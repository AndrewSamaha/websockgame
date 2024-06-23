import React from "react";
import { Char } from "../../Layer/Char/Char";
import { globalStore } from "../../../state/globalStore";
import uniq from "lodash/uniq";
import { ACTIONS } from "../../../generators/actions";

export const NoCharacterSelected = () => {
    return (
        <></>
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
    if (ACTIONS[action]) return ACTIONS[action].label;
    return `unknown action: ${action}`;
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
            justifyContent: 'flex-start',
            height: 'auto'
        }}>
            actions
            <div style={{fontSize: '.6em', height: '100%', justifyContent: 'flex-start', }}>
                {uniq(Object.values(actions)).map((actionName) => <span style={{justifyContent: 'flex-start'}}>{mapActionToUIText(actionName)}</span>)}
            </div>
        </div>
    );
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

export const BuildsList = ({ builds }) => {
    return (
        <div id={'buildListParent'} style={{
            padding: '0px',
            margin: '0px',
            justifyContent: 'flex-start',
            height: 'auto'
        }}>
            builds
            <div id={'buildListContainer'} style={{
                fontSize: '.6em',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexShrink: 1
                }}>
                {uniq(builds).map((build, idx) => <span id={'buildListItem'} key={`build-${idx}`} style={{
                        flexShrink: 1,
                    }}>{build}</span>)}
            </div>
        </div>
    );
}

export const LeftSideBar = () => {
    globalStore.ui.selected_char.use();
    const selectedChar = globalStore.ui.selected_char.get();
    if (!selectedChar) return <NoCharacterSelected />;
    const { networkHistory, id, type, health, builds, maxHealth, owner, actions } = selectedChar;
    const belongsToPlayer = owner.id === globalStore.user.id.get();
    const backgroundColor = belongsToPlayer ? 'rgba(0, 100, 0, 1)' : owner.username === 'server' ? 'rgba(100, 100, 100, .4)' : 'rgba(100, 0, 0, 1)';
    return (
        <div id={'leftSideBar'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'flex-start',
            backgroundColor,
            height: '580px',
            width: '100%',
            justifyContent: 'flex-start',
            overflowY: 'hidden'
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
            {belongsToPlayer && <hr />}
            {belongsToPlayer && <ActionsList actions={actions}/>}
            {belongsToPlayer && <BuildsList builds={builds}/>}
        </div>
    );
}
