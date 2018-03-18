import R from 'ramda';

export default function sortRows(rows, sortColumn, sortDirection) {
    function comparer(a, b) {
        if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? true : false;
        } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? true : false;
        }
    }

    return (sortDirection === 'NONE' ?
        rows : R.sort(comparer, rows.slice(0))
    );
}
