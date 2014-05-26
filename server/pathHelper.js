'use strict';

function isAtPosition(position, reference) {
	return (position[0] === reference[0] && (position[1] === reference[1]));
}

function isPresent(position, walls) {
	return walls.filter(function (wall) {
		return isAtPosition(position, wall);
	}).length !== 0;
}

function findMinPath(startPosition, endPosition, walls) {

	function _validMove(position) {
		var result = [];
		var positionUp = [position[0], position[1] + 1];
		var positionDown = [position[0], position[1] - 1];
		var positionLeft = [position[0] - 1, position[1]];
		var positionRight = [position[0] + 1, position[1]];

		if (!isPresent(positionUp, walls)) {
			result.push(positionUp);
		}
		if (!isPresent(positionDown, walls)) {
			result.push(positionDown);
		}
		if (!isPresent(positionLeft, walls)) {
			result.push(positionLeft);
		}
		if (!isPresent(positionRight, walls)) {
			result.push(positionRight);
		}
		return result;
	}

	function _newStepsOfPath(path, endPosition) {
		var newPaths = [];
		if (isAtPosition(path[path.length - 1], endPosition)) {
			return [path];
		}

		var options = _validMove(path[path.length - 1]);
		if (options.length > 0) {
			options.forEach(function (option) {
				if (!isPresent(option, path)) {
					var newPath = path.slice(0);
					newPath.push(option);
					newPaths.push(newPath);
				}
			});
			return _newSteps(newPaths, endPosition);
		} else {
			return [];
		}
	}

	function _newSteps(paths, endPosition) {
		var newPaths = [];
		paths.forEach(function (p) {
			var newsteps = _newStepsOfPath(p, endPosition);
			if (newsteps.length > 0) {
				newsteps.forEach(function (it) {
					newPaths.push(it);
				});
			} else {
				newPaths.push(p);
			}
		});
		return newPaths;
	}

	var path = [];
	path.push([startPosition]);
	var allPaths = _newSteps(path, endPosition);

	var possiblePaths = [];
	allPaths.forEach(function (path) {
		if (isPresent(endPosition, path)) {
			possiblePaths.push(path);
		}
	});

	var possibleLengthPath = possiblePaths.map(function (path) {
		return path.length;
	});
	var minIndex = possibleLengthPath.indexOf(Math.min.apply(Math, possibleLengthPath));
	return possiblePaths[minIndex];
}

module.exports = findMinPath;