'use strict';

var maze = require('./maze');
var resolveMaze = require('./pathHelper');

function isOnWalls(x, y, walls) {
	var result = walls.filter(function (elem) {
		return elem[0] === x && elem[1] === y;
	});
	return result.length !== 0;
}

function randomPosition(gridSize, walls) {
	var x;
	var y;

	x = Math.floor(Math.random() * (gridSize - 2)) + 1;
	y = Math.floor(Math.random() * (gridSize - 2)) + 1;

	if (isOnWalls(x, y, walls)) {
		return randomPosition(gridSize, walls);
	}

	return [x, y];
}

var Game = function (id, user) {
	var gridSize;
	var walls;
	var root;

	gridSize = 15;
	walls = maze(7, 7);

	root = {
		images: {
			franklin: 'turtle.png',
			emily: 'pig.png',
			tree1: 'tree.png',
			bird: 'bird.png'
		},
		position: {
			franklin: randomPosition(gridSize, walls),
			tree1: randomPosition(gridSize, walls),
			bird: randomPosition(gridSize, walls)
		},
		grid: gridSize,
		stepDuration: 1000
	};


	this.gameId = id;
	this.user1 = user;
	this.mazeDefinition = {
		walls: walls
	};
	this.turtles = root;
};

Game.prototype._sneakyBirdMove = function () {
	var solution = resolveMaze(this.turtles.position.bird , this.turtles.position.tree1, this.mazeDefinition.walls);
	if(Math.ceil(Math.random()* 3) > 1) {
		var move = Math.min(Math.floor(Math.random()* 3), solution.length);
		if(move > 0) {
			this.turtles.position.bird = [solution[move-1][0], solution[move-1][1]];
			return solution.slice(0, move);
		}
	}
	return [];
};

Game.prototype.join = function (user) {
	this.user2 = user;
	this.turtles.position.emily = randomPosition(this.turtles.grid, this.mazeDefinition.walls);
};

Game.prototype.move = function (direction, user) {
	var steps = {};
	this._updateTurtle(direction, user, steps);
	steps.bird = this._sneakyBirdMove();
	return {
		steps: steps,
		won: this._win(),
		lost: this._lost(),
		winningAnimation: [this.turtles.position.tree1[0], this.turtles.position.tree1[1]]
	};
};

Game.prototype._win = function () {
	if (this.turtles.position.emily === void 0) {
		return false;
	}
	return (this.turtles.position.franklin[0] === this.turtles.position.tree1[0] &&
		this.turtles.position.franklin[1] === this.turtles.position.tree1[1] &&
		this.turtles.position.emily[0] === this.turtles.position.tree1[0] &&
		this.turtles.position.emily[1] === this.turtles.position.tree1[1]);
};

Game.prototype._lost = function () {
	return (this.turtles.position.bird[0] === this.turtles.position.tree1[0] &&
		this.turtles.position.bird[1] === this.turtles.position.tree1[1]);
};

Game.prototype._updateTurtle = function (direction, user, steps) {
	var turtle;
	var playerStep = [];
	if (user === this.user1) {
		turtle = this.turtles.position.franklin;
		steps.franklin = playerStep;
	} else {
		turtle = this.turtles.position.emily;
		steps.emily = playerStep;
	}
	switch (direction) {
		case 'left':
			if (!isOnWalls(turtle[0] - 1, turtle[1], this.mazeDefinition.walls)) {
				turtle[0] -= 1;
			}
			break;
		case 'right':
			if (!isOnWalls(turtle[0] + 1, turtle[1], this.mazeDefinition.walls)) {
				turtle[0] += 1;
			}
			break;
		case 'up':
			if (!isOnWalls(turtle[0], turtle[1] + 1, this.mazeDefinition.walls)) {
				turtle[1] += 1;
			}
			break;
		case 'down':
			if (!isOnWalls(turtle[0], turtle[1] - 1, this.mazeDefinition.walls)) {
				turtle[1] -= 1;
			}
			break;
	}
	playerStep.push(turtle);
};

module.exports = Game;
