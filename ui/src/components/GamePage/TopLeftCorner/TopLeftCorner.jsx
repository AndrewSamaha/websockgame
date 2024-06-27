import React from 'react';

export const TopLeftCorner = ({children}) => {
    return (
        <div id={'topLeftCorner'}
            style={{
                backgroundColor: 'rgba(100, 100, 0, 1)',
                margin: '0px 0px 5px 0px',
                height: '100px',
                width: '100%'
            }}>
            {children}
        </div>
    );
}
