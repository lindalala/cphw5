
var express = require('express');
var app = express();

app.use(express.static('client'));
var server = app.listen(process.env.PORT || 8080);

var globalRocketX;
var globalRocketY;
var globalRocketPos;
var board;
var offset;
var boardLen;
var money;
var startTime;
var step;

var votes = {};
var interval;
var userCount = 0;

var io = require('socket.io')(server);
io.sockets.on('connect', function (socket) {
  userCount++;

  if (userCount === 1) {
    globalRocketX = 0;
    globalRocketY = 0;
    globalRocketPos = 0;
    board = [[0,0,0,0,0],
             [0,0,0,0,1],
             [0,0,0,0,0],
             [0,0,0,0,0],
             [0,1,0,1,1],
             [0,0,0,0,1],
             [0,0,0,0,1]];
    offset = 0;
    money = 0.000;
    startTime = new Date().getTime();
    step = 50;

    interval = setInterval(emitStep, 1000);
  }

  io.sockets.emit('start', {
    globalRocketX: globalRocketX,
    globalRocketY: globalRocketY,
    globalRocketPos: globalRocketPos,
    board: board,
    offset: offset,
    money: money,
    startTime: startTime,
    step: step
  });

  socket.on('vote', function(data) {
    votes[socket.id] = data.rocketPos;
  });

  socket.on('disconnect', function() {
    userCount--;
  });

  // if (money === 2.000 || board[(offset+boardLen-1) % (board.length)][rocketPos]) {
  //   gameOver(money, new Date().getTime());
  //   return;
  // }
});

function emitStep() {
  updateGame();
  io.sockets.emit('step', {
    globalRocketX: globalRocketX,
    globalRocketY: globalRocketY,
    globalRocketPos: globalRocketPos,
    board: board,
    offset: offset,
    money: money,
    startTime: startTime,
    step: step
  });
}

function updateGame() {
  offset--;
  if (offset < 0) {
    offset = board.length - 1;
  }

  updateGlobalRocket();
}

function updateGlobalRocket() {
  var votesCount = {};
  var maxCount = 0;
  var modeVote = null;

  for (key in votes) {
    vote = votes[key];
    if (votesCount[vote]) {
      votesCount[vote]++;
    } else {
      votesCount[vote] = 1;
    }

    if (votesCount[vote] > maxCount) {
      var modeVote = vote;
      maxCount = votesCount[vote];
    }
  }

  if (modeVote !== null) {
    globalRocketPos = modeVote;
    globalRocketX = modeVote*step;
  }
  votes = {};
}
