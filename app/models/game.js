'use strict';

YUI.add('gameModel', function (Y) {
	Y.Game = Y.Base.create('gameModel', Y.Model, {
	}, {
		ATTRS: {
			gameId: '',
			user1: '',
			user2: '',
			mazeDefinition: {},
			turtles: {},
			steps: {},
			won: false,
			lost: false,
			winningAnimation: {},
			deleted: false
		}
	});
}, { requires: ['model']});