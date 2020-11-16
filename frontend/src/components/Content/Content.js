import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import { API_URL } from "../../constants";

const useStyles = makeStyles({
  tableContainer: {
    margin: 20,
  },
  table: {
    minWidth: 150,
  },
});

export default function Content(props) {
  const [sites, setSites] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setSites(props.sites);
  }, [props.sites]);

  const getSiteDetails = async (url, site_key) => {
    switchButton(site_key);
    let response = await fetch(
      `${API_URL}/get_site_details?domain_name=${url}&site_key=${site_key}`
    );
    if (response.ok) {
      let result = await response.json();
      setSites((state) =>
        state.map((row) => {
          if (row.site_key === site_key) {
            row.responseCode = result["responseCode"];
            row.siteKey = result["isSiteKey"] ? "+" : "-";
            row.csMinJs = result["isJsFile"] ? "+" : "-";
            row.inProgress = false;
          }
          return row;
        })
      );
    } else {
      console.error(response.status);
    }
  };

  const switchButton = (siteKey) => {
    setSites((state) =>
      state.map((row) => {
        if (row.site_key === siteKey) {
          row.inProgress = !row.inProgress;
        }
        return row;
      })
    );
  };

  return (
    <div className={classes.tableContainer}>
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
            {sites.map((row) => {
              return (
                <TableRow key={row.site_key}>
                  <TableCell component="th" scope="row">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`http://${row.domain_name}`}
                    >
                      {row.domain_name}
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={row.inProgress}
                      onClick={() => {
                        getSiteDetails(row.domain_name, row.site_key);
                      }}
                    >
                      <span className="button-text">Проверка кода</span>
                    </Button>
                  </TableCell>
                  <TableCell align="right">{row.responseCode}</TableCell>
                  <TableCell align="right">{row.siteKey}</TableCell>
                  <TableCell align="right">{row.csMinJs}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
