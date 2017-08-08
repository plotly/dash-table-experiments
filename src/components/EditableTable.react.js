import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {keys} from 'ramda';


class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovering: false,
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

    render() {
        const {editable, updateValue, value} = this.props;
        const {isHovering, isSelected} = this.state;
        if (editable && isSelected) {
            return (
                <td>
                    <input
                        type="text"
                        value={value}
                        onChange={e => updateValue({value: e.target.value})}
                        style={{'width': '100%', 'border': 'none', 'height': '100%'}}
                        isActive={true}
                        ref={input => {
                            if (input) {
                                input.focus();
                            }
                        }}
                    />
                </td>
            );
        } else {
            return (
                <td
                    onClick={() => {
                        this.setState({isSelected: true});
                    }}
                    onMouseEnter={() => this.setState({isHovering: true})}
                    onMouseLeave={() => this.setState({isHovering: false})}
                    style={{
                        'box-sizing': 'border-box',
                        'border': isHovering ? 'thin blue solid' : 'thin white solid',
                        'padding': '5px',
                        'cursor': isHovering ? 'pointer' : 'defualt'
                    }}
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
            rows: props.rows,
            columnnames: props.columnnames
        };
    }

    render() {
        const {editable, dataframe} = this.props;

        const columnNames = keys(dataframe);
        const index = keys(dataframe[columnNames[0]]);

        return (
            <table
                style={{
                    'box-sizing': 'border-box',
                    'border-collapse': 'collapse'
                }}
            >
                {/* Render Columns so that each column can have the
                    same parent width */}

                <thead>
                    <tr>
                        <th>
                            {''}
                        </th>
                        {keys(dataframe).map(columnName => (
                            <th>
                                {columnName}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                {index.map(idx => (
                    <tr>
                        <th>
                            {idx}
                        </th>
                        {columnNames.map(c => (
                            <Cell
                                value={dataframe[c][idx]}
                                editable={editable}
                                updateValue={newProps => {
                                    const newDataframe = dataframe[c][idx] = newProps.value;
                                    this.setState({
                                        dataframe: newDataframe
                                    });
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
    editable: true,
    dataframe: {
        'Column 1': {
            '0': 4,
            '1': 'Another cell',
            '2': 5
        },
        'Column 2': {
            '0': 8,
            '1': 4,
            '2': 'NYC'
        }
    }
}
