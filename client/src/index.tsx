import Router from "./router";
import ReactDOM from "react-dom";
import { PlayerNameProvider } from "./contexts/playerNameContext";
import "./App.css";

function App() {
  return (
    <PlayerNameProvider>
      <Router />
    </PlayerNameProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
