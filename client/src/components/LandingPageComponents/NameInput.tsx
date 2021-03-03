import { useState } from "react";
import { Redirect } from "react-router-dom";
import { usePlayerNameContext } from "../../contexts/playerNameContext";

interface Props {}

const NameInput: React.FC<Props> = (props) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const { playerName, setPlayerName } = usePlayerNameContext();

  const handleChange = (event: any) => {
    setNewPlayerName(event.target.value);
  };

  const submitPlayerName = () => {
    if (newPlayerName !== "") {
      setPlayerName?.(newPlayerName);
    }
  };

  if (playerName !== "") return <Redirect to={"/blockJump"} />;

  return (
    <div>
      <div>{`PlayerName: ${newPlayerName}`}</div>
      <button onClick={submitPlayerName}>Submit</button>
      <input value={newPlayerName} onChange={handleChange} />
    </div>
  );
};

export default NameInput;
