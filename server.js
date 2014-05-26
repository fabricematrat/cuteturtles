#!/usr/bin/env node
'use strict';

var clientId = 1;
var clients = {};
var gameId = 1;
var games = [];

var http = require('http');
var express = require('express');

var app = express();

app.use(express.static(__dirname));
var server = app.listen(8080);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
	res.render('index.html');
});

var Game = require('./server/Game');

io.on('connection', function (ws) {
	var id = clientId++;
	var client = clients[id] = id;

	ws.on('games', function () {
		process.nextTick(function () {
			ws.emit('games', games);
		});
	});

	ws.on('createGame', function (message) {
		process.nextTick(function () {
			var game = new Game(gameId++, message.user);
			games.push(game);
			ws.emit('gameCreated', game);
			ws.broadcast.emit('gameCreated', game);
		});
	});

	ws.on('joinGame', function (message) {
		process.nextTick(function () {
			var game = games.filter(function (game) {
				return game.gameId === message.gameId;
			});
			game[0].join(message.user);
			ws.emit('gameJoined', {gameId: message.gameId, user2: message.user, emily: games[0].turtles.position.emily});
			ws.broadcast.emit('gameJoined', {gameId: message.gameId, user2: message.user, emily: games[0].turtles.position.emily});
		});
	});

	ws.on('move', function (message) {
		process.nextTick(function () {
			var game = games.filter(function (game) {
				return game.gameId === message.gameId;
			});
			var move = game[0].move(message.direction, message.user);
			ws.emit('gameUpdated-' + game[0].gameId, move);
			ws.broadcast.emit('gameUpdated-' + game[0].gameId, move);
		});
	});

	ws.on('won', function (message) {
		process.nextTick(function () {
			for (var i = 0; i < games.length; i += 1) {
				if (games[i].gameId === message.gameId) {
					games.splice(i, 1);
					i -= 1;
				}
			}
			ws.emit('gameWon-' + message.gameId, {gameId: message.gameId});
			ws.broadcast.emit('gameWon-' + message.gameId, {gameId: message.gameId});
		});
	});

	ws.on('lost', function (message) {
		process.nextTick(function () {
			for (var i = 0; i < games.length; i += 1) {
				if (games[i].gameId === message.gameId) {
					games.splice(i, 1);
					i -= 1;
				}
			}
			ws.emit('gameLost-' + message.gameId, {gameId: message.gameId});
			ws.broadcast.emit('gameLost-' + message.gameId, {gameId: message.gameId});
		});
	});

	ws.on('giveUp', function (message) {
		process.nextTick(function () {
			for (var i = 0; i < games.length; i += 1) {
				if (games[i].gameId === message.gameId) {
					games.splice(i, 1);
					i -= 1;
				}
			}
			ws.broadcast.emit('gameGiveUp-' + message.gameId, {gameId: message.gameId, user: message.user});
		});
	});

	ws.on('close', function () {
		delete clients[id];
	});
});



