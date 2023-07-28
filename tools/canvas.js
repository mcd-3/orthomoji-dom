/**
 * THIS FILE HAS BEEN REPLACED BY THE setup-orthomoji.sh SCRIPT FILE
 */

import { drawBorderToCanvas } from './../tools/border.js';

/**
 * Number of characters per row/column in a letter
 */
const BITS_PER_CHAR = 5;

/**
 * Gets the width of a letter
 *
 * @param {number} fontSize - Size of character (not letter)
 * @returns {number} Calculated width
 */
const getWidthPerLetter = fontSize => fontSize * BITS_PER_CHAR;

/**
 * Gets the height of a letter
 *
 * @param {number} fontSize - Size of character (not letter)
 * @returns {number} Calculated height
 */
const getHeightPerLetter = fontSize => fontSize * BITS_PER_CHAR;

/**
 * Gets the padding width of the canvas
 *
 * @param {number} fontSize - Size of character (not letter)
 * @returns {number} Calculated width
 */
const getPaddingWidth = fontSize => fontSize * 2;

/**
 * Gets the padding height of the canvas
 *
 * @param {number} fontSize - Size of character (not letter)
 * @returns {number} Calculated height
 */
const getPaddingHeight = fontSize => fontSize * 2;

/**
 * Gets the amount of pixels that a border added to the padding
 *
 * @param {object} borderStyle - Border object that contains border parameters
 * @returns {number} - Width of the border in px
 */
const getAddedBorderWidth = borderStyle => {
    return (borderStyle.width !== undefined)
        ? borderStyle.width
        : 0;
}

/**
 * Changes the background style/colour of a canvas
 *
 * @param {HTMLCanvasElement} canvas - Canvas to change BG colour of
 * @param {string} style - Valid CSS colour
 * @returns {HTMLCanvasElement} Newly edited canvas element
 */
 const changeBGCanvas = (canvas, style) => {
    try {
        canvas.getContext('2d').fillStyle = style;
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    } catch (e) {
        throw new Error(`${style} is not a correct style for the background`);
    }
};

/**
 * Resizes a canvas to properly apply text and changes the background style if needed
 *
 * @param {HTMLCanvasElement} canvas - Canvas that we will resize
 * @param {string} str - String we will print to canvas.
 * @returns {HTMLCanvasElement} Newly resized canvas
 */
const editCanvas = (canvas, str, fontSize, style, borderStyle) => {
    const longestLine = str.split('\n').sort((a, b) => b.length - a.length)[0];
    const lines = (str.match(/\n/g) || []).length + 1;

    // Add padding on both L and R sides, then add space for each letter being typed
    canvas.width = (getPaddingWidth(fontSize) * 2) 
        + (longestLine.length * getWidthPerLetter(fontSize))
        + (getAddedBorderWidth(borderStyle) * 2);

    // Add padding for both up and down, then add space for each letter being typed
    const height = (getPaddingHeight(fontSize)) 
        + (lines * getHeightPerLetter(fontSize))
        + (getAddedBorderWidth(borderStyle) * 2);
    canvas.height = (lines > 1) ? height + (fontSize * (lines - 1)) : height;

    // Change background style, if present
    const newCanvas = (style !== null) ? changeBGCanvas(canvas, style) : canvas;

    return drawBorderToCanvas(newCanvas, borderStyle);
};

/**
 * Adds a string of text to a canvas
 *
 * @param {HTMLCanvasElement} canvas - Canvas we will apply text to
 * @param {string} str - String we will apply to canvas
 * @param {JSON} fontSet - JSON object containing the font set
 * @param {number} fontSize - Size of the font to print
 * @param {string} bgStyle - Background style of the canvas
 * @param {JSON} borderStyle - Object that determines how to style a border
 * @returns {HTMLCanvasElement} Canvas with text drawn to it
 */
const addTextToCanvas = async (canvas, str, fontSet, fontSize, bgStyle, borderStyle) => {
    let editedCanvas = editCanvas(
        canvas,
        str,
        fontSize,
        bgStyle,
        borderStyle
    );

    const ctx = editedCanvas.getContext('2d');
    ctx.font = `${fontSize}px serif`;

    // Set the starting point
    const getNewStartX = (getPaddingWidth(fontSize) / 1.5) + getAddedBorderWidth(borderStyle);
    let currentX = getNewStartX;
    let currentY = (getPaddingHeight(fontSize) + getAddedBorderWidth(borderStyle));

    // Draw each row of a letter then adds spacing or a newline
    for (const c of str) {
        const spacing = (fontSize * BITS_PER_CHAR);
        let topX = currentX;
        let topY = currentY;

        if (c !== '\n') {
            const fontBits = fontSet[c];
            for (const elem of fontBits) {
                currentX += fontSize;
                if (elem === '') {
                    currentX = topX;
                    currentY += fontSize;
                }
                ctx.fillText(elem, currentX, currentY)
            };
            currentY = topY;
            currentX = topX + spacing;
        } else {
            currentY = topY + spacing + fontSize;
            currentX = getNewStartX;
        }
    }
    return editedCanvas;
};

export { addTextToCanvas };
