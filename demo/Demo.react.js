import React, {Component} from 'react';
import {EditableTable} from '../src';

class Demo extends Component {
    render() {
        return (
            <div>
                <h1>dash-table-experiments Demo.</h1>

                <hr/>
                <h2>EditableTable..</h2>
                    <EditableTable/>
                <hr/>
            </div>
        );
    }
}

export default Demo;
