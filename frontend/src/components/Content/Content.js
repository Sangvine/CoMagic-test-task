import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, TablePagination } from "@material-ui/core";
import { API_URL } from "../../constants";
import TablePaginationActions from "./TablePaginationActions";

const useStyles = makeStyles({
  tableContainer: {
    margin: 20,
  },
  container: {
    maxHeight: 700,
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, sites.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.tableContainer}>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-label="simple table"
          >
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
              {(rowsPerPage > 0
                ? sites.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : sites
              ).map((row) => {
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
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "Все", value: -1 }]}
          labelRowsPerPage="Строк на странице"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          colSpan={3}
          count={sites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </div>
  );
}
