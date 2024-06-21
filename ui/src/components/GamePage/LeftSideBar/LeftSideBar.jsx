import React from "react";
import { Char } from "../../Layer/Char/Char";
import { globalStore } from "../../../state/globalStore";
import uniq from "lodash/uniq";
import compact from "lodash/compact";

export const NoCharacterSelected = () => {
    return (
        <pre>No character selected</pre>
    );
}

function healthToColor(ratio) {
    let red, green;
    if (ratio > 0.4) {
        // From green to yellow
        red = Math.floor(255 * (1 - ratio) * 2.5); // Increase red as health decreases
        green = 255;
    } else {
        // From yellow to red
        red = 255;
        green = Math.floor(255 * (ratio / 0.4)); // Decrease green as health decreases further
    }
    return `rgba(${red}, ${green}, 0, 1)`; // Return the color in rgba format
}

const mapActionToUIText = (action) => {
    switch (action) {
        case 'setAttackTarget':
            return 'Attack';
        case 'setMoveDestination':
            return 'Move';
        default:
            return action;
    }
}

export const HealthBar = ({ health, maxHealth }) => {
    const ratio = health / maxHealth;
    const healthColor = healthToColor(ratio);

    return (
        <div
            style={{
                backgroundColor: 'rgba(0, 0, 0, 1)',
                height: '10px',
                width: '90%',
                border: '1px solid black'
            }}>
                <div
                    style={{
                        backgroundColor: healthColor,
                        height: '100%',
                        width: `${ratio * 100}%`
                    }}>

                </div>
        </div>
    );
}

export const OwnerBar = ({ owner, belongsToPlayer }) => {

    if (belongsToPlayer) {
        return (
            <div style={{ height: '2em', fontSize: '.7em'}}>
                you own this
            </div>
        );
    }
    return (
        <div style={{ height: '2em', fontSize: '.7em'}}>
                owned by: {owner.username}
        </div>
    );
}
export const ActionsList = ({ actions }) => {
    return (
        <div style={{
            padding: '0px',
            margin: '0px',
            height: '100%',
            justifyContent: 'flex-start'
        }}>
            actions
            <div style={{fontSize: '.6em', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                {uniq(Object.values(actions)).map((actionName) => <span style={{justifyContent: 'flex-start'}}>{mapActionToUIText(actionName)}</span>)}
            </div>
        </div>
    );
}

export const LeftSideBar = () => {
    globalStore.ui.selected_char.use();
    const selectedChar = globalStore.ui.selected_char.get();
    if (!selectedChar) return <NoCharacterSelected />;
    const { networkHistory, id, type, health, maxHealth, owner, actions } = selectedChar;
    const belongsToPlayer = owner.id === globalStore.user.id.get();
    const backgroundColor = belongsToPlayer ? 'rgba(0, 100, 0, 1)' : owner.username === 'server' ? 'rgba(100, 100, 100, .4)' : 'rgba(100, 0, 0, 1)';
    return (
        <div id={'leftSideBar'}
          style={{
            backgroundColor,
            height: '580px',
            width: '100%',
            justifyContent: 'flex-start'
          }}>
            <style>
                {`
                    #leftSideBar hr {
                        border: 0;
                        height: 5px;
                        background-image: linear-gradient(to right, rgba(100, 0, 100, 0), rgba(100, 0, 100, 0.75), rgba(100, 0, 100, 0));
                        margin: 20px 0;
                        width: 90%;
                    }
                `}
            </style>
            <Char
                key={`leftSideBarChar${id}`}
                id={id}
                viewport={null} />
            {type}
            <HealthBar health={health} maxHealth={maxHealth} />
            <OwnerBar owner={owner} belongsToPlayer={belongsToPlayer} />
            {belongsToPlayer && (<>
                <hr/>
                <ActionsList actions={actions}/>
                </>)}
        </div>
    );
}
