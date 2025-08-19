const initSize = 16;

/** Returns true if the value passed is a number
 *
 * @param {any} value - the value to test if it is a number
 * @returns {boolean}
 */
function isNumber(value) {
	return typeof value === 'number' && !Number.isNaN(value);
}

/** Generates a random color and outputs it as an rgb string in css style format
 *
 * @returns {string} - rgb string of a randomized color
 */
function randomColor() {
	const random255 = function () {
		return Math.random() * 255;
	};
	return `rgb(${random255()}, ${random255()}, ${random255()})`;
}

class EtchASketch {
	constructor(size) {
		this.screen = document.querySelector('.screen');
		this.size = size;
		this.colorMode = 'default';
		this.darkenMode = 'default';
		this.defaultColor = '#333';
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
			// pixel.classList.remove('pixel--painted');
			pixel.style.backgroundColor = 'transparent';
			pixel.style.opacity = '';
		});
	}

	/** Prompts the user for a new pixel size. If valid size is entered, removes all pixel
	 * elements from the screen. Updates this.size. Re populates screen with the new size.
	 */
	resize() {
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

		this.screen.querySelectorAll('.pixel').forEach((pixel) => pixel.remove());
		this.size = newNumPixels;
		this.populateScreen();
	}

	/** Paints a pixel depending on the color mode of the etch a sketch
	 * @param {HTMLElement} pixel - the pixel to be painted
	 */
	paintPixel(pixel) {
		switch (this.colorMode) {
			case 'default':
				pixel.style.backgroundColor = this.defaultColor;
				break;

			case 'random':
				console.log(randomColor());
				pixel.style.backgroundColor = randomColor();
				break;

			case 'custom':
				pixel.style.backgroundColor =
					document.querySelector('#custom-color').value;
				break;
		}

		switch (this.darkenMode) {
			case 'default':
				pixel.style.opacity = 1;
				break;

			case 'gradual':
				pixel.style.opacity = Number(pixel.style.opacity) + 0.1;
				break;
		}
	}

	/** Updates color mode for this object
	 *
	 * @param {'default'|'random'|'custom'} newColorMode
	 */
	updateColorMode(newColorMode) {
		this.colorMode = newColorMode;
	}

	/** Updates darken mode for this object
	 *
	 * @param {'default'|'gradual'} newDarkenMode
	 */
	updateDarkenMode(newDarkenMode) {
		this.darkenMode = newDarkenMode;
	}
}

const etch = new EtchASketch(initSize);

const etchEl = document.querySelector('.etch');
etchEl.addEventListener('mouseover', (e) => {
	if (e.target.id.startsWith('pixel')) {
		etch.paintPixel(e.target);
	}
});

const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
	etch.clear();
});

const colorModeSelect = document.querySelector('#color-mode');
colorModeSelect.addEventListener('change', (e) => {
	etch.updateColorMode(e.target.value);
});

const resizeBtn = document.querySelector('#resize-btn');
resizeBtn.addEventListener('click', () => {
	etch.resize();
});

const darkenModeSelect = document.querySelector('#darken-mode');
darkenModeSelect.addEventListener('change', (e) => {
	etch.updateDarkenMode(e.target.value);
});
