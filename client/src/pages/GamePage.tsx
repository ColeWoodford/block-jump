import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import Game from "../three/Game";
import HighScores from "../components/GamePageComponents/HighScores";
import useScore from "../hooks/useScore";
import { TEMP_ROOM_ID } from "../constants/socketIO";
import { usePlayerNameContext } from "../contexts/playerNameContext";

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const ScoreDisplay = styled.h3`
  position: absolute;
  font-size: 35px;
  color: #aaaaaa;
  margin: 1rem;
`;

const Blocker = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Instructions = styled.div`
  width: 100%;
  height: 100%;

  display: -webkit-box;
  display: -moz-box;
  display: box;

  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  box-orient: horizontal;

  -webkit-box-pack: center;
  -moz-box-pack: center;
  box-pack: center;

  -webkit-box-align: center;
  -moz-box-align: center;
  box-align: center;

  color: #ffffff;
  text-align: center;
  font-family: Arial;
  font-size: 14px;
  line-height: 24px;

  cursor: pointer;
`;

function GamePage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<number>(0);
  const [highScore, setHighScore] = useState(0);
  const { sendScore, scores } = useScore(TEMP_ROOM_ID);
  const { playerName } = usePlayerNameContext();

  useEffect(() => {
    if (playerName === "") return;
    const NewGame = new Game(mountRef);
    NewGame.init();
    NewGame.animate();
    window.addEventListener(
      "resize",
      function () {
        NewGame.resize();
      },
      false
    );
    setInterval(() => setHighScore(NewGame.getHighScore()), 500);
    return () => {
      NewGame.delete();
    };
  }, [playerName]);

  useEffect(() => {
    if (highScore > scoreRef.current) {
      // Send score to leaderboard if it updates
      sendScore({ messageBody: highScore, playerName });
    }
    scoreRef.current = highScore;
  }, [highScore, sendScore, playerName]);

  if (playerName === "") return <Redirect to="/" />;

  return (
    <Container>
      <ScoreDisplay>HIGH SCORE: {highScore}</ScoreDisplay>
      <HighScores scores={scores} />
      <Blocker id="blocker">
        <Instructions id="instructions">
          <span>CLICK TO PLAY</span>
          <br />
          <br />
          Move: WASD
          <br />
          Jump: SPACE
          <br />
          Look: MOUSE
          <br />
        </Instructions>
      </Blocker>
      <GameContainer ref={mountRef} />
    </Container>
  );
}

export default GamePage;
