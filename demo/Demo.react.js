import R from 'ramda';
import React, {Component} from 'react';
import {DataTable} from '../src';

const ROWS = [
    {'a': 'AA', 'b': 1},
    {'a': 'AB', 'b': 2},
    {'a': 'BB', 'b': 3},
    {'a': 'BC', 'b': 4},
    {'a': 'CC', 'b': 5},
    {'a': 'CD', 'b': 6}
]

class Demo extends Component {
    constructor() {
        super()
        this.state = {
            rows: ROWS,
            columns: R.keys(ROWS[0]),
            filterable: true,
            sortable: true,
            row_selectable: true
        }
    }

    render() {
        return (
            <div>
                <h2>DataTable</h2>
                <button onClick={() => this.setState({rows: ROWS})}>
                    Reset
                </button>
                <DataTable
                    {...this.state}
                />
            </div>
        );
    }
}

export default Demo;
