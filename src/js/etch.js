const initSize = 16;

const screen = document.querySelector('.screen');

/** Creates new div to represent "pixel" element and attaches it to screen.
 *
 * @param {HTMLElement} screen - the container element which new pixels are attached
 */
function createPixel(screen, numPixels) {
	const pixel = document.createElement('div');

	pixel.classList.add('pixel');

	pixel.style.flexGrow = 1;
	pixel.style.flexBasis = `${(1 / numPixels) * 100}%`;
	screen.appendChild(pixel);
}

for (let i = 0; i < initSize * initSize; i++) {
	createPixel(screen, initSize);
}
