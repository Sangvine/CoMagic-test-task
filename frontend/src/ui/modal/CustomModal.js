import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "30%",
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  },
}));

export default function CustomModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">{props.title || "Ошибка!"}</h2>
      <p id="simple-modal-description">{props.text}</p>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={props.close}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
