import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export default function useWebSocket({ worldId, avatarId, avatarName, onMessage }) {
  const clientRef = useRef(null)
  const connected = useRef(false)

  const sendMessage = useCallback((destination, body) => {
    if (clientRef.current && connected.current) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      })
    }
  }, [])

  const moveAvatar = useCallback((x, y) => {
    sendMessage('/app/avatar.move', {
      type: 'AVATAR_MOVE',
      avatarId,
      avatarName,
      worldId,
      positionX: x,
      positionY: y,
    })
  }, [avatarId, avatarName, worldId, sendMessage])

  const sendChat = useCallback((content) => {
    sendMessage('/app/chat.send', {
      type: 'CHAT_MESSAGE',
      avatarId,
      avatarName,
      worldId,
      content,
    })
  }, [avatarId, avatarName, worldId, sendMessage])

  useEffect(() => {
    if (!worldId || !avatarId) return

    const token = localStorage.getItem('nexaverse_token')

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      onConnect: () => {
        connected.current = true
        // Subscribe to world events
        client.subscribe(`/topic/world/${worldId}`, (msg) => {
          try {
            const data = JSON.parse(msg.body)
            onMessage && onMessage(data)
          } catch (e) {}
        })
        // Subscribe to chat
        client.subscribe(`/topic/world/${worldId}/chat`, (msg) => {
          try {
            const data = JSON.parse(msg.body)
            onMessage && onMessage({ ...data, isChat: true })
          } catch (e) {}
        })
        // Join world
        sendMessage('/app/avatar.join', {
          type: 'AVATAR_JOIN',
          avatarId,
          avatarName,
          worldId,
          positionX: 0,
          positionY: 0,
        })
      },
      onDisconnect: () => {
        connected.current = false
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      if (connected.current) {
        sendMessage('/app/avatar.leave', {
          type: 'AVATAR_LEAVE',
          avatarId,
          avatarName,
          worldId,
        })
      }
      client.deactivate()
      connected.current = false
    }
  }, [worldId, avatarId])

  return { moveAvatar, sendChat }
}