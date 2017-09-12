import R from 'ramda';

export default function filterRows(filters, rows) {
    return rows.filter(r => {

        let include = true;
        R.keys(filters).forEach(columnKey => {
            const colFilter = filters[columnKey];
            const rowValue = r[columnKey];

            /*
             * TODO:
             * - Options for lowercase
             * - Options for strict equality
             * - Numeric options: <5
             * - and / or: (<5, ==3) && NYC
             */
            include = include && R.contains(
                R.toLower(colFilter.filterTerm+''),
                R.toLower(rowValue+'')
            );
        });

        return include;

    });
}
