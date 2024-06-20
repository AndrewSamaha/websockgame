import React from "react";

export const LeftSideBar = ({children}) => {
    return (
        <div id={'leftSideBar'}
          style={{
            backgroundColor: 'rgba(100, 0, 100, 1)',
            height: '580px',
            width: '100%'
          }}>
            {children}
        </div>
    );
}