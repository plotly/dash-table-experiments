import R from 'ramda';

export default function sortRows(rows, sortColumn, sortDirection) {
    switch (sortDirection) {
        case 'ASC': return R.sort(R.ascend(R.nth(sortColumn)), rows.slice(0));
        case 'DESC': return R.sort(R.descend(R.nth(sortColumn)), rows.slice(0));
        default: return rows
    }
}