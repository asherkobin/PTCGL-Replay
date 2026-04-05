class State {
    /** @type {string} */
    playerName = "";
    /** @type {string} */
    opponentName = "";
}

//
// state manager
//

export default class StateManager {
    constructor() {
        this._currentState = new State();
        
        this._currentState.playerName = "PH PlayerName";
        this._currentState.opponentName = "PH OpponentName";

        this._updateRegions = [1];
    }

    invalidateAll() {
        this._updateRegions.push(1);
    }

    /**
     * (NYI) Returns the regions that need updating due to state changes
     * 
     * @returns {number[]}
     */
    getUpdateRegions() {
        return this._updateRegions;
    }

    /**
     * (NYI) Removes all update regions (usually as a result of redering)
     */
    clearUpdateRegions() {
        this._updateRegions.length = 0;
    }

    get PlayerName() {
        return this._currentState.playerName;
    }
    set PlayerName(v) {
        this._currentState.playerName = v;
        this.invalidateAll();
    }
}