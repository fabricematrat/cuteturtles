'use strict';

YUI.add('GamePadView', function (Y) {
	Y.GamePadView = Y.Base.create('GamePadView', Y.View, [], {
		initializer: function () {
			var self = this;
			Y.io('/app/views/templates/gamepad.Template', {
				on: {
					complete: function (id, response) {
						// This should be precompile before at build time or at start of the server
						var template = Y.Handlebars.compile(response.responseText);
						Y.one('#game-pad').setHTML(template([]));
						self._down = new Y.Button({
							srcNode: '#down',
							on: {
								click: function (data) {
									self.move('down');
								}
							}
						}).render();
						self._up = new Y.Button({
							srcNode: '#up',
							on: {
								click: function (data) {
									self.move('up');
								}
							}
						}).render();
						self._left = new Y.Button({
							srcNode: '#left',
							on: {
								click: function (data) {
									self.move('left');
								}
							}
						}).render();
						self._right = new Y.Button({
							srcNode: '#right',
							on: {
								click: function (data) {
									self.move('right');
								}
							}
						}).render();

					}
				}
			});
			this._gameRepository = this.get('gameRepository');
			this._game = this.get('model');
			this._game.after('deletedChange', this.dispose, this);
		},
		render: function () {
			return this;
		},
		move: function (direction) {
			this._gameRepository.move(this._game.get('gameId'), direction);
		},
		dispose: function (end) {
			Y.one('#game-pad').get('childNodes').remove();
			this.destroy({remove: true});
			this._down.destroy({remove: true});
			this._up.destroy({remove: true});
			this._left.destroy({remove: true});
			this._right.destroy({remove: true});
		}
	});
}, '0.0.1', { requires: ['view', 'node', 'button']});