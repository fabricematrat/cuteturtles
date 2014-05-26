'use strict';

YUI.add('gameRepository', function (Y) {
	function GameRepository() {
		// TODO associate io with Y.Socket for example instead of using global io
		this._socket = io.connect('http://localhost'); // jshint ignore:line
		this._socket.on('connect', function () {
		});
		// For publish/subscribe
		this._channels = {};
	}

	GameRepository.prototype.loadGames = function () {
		var self = this;
		return new Y.Promise(function (resolve, reject) {
			self._socket.emit('games');
			self._socket.on('games', function (data) {
				resolve(data);
			});
		});
	};

	GameRepository.prototype.on = function (event, callback) {
		this._socket.on(event, callback);
	};

	GameRepository.prototype.createGame = function () {
		this._socket.emit('createGame', {user: localStorage['cuteTurtles.user']});
	};

	GameRepository.prototype.lost = function (gameId) {
		this._socket.emit('lost', {gameId: gameId});
	};

	GameRepository.prototype.won = function (gameId) {
		this._socket.emit('won', {gameId: gameId});
	};

	GameRepository.prototype.createGame = function () {
		this._socket.emit('createGame', {user: localStorage['cuteTurtles.user']});
	};

	GameRepository.prototype.move = function (gameId, direction) {
		this._socket.emit('move', { gameId: gameId, direction: direction, user: localStorage['cuteTurtles.user']});
	};

	GameRepository.prototype.joinGame = function (gameId) {
		this._socket.emit('joinGame', { gameId: gameId, user: localStorage['cuteTurtles.user']});
	};

	GameRepository.prototype.giveUp = function (gameId) {
		this._socket.emit('giveUp', { gameId: gameId, user: localStorage['cuteTurtles.user']});
	};

	GameRepository.prototype.subscribe = function (channel, func) {
		this._channels[channel] = func;
	};

	GameRepository.prototype.unsubscribe = function (channel) {
		this._channels[channel] = void 0;
	};

	GameRepository.prototype.publish = function (channel, value) {
		if (this._channels[channel]) {
			this._channels[channel](value);
		}
	};

	Y.GameRepository = GameRepository;
}, {requires: ['socket.io', 'promise']});
