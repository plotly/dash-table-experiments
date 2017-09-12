import R from 'ramda';

export default function filterIndices(some_rows, all_rows) {
    const indices = [];
    some_rows.forEach(some_row => {
        const index = R.findIndex(R.equals(some_row), all_rows);
        if (index !== -1) {
            indices.push(index);
        }
    });
    return indices;
}
