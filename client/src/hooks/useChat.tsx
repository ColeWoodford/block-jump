import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client/build/index';
import { NEW_CHAT_MESSAGE_EVENT, SOCKET_SERVER_URL } from '../constants/socketIO';

const useChat = (roomId: any) => {
  const [messages, setMessages] = useState<any>([]);
  const socketRef = useRef<any>();

  useEffect(() => {
    // Creates a WebSocket Connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: any) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages: any) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody: any) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
