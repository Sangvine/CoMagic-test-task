import { Button, TextField } from "@material-ui/core";
import { useRef } from "react";
import { API_URL } from "../../constants";
import "./Search.css";

function Search(props) {
  const searchText = useRef(null);

  const handleSearch = async () => {
    let result = await fetchSites(searchText.current?.value);
    result.map((row) => {
      row.inProgress = false;
      return row;
    });
    props.getSites(result);
  };

  const fetchSites = async (searchText) => {
    let response = await fetch(`${API_URL}/get_sites?token=${searchText}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(response.status);
    }
  };

  return (
    <div className="search-panel">
      <div className="search-input">
        <TextField
          fullWidth={true}
          autoFocus
          label="Введите токен DataApi"
          inputRef={searchText}
        ></TextField>
      </div>
      <div className="search-button">
        <Button variant="contained" color="primary" onClick={handleSearch}>
          <span className="button-text">Загрузить сайты</span>
        </Button>
      </div>
    </div>
  );
}

export default Search;
