import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Filter from '../Filter';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const columns = [
  { id: '#', label: '#', minWidth: 50 },
  { id: 'person_id', label: '환자ID', minWidth: 70 },
  {
    id: 'gender_source_value',
    label: '환자성별',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'birth_datetime',
    label: '생년월일',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'age',
    label: '나이',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toFixed(2),
    },
    {
    id: 'race_source_value',
    label: '인종',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toFixed(2),
    },
      {
    id: 'ethnicity_source_value',
    label: '민족',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toFixed(2),
    },
        {
    id: 'death',
    label: '사망여부',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toFixed(2),
    }
];

function Row({row}) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
            <TableCell component="th" scope="row">{row.person_id}</TableCell>
            <TableCell align="left">{row.gender_source_value}</TableCell>
            <TableCell align="left">{row.birth_datetime}</TableCell>
            <TableCell align="left">{row.age}</TableCell>
            <TableCell align="left">{row.race_source_value}</TableCell>
            <TableCell align="left">{row.ethnicity_source_value}</TableCell>
            <TableCell align="left">{row.death}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {`History (${row.condition_concept.length})`}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell>진단정보 ID</TableCell>
                    <TableCell>{`전체 방문 횟수 (${row.total_visited}회)`}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.condition_concept.map((historyRow,index) => (
                    <TableRow key={index}>
                      <TableCell>{historyRow.condition_concept_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default ({data,sortBy,filterVal}) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                key={column.id}
                align={column.align}
                onClick={() => sortBy(column.id)}
                >
                  {column.label}
                </TableCell>
              ))}
                    </TableRow>
            </TableHead>
                <TableRow>
                {/* filter */}
                            <TableCell key={'#'}>{`필터링`}</TableCell>
                            <TableCell align="left"><Filter /></TableCell>
                            <TableCell align="left"><Filter values={filterVal.gender}/></TableCell>
                            <TableCell align="left"><Filter /></TableCell>
                            <TableCell align="left"><Filter values={filterVal.age}/></TableCell>
                            <TableCell align="left"><Filter values={filterVal.race}/></TableCell>
                            <TableCell align="left"><Filter values={filterVal.ethnicity}/></TableCell>
                            <TableCell align="left"><Filter values={filterVal.death}/></TableCell>
                </TableRow>

          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (<Row key={row.person_id} row={row} />);
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


