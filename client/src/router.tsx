import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing";
import GamePage from "./pages/GamePage";

export default function Router() {
  return <Routes />;
}

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={"/"} component={Landing} />
        <Route exact path={"/blockJump"} component={GamePage} />
      </Switch>
    </BrowserRouter>
  );
}
