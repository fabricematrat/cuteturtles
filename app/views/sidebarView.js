'use strict';

YUI.add('SidebarView', function (Y) {
	Y.SidebarView = Y.Base.create('SidebarView', Y.View, [], {
		initializer: function () {
			var self = this;
			this._panel = new Y.Panel({
				srcNode: '#side-bar',
				headerContent: 'Play with',
				width: '10em',
				height: '100%',
				centered: false,
				visible: true,
				buttons: [
					{
						value: 'New game',
						section: Y.WidgetStdMod.FOOTER,
						action: function (e) {
							e.preventDefault();
							self.createGame();
						}
					}
				],
				hideOn: []
			});

			//This should be precompile before at build time or at start of the server
			this.listTemplate = Y.Handlebars.compile('<ul style="padding-left:0em;">{{#each games}}{{> game}}{{/each}}</ul>');
			this.itemTemplate = Y.Handlebars.compile('<li id="game-join-{{gameId}}" class="game"><button class="yui3-button">{{user1}}</button></li>');

			this._user = this.get('user');
			this._gameRepository = this.get('gameRepository');
			this._games = this.get('model');
			this._games.after('add', this.addGame, this);
			this._games.after('remove', this.removeGame, this);
			this._games.after('*:change', this.updateGame, this);
			this._games.after('reset', this.render, this);
		},
		render: function () {
			var self = this;
			var content = this.listTemplate({
				games: self._games.map(function (game) {
					return game.getAttrs(['gameId', 'user1']);
				})
			}, {
				partials: {game: this.itemTemplate}
			});
			this._panel.set('bodyContent', content);
			this._panel.render();

			return this;
		},
		addGame: function (e) {
			var listNode;
			var content;
			var self = this;
			if (e.model.get('user1') !== this._user.get('name') && e.model.get('user2') !== '') {
				listNode = Y.one('ul');
				content = this.itemTemplate(e.model.getAttrs(['gameId', 'user1']));
				listNode.insertBefore(content, listNode.get('children').item(e.index));
				new Y.Button({
					srcNode: '#game-join-' + e.model.get('gameId'),
					on: {
						click: function (data) {
							self.joinGame(e.model.get('gameId'));
						}
					}
				}).render();
			}
		},
		removeGame: function (e) {
			var gameItemNode = Y.one('#game-join-' + e.model.get('gameId'));
			if (gameItemNode !== null) {
				gameItemNode.remove();
			}
		},
		updateGame: function (e) {
			var gameItemNode = Y.one('#game-join-' + e.target.get('gameId'));
			if (gameItemNode !== null) {
				if (e.target.get('user2')) {
					Y.one('#game-join-' + e.target.get('gameId')).remove();
				}
			}
		},
		createGame: function () {
			this._gameRepository.publish('currentGameChange');
			this._gameRepository.createGame();
		},
		joinGame: function (gameId) {
			this._gameRepository.publish('currentGameChange');
			this._gameRepository.joinGame(gameId);
		}
	});
}, '0.0.1', { requires: ['view', 'node', 'gallery-sliding-sidebar', 'io-base', 'handlebars']});
