import { InputEventManager, UserInputState } from "./input-event-manager.js";
import StateManager from "./state-manager.js";
import { drawUI, drawViewport }  from "./canvas.js";
import SoundFactory from "./sound-factory.js";
import LogicHelper from "./logic-helper.js";
import { ConfigManager } from "./config-manager.js";

//
// Contains the main loop that is called in conjuction with 
// html's window.requestAnimationFrame.
//

export default class App {
    /**
     * @param {Window} htmlWindow
     */
    constructor(htmlWindow) {
        this._soundFactory = new SoundFactory();
        this._stateManager = new StateManager();
        this._configManager = new ConfigManager(htmlWindow, this._stateManager);
        this._inputEventManager = new InputEventManager(htmlWindow);
        this._logicHelper = new LogicHelper(
            this._stateManager,
            this._configManager.Config,
            this._configManager.Layout,
            this._soundFactory);

        htmlWindow.addEventListener("pointerdown",
            this._soundFactory.primeAudio.bind(this._soundFactory), { once: true });
        htmlWindow.addEventListener("keydown",
            this._soundFactory.primeAudio.bind(this._soundFactory), { once: true });

        this._savedTimeStamp = 0;
        this._inputState = new UserInputState();

        /** @type {FrameRequestCallback} */
        this._loopCallback = this.mainLoop.bind(this);
    }
    
    startLoop() {
        window.requestAnimationFrame(this._loopCallback);
    }
    
    /**
     * ---> MAIN LOOP <---
     * 
     * @param {number} timeStamp 
     */
    mainLoop(timeStamp) {
        const timeNow = timeStamp;
        const timeLast = (this._savedTimeStamp == 0) ? timeStamp : this._savedTimeStamp;
        const timeDelta = timeNow - timeLast;

        this.getInput(timeDelta);
        this.updateState(timeDelta);
        this.renderUI(timeDelta);
        this.renderViewport(timeDelta);

        this._savedTimeStamp = timeStamp;
        
        window.requestAnimationFrame(this._loopCallback);
    }

    async loadAssets() {
        await this._soundFactory.initBuffers();
    }

    /**
     * @param {number} dT 
     */
    getInput(dT) {
        this._inputState = this._inputEventManager.getState(dT);
    }

    /**
     * @param {number} dT 
     */
    renderUI(dT) {
        // TBD
    }

    /**
     * @param {number} dT 
     */
    renderViewport(dT) {
        const updateRegions =  this._stateManager.getUpdateRegions();
        
        if (updateRegions.length > 0) {
            drawUI(this._configManager.Layout);
            drawViewport(this._configManager.Layout);

            this._stateManager.clearUpdateRegions();
        }
    }

    /**
     * @param {number} dT 
     */
    updateState(dT) {
        this._logicHelper.updateAppState(this._inputState, dT);
    }
}