// @flow
import * as React from 'react';
import type {Node as ReactNode} from 'react';

import Resizable from './Resizable';
import {resizableProps} from "./propTypes";
import type {ResizeCallbackData, ResizableBoxState} from './propTypes';

// ElementConfig gives us an object type where all items present in `defaultProps` are made optional.
// <ResizableBox> does not have defaultProps, so we can use this type to tell Flow that we don't
// care about that and will handle it in <Resizable> instead.
type ResizableBoxProps = React.ElementConfig<typeof Resizable>;

export default class ResizableBox extends React.Component<ResizableBoxProps, ResizableBoxState> {
  static propTypes = resizableProps;

  state: ResizableBoxState = {
    width: this.props.width,
    height: this.props.height,
    propsWidth: this.props.width,
    propsHeight: this.props.height,
  };

  static getDerivedStateFromProps(props: ResizableBoxProps, state: ResizableBoxState) {
    // If parent changes height/width, set that in our state.
    if (state.propsWidth !== props.width || state.propsHeight !== props.height) {
      return {
        width: props.width,
        height: props.height,
        propsWidth: props.width,
        propsHeight: props.height,
      };
    }
    return null;
  }

  onResize = (e: SyntheticEvent<>, data: ResizeCallbackData) => {
    const {size} = data;
    if (this.props.onResize) {
      e.persist && e.persist();
      this.setState(size, () => this.props.onResize && this.props.onResize(e, data));
    } else {
      this.setState(size);
    }
  };

  render(): ReactNode {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the child component
    // with a new width and height.
    const {
      handle,
      handleSize,
      onResize,
      onResizeStart,
      onResizeStop,
      draggableOpts,
      minConstraints,
      maxConstraints,
      lockAspectRatio,
      axis,
      width,
      height,
      resizeHandles,
      transformScale,
      ...props
    } = this.props;

    return (
      <Resizable
        axis={axis}
        draggableOpts={draggableOpts}
        handle={handle}
        handleSize={handleSize}
        height={this.state.height}
        lockAspectRatio={lockAspectRatio}
        maxConstraints={maxConstraints}
        minConstraints={minConstraints}
        onResizeStart={onResizeStart}
        onResize={this.onResize}
        onResizeStop={onResizeStop}
        resizeHandles={resizeHandles}
        transformScale={transformScale}
        width={this.state.width}
      >
        <div style={{width: this.state.width + 'px', height: this.state.height + 'px'}} {...props} />
      </Resizable>
    );
  }
}
