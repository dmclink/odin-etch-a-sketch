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
		this.defaultColor = '#333';
		this.colorMode = 'default';
		this.darkenMode = 'default';
		this.paintMode = 'default';
		this.cursorLoc = 0;
		this.populateScreen();
		this.pixels = this.screen.querySelectorAll('.pixel');

		this.hoverPaint = this.hoverPaint.bind(this);
		this.keyboardPaint = this.keyboardPaint.bind(this);
		this.knobLeftPaint = this.knobLeftPaint.bind(this);
		this.knobRightPaint = this.knobRightPaint.bind(this);

		this.knobLeft = document.querySelector('#etch__knob--left');
		this.knobRight = document.querySelector('#etch__knob--right');
		this.knobWidth = this.knobLeft.offsetWidth;

		this.updatePaintMode('default');
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
		this.pixels = document.querySelectorAll('.pixel');
		this.cursorLoc = 0;
		if (this.paintMode === 'keyboard' || this.paintMode === 'knobs') {
			this.pixels[0].classList.add('pixel--glowing');
		}
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

	/** Event listener to paint whenever mouse hovers over a pixel */
	hoverPaint(e) {
		if (e.target.id.startsWith('pixel')) {
			this.paintPixel(e.target);
		}
	}

	/** Moves cursor by delta pixels and paints the pixel that the cursor lands on.
	 *
	 * ASSUME: this function is only called when possible to move (won't send out of bounds)
	 * @param {number} delta - the change in pixel position
	 */
	moveCursorAndPaint(delta) {
		this.pixels[this.cursorLoc].classList.remove('pixel--glowing');
		this.cursorLoc += delta;
		this.pixels[this.cursorLoc].classList.add('pixel--glowing');
		this.paintPixel(this.pixels[this.cursorLoc]);
	}

	/** Checks if cursor can move up without going out of bounds. Moves and paints if so */
	tryPaintUp() {
		if (this.cursorLoc - this.size > -1) {
			this.moveCursorAndPaint(-this.size);
		}
	}

	/** Checks if cursor can move down without going out of bounds. Moves and paints if so */
	tryPaintDown() {
		if (this.cursorLoc + this.size < this.size * this.size) {
			this.moveCursorAndPaint(+this.size);
		}
	}

	/** Checks if cursor can move left without going out of bounds. Moves and paints if so */
	tryPaintLeft() {
		if (this.cursorLoc % this.size !== 0) {
			this.moveCursorAndPaint(-1);
		}
	}

	/** Checks if cursor can move right without going out of bounds. Moves and paints if so */
	tryPaintRight() {
		if ((this.cursorLoc + 1) % this.size !== 0) {
			this.moveCursorAndPaint(1);
		}
	}

	/** Event listener to paint whenever arrow keys are pressed */
	keyboardPaint(e) {
		e.preventDefault();
		switch (e.key) {
			case 'ArrowUp':
				this.tryPaintUp();
				break;

			case 'ArrowDown':
				this.tryPaintDown();
				break;

			case 'ArrowLeft':
				this.tryPaintLeft();
				break;

			case 'ArrowRight':
				this.tryPaintRight();
				break;

			default:
				break;
		}
	}

	/** Event listener for clicking on the left knob. Moves cursor and paints horizontally.
	 *
	 * @param {Event} e - the event
	 */
	knobLeftPaint(e) {
		console.log(e.offsetX);
		if (e.offsetX < this.knobWidth / 2) {
			this.tryPaintLeft();
		} else {
			this.tryPaintRight();
		}
	}

	/** Event listener for clicking on the right knob. Moves cursor and paints vertically.
	 *
	 * @param {Event} e - the event
	 */
	knobRightPaint(e) {
		if (e.offsetX < this.knobWidth / 2) {
			this.tryPaintDown();
		} else {
			this.tryPaintUp();
		}
	}

	/** Updates paint mode for this object by adding and removing the appropriate event listeners
	 *
	 * @param {'default'|'keyboard'|'knobs'} newPaintMode
	 */
	updatePaintMode(newPaintMode) {
		this.paintMode = newPaintMode;
		switch (newPaintMode) {
			case 'default':
				this.pixels[this.cursorLoc].classList.remove('pixel--glowing');
				this.screen.addEventListener('mouseover', this.hoverPaint);

				document.removeEventListener('keydown', this.keyboardPaint);
				this.knobLeft.removeEventListener('click', this.knobLeftPaint);
				this.knobRight.removeEventListener('click', this.knobRightPaint);
				this.knobLeft.classList.remove('active');
				this.knobRight.classList.remove('active');
				break;

			case 'keyboard':
				this.pixels[this.cursorLoc].classList.add('pixel--glowing');
				document.addEventListener('keydown', this.keyboardPaint);

				this.screen.removeEventListener('mouseover', this.hoverPaint);
				this.knobLeft.removeEventListener('click', this.knobLeftPaint);
				this.knobRight.removeEventListener('click', this.knobRightPaint);
				this.knobLeft.classList.remove('active');
				this.knobRight.classList.remove('active');
				break;

			case 'knobs':
				this.pixels[this.cursorLoc].classList.add('pixel--glowing');
				this.knobLeft.addEventListener('click', this.knobLeftPaint);
				this.knobRight.addEventListener('click', this.knobRightPaint);
				this.knobLeft.classList.add('active');
				this.knobRight.classList.add('active');

				this.screen.removeEventListener('mouseover', this.hoverPaint);
				document.removeEventListener('keydown', this.keyboardPaint);
				break;
		}
	}
}

const etch = new EtchASketch(initSize);

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

const paintModeSelect = document.querySelector('#paint-mode');
paintModeSelect.addEventListener('change', (e) => {
	etch.updatePaintMode(e.target.value);
});
