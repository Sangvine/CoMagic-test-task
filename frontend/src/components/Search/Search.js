import { Button, TextField } from "@material-ui/core";
import "./Search.css";

function Search() {
  return (
    <div className="search-panel">
      <div className="search-input">
        <TextField
          fullWidth="true"
          autoFocus
          label="Введите токен DataApi"
        ></TextField>
      </div>
      <div className="search-button">
        <Button variant="contained" color="primary">
          <span className="button-text">Загрузить сайты</span>
        </Button>
      </div>
    </div>
  );
}

export default Search;
