export const ACTIONS = {
    none: {
        name: 'none',
        label: 'None',
        initiate: () => {}
    },
    setMoveDestination: {
        name: 'setMoveDestination',
        label: 'Move',
        defaultHotKey: 'm',
        initiate: ({unit, requestUnitAction, worldCoordinates}) => {
            console.log('calling initiate on setMoveDestination')
            console.log('unit here:')
            console.log({unit})
            unit.actionData = {
                moveDestination: { ...worldCoordinates },
                moveStart: { ...unit.pos }
            }
            requestUnitAction(unit, {
                actionName: ACTIONS.setMoveDestination.name,
                actionData: unit.actionData
            });
        }
    },
    setAttackTarget: {
        name: 'setAttackTarget',
        label: 'Attack',
        defaultHotKey: 'x',
        initiate: () => {}
    },
    setResourceTarget: {
        name: 'setResourceTarget',
        label: 'Gather',
        defaultHotKey: 'g',
        initate: () => {}
    },
}
