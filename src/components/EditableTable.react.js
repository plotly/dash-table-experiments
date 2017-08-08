import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {keys} from 'ramda';


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

    render() {
        const {editable, updateValue, value} = this.props;
        const {isSelected} = this.state;
        if (editable && isSelected) {
            return (
                <td style={{'width': 60, 'padding': 0}}>
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
                    style={{
                        'box-sizing': 'border-box',
                        'padding': '5px',
                        'width': '60px'
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
        const {dataframe, editable, id, setProps} = this.props;

        const columnNames = keys(dataframe);
        const index = keys(dataframe[columnNames[0]]);

        return (
            <table
                style={{
                    'box-sizing': 'border-box',
                    'border-collapse': 'collapse'
                }}
                id={id}
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
                                    if(setProps) {
                                        setProps({dataframe});
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
    editable: false
}

EditableTable.propTypes = {
    id: PropTypes.string,
    dataframe: PropTypes.object,
    editable: PropTypes.bool,
    setProps: PropTypes.func
}
