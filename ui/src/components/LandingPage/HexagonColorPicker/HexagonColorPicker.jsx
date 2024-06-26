import React, { useState } from 'react';
import { useQuery } from "react-query";
import { getHost } from '../../../helpers/host';
import { globalStore } from '../../../state/globalStore';
import './HexagonColorPicker.css';


const fetchAvailableColors = async () => {
    console.log('calling fetchAvailableColors')
    const response = await fetch(`${getHost()}/availableColors`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
const HexagonColorPicker = ({setSelectedColor}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { data: availableColors, isLoading, error } = useQuery('availableColors', fetchAvailableColors);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

  

  const hexagonColors = Array(7).fill(null);
  availableColors.forEach((color, index) => {
    hexagonColors[index] = color;
  });

  const getHexagonStyle = (index) => {
    const size = 50;
    const offset = size * Math.sqrt(3) / 2;
    const row = Math.floor(index / 2);
    const col = index % 2;

    const x = col * offset * 2 + (row % 2) * offset;
    const y =  row * size * .8 - row * size * .3;

    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  };

  return (
    <div className="hexagon-container">
      <div className="large-hexagon">
        {hexagonColors.map((color, index) => (
          <div
            key={index}
            className={`hexagon ${color ? 'selectable' : 'unselectable'} ${hoveredIndex !== null && hoveredIndex !== index ? 'dim' : ''}`}
            style={{
              backgroundColor: color || 'black',
              border: hoveredIndex === index ? '2px inset #ffffff' : 'none',
              ...getHexagonStyle(index),
            }}
            onClick={() => {
                globalStore.user.color.set(color);
                setSelectedColor(color);
                setHoveredIndex(index)
            }}
            // onClick={() => setHoveredIndex(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default HexagonColorPicker;
