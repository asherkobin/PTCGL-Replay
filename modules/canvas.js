import { Layout } from "./config-manager.js";

//
// canvas draw routines
//

/**
 * @param {Layout} l
 */
function drawUI(l) {
    __drawBackground(l.CanvasContext, l.Width, l.Height);
}

/**
 * @param {Layout} l 
 */
function drawViewport(l) {
    __drawText(l.CanvasContext, "Hello World", 0, 0);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 */
function __drawText(ctx, text, x, y) {
    ctx.textBaseline = "top";
    ctx.font =  "20px Cormorant Garamond";

    // burned text
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 2;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillText(text, x, y);

    // outline
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.strokeText(text, x, y);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function __drawBackground(ctx, width, height) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, width, height);

    // woodgrain

    for (let i = 0; i < width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i + Math.sin(i * 0.02) * 6, 0);
        ctx.lineTo(i + Math.sin(i * 0.02) * 6, height);
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i + Math.sin(i * 0.03) * 3, 0);
        ctx.lineTo(i + Math.sin(i * 0.03) * 3, height);
        ctx.strokeStyle = "rgba(0,0,0,0.10)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i + Math.sin(i * 0.01) * 10, 0);
        ctx.lineTo(i + Math.sin(i * 0.01) * 10, height);
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export {
    drawViewport,
    drawUI
};