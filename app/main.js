'use strict';

YUI.GlobalConfig = {
	modules: {
		gameModel: '/app/models/game.js',
		userModel: '/app/models/user.js',
		gameRepository: '/app/repository/gameRepository.js',
		'socket.io': '/socket.io/socket.io.js',
		RegistrationView: '/app/views/registrationView.js',
		GameWonView: '/app/views/gamewonView.js',
		GameLostView: '/app/views/gamelostView.js',
		SidebarView: '/app/views/sidebarView.js',
		GameView: '/app/views/gameView.js',
		GamePadView: '/app/views/gamepadView.js',
		GameGiveUpView: '/app/views/gamegiveupView.js',
		drawGrid: '/app/views/drawGrid.js',
		drawTurtles: '/app/views/drawTurtles.js',
		drawWalls: '/app/views/drawWalls.js'
	}
};

// Should be able to declare only the dependency use not the transitive one
YUI().use('app', 'socket.io', 'gameModel', 'userModel', 'promise', 'gameRepository', 'RegistrationView', 'GameView', 'GamePadView', 'SidebarView', 'GameLostView', 'GameWonView', 'GameGiveUpView', 'drawGrid', 'drawTurtles', 'drawWalls', function (Y) {
	var user = new Y.User({name: localStorage['cuteTurtles.user']});
	var myApp = new Y.App({
		views: {
			GameView: {
				type: 'GameView'
			},
			GameLostView: {
				type: 'GameLostView'
			},
			GameWonView: {
				type: 'GameWonView'
			},
			GameGiveUpView: {
				type: 'GameGiveUpView'
			},
			GamePadView: {
				type: 'GamePadView'
			},
			SidebarView: {
				type: 'SidebarView'
			},
			RegistrationView: {
				type: 'RegistrationView'
			}
		},
		games: new Y.ModelList({model: Y.Game}),
		gameRepository: new Y.GameRepository(user),
		user: user
	});

	myApp.route('/', function () {
		var self = this;
		var games = this.get('games');
		var gameRepository = this.get('gameRepository');

		gameRepository.loadGames().then(function (data) {
			data.map(function (game) {
				var model = new Y.Game(game);
				games.add(model);
				gameRepository.on('gameTaken-' + game.gameId, function (updated) {
					Object.keys(updated).forEach(function (key) {
						model.set(key, updated[key]);
					});
				});
			});
		});

		var sidebarModel = {model: games, gameRepository: gameRepository, user: user};
		this.showView('SidebarView', sidebarModel);

		if (user.get('name') === void 0) {
			this.showView('RegistrationView', {gameRepository: gameRepository});
			// Really simple mediator, I mean really
			// Should be on a different object but took the easy road
			gameRepository.subscribe('newUser', function (newUser) {
				localStorage.setItem('cuteTurtles.user', newUser);
				sidebarModel.user.set('name', newUser);
			});
		}

		// TODO: Should move to a real router object
		// Events happening during the game
		gameRepository.on('gameCreated', function (game) {
			var model = new Y.Game(game);
			games.add(model);
			if (game.user1 === user.get('name')) {
				self.showView('GameView', {model: model, gameRepository: gameRepository});
				self.showView('GamePadView', {model: model, gameRepository: gameRepository});
				gameRepository.subscribe('currentGameChange', function () {
					if (model) {
						gameRepository.giveUp(game.gameId);
						model.set('deleted', true);
					}
					gameRepository.unsubscribe('currentGameChange');
				});
				gameRepository.on('gameGiveUp-' + game.gameId, function (giveup) {
					var model = games.filter(function (game) {
						return game.get('gameId') === giveup.gameId;
					});
					if (model.length > 0) {
						games.remove(game);
						model[0].set('deleted', true);
						gameRepository.unsubscribe('currentGameChange');
						self.showView('GameGiveUpView', {user: giveup.user});
					}
				});
			}
			gameRepository.on('gameUpdated-' + game.gameId, function (updated) {
				model.set('steps', updated.steps);
				model.set('won', updated.won);
				model.set('lost', updated.lost);
				model.set('winningAnimation', updated.winningAnimation);
			});
		});

		gameRepository.on('gameJoined', function (message) {
			var model = games.filter(function (game) {
				return game.get('gameId') === message.gameId;
			});
			model[0].get('turtles').position.emily = message.emily;
			model[0].set('user2', message.user2);
			if (model[0].get('user1') !== user.get('name')) {
				gameRepository.subscribe('currentGameChange', function () {
					if (model.length > 0) {
						gameRepository.giveUp(message.gameId);
						model[0].set('deleted', true);
					}
					gameRepository.unsubscribe('currentGameChange');
				});
				self.showView('GameView', {model: model[0], gameRepository: gameRepository});
				self.showView('GamePadView', {model: model[0], gameRepository: gameRepository});
				gameRepository.on('gameGiveUp-' + message.gameId, function (giveup) {
					var model = games.filter(function (game) {
						return game.get('gameId') === giveup.gameId;
					});
					if (model.length > 0) {
						games.remove(model);
						model[0].set('deleted', true);
						gameRepository.unsubscribe('currentGameChange');
						self.showView('GameGiveUpView', {user: giveup.user});
					}
				});
			}

			gameRepository.on('gameWon-' + message.gameId, function () {
				var game = games.filter(function (game) {
					return game.get('gameId') === message.gameId;
				});
				if (game.length > 0) {
					games.remove(game);
					//Should be a better way to delete the view ?
					game[0].set('deleted', true);
					gameRepository.unsubscribe('currentGameChange');
					self.showView('GameWonView');
				}
			});

			gameRepository.on('gameLost-' + message.gameId, function () {
				var game = games.filter(function (game) {
					return game.get('gameId') === message.gameId;
				});
				if (game.length > 0) {
					games.remove(game);
					//Should be a better way to delete the view ?
					game[0].set('deleted', true);
					gameRepository.unsubscribe('currentGameChange');
					self.showView('GameLostView');
				}
			});

			gameRepository.subscribe('won-' + message.gameId, function (gameId) {
				gameRepository.won(gameId);
			});

			gameRepository.subscribe('lost-' + message.gameId, function (gameId) {
				gameRepository.lost(gameId);
			});
		});

		gameRepository.on('gameDeleted', function (deleted) {
			games.remove(games.filter(function (game) {
				return game.get('gameId') === deleted.gameId;
			}));
		});

	});

	myApp.render().dispatch();
});


