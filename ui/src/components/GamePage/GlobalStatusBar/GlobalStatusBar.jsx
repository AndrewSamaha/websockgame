import React, { useState } from 'react';
import { globalStore } from "../../../state/globalStore";
import { styles } from "../../../styles/styles";
const GLOBAL_STATUS_BAR_HEIGHT = 100;

const ViewPortItem = () => {
    globalStore.viewport.use();
    const viewport = globalStore.viewport;

    const [hover, setHover] = useState(false);

    return (<div style={{
        backgroundColor: hover ? styles.ui.callToAction.hex : styles.ui.secondary.hex,
        boxSizing: 'border-box',
        width: `10em`,
        height: '1.5em',
        padding: `0px`,
        margin: '4px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left'
    }}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}>
    speed: {Math.round(viewport.pos.speed.get())}
    </div>)
}
const ViewPortPosition = () => {
    globalStore.viewport.use();
    const viewport = globalStore.viewport;
    
    return (<div style={{
        backgroundColor: styles.ui.secondary.hex,
        boxSizing: 'border-box',
        width: `10em`,
        height: '1.5em',
        padding: `0px`,
        margin: '4px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left'
    }}>
    pos: {Math.round(viewport.pos.x.get())}, {Math.round(viewport.pos.y.peek())}
    </div>)
}

export const GlobalStatusBar = () => {
    return (<div 
        id={"globalstatusbar"}
        style={{
            height: `${GLOBAL_STATUS_BAR_HEIGHT}px`,
            backgroundColor: styles.ui.background.hex, 
            border: '2px',
            borderColor: 'black',
            boxSizing: 'border-box',
            width: `100%`,
            padding: `0px`,
            margin: '0',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
            }}>
        <ViewPortPosition />
        <ViewPortItem />
    </div>)
}