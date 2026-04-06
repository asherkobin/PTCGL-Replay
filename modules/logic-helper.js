import StateManager from "./state-manager.js";
import SoundFactory from "./sound-factory.js";
import TransitionManager from "./transition-manager.js";
import { UserInputState } from "./input-event-manager.js";
import { Config, Layout, Button } from "./config-manager.js"
import CombatLog from "./combat-log.js";

export default class LogicHelper {
    /**
     * Game Logic
     * 
     * @param {StateManager} stateManager
     * @param {Config} currentConfig
     * @param {Layout} uiLayout
     * @param {SoundFactory} soundFactory
     */
    constructor (stateManager, currentConfig, uiLayout, soundFactory) {
        /** @type {StateManager} */
        this._stateManager = stateManager;
        /** @type {Config} */
        this._currentConfig = currentConfig;
        /** @type {Layout} */
        this._uiLayout = uiLayout;
        /** @type {SoundFactory} */
        this._soundFactory = soundFactory;
        /** @type {TransitionManager} */
        this._transitionManager = new TransitionManager();

    }
    
    /**
     * Generates a command based on user input.
     * 
     * @returns {string | null}
     * @param {UserInputState} userInput
     * @param {number} dT
     */
    inputToCommand(userInput, dT) {
        if (userInput.pointerClick != "none") {
            const buttonInfo = this._objectFromPoint(userInput.pointerX, userInput.pointerY);
            
            if (buttonInfo) {
                return buttonInfo.caption;
            }
        }

        return null;
    }

    /**
     * @returns {Button | null}
     * @param {number} x
     * @param {number} y
     */
    _objectFromPoint(x, y) {
        // search for button
        const foundButton = this._uiLayout._buttonList.find(b => {
            const bx = b.x;
            const by = b.y;
            const bw = b.w;
            const bh = b.h;
            
            return (x >= bx && x <= bx + bw && y >= by && y <= by + bh);
        });
 
        return foundButton ?? null;
    }

    isWinCondition() {
        return false;
    }

    /**
     * Main entry-point that calls StateManager based on user input and time change.
     * 
     * @param {UserInputState} userInput
     * @param {number} dT
     */
    updateAppState(userInput, dT)
    {
        if (userInput !== null) {
            this.runCommand(this.inputToCommand(userInput, dT));
        }

        if (userInput.upKeyPress == "short") {
            this._loadLog();
        }

        if (userInput.downKeyPress == "short") {
            this._printLog();
        }

        this._transitionManager.handleTimeChange(dT);
    }

    /**
     * @param {string | null} uiCommand
     */
    runCommand(uiCommand) {
        switch (uiCommand) {
            case "???":
                break;
        }
    }

    _loadLog() {
        if (!this._combatLog) {
            this._combatLog = new CombatLog("./logs/setup.txt");
        }
    }

    _printLog() {
        if (this._combatLog) {
            this._combatLog.debugPrint();
        }
    }
}