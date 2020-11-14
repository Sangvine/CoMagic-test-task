import { Container } from "@material-ui/core";
import "./App.css";
import Header from "./components/Header/Header";
import Search from "./components/Search/Search";
import Content from "./components/Content/Content";

function App() {
  return (
    <div>
      <Header></Header>
      <Search></Search>
      <Content></Content>
    </div>
  );
}

export default App;
