import React, {Component, PropTypes} from 'react';
import ReactDataGrid from 'react-data-grid';
import {type} from 'ramda';

const DATAFRAME = {
    'data': [
        [1, 3, 'Montréal'],
        [4, 1, 'SF'],
        [5, 8, 'New York City, United States of America']
    ],
    'columns': ['Column 1', 'Column 2', 'Column 3'],
    'index': [1, 4, 8]
}

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.rowGetter = this.rowGetter.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updateState(props) {
        const {dataframe} = this.props;
        const {columns, index, data} = dataframe;
        const newState = {
            rows: data
        };
        if (type(columns[0]) === 'Object') {
            newState.richColumns = columns;
        } else {
            newState.richColumns = columns.map(c => ({
                key: c,
                name: c,
                editable: false
            }));
        }
        this.setState(newState);
    }

    componentWillMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    rowGetter(i) {
        const {richColumns} = this.state;
        const row = {};
        this.state.rows[i].forEach((value, j) => {
            row[richColumns[j].key] = value;
        });
        return row;
    }

    render() {
        const {
            enable_cell_select,
            enable_drag_and_drop,
            enable_row_select,
            header_row_height,
            min_height,
            min_width,
            row_height,
            row_scroll_timeout,
            tab_index
        } = this.props;

        const {
            richColumns,
            rows
        } = this.state;

        return  (
            <ReactDataGrid
                enableCellSelect={enable_cell_select}
                enableDragAndDrop={enable_drag_and_drop}
                enableRowSelect={enable_row_select}
                headerRowHeight={header_row_height}
                minHeight={min_height}
                minWidth={min_width}
                row_height={row_height}
                row_scroll_timeout={row_scroll_timeout}
                tab_index={tab_index}

                columns={richColumns}
                rowGetter={this.rowGetter}
                rowsCount={rows.length}
            />
        );
    }
}

DataTable.propTypes = {
    dataframe: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.array),
        columns: PropTypes.arrayOf(PropTypes.string),
        index: PropTypes.array
    }),
    enable_cell_select: PropTypes.bool,
    enable_drag_and_drop: PropTypes.bool,
    enable_row_select: PropTypes.bool,
    header_row_height: PropTypes.number,
    min_height: PropTypes.number,
    min_width: PropTypes.number,
    // TODO - over_scan
    // over_scan: PropTypes.shape({
    //     cols_start: PropTypes.number,
    //     cols_end: PropTypes.number,
    //     rows_start: PropTypes.number,
    //     rows_end: PropTypes.number
    // }),
    row_height: PropTypes.number,
    row_scroll_timeout: PropTypes.number,
    // TODO - row_selection
    tab_index: PropTypes.number,
}

export default DataTable;
