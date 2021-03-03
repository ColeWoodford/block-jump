import {
  useState,
  memo,
  createContext,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface PlayerNameContextProps {
  playerName: string;
  setPlayerName?: Dispatch<SetStateAction<string>>;
}

const PlayerNameContext = createContext<PlayerNameContextProps>({
  playerName: "",
});

interface PlayerNameProviderProps {
  children: ReactNode;
}

const _PlayerNameProvider = (props: PlayerNameProviderProps) => {
  const [playerName, setPlayerName] = useState("");

  return (
    <PlayerNameContext.Provider
      value={{ playerName, setPlayerName }}
      {...props}
    />
  );
};

export const PlayerNameProvider = memo(_PlayerNameProvider);

export const usePlayerNameContext = () => {
  const context = useContext(PlayerNameContext);
  if (!context) {
    throw new Error("usePlayerName must be used within a PlayerNameProvider");
  }
  return context;
};
