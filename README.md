## Playing Cute Turtles Game

### Goal

Franklin(Turtle) is lost in the maze, help him to meet Emily(Pig) at the Heart before Sneaky(Bird) reaches the heart.

* You can move up/down/right/left to navigate through the maze.
* Sneaky is trying to reach before you the heart and then you will loose

![CuteTurtles](/cute.png)

### Requirements
* Cute Turtles is a collaborative game for 2 players.
* You will need two separate browsers (like use Chrome for player1, FireFox for player2) if players are on the same computer.
Some data like player's name are stored on your browser local storage.
* First time you use Cute Turtles you will be prompted to enter your pseudo/name which will be displayed in the list of open games for others
* When you create a game you become Franklin and you should wait until emily is joining the game. If nobody joins you will be alone crying.
* You can also join a game as Emily by clicking on the list of available game, you won't be Franklin for this game but Emily.

### What is it made of

1. A Node Backend that return position value for the turtles/bird
3. HTML5 Canvas API for displaying turtle moves and positions.
4. YUI3 MVC.
5. socket.io for multi players joining a virtual room.

### How to build your dev environment
* Install : npm install
* Run server: npm server.js
* Open 2 different browsers with : http://localhost:8080

### What's left
* TODO in the code
* Extract router code in a real router class
* Extract config in a separate file
* Discover why I need to put transitive dependencies in my YUI.use
* Use Page Layout and responsive widgets
* Fix bugs
* Write more tests
* Simplify the code
* Use namespace
* Many more ...


