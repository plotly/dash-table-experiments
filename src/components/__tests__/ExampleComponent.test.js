import React from 'react';
import {shallow} from 'enzyme';

describe('ExampleComponent', () => {

    it('renders', () => {
        const component = shallow(<div/>);
        expect(component).to.be.ok;
    });
});
