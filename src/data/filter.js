import R from 'ramda';
import isNumeric from 'fast-isnumeric';

const FILTER_TERMS = {
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b
}

export default function filterRows(filters, rows) {
    return rows.filter(r => {

        let include = true;
        R.keys(filters).forEach(columnKey => {
            const colFilter = filters[columnKey];
            const rowValue = r[columnKey];

            let matched = false;
            const strFilterTerm = colFilter.filterTerm+''
            R.keys(FILTER_TERMS).forEach(k => {
                const replacedFilterTerm = R.replace(k, '', strFilterTerm);
                if (!matched &&
                    R.contains(k, strFilterTerm) &&
                    isNumeric(replacedFilterTerm) &&
                    isNumeric(rowValue) &&
                    strFilterTerm !== k
                ) {
                    include = include && FILTER_TERMS[k](
                        parseFloat(rowValue, 10),
                        parseFloat(replacedFilterTerm, 10)
                    );
                    matched=true;
                }
            });
            if (!matched &&
                !R.contains(strFilterTerm, R.keys(FILTER_TERMS))
            ) {
                include = include && R.contains(
                    R.toLower(strFilterTerm),
                    R.toLower(rowValue+'')
                );
            }
        });

        return include;

    });
}
