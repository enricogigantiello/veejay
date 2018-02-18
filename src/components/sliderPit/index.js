import React from 'react'
const SliderPit = props => {
  var height = 10;
  if (props.children % 10 === 0) {
    height = 15;
  }
  if (props.children === 100) {
    height = 20;
  }
  return (
        <div
          className="slider-pit"
          style={{
            ...props.style,
            height: height,
          }}
        />
      );

}

export default SliderPit
