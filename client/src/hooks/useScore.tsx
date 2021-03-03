import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client/build/index";
import {
  NEW_SCORE_MESSAGE_EVENT,
  NEW_HIGH_SCORES_MESSAGE_EVENT,
} from "../constants/socketIO";
import { encryptMessage } from "../utility/encryptMessage";

const useScore = (roomId: any) => {
  const [scores, setScores] = useState<any>([]);
  const socketRef = useRef<any>();

  useEffect(() => {
    // Creates a WebSocket Connection
    socketRef.current = io({
      query: { roomId },
    });
    // socketRef.current = io();

    // Listens for incoming scores
    socketRef.current.on(NEW_HIGH_SCORES_MESSAGE_EVENT, (scores: any) => {
      const incomingScores = scores.map((score: any) => ({
        ...score,
        ownedByCurrentUser: score.senderId === socketRef.current.id,
      }));
      setScores(incomingScores);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a score to the server that
  // forwards it to the leaderboard of the same room
  const sendScore = ({ messageBody, playerName }: any) => {
    const scoreMessage = encryptMessage({
      body: messageBody,
      senderId: socketRef.current.id,
      senderName: playerName,
    }).toString();
    socketRef.current.emit(NEW_SCORE_MESSAGE_EVENT, scoreMessage);
  };

  return { scores, sendScore };
};

export default useScore;
