import fs from 'fs';

/**
 * Saves an image to a given directory
 *
 * @param {string} destination - Destination to save to
 * @param {HTMLCanvasElement} canvas - Canvas element to save as an image
 */
const saveToDestination = (destination, canvas) => {
    try {
        const fileName = `orthomoji_${new Date().getTime()}.png`;
        const out = fs.createWriteStream(`${destination}${fileName}`);
        const stream = canvas.pngStream();
        stream.on('data', chunk => out.write(chunk));
        stream.on('end', chunk => {
            console.log(`Image successfully saved to ${destination} as ${fileName}`)
        });
    } catch (e) {
        throw new Error(
            `An error has occured while trying to your image save to ${destination}.\n${e.toString()}`
        );
    }
};

export { saveToDestination };