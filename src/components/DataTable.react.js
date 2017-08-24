import React, {Component, PropTypes} from 'react';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';
import R, {type} from 'ramda';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.getSize = this.getSize.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updateState(props) {
        const {dataframe} = props;
        const {columns, data} = dataframe;
        const newState = {
            rows: data.map(row => {
                const rowObject = {};
                row.forEach((cell, j) => {
                    rowObject[columns[j]] = cell;
                });
                return rowObject;
            })
        };
        if (props.sortable) {
            newState.originalRows = newState.rows;
        }
        if (props.filterable) {
            newState.filters = {};
        }
        if (type(columns[0]) === 'Object') {
            newState.columns = columns;
        } else {
            newState.columns = columns.map(c => ({
                key: c,
                name: c,
                editable: false,
                sortable: props.sortable ? true : false,
                filterable: props.filterable ? true : false
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

    onClearFilters() {
        this.setState({filters: {}});
    }

    handleFilterChange(filter) {
        const newFilters = R.merge({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters});
    }

    handleGridSort(sortColumn, sortDirection) {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = (sortDirection === 'NONE' ?
            this.state.originalRows.slice(0) : this.state.rows.sort(comparer)
        );

        this.setState({rows});
    }

    getRows() {
        return Data.Selectors.getRows(this.state);
    }

    getSize() {
        return this.getRows().length;
    }

    rowGetter(rowIdx) {
        const rows = this.getRows();
        return rows[rowIdx];
    }

    render() {
        const {
            enable_cell_select,
            enable_drag_and_drop,
            enable_row_select,
            filterable,
            header_row_height,
            min_height,
            min_width,
            row_height,
            row_scroll_timeout,
            sortable,
            tab_index
        } = this.props;

        const {columns} = this.state;

        const extraProps = {};
        if (sortable) {
            extraProps.onGridSort = this.handleGridSort;
        }
        if (filterable) {
            extraProps.onAddFilter = this.handleFilterChange;
            extraProps.toolbar = <Toolbar enableFilter={true}/>;
            extraProps.onClearFilters = this.onClearFilters;
        }

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

                columns={columns}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}

                {...extraProps}
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
    filterable: PropTypes.bool,
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
    sortable: PropTypes.bool,
    tab_index: PropTypes.number
}

DataTable.defaultProps = {
    filterable: false,
    sortable: true
}

export default DataTable;
