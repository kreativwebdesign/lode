import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import ModelChooser from "./ModelChooser";
import ModelViewer from "./ModelViewer";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/model/" component={ModelViewer} />
        <Route path="/" component={ModelChooser} />
      </Switch>
    </Router>
  );
}

export default App;
