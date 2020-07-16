const net = require('net');
const isValidUUID = require('uuid-validate');

class Player {
    constructor(username, userId, handleId) {
        if(username === undefined)
            throw new Error('Invalid player: undefined username');

        if(userId === undefined)
            throw new Error('Invalid player: undefined userId');

        if(handleId === undefined)
            throw new Error('Invalid player: undefined handleId');

        if(typeof username !== 'string')
            throw new Error('Invalid player: username not a string');

        if(typeof userId !== 'string')
            throw new Error('Invalid player: userId not a string');

        if(typeof handleId !== 'string')
            throw new Error('Invalid player: handleId not a string');

        if(!isValidUUID(userId))
            throw new Error('Invalid player: bad userId ("' + userId + '")');

        if(!isValidUUID(handleId))
            throw new Error('Invalid player: bad handleId ("' + handleId + '")');

        this._username = username;
        this._userId = userId;
        this._handleId = handleId;
        this._connected = false;
        this._controller = null;
        this._state = null;
        this._brikkit = null;
    }

    // get player's controller
    async getController() {
        if (!this._brikkit)
            return null;

        if (this._controller)
            this._controller;

        const brickadia = this._brikkit._brickadia;

        // regexes for matching player state and controller
        const stateRegExp = /BP_PlayerState_C .+?PersistentLevel\.(?<state>BP_PlayerState_C_\d+)\.PlayerName = (?<name>.+)$/;
        const controllerRegExp = /BP_PlayerState_C .+?PersistentLevel\.(?<state>BP_PlayerState_C_\d+)\.Owner = BP_PlayerController_C'.+?:PersistentLevel.(?<controller>BP_PlayerController_C_\d+)'/;

        // wait for this players' state
        const statePromise = brickadia.waitForLine(line => {
            const match = line.match(stateRegExp);
            // no match, return null
            if (!match) return null;
            const { name, state } = match.groups;

            // a player under the same name is using this state, ignore
            if (this._brikkit._players.some(p => p._connected && p._username === this._username && state === p._state)) {
                return null;
            }

            // return the state if the name matches
            return name === this._username ? state : null;
        });

        // request all states and players from brickadia
        brickadia.write(`GetAll BRPlayerState PlayerName\n`);
        const state = await statePromise;

        // wait for this players' controller
        const controllerPromise = brickadia.waitForLine(line => {
            const match = line.match(controllerRegExp);

            // if no match, return null
            if (!match) return null;

            return match.groups.state === state ?  match.groups.controller : null;
        });


        // request the owner for this state
        brickadia.write(`GetAll BRPlayerState Owner Name=${state}\n`);
        const controller = await controllerPromise;

        if (!controller || !state)
            return null;

        // the controller and state exist, so this player is connected
        this._state = state;
        this._controller = controller;
        this._connected = true;

        return controller;
    }

    // get player's position
    async getPosition() {
        if (!this._brikkit)
            return null;

        const controller = this._controller || await this.getController();

        if (!controller)
            return;

        const brickadia = this._brikkit._brickadia;

        // regexes for matching player state and controller
        const pawnRegExp = /BP_PlayerController_C .+?PersistentLevel\.(?<controller>BP_PlayerController_C_\d+)\.Pawn = BP_FigureV2_C'.+?:PersistentLevel.(?<pawn>BP_FigureV2_C_\d+)'/;
        const posRegExp = /CapsuleComponent .+?PersistentLevel\.(?<pawn>BP_FigureV2_C_\d+)\.CollisionCylinder\.RelativeLocation = \(X=(?<x>[\d\.-]+),Y=(?<y>[\d\.-]+),Z=(?<z>[\d\.-]+)\)/;

        // wait for this players' pawn
        const pawnPromise = brickadia.waitForLine(line => {
            const match = line.match(pawnRegExp);

            // if no match, return null
            if (!match) return null;

            return match.groups.controller === controller ?  match.groups.pawn : null;
        });

        // request all states and players from brickadia
        brickadia.write(`GetAll BP_PlayerController_C Pawn Name=${controller}\n`);
        const pawn = await pawnPromise;

        // wait for this players' pawn
        const posPromise = brickadia.waitForLine(line => {
            const match = line.match(posRegExp);

            // if no match, return null
            if (!match) return null;
            const { x, y, z } = match.groups;

            return match.groups.pawn === pawn ? [x, y, z].map(Number) : null;
        });

        // request the owner for this state
        brickadia.write(`GetAll SceneComponent RelativeLocation Name=CollisionCylinder Outer=${pawn}\n`);
        const pos = await posPromise;

        if (!pawn || !pos)
            return null;

        // the player exists, return the position
        return pos;
    }

    // not very reliable
    isConnected() {
        return this._connected;
    }

    getUsername() {
        return this._username;
    }


    getUserId() {
        return this._userId;
    }

    getHandleId() {
        return this._handleId;
    }
}

module.exports = Player;