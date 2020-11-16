import { AppBar, Toolbar, Typography } from "@material-ui/core";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar color="primary">
        <Typography variant="subtitle1" color="inherit">
          Сервис проверки кода вставки
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
