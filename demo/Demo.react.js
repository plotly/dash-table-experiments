import React, {Component} from 'react';
import {EditableTable} from '../src';

class Demo extends Component {
    constructor() {
        super()
        this.state = {
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
        }
    }

    render() {
        return (
            <div>
                <h2>EditableTable..</h2>
                    <EditableTable
                        changedData={this.state.changedData}
                        dataframe={this.state.dataframe}
                        editable={true}
                        setProps={newProps => this.setState(newProps)}
                        merged_styles={{
                            td: {'border': 'thick blue solid'}
                        }}
                    />
                <hr/>
                <pre>
                    {JSON.stringify(this.state, null, 2)}
                </pre>
            </div>
        );
    }
}

export default Demo;
