import React, { useState } from 'react';
import { globalStore } from "../../../state/globalStore";
import { styles } from "../../../styles/styles";
const GLOBAL_STATUS_BAR_HEIGHT = 100;

const GenericFied = ({label, value}) => {
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
    {label}: {value}
    </div>)
}
const UserFieldsRow = () => {
    globalStore.user.use();
    const user = globalStore.user;

    return (<div style={{
        boxSizing: 'border-box',
        height: '1.5em',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'flex-start',
    }}>
        {
            Object.entries(user.resources).map(([key, value]) => {
                return <GenericFied key={key} label={key} value={value.get()} />
            })
        }
    </div>)
}

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
        flexDirection: 'row',
        alignItems: 'left'
    }}>
    pos: {Math.round(viewport.pos.x.get())}, {Math.round(viewport.pos.y.peek())}
    </div>)
}

const ViewPortRow = () => {
    return (<div style={{
        boxSizing: 'border-box',
        height: '1.5em',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'flex-start',
    }}>
        <ViewPortPosition />
        <ViewPortItem />
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
            padding: `4px`,
            margin: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            justifyContent: 'space-between'
            }}>
        <UserFieldsRow />
        <ViewPortRow />
    </div>)
}