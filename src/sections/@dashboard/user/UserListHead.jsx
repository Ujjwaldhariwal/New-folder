import PropTypes from 'prop-types';
// @mui
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  // onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  // onRequestSort,
  onSelectAllClick,
}) {
  // const createSortHandler = (property) => (event) => {
  //   onRequestSort(event, property);
  // };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.label}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.label ? order : false}
            title={headCell.title}
            style={{backgroundColor: '#5c59e8', color:"white", padding:'14px', lineHeight: 1.2, borderBottom: "1px solid var(--primary-border-color)"}}
            
          >
            <TableSortLabel
              hideSortIcon
              // active={orderBy === headCell.label}
              direction={orderBy === headCell.label ? order : 'asc'}
              // onClick={createSortHandler(headCell.label)}
            >
              
             <div style={{width: headCell.width}} className='userTableHead'>{headCell.label}</div>
              {orderBy === headCell.label ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
