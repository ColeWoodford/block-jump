import styled from 'styled-components';

interface Props {
  scores: any;
}

const HighScoresContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
`;

const HighScoresDisplay = styled.div`
  color: #aaaaaa;
`;

const LeaderboardTitle = styled.div`
  margin-bottom: 0.5rem;
  font-size: 20px;
  color: #aaaaaa;
`;

const HighScores: React.FC<Props> = (props) => {
  const { scores } = props;

  return (
    <HighScoresContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      {scores.map((playerScore: any, index: number) => (
        <HighScoresDisplay key={index}>
          {playerScore.senderName} --- {playerScore.body}
        </HighScoresDisplay>
      ))}
    </HighScoresContainer>
  );
};

export default HighScores;
