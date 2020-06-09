import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import ResizableBox from '../lib/ResizableBox';
import Resizable from "../lib/Resizable";

describe('render ResizableBox', () => {
  const props = {
    axis: 'x',
    handle: jest.fn(resizeHandle => <span className={`test-class-${resizeHandle}`} />),
    handleSize: [20, 20],
    height: 50,
    lockAspectRatio: false,
    maxConstraints: [30, 30],
    minConstraints: [10, 10],
    onResize: jest.fn(),
    onResizeStart: jest.fn(),
    onResizeStop: jest.fn(),
    resizeHandles: ['w'],
    width: 50,
  };
  const children = <span className={'children'} />;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('snapshot default props', () => {
    const tree = renderer.create(<ResizableBox {...props}>{children}</ResizableBox>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with correct props', () => {
    const element = shallow(<ResizableBox {...props}>{children}</ResizableBox>);
    expect(element.state()).toEqual({
      height: 50,
      propsHeight: 50,
      propsWidth: 50,
      width: 50,
    });
    const resizable = element.find(Resizable);
    const fakeEvent = {persist: jest.fn()};
    const data = {node: children, size: {width: 30, height: 30}, handle: 'w'};
    resizable.simulate('resize', fakeEvent, data);
    expect(element.state()).toEqual({
      height: 30,
      propsHeight: 50,
      propsWidth: 50,
      width: 30,
    });
    expect(element.find('.children')).toHaveLength(1);
    expect(fakeEvent.persist).toHaveBeenCalledTimes(1);
    expect(props.onResize).toHaveBeenCalledWith(fakeEvent, data);

    resizable.simulate('resizeStart', fakeEvent, data);
    expect(props.onResizeStart).toHaveBeenCalledWith(fakeEvent, data);

    resizable.simulate('resizeStop', fakeEvent, data);
    expect(props.onResizeStop).toHaveBeenCalledWith(fakeEvent, data);
  });
});
