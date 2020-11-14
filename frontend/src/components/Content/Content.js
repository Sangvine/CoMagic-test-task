import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(title, responseCode, siteKey, csMinJs) {
  return { title, responseCode, siteKey, csMinJs };
}

const rows = [
  createData("http://www.site1.com", 159, 6.0, 24, 4.0),
  createData("http://www.site2.com", 237, 9.0, 37, 4.3),
  createData("http://www.site3.com", 262, 16.0, 24, 6.0),
  createData("http://www.site4.com", 305, 3.7, 67, 4.3),
  createData("http://www.site5.com", 356, 16.0, 49, 3.9),
];

export default function Content() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название сайта</TableCell>
            <TableCell align="right">Проверить сайт</TableCell>
            <TableCell align="right">Код ответа</TableCell>
            <TableCell align="right">Наличие site_key</TableCell>
            <TableCell align="right">Наличие cs.min.js</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title}>
              <TableCell component="th" scope="row">
                <a target="_blank" rel="noreferrer" href={row.title}>
                  {row.title}
                </a>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small">
                  <span class="button-text">Проверка кода</span>
                </Button>
              </TableCell>
              <TableCell align="right">{row.responseCode}</TableCell>
              <TableCell align="right">{row.siteKey}</TableCell>
              <TableCell align="right">{row.csMinJs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
