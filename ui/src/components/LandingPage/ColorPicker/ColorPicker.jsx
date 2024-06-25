import React from 'react';
import './ColorPicker.css';

const ColorPicker = ({ colors }) => {
  const hexagonColors = Array(10).fill(null);
  colors.forEach((color, index) => {
    hexagonColors[index] = color;
  });

  return (
    <div className="hexagon-container">
      {hexagonColors.map((color, index) => (
        <div
          key={index}
          className={`hexagon ${color ? 'selectable' : 'unselectable'}`}
          style={{ backgroundColor: color || 'black' }}
        >
          {color && (
            <div className="tooltip" style={{ backgroundColor: color }}>
              {color}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
