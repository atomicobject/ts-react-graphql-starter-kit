import * as React from 'react';

import {shallow} from 'enzyme';
import {RedBox} from '..';

describe("RedBox", () => {
  it("Renders", () => {
    const result = shallow(<RedBox>Hello!</RedBox>)
    expect(result.name()).toEqual('div');
    expect(result.hasClass('red-box')).toBeTruthy();
    expect(result.text()).toEqual('Hello!')
  })
})