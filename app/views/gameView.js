'use strict';

YUI.add('GameView', function (Y) {
	Y.GameView = Y.Base.create('GameView', Y.View, [], {
		initializer: function () {
			var self = this;
			Y.io('/app/views/templates/game.Template', {
				on: {
					complete: function (id, response) {
						// This should be precompile before at build time or at start of the server
						var template = Y.Handlebars.compile(response.responseText);
						Y.one('#game').setHTML(template([]));
						var turtles = self._game.get('turtles');
						var mazeDefinition = self._game.get('mazeDefinition');
						self.drawGrid = Y.drawGrid(Y.one('#canvasGrid').getDOMNode(), turtles.grid);
						self.drawWalls = Y.drawWalls(Y.one('#canvasWalls').getDOMNode(), mazeDefinition.walls, turtles.grid);
						self.drawTurtles = Y.drawTurtles(Y.one('#canvasTurtles').getDOMNode(), turtles, turtles.grid);
					}
				}
			});
			this._game = this.get('model');
			this._game.after('stepsChange', this.animate, this);
			this._game.after('user2Change', this.emilyJoined, this);
			this._game.after('deletedChange', this.dispose, this);
			this._gameRepository = this.get('gameRepository');
		},
		render: function () {
			return this;
		},
		emilyJoined: function () {
			this.drawTurtles({emily: this._game.get('turtles').position.emily});
		},
		dispose: function (end) {
			Y.one('#game').get('childNodes').remove();
			this.destroy({remove: true});
		},
		animate: function () {
			var self = this;

			var animating = 0;
			for (var key in this._game.get('steps')) {
				if (this._game.get('steps').hasOwnProperty(key)) {
					var value = this._game.get('steps')[key];
					var obj;
					if (value.length !== 0) {
						animating += 1;
						for (var i = 0; i < value.length - 1; i += 1) {
							obj = {};
							obj[key] = value[i];
							self.drawTurtles(obj);
						}
						obj = {};
						obj[key] = value[value.length - 1];
						self.drawTurtles(obj, function () {
							animating -= 1;
							if (animating === 0) {
								if (self._game.get('won')) {
									self.drawTurtles.win(self._game.get('winningAnimation')[0], self._game.get('winningAnimation')[1], function () {
										self._gameRepository.publish('won-' + self._game.get('gameId'), self._game.get('gameId'));
									});
								} else if (self._game.get('lost')) {
									self.drawTurtles.lost(self._game.get('winningAnimation')[0], self._game.get('winningAnimation')[1], function () {
										self._gameRepository.publish('lost-' + self._game.get('gameId'), self._game.get('gameId'));
									});
								}
							}
						});
					}
				}
			}
		}
	});
}, '0.0.1', { requires: ['view', 'node', 'io-base', 'handlebars', 'drawGrid', 'drawTurtles', 'drawWalls']});