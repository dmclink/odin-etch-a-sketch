const initSize = 16;

function isNumber(value) {
	return typeof value === 'number' && !Number.isNaN(value);
}

class EtchASketch {
	constructor(size) {
		this.screen = document.querySelector('.screen');
		this.size = size;
		this.populateScreen();
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

	/** Creates size * size number of pixels and attaches them to the .screen flexbox element*/
	populateScreen() {
		for (let i = 0; i < this.size * this.size; i++) {
			const pixel = EtchASketch.createPixel(this.size);
			pixel.id = `pixel${i}`;
			this.screen.appendChild(pixel);
		}
	}

	/** Clears the Etch A Sketch screen wiping all pixels back to their original state */
	clear() {
		this.screen.querySelectorAll('.pixel').forEach((pixel) => {
			pixel.classList.remove('pixel--painted');
		});
	}

	/** Removes all pixel elements from the screen. Updates this.size. Re populates screen
	 * with the new size.
	 */
	resize(newSize) {
		this.screen.querySelectorAll('.pixel').forEach((pixel) => pixel.remove());
		this.size = newSize;
		this.populateScreen();
	}
}

const etch = new EtchASketch(initSize);

const etchEl = document.querySelector('.etch');
etchEl.addEventListener('mouseover', (e) => {
	if (e.target.id.startsWith('pixel')) {
		e.target.classList.add('pixel--painted');
	}
});

const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
	etch.clear();
});

const resizeBtn = document.querySelector('#resize-btn');
resizeBtn.addEventListener('click', () => {
	let newNumPixels = NaN;
	while (!isNumber(newNumPixels) || newNumPixels < 0 || newNumPixels > 100) {
		newNumPixels = Number(
			prompt(
				'Enter new pixel length for screen between 1 and 100. \nOr press ESC to go back. \nWarning: This will also clear the screen!'
			)
		);
	}

	if (newNumPixels === 0) {
		return;
	}

	etch.resize(newNumPixels);
});
