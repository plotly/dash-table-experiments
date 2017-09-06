import React, {Component, PropTypes} from 'react';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';
import R from 'ramda';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.getSize = this.getSize.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.propsToState = this.propsToState.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this._originalRows = [];
    }

    propsToState(props, prevProps) {
        const newState = {
            rows: props.rows
        };
        if (props.sortable) {
            this._originalRows = props.rows;
        }
        if (props.filterable && !prevProps.filterable) {
            this.updateProps({filters: {}});
        }

        const columnNames = props.columns || R.keys(newState.rows[0]);

        newState.columns = columnNames.map(c => ({
            key: c,
            name: c,
            editable: Boolean(props.editable),
            sortable: Boolean(props.sortable),
            filterable: Boolean(props.filterable)
        }));

        this.setState(newState);
    }

    componentWillMount() {
        this.propsToState(this.props, {});
    }

    componentWillReceiveProps(nextProps) {
        this.propsToState(nextProps, this.props);
    }

    updateProps(obj) {
        /* eslint-disable */
        console.warn(`updateProps: ${JSON.stringify(obj, null, 2)}`);
        /* eslint-enable */
        if(this.props.setProps) {
            this.props.setProps(obj);
        } else {
            this.setState(obj);
        }
    }

    onClearFilters() {
        this.updateProps({filters: {}});
    }

    handleFilterChange(filter) {
        const newFilters = R.merge({}, (
            this.props.setProps ? this.props.filters : this.state.filters
        ));
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        this.updateProps({filters: newFilters});

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

        this.updateProps({
            rows,
            sortColumn,
            sortDirection
        });

    }

    handleGridRowsUpdated({fromRow, toRow, updated}) {
        const {rows} = this.state;
        for (let i=fromRow; i<=toRow; i++) {
            rows[i] = R.merge(rows[i], updated);
        }


        this.updateProps({
            row_update: R.append(
                this.props.row_update,
                [{
                    from_row: fromRow,
                    to_row: toRow,
                    updated: updated
                }]
            ),
            rows: rows
        });

    }

    getSize() {
        return this.getRows().length;
    }

    getRows() {
        if (this.props.setProps) {
            return Data.Selectors.getRows(this.props);
        } else {
            return Data.Selectors.getRows(this.state);
        }

    }

    rowGetter(rowIdx) {
        const rows = this.getRows();
        return rows[rowIdx];
    }

    render() {
        const {
            editable,
            enable_drag_and_drop,
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

        extraProps.enableCellSelect = Boolean(editable);
        if (editable) {
            extraProps.onGridRowsUpdated = this.handleGridRowsUpdated;
        }

        return  (
            <ReactDataGrid
                enableDragAndDrop={enable_drag_and_drop}
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
    // These props are "custom" - defined by me.
    id: PropTypes.string,
    editable: PropTypes.bool,
    filterable: PropTypes.bool,
    sortable: PropTypes.bool,
    /**
     * Order of columns. Note that the column names are specified in
     * `rows` but without order. This attribute allows you to specify
     * a custom order for your columns.
     */
    columns: PropTypes.arrayOf(PropTypes.string),

    // These props are passed directly into the component
    enable_drag_and_drop: PropTypes.bool,
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
    tab_index: PropTypes.number,

    // These props get updated
    filters: PropTypes.object,
    rows: PropTypes.arrayOf(PropTypes.shape),
    row_update: PropTypes.shape({
        from_row: PropTypes.number,
        to_row: PropTypes.number,
        updated: PropTypes.arrayOf(PropTypes.shape)
    }),
    sortColumn: PropTypes.object,
    sortDirection: PropTypes.object,

    // Dash supplied props
    setProps: PropTypes.func
}

DataTable.defaultProps = {
    editable: true,
    filterable: false,
    sortable: true,
    filters: {}
}

export default DataTable;
