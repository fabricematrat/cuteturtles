'use strict';

YUI.add('drawGrid', function (Y) {
	Y.drawGrid = function (canvas, grid) {
		var ctx = canvas.getContext('2d');
		var width = canvas.width;
		var height = canvas.height;
		var wstep = width / (grid + 1);
		var hstep = height / (grid + 1);
		var wstart = Math.floor(wstep / 2);
		var hstart = Math.floor(hstep / 2);
		ctx.clearRect(0, 0, width, height);
		ctx.save();
		// Styling
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'green';
		ctx.beginPath();
		for (var i = 1; i <= grid; i += 1) {
			// Horizontal
			ctx.moveTo(wstart, i * wstep);
			ctx.lineTo(width - wstart, i * wstep);
			// Vertical
			ctx.moveTo(i * hstep, hstart);
			ctx.lineTo(i * hstep, height - hstart);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};
});
