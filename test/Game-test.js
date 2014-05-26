require('buster').spec.expose();
var expect = require('buster').expect;

var Game = require('../server/Game.js');

describe('Game', function () {
	describe('join', function () {
		it('should create a position and set the name for Emily when joining', function () {
			var game = new Game(1, 'myUser');
			var user2 = 'user2';
			game.join(user2);
			expect(game).toBeDefined();
			expect(game.user2).toEqual(user2);
			expect(game.turtles.position.emily).toBeDefined();
			expect(game.turtles.position.emily).toBeArray();
			expect(game.turtles.position.emily.length).toEqual(2);
		});
	});
});
