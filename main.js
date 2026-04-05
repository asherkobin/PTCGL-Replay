"use strict";

import App from "./modules/app.js";

document.addEventListener("DOMContentLoaded", () => { startApp(window) });

/**
 * @param {Window} htmlWindow
 */
async function startApp(htmlWindow) {
    const mainApp = new App(htmlWindow);

    await mainApp.loadAssets(); // FIXME

    mainApp.startLoop();
}