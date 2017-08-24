import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import R, {keys, merge} from 'ramda';

function deepMerge(a, b) {
  return (R.is(Object, a) && R.is(Object, b)) ? R.mergeWith(deepMerge, a, b) : b;
}

class Cell extends Component {
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
        const {editable, type, updateValue, STYLES} = this.props;
        const {isSelected, value} = this.state;

        if (editable) {
            return (
                <td style={merge(STYLES.td, STYLES[type])}>
                    <input
                        type="text"
                        value={value}
                        onChange={e => {
                            this.setState({value: e.target.value})
                        }}
                        onBlur={e => {
                            updateValue({value: e.target.value})
                        }}
                        style={merge(
                            merge(STYLES.input, STYLES[type]),
                            isSelected ? STYLES['input-active'] : {}
                        )}
                        isActive={isSelected}
                    />
                </td>
            );
        } else {
            return (
                <td
                    onClick={() => {
                        this.setState({isSelected: true});
                    }}
                     style={merge(STYLES.td, STYLES[type])}
                >
                    {value}
                </td>
            );
        }
    }
}

export default class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            column_order: props.column_order || keys(props.dataframe)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.column_order) {
            this.setState({
                column_order: keys(nextProps.dataframe)
            });
        }
    }

    render() {
        const {
            dataframe,
            editable,
            id,
            merged_styles,
            setProps,
            base_styles,
            types
        } = this.props;

        const {column_order} = this.state;
        const index = keys(dataframe[column_order[0]]);

        const STYLES = deepMerge(base_styles, merged_styles);

        return (
            <table
                style={STYLES.table}
                id={id}
            >
                {/* Render Columns so that each column can have the
                    same parent width */}

                <thead style={STYLES.thead}>
                    <tr>
                        <th style={STYLES.th}>
                            {this.props.index_name}
                        </th>
                        {column_order.map(columnName => (
                            <th style={STYLES.th}>
                                {columnName}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                {index.map(idx => (
                    <tr>
                        <th style={STYLES.th}>
                            {idx}
                        </th>
                        {column_order.map(c => (
                            <Cell
                                STYLES={STYLES}
                                value={dataframe[c][idx]}
                                type={types[c]}
                                editable={editable}
                                updateValue={newProps => {

                                    dataframe[c][idx] = newProps.value;

                                    const changed_data = merge(
                                        this.props.changed_data,
                                        {[c]: merge(
                                            this.props.changed_data[c],
                                            {[idx]: newProps.value}
                                        )}
                                    );

                                    this.setState({dataframe, changed_data});

                                    if(setProps) {
                                        setProps({
                                            dataframe,
                                            changed_data
                                        });
                                    }

                                }}
                            />
                        ))}
                    </tr>
                ))}
                </tbody>

            </table>
        );
    }
}

EditableTable.defaultProps = {
    changed_data: {},
    editable: false,
    index_name: '',
    types: {},
    merged_styles: {},
    base_styles: {
        'numeric': {
            'text-align': 'right',
            'font-family': '\'Droid Sans Mono\', Courier, monospace'
        },

        'string': {
            'text-align': 'left'
        },

        'input': {
            'padding': 0,
            'margin': 0,
            'width': '80px',
            'border': 'none',
            'font-size': '1rem'
        },

        'input-active': {
            'outline': '#7FDBFF auto 3px'
        },

        'table': {
            'border-collapse': 'collapse',
            'box-sizing': 'border-box',
            'font-size': '1rem'
        },

        'thead': {
            'display': 'table-row-group'
        },

        'th': {
            'text-align': 'left',
            'font-weight': 'normal',
            'border': 'thin lightgrey solid',
            'width': '80px'
        },

        'td': {
            'white-space': 'nowrap',
            'border': 'thin lightgrey solid',
            'width': '80px',
            'max-width': '80px',
            'text-overflow': 'ellipsis',
            'overflow-x': 'hidden'
        }
    }
}

const STYLE_SHAPE = {};
keys(EditableTable.defaultProps.base_styles).forEach(
    k => STYLE_SHAPE[k] = PropTypes.object);

EditableTable.propTypes = {
    /**
     * The ID of the component, used to identify the component
     * in Dash callbacks
     */
    id: PropTypes.string,

    changed_data: PropTypes.object,

    /**
     * The data of this table, in the form of a Pandas DataFrame.to_dict()
     * The keys of the dict are the column names and the values are a
     * dict that represents the column where the keys of the column are the
     * values of the index and the values are the rows.
     * For example,
     * {
     *    "Column 1": {"0": "Value A", "1": "Value B"},
     *    "Column 2": {"0": 3129, "1": 4931},
     * }
     *
     * If `editable=True`, then this `dataframe` will be updated when the
     * user changes values
     */
    dataframe: PropTypes.objectOf(PropTypes.objectOf),

    /**
     * Order of the columns
     */
    column_order: PropTypes.arrayOf(PropTypes.string),

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
     * The `base_styles` have a default value. If you want to remove
     * all default styles, set `base_styles` to `{}`.
     */
    base_styles: STYLE_SHAPE,

    /**
     * `merged_styles` is recursively merged into `base_styles`.
     * Use `merged_styles` if you want to update or overwrite a small set
     * of the base styles.
     */
    merged_styles: STYLE_SHAPE,

    types: PropTypes.object,

    /**
     * Dash supplied function
     */
    setProps: PropTypes.func
}
