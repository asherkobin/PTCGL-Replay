import StateManager from "./state-manager";

class Button {
    /** @type {number} */
    x = 0;
    /** @type {number} */
    y = 0;
    /** @type {number} */
    w = 0;
    /** @type {number} */
    h = 0;
    /** @type {string} */
    caption = "";
}

class Config {
    constructor() {
        /** @type {string} */
        this.cardBack = "";
        /** @type {string[]} */
        this.standardRegulationMarks = [];
    }
}

class Layout {
    /**
     * @param {Window} htmlWindow
     * @param {Button[]} buttonList
     * @param {StateManager} stateManager
     */
    constructor(htmlWindow, buttonList, stateManager) {
        this._htmlWindow = htmlWindow;
        this._buttonList = buttonList;
        this._stateManager = stateManager;
        
        this._canvasElem = this._htmlWindow.document.createElement("canvas");

        this._canvasElem.style.display = "block";
        this._canvasElem.style.position = "fixed";
        this._canvasElem.style.top = "0";
        this._canvasElem.style.left = "0";
        
        this._canvasElem.id = "canvas";

        this._htmlWindow.document.body.style.margin = "0";
        this._htmlWindow.document.body.appendChild(this._canvasElem);
        this._htmlWindow.addEventListener("resize", this._resizeHandler);

        this._c = this._canvasElem.getContext("2d");

        if (!this._c) {
            throw new Error("Failed to get CanvasRenderingContext2D");
        }

        this._w = 0;
        this._h = 0;

        this._resizeHandler();
    }

    get CanvasContext() {
        return this._c;
    }

    get Width() {
        return this._w;
    }

    get Height() {
        return this._h;
    }

    _resizeHandler = () => {
        const dpr = this._htmlWindow.devicePixelRatio || 1;
        
        this._w = this._htmlWindow.innerWidth;
        this._h = this._htmlWindow.innerHeight;

        this._canvasElem.width = this._w * dpr;
        this._canvasElem.height = this._h * dpr;
        this._canvasElem.style.width = this._w + "px";
        this._canvasElem.style.height = this._h + "px";

        this._c.setTransform(dpr, 0, 0, dpr, 0, 0);

        this._stateManager.invalidateAll();
    }
}

class ConfigManager
{
    /**
     * @param {Window} htmlWindow
     * @param {StateManager} stateManager
     */
    constructor(htmlWindow, stateManager) {
        this._layoutConfig = new Layout(htmlWindow, [], stateManager);
        this._currentConfig = new Config();
    }

    /** @returns {Config} */
    get Config() {
        return this._currentConfig;
    }

    /** @returns {Layout} */
    get Layout() {
        return this._layoutConfig;
    }
}

export { ConfigManager, Config, Layout, Button };