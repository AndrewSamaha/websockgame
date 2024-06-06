export const ACTIONS = {
    setMoveDestination: {
        name: 'setMoveDestination',
        label: 'Move',
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
        initiate: () => {}
    },
    setResourceTarget: {
        name: 'setResourceTarget',
        label: 'Gather',
        initate: () => {}
    },
}
