import R from 'ramda';

export default function sortRows(rows, sortColumn, sortDirection) {
    function comparer(a, b) {
        if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
        } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
        }
    }

    return (sortDirection === 'NONE' ?
        rows : R.sort(comparer, rows.slice(0))
    );
}
