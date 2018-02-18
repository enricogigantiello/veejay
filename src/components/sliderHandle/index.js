import React from 'react'
const SliderHandle = props => {

  return (
    <div
      {...props}
      className="slider-handle"
      style={{
        ...props.style,
      }}
    />
  );

}

export default SliderHandle
