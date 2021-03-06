'use strict';

YUI.add('drawWalls', function (Y) {
	Y.drawWalls = function (canvas, walls, gridSize) {
		var pixels = 200;
		var ctx = canvas.getContext('2d');
		var width = canvas.width;
		var height = canvas.height;
		var grid = gridSize;
		var wstep = width / (grid + 1);
		var hstep = height / (grid + 1);
		var current = walls;

		// Drawing
		var clean = function () {
			ctx.clearRect(0, 0, width, height);
		};

		function computeColor(color, intensity) {
			return 'rgb(' + computeIntensity(color, 0, intensity) + ', ' + computeIntensity(color, 1, intensity) + ', ' + computeIntensity(color, 2, intensity) + ')';
		}

		function computeIntensity(color, idx, intensity) {
			return Math.floor(color.min[idx] + ((color.max[idx] - color.min[idx]) * intensity));
		}

		// Draw wall with a minecraft effect and add number in the grid
		var drawWall = function (x, y, rotation) {
			var green = {
				min: [55, 90, 36],
				max: [105, 170, 70]
			};
			var grid = 15;
			var centerx = (x + 1) * pixels / (grid + 1);
			var centery = (y + 1) * pixels / (grid + 1);
			var size = 5;
			for (var i = 0; i < pixels; i += 1) {
				for (var j = 0; j < pixels; j += 1) {
					var distance = Math.sqrt((i - centerx) * (i - centerx) + (j - centery) * (j - centery));
					if (distance < size || (distance < 2 * size && Math.random() > (distance - size) / size)) {
						var intensity = Math.random();
						ctx.fillStyle = computeColor(green, intensity);
						ctx.fillRect(i, j, 1, 1);
					}
				}
			}

			ctx.font = Math.max(2, Math.floor(pixels / (2 * grid) * 0.6)) + 'pt arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			for (var k = 2; k < grid; k += 1) {
				ctx.fillStyle = 'black';
				ctx.fillText(k - 1, pixels / (grid + 1) * k, pixels - pixels / (grid + 1));
				ctx.fillText(k - 1, pixels / (grid + 1), pixels - pixels / (grid + 1) * k);
			}

		};

		// Animate from frame to frame
		var animate = function () {
			clean();
			ctx.save();
			ctx.scale(canvas.width / pixels, canvas.height / pixels);

			for (var i = 0; i < current.length; i += 1) {
				drawWall(current[i][0], (grid - current[i][1]) - 1, 0);
			}

			ctx.restore();
		};

		// Draw initial frame
		animate();

	};
});
