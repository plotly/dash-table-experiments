import React, {Component} from 'react';
import {DataTable, EditableTable, VirtualizedTable} from '../src';

const DATAFRAME = {
    'data': [
        [1, 3, 'Montréal'],
        [4, 1, 'SF'],
        [5, 8, 'New York City, United States of America']
    ],
    'columns': ['Column 1', 'Column 2', 'Column 3'],
    'index': [1, 4, 8]
}

class Demo extends Component {
    constructor() {
        super()
        this.state = {
            editable: {
                changedData: {},
                dataframe: {
                    'x': {
                        '0': 1,
                        '1': 3,
                        '2': 5
                    },
                    'y': {
                        '0': 4,
                        '1': 3,
                        '2': 8
                    },
                    'z': {
                        '0': 'Montréal',
                        '1': 'SF',
                        '2': 'New York City, United States of America'
                    }
                }
            },
            virtualized: {
                dataframe: {
                    'data': [
                        [1, 3, 'Montréal'],
                        [4, 1, 'SF'],
                        [5, 8, 'New York City, United States of America']
                    ],
                    'columns': ['Column 1', 'Column 2', 'Column 3'],
                    'index': [1, 4, 8]
                },
                index_name: 'Index'
            }
        }
    }

    render() {
        return (
            <div>

                <h2>DataTable</h2>
                <DataTable dataframe={DATAFRAME}/>
{/*
                <h2>VirtualizedTable Component</h2>
                <VirtualizedTable
                    dataframe={this.state.virtualized.dataframe}
                    index_name={this.state.virtualized.index_name}
                    setProps={newProps => {
                        this.setState({
                            virtualized: newProps
                        })
                    }}
                />
                <pre>
                    {JSON.stringify(this.state.virtualized, null, 2)}
                </pre>

                <hr/>

                <h2>EditableTable Component</h2>
                <EditableTable
                    changedData={this.state.editable.changedData}
                    dataframe={this.state.editable.dataframe}
                    editable={true}
                    setProps={newProps => this.setState(newProps)}
                />
                <pre>
                    {JSON.stringify(this.state.editable, null, 2)}
                </pre>
*/}
            </div>
        );
    }
}

export default Demo;
