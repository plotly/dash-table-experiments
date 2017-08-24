import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {keys, mergeAll} from 'ramda';
import {Grid} from 'react-virtualized';



class EditableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);

        if ((!domNode || !domNode.contains(event.target))) {
            this.setState({
                isSelected: false
            });
        }
    }

    componentWillMount() {
        this.setState({value: this.props.value});
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    render() {
        const {style, updateValue} = this.props;
        const {isSelected, value} = this.state;

        return (
            <input
                type="text"
                value={value}
                onChange={e => {
                    this.setState({value: e.target.value});
                }}
                onBlur={e => {
                    updateValue(e.target.value);
                }}
                isActive={isSelected}
                style={style}
            />
        );
    }
}


export default class VirtualizedTable extends Component {
    constructor(props) {
        super(props);
        this.cellRenderer = this.cellRenderer.bind(this);
    }


    cellRenderer ({columnIndex, key, rowIndex, style}) {
        const {editable, dataframe, display_index, index_name, setProps, styles} = this.props;
        let value;
        if (display_index) {
            if (columnIndex === 0 && rowIndex == 0) {
                value = index_name;
            } else if (columnIndex === 0) {
                value = dataframe.index[rowIndex - 1];
            } else if (rowIndex === 0) {
                value = dataframe.columns[columnIndex - 1];
            } else {
                value = dataframe.data[rowIndex - 1][columnIndex-1];
            }
        } else {
            value = dataframe.data[rowIndex][columnIndex];
        }


        const cellStyle = mergeAll([
            style,
            rowIndex === 0 ? styles.header : styles.cell,
            (columnIndex == dataframe.columns.length ?
             (rowIndex === 0 ? styles['header-rightmost'] :
                               styles['cell-rightmost']
             ) : {})
        ]);

        if (editable) {
            return (
                <EditableCell
                    style={cellStyle}
                    value={value}
                    updateValue={newValue => {
                        if (display_index) {
                            if (columnIndex === 0 && rowIndex === 0) {
                                if (setProps) setProps({index_name: newValue});
                            } else if (columnIndex === 0) {
                                dataframe.index[rowIndex - 1] = newValue;
                            } else if (rowIndex === 0) {
                                dataframe.columns[columnIndex - 1] = newValue;
                            } else {
                                dataframe.data[rowIndex - 1][columnIndex-1] = newValue;
                            }
                        } else {
                            dataframe.data[rowIndex][columnIndex] = newValue;
                        }

                        if (setProps) setProps({dataframe});
                    }}
                />
            );
        } else {
            return (
                <div
                    key={key}
                    style={cellStyle(columnIndex)}
                >
                    {value}
                </div>
            );
        }
    }

    render() {
        const {
            column_width,
            dataframe,
            display_index,
            height,
            row_height,
            styles,
            width
        } = this.props;

        return (
            <div style={styles.container}>
                <Grid
                    cellRenderer={this.cellRenderer}
                    columnCount={
                        dataframe.columns.length +
                        (display_index ? 1 : 0)
                    }
                    columnWidth={column_width}
                    height={height}
                    rowCount={dataframe.data.length + 1}
                    rowHeight={row_height}
                    width={width}
                />
            </div>
        );
    }
}

const BORDER = 'thin lightgrey solid';

VirtualizedTable.defaultProps = {
    editable: true,
    display_index: true,
    index_name: '',
    column_width: 80,
    row_height: 20,
    height: 500,
    width: 600,
    styles: {
        'container': {
            'font-size': '1rem'
        },
        'cell': {
            'white-space': 'nowrap',
            'border-left': BORDER,
            'border-bottom': BORDER,
            'border-top': 'none',
            'border-right': 'none',
            'text-overflow': 'ellipsis',
            'overflow-x': 'hidden',
            'box-sizing': 'border-box'
        },
        'cell-rightmost': {
            'border-right': BORDER
        },
        'header': {
            'text-align': 'left',
            'border-left': BORDER,
            'border-bottom': BORDER,
            'border-top': BORDER,
            'font-weight': 600,
            'display': 'inline-block',
            'box-sizing': 'border-box'
        },
        'header-rightmost': {
            'border-right': BORDER
        }
    }
}

const STYLE_SHAPE = {};
keys(VirtualizedTable.defaultProps.styles).forEach(
    k => STYLE_SHAPE[k] = PropTypes.object);


VirtualizedTable.propTypes = {
    /**
     * The ID of the component, used to identify the component
     * in Dash callbacks
     */
    id: PropTypes.string,

    changed_data: PropTypes.object,

    /**
     * The data of this table, in the form of a Pandas DataFrame.to_dict('split')
     * For example,
     * {
     *    'columns': ['Column 1', 'Column 2', 'Column 3'],
     *    'data': [[1, 2, 3], [4, 3, 1]],
     *    'index': [1, 2, 3]
     * }
     *
     * If `editable=True`, then this `dataframe` will be updated when the
     * user changes values
     */
    dataframe: PropTypes.objectOf(PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.array),
        columns: PropTypes.arrayOf(PropTypes.string),
        index: PropTypes.array
    })),

    /**
     * Whether or not to show the index column
     */
    display_index: PropTypes.bool,

    /**
     * The name of the index column.
     * This name is not included in the `dataframe` object
     */
    index_name: PropTypes.string,

    /**
     * Whether or not this table is editable
     */
    editable: PropTypes.bool,

    /**
     * CSS styles for all of the different elements in this table.
     * The `styles` have a default value. If you want to remove
     * all default styles, set `styles` to `{}`.
     */
    styles: STYLE_SHAPE,

    /**
     * Column width (in pixels)
     */
    column_width: PropTypes.number,

    /**
     * Row height (in pixels)
     */
    row_height: PropTypes.number,

    /**
     * Height of entire table (in pixels)
     */
    height: PropTypes.number,

    /**
     * Width of entire table (in pixels)
     */
    width: PropTypes.number,

    /**
     * Dash supplied function
     */
    setProps: PropTypes.func
}
