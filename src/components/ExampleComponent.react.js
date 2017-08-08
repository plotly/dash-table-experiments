import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * ExampleComponent is an example component.
 * It takes a single property, `label`, and
 * displays it.
 */
export default class ExampleComponent extends Component {
    render() {
        const {label} = this.props;

        return (
            <div>ExampleComponent: {label}</div>
        );
    }
}

ExampleComponent.propTypes = {
    /**
     * A label that will be printed when this component is rendered.
     */
    label: PropTypes.string.isRequired
};
