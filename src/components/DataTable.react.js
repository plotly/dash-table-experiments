import React, {Component, PropTypes} from 'react';
import ReactDataGrid from 'react-data-grid';
import {Toolbar} from 'react-data-grid-addons';
import R from 'ramda';

import filterRows from '../data/filter';
import sortRows from '../data/sort';
import filterIndices from '../data/find';

const MUTABLE_PROPS = [
    'selected_row_indices',
    'rows',
    'filters',
    'sortColumn',
    'sortDirection'
];

class DataTable extends Component {
    constructor(props) {
        super(props);

        this.getSize = this.getSize.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.onRowsDeselected = this.onRowsDeselected.bind(this);
        this.onRowsSelected = this.onRowsSelected.bind(this);
        this.propsToState = this.propsToState.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this._absolute = {
            rows: props.rows,
            selected_row_objects: []
        };
        this._view = {
            rows: props.rows,
            selected_row_indices: []
        }
        this.state = {};
    }

    propsToState(props, prevProps) {

        const newState = {};

        MUTABLE_PROPS.forEach(propKey => {
            if (this.state[propKey] !== props[propKey]) {
                // update was supplied by parent, not by this component
                newState[propKey] = props[propKey];
            }
        });

        if (props.rows !== prevProps.rows &&
                this._view.rows !== props.rows) {
            // Reset the index if supplied by dash not by component
            this._absolute.rows = props.rows;

            this._absolute.selected_row_objects = [];
            newState.selected_row_indices = [];
        }

        if (!props.filterable) {
            this.setState({filters: {}});
        }

        if (props.selected_row_indices !== prevProps.selected_row_indices &&
                this._view.selected_row_indices !== props.selected_row_indices) {
            this._absolute.selected_row_objects = (
                props.selected_row_indices.map(i => props.rows[i])
            );
        }

        let columnNames;
        if (R.has('columns', props)) {
            columnNames = props.columns;
        } else if (R.has('rows', newState) &&
                   newState.rows.length > 0 &&
                   !R.has('columns', props)) {
            columnNames = R.keys(newState.rows[0]);
        } else {
            columnNames = R.pluck('name', this.state.columns);
        }

        newState.columns = columnNames.map(c => ({
            key: c,
            name: c,
            editable: Boolean(props.editable),
            sortable: Boolean(props.sortable),
            resizable: Boolean(props.resizable),
            filterable: Boolean(props.filterable)
        }));
        if (props.column_widths) {
            newState.columns.forEach((c, i) => {
                c.width = props.column_widths[i];
            });
        }

        this.setState(newState);
    }

    componentWillMount() {
        this.propsToState(this.props, {});
    }

    componentWillReceiveProps(nextProps) {
        this.propsToState(nextProps, this.props);
    }

    updateProps(obj) {

        /*
         * Keep the state synced with the props so that
         * we know when a change in e.g. `rows` is
         * triggered by dash vs this component.
         */

        if (this.props.setProps) {
            if (R.has('rows', obj)) {
                this._view.rows = obj.rows;
            }
            if (R.has('selected_row_indices', obj)) {
                this._view.selected_row_indices = obj.selected_row_indices;
            }
            this.props.setProps(obj);
        } else {
            this.setState(obj);
        }
    }

    onClearFilters() {
        this.updateProps({filters: {}});
    }

    handleFilterChange(filter) {
        const newFilters = R.merge({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        const newRows = sortRows(
            filterRows(
                newFilters,
                this._absolute.rows
            ),
            this.state.sortColumn,
            this.state.sortDirection
        );

        const update = {
            filters: newFilters,
            rows: newRows
        };

        if (this.props.row_selectable) {
            update.selected_row_indices = filterIndices(
                this._absolute.selected_row_objects,
                newRows
            );
        }

        this.updateProps(update);

    }

    handleGridSort(sortColumn, sortDirection) {
        const newRows = sortRows(
            this.state.rows,
            sortColumn,
            sortDirection
        );

        const update = {
            rows: newRows,
            sortColumn,
            sortDirection
        };

        if (this.props.row_selectable) {
            update.selected_row_indices = filterIndices(
                this._absolute.selected_row_objects,
                newRows
            );
        }

        this.updateProps(update);
    }

    handleGridRowsUpdated({fromRow, toRow, updated}) {
        const rows = this.state.rows;
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
        return this.state.rows;
    }

    getMinHeight() {
        const row_height = (R.has('row_height', this.props) ?
                            this.props.row_height :
                            DataTable.defaultProps.row_height);
        const {filterable} = this.props;
        const nRows = this.getSize();

        if (R.has('max_rows_in_viewport', this.props) ||
                !R.has('min_height', this.props)) {
            const headerHeight = row_height;
            const borderHeight = 2;
            // when the filter panel expands, it adds a 45px tall row
            const filterSearchPanelHeight = filterable ? 45 : 0;
            const nRowsToDisplay = R.propOr(10, 'max_rows_in_viewport', this.props);
            return (
                (R.min(nRows, nRowsToDisplay) * row_height) +
                filterSearchPanelHeight +
                headerHeight +
                borderHeight
            );
        } else {
            return this.props.min_height;
        }
    }

    onRowsSelected(rows) {

        this._absolute.selected_row_objects = R.union(
            R.pluck('row', rows),
            this._absolute.selected_row_objects
        );

        this.updateProps({
            selected_row_indices: filterIndices(
                this._absolute.selected_row_objects,
                this.state.rows // only the visible rows
            )
        });
    }

    onRowsDeselected(rowSelections) {
        const rows = R.pluck('row', rowSelections);
        this._absolute.selected_row_objects = R.reject(
            R.flip(R.contains)(rows),
            this._absolute.selected_row_objects
        );
        this.updateProps({
            selected_row_indices: filterIndices(
                this._absolute.selected_row_objects,
                this.state.rows // only the visible rows
            )
        });
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
            min_width,
            row_height,
            row_scroll_timeout,
            row_selectable,
            sortable,
            tab_index
        } = this.props;

        const {columns, selected_row_indices} = this.state;

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

        if (row_selectable) {
            extraProps.rowSelection = {
                showCheckbox: true,
                enableShiftSelect: true,
                onRowsSelected: this.onRowsSelected,
                onRowsDeselected: this.onRowsDeselected,
                selectBy: {
                    indexes: selected_row_indices
                }
            };
        }

        return  (
            <ReactDataGrid
                enableDragAndDrop={enable_drag_and_drop}
                headerRowHeight={header_row_height}
                minHeight={this.getMinHeight()}
                minWidth={min_width}
                rowHeight={row_height}
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

    /**
     * Are the cells in the table editable?
     * If `True`, you can listen to `rows` or `row_update` to
     * get the updated data.
     */
    editable: PropTypes.bool,

    /**
     * Should the filtering UI in the Table appear?
     * If `True`, you can listen to `rows` or `row_update` to
     * get the updated data.
     */
    filterable: PropTypes.bool,

    /**
     * Is the table sortable? If `True`, click on the column headers
     * to sort by that column.
     * If `True`, you can listen to `rows` or `row_update` to
     * get the updated data.
     */
    sortable: PropTypes.bool,

    /**
     * Are the columns resizble?
     * If `True`, then the columns can be resized by clicking and
     * dragging on the border on the edge of the column
     * header. If `False`, they cannot be resized.
     */
    resizable: PropTypes.bool,

    /**
     * Column widths (in pixels) of each column
     */
    column_widths: PropTypes.arrayOf(PropTypes.number),

    /**
     * Order of columns. Note that the column names are specified in
     * `rows` but without order. This attribute allows you to specify
     * a custom order for your columns.
     */
    columns: PropTypes.arrayOf(PropTypes.string),

    row_selectable: PropTypes.bool,
    selected_row_indices: PropTypes.array,

    // These props are passed directly into the component
    enable_drag_and_drop: PropTypes.bool,
    header_row_height: PropTypes.number,
    min_height: PropTypes.number,
    min_width: PropTypes.number,

    /**
     * Maximum number of of rows to display in the viewport.
     * If `max_rows_in_viewport` is 10, then if there are 15 rows,
     * only 10 will be displayed in the viewport but if there are 5 rows,
     * then the viewport will shrink to only show those 5 rows.
     * This takes precedence over `min_height`.
     */
    max_rows_in_viewport: PropTypes.number,
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
    resizable: true,
    filters: {},
    selected_row_indices: [],
    row_selectable: false,
    row_height: 35,
}

export default DataTable;
