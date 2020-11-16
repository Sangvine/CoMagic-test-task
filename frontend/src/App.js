import "./App.css";
import Header from "./components/Header/Header";
import Search from "./components/Search/Search";
import Content from "./components/Content/Content";
import { useState } from "react";

function App() {
  const [sites, setSites] = useState([]);

  return (
    <div>
      <Header></Header>
      <Search getSites={(sites) => setSites(sites)}></Search>
      {sites.length > 0 ? <Content sites={sites}></Content> : null}
    </div>
  );
}

export default App;
