var rocketx = 0;
var rockety = 0;
var rocketPos = 0;
var globalRocketX;
var globalRocketY;
var globalRocketPos;
var board;
var offset;
var moneybox;
var startTime;
var step;

var socket = io.connect('/');
var moneyBox;

socket.on('step', function (data) {
  globalRocketX = data.globalRocketX;
  globalRocketY = data.globalRocketY;
  globalRocketPos = data.globalRocketPos;
  board = data.board;
  offset = data.offset;
  money = data.money;
  startTime = data.startTime;
  step = data.step;
  redraw();
});

socket.on('start', function (data) {
  globalRocketX = data.globalRocketX;
  globalRocketY = data.globalRocketY;
  globalRocketPos = data.globalRocketPos;
  board = data.board;
  offset = data.offset;
  money = data.money;
  startTime = data.startTime;
  step = data.step;
  setup();
});

socket.on('gameover', function (data) {
  gameOver(data.money, data.time);
});

function setup() {
  var gameboard = $("#gameboard");
  gameboard.empty();
  var rocket = $("<div class='rocket'></div>");
  var globalRocket = $("<div class='globalrocket'></div>");

  $(gameboard).append(rocket);
  $(gameboard).append(globalRocket);
  for (var i=0; i<board.length-1; i++){
    var gridRow = $("<div class='gridrow' id='row_"+i+"'></div>");
    $(gameboard).append(gridRow);
    for (var j=0; j<board[0].length; j++){
      var iOff = (offset+i) % (board.length);
      if (board[iOff][j]) {
        $(gridRow).append($("<div class='gridcell enemy'></div>"));
      } else {
        $(gridRow).append($("<div class='gridcell free'></div>"));
      }
    }
  }
}

function gameOver(money, time){
  // clearInterval(interval);
  // money = Math.min(2.000, money, Math.round(((0.001*(time-startTime))/1000)*1000)/1000);
  // $('input[name="time"]').val(time/1000);
  // $('input[name="earnings"]').val(money);
  // $('#mturk_form').submit();
  // alert('Your HIT has been submitted. \n You have earned: $' + money);
  alert('game over');
}

function redraw() {
  $(".globalrocket").css("left", globalRocketX + "px");

  $("#moneybox").text("$" + money);

  for (var i=0; i<board.length-1; i++){
    var gridRow = $("#row_" + i);
    gridRow.empty();
    for (var j=0; j<board[0].length; j++){
      var gridCell;
      var iOff = (offset+i) % (board.length);
      if (board[iOff][j]) {
        gridCell = $("<div class='gridcell enemy'></div>");
      } else {
        gridCell = $("<div class='gridcell free'></div>");
      }
      $(gridRow).append(gridCell);
    }
  }
  $(".enemy").each(function(i,el) {
    $(el).css("background-color", "blue");
  });
}

$(document).ready(function() {

  $(document).keydown(function(e) {
    if(e.keyCode==37) {
      // left arrow clicked
      rocketPos--;
      rocketx -= step;
    } else if(e.keyCode == 39) {
      // right arrow clicked
      rocketPos++;
      rocketx += step;
    }

    if (rocketPos < 0){
      rocketPos = board[0].length - 1;
      rocketx += (board[0].length)*step;
    } else if(rocketPos > board[0].length - 1) {
      rocketPos = 0;
      rocketx -= (board[0].length)*step;
    }

    $(".rocket").css("left", rocketx + "px");
    socket.emit('vote', { 'rocketPos': rocketPos });
  });

});
