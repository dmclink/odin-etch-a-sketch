const initSize = 16;

class EtchASketch {
	constructor() {
		this.screen = document.querySelector('.screen');
	}

	/** Creates new div to represent "pixel" element. Its size is based on the number of
	 * pixels side length
	 *
	 * @param {number} numPixels - the side length of the screen in number of pixels. determines pixel size
	 * @returns {HTMLElement} - the new div.pixel created
	 */
	static createPixel(numPixels) {
		const pixel = document.createElement('div');

		pixel.classList.add('pixel');

		pixel.style.flexGrow = 1;
		pixel.style.flexBasis = `${(1 / numPixels) * 100}%`;

		return pixel;
	}

	/** Creates size * size number of pixels and attaches them to the .screen flexbox element
	 *
	 * @param {number} size - the side length of the screen in number of "pixels"
	 */
	populateScreen(size) {
		for (let i = 0; i < size * size; i++) {
			const pixel = EtchASketch.createPixel(size);
			pixel.id = `pixel${i}`;
			this.screen.appendChild(pixel);
		}
	}
}

const etch = new EtchASketch();
etch.populateScreen(initSize);

const etchEl = document.querySelector('.etch');
etchEl.addEventListener('mouseover', (e) => {
	if (e.target.id.startsWith('pixel')) {
		e.target.classList.add('pixel--painted');
	}
});
