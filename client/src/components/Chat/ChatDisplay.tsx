import { useState } from 'react';
import useChat from '../../hooks/useChat';
import { TEMP_ROOM_ID } from '../../constants/socketIO';

const ChatDisplay = () => {
  const roomId = TEMP_ROOM_ID; // TODO replace with route
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (event: any) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      {messages.map((message: any, index: number) => (
        <div key={index}>{message.body}</div>
      ))}
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatDisplay;
