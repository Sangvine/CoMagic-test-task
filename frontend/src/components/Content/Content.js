import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Box, Button, TablePagination } from "@material-ui/core";

import CustomTablePaginationActions from "../../ui/table/CustomPaginationActions";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import { API_URL } from "../../service/constants";

const useStyles = makeStyles({
  tableContainer: {
    margin: 20,
  },
  container: {
    maxHeight: 670,
  },
  table: {
    minWidth: 150,
  },
});

export default function Content(props) {
  const [sites, setSites] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const classes = useStyles();

  useEffect(() => {
    setSites(props.sites);
  }, [props.sites]);

  const getSiteDetails = async (url, siteKey) => {
    setSites((state) =>
      state.map((row) => {
        if (row.site_key === siteKey) {
          row.inProgress = !row.inProgress;
        }
        return row;
      })
    );
    let response = await fetch(
      `${API_URL}/get_site_details?domain_name=${url}&site_key=${siteKey}`
    );
    if (response.ok) {
      let result = await response.json();
      setSites((state) =>
        state.map((row) => {
          if (row.site_key === siteKey) {
            let data = result["result"];
            row.responseCode = data["responseCode"];
            row.siteKey = data["isSiteKey"] ? <DoneIcon /> : <ClearIcon />;
            row.csMinJs = data["isJsFile"] ? <DoneIcon /> : <ClearIcon />;
            row.inProgress = false;
          }
          return row;
        })
      );
    } else {
      console.error(response.status);
    }
  };

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
      <Paper>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-label="Список сайтов"
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box fontWeight="fontWeightBold">Название сайта</Box>
                </TableCell>
                <TableCell align="center">
                  <Box fontWeight="fontWeightBold">Проверить сайт</Box>
                </TableCell>
                <TableCell align="center">
                  <Box fontWeight="fontWeightBold">Код ответа</Box>
                </TableCell>
                <TableCell align="center">
                  <Box fontWeight="fontWeightBold">Наличие site_key</Box>
                </TableCell>
                <TableCell align="center">
                  <Box fontWeight="fontWeightBold">Наличие cs.min.js</Box>
                </TableCell>
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
                    <TableCell width="30%" component="th" scope="row">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`http://${row.domain_name}`}
                      >
                        {row.domain_name}
                      </a>
                    </TableCell>
                    <TableCell align="center">
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
                    <TableCell align="center">{row.responseCode}</TableCell>
                    <TableCell align="center">{row.siteKey}</TableCell>
                    <TableCell align="center">{row.csMinJs}</TableCell>
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
          ActionsComponent={CustomTablePaginationActions}
        />
      </Paper>
    </div>
  );
}
