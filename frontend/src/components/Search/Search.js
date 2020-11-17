import { Button, TextField } from "@material-ui/core";
import { useRef, useState } from "react";
import { API_URL } from "../../service/constants";

import CustomModal from "../../ui/modal/CustomModal";
import "./Search.css";

function Search(props) {
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState();
  const searchText = useRef(null);

  const handleSearch = async () => {
    let result = await fetchSites(searchText.current?.value);
    result.map((row) => {
      row.inProgress = false;
      return row;
    });
    props.getSites(result);
  };

  const handleOpen = (text) => {
    setModalText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchSites = async (searchText) => {
    let response = await fetch(`${API_URL}/get_sites?token=${searchText}`);
    if (response.ok) {
      let result = await response.json();
      if (result.error?.message) {
        handleOpen(result.error?.message);
        return [];
      } else return result["result"];
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
        <CustomModal
          open={open}
          text={modalText}
          close={handleClose}
        ></CustomModal>
      </div>
    </div>
  );
}

export default Search;
