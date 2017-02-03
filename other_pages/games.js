/************* Screen Size Check ******************/
$(document).ready(function() {
    readjustWidth();
    $(window).bind('resize', readjustWidth);
});

function readjustWidth() {
    var windowWidth = $(window).width();
    if (windowWidth < 850) {
        $('.play, .ping_pong, .snake').addClass("hidden");
        $('.title').html("Unfortunately your screen isn't wide enough to play the games at the " +
            "moment. Please readjust your screen size. Sorry!");
    } else {
        $('.play, .ping_pong, .snake').removeClass("hidden");
        $('.title').html("Here are a few games I wrote for fun. Enjoy!");
    }
}

/************* Snake *****************************/
var snakeTimerG;

function showSnake() {
    $('.play').css("display", "none");

    var $SK = $('.SK');
    $SK.css("display", "block");
    $SK.html('Hide Snake');
    $SK.attr("onclick","resetSnake()");
    $('.snake').css("display", "block");

    snake();
}

function resetSnake() {
    $('.play').css("display", "block");

    var $SK = $('.SK');
    $SK.html('Snake');
    $SK.attr("onclick","showSnake()");
    $('.snake').css("display", "none");
    $('.SKscore').html("Score: 0<br> High Score: 0");

    window.clearInterval(snakeTimerG);
    var canvas = canvas = document.getElementsByClassName('SKcanvas')[0];
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function snake() {
    // initialize the canvas and prepare our page to listen for keyboard
    var canvas = document.getElementsByClassName('SKcanvas')[0];
    var canvasCtxt = canvas.getContext('2d');
    document.addEventListener("keydown", changeDirection, false);

    var score = 0;
    var highScore = 0;

    // define the start/restart screens and register a click to get out of them
    var startScreenShowing = true;
    var restartScreenShowing = false;
    canvas.addEventListener("mousedown", function(){
        startScreenShowing = false;
        restartScreenShowing = false
    }, false);


    // prepare the snake
    var snakeColor = 'blue';
    var snakeSize = 10;
    var direction = 'R';
    /*
     We're going to store the snake segments in an array so that it's easy to
     manipulate the movement - every item in the array will be a coordinate of a
     segment. We're starting off with 3 segments.
     */
    var snake = [{x:0, y:0}, {x:snakeSize, y:0}, {x:snakeSize*2, y:0}];

    // define the function that runs when keys are pressed
    function changeDirection(e) {
        // 87 is up(w), 83 is down(s), 68 is right(d), 65 is left (a)
        if (e.keyCode === 87 && direction !== 'D') direction = 'U';
        else if (e.keyCode === 83 && direction !== 'U') direction = 'D';
        else if (e.keyCode === 68 && direction !== 'L') direction = 'R';
        else if (e.keyCode === 65 && direction !== 'R') direction = 'L';
    }

    // prepare the food
    var food = generateSquare();

    function generateSquare() {

        var randX = Math.round(Math.random()*(canvas.width-snakeSize)/snakeSize) * snakeSize;
        var randY = Math.round(Math.random()*(canvas.height-snakeSize)/snakeSize) * snakeSize;
        return { x: randX,  y: randY }
    }

    // get the animation going and do it once before so there isn't a delay
    draw(); move();
    snakeTimerG = setInterval(function () { draw(); move(); }, 60);

    function draw() {
        // draw the game area
        canvasCtxt.fillStyle = 'white';
        canvasCtxt.fillRect(0,0, canvas.width, canvas.height);

        if (startScreenShowing) {
            canvasCtxt.fillStyle = 'black';
            canvasCtxt.font = "15px Arial";
            canvasCtxt.textAlign="center";
            canvasCtxt.fillText("Click to begin", canvas.width/2, canvas.height/2);
            return;
        }

        if (restartScreenShowing) {
            canvasCtxt.fillStyle = 'black';
            canvasCtxt.font = "15px Arial";
            canvasCtxt.textAlign="center";
            canvasCtxt.fillText("Click to play again", canvas.width/2, canvas.height/2);
            return;
        }

        // draw the square
        canvasCtxt.fillStyle = snakeColor;
        canvasCtxt.fillRect(food.x, food.y, snakeSize, snakeSize);

        // draw the snake by drawing each item in the snake array
        for (var i=0; i < snake.length; i++) {
            canvasCtxt.fillStyle = snakeColor;
            canvasCtxt.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
        }

        // update the score
        if (score > highScore) highScore = score;
        $('.SKscore').html("Score: " + score + "<br>High Score: " + highScore);
    }

    function move() {
        if (startScreenShowing || restartScreenShowing) {
            return;
        }
        /*
         The logic for moving the snake:
         The first item in the snake array is the tail, and the last is the head.
         To get the snake to move, we just have to take out the tail cell and place
         it in front of/below/beside the head, based on which direction is should go.
         */
        var head = snake[snake.length-1];
        snake.shift();
        switch(direction) {
            case 'R': snake.push({x: head.x + snakeSize, y: head.y}); break;
            case 'L': snake.push({x: head.x - snakeSize, y: head.y}); break;
            case 'U': snake.push({x: head.x, y: head.y - snakeSize}); break;
            case 'D': snake.push({x: head.x, y: head.y + snakeSize}); break;
        }

        // check if the snake hits the wall
        head = snake[snake.length-1];
        if (head.x + snakeSize > canvas.width || head.x < 0 || head.y + snakeSize >  canvas.height || head.y < 0) {
            reset();
        }

        // check if the snake hits itself by seeing if the head coordinates already exist
        // exist within the snake array (other than itself of course)
        for (var j=0; j < snake.length-1; j++) {
            if (snake[j].x == head.x && snake[j].y == head.y) {
                reset();
            }
        }

        // check if the snake hit the food
        if (head.x == food.x && head.y == food.y) {
            ate();
        }
    }

    function reset() {
        score = 0;
        direction = 'R';
        snake = [{x:0, y:0}, {x:snakeSize, y:0}, {x:snakeSize*2, y:0}];
        restartScreenShowing = true;
    }

    function ate() {
        score++;

        // reset the food position
        food = generateSquare();

        // add a new head segment in front of the current one
        var oldHead = snake[snake.length-1];
        if (direction == 'U') snake.push({x: oldHead.x, y: oldHead.y - snakeSize});
        if (direction == 'D') snake.push({x: oldHead.x, y: oldHead.y + snakeSize});
        if (direction == 'L') snake.push({x: oldHead.x - snakeSize, y: oldHead.y});
        if (direction == 'R') snake.push({x: oldHead.x + snakeSize, y: oldHead.y});
    }
}

/************* Ping Pong *************************/
var ppTimerG;

function showPP() {
    $('.play').css("display", "none");

    var $PP = $('.PP');
    $PP.css("display", "block");
    $PP.html('Hide Ping Pong');
    $PP.attr("onclick","resetPP()");
    $('.ping_pong').css("display", "block");

    pingPong();
}

function resetPP() {
    $('.play').css("display", "block");

    var $PP = $('.PP');
    $PP.html('Ping Pong');
    $PP.attr("onclick","showPP()");
    $('.ping_pong').css("display", "none");

    window.clearInterval(ppTimerG);
    var canvas = canvas = document.getElementsByClassName('PPcanvas')[0];
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function pingPong() {
    var canvas, canvasContext;

    // initialize our canvas
    canvas = document.getElementsByClassName('PPcanvas')[0];
    canvasContext = canvas.getContext('2d');

    // listen for mouse input
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePos(evt);
        // if paddleHeight hasn't been initialized (when the game starts)
        // then just set a random height for the paddle
        if (!paddleHeight) {paddle1Y = 100 }
        else {paddle1Y = mousePos.y - paddleHeight/2 }
    });
    function calculateMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        }
    }
    canvas.addEventListener('mousedown', handleMouseClick);
    function handleMouseClick() {
        if (showingStartScreen || showingWinScreen) {
            // check what level the game should be at when it starts again
            checkLevel();
            function checkLevel() {
                var level = $('input[name="level"]:checked').val();
                switch (level) {
                    case '1':
                        ballRadius = 10;
                        ballSpeedX = 10; ballSpeedY = 4;
                        paddleHeight= 100;
                        computerSpeed = 6;
                        break;
                    case '2':
                        ballRadius = 7.5;
                        ballSpeedX = 11; ballSpeedY = 4.5;
                        paddleHeight= 75;
                        computerSpeed = 7;
                        break;
                    case '3':
                        ballRadius = 5;
                        ballSpeedX = 12; ballSpeedY = 5;
                        paddleHeight = 50;
                        computerSpeed = 8;
                        break;
                }
            }
        }
        // then handle the individual case itself
        if (showingStartScreen) {
            showingStartScreen = false;
        } else if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    }

    var ballRadius, ballSpeedX, ballSpeedY, paddleHeight, computerSpeed;
    var ballX = 50;
    var ballY = 50;
    var winScore = 3;
    var paddleThick = 10;
    var paddle1Y = 100;
    var paddle2Y = 100;
    var player1Score = 0;
    var player2Score = 0;
    var showingStartScreen = true;
    var showingWinScreen = false;

    // get the animation going
    ppTimerG = setInterval(function() { moveEverything(); drawEverything() }, 30);

    function moveEverything() {
        if (showingWinScreen || showingStartScreen) {
            return;
        }
        computerMovement();
        ballX += ballSpeedX; ballY += ballSpeedY;
        // want to check if it hits the front of the paddle
        if (ballX - ballRadius < paddleThick){
            // if the ball is below the top of the paddle and above the bottom, bounce
            if (ballY + ballRadius > paddle1Y && ballY - ballRadius < paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
                /*
                 we want to incorporate ball control - aka if you hit the ball with the middle
                 of your paddle it bounces straight off, but if you hit with the edge you
                 send it off at a steep angle
                 */
                var deltaY = ballY - (paddle1Y + paddleHeight/2);
                // dampening the ballSpeedY so you don't send it off at a Y speed of 50
                ballSpeedY = deltaY * 0.35;
            }
        }
        // check if it hits the left wall
        if (ballX - ballRadius < 0) {
            player2Score ++;
            ballReset();
        }
        // same thing for the other side
        if (ballX + ballRadius > canvas.width - paddleThick) {
            if (ballY + ballRadius > paddle2Y && ballY - ballRadius < paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
                deltaY = ballY - (paddle2Y + paddleHeight/2);
                ballSpeedY = deltaY * 0.35;
            }
        }
        if (ballX + ballRadius > canvas.width){
            player1Score ++;
            ballReset();
        }
        // bounce off the top and bottom always
        if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function computerMovement() {
        var paddle2Ycenter = paddle2Y + paddleHeight/2;
        // include the +- 1/3 of paddleHeight so that if the ball is close enough, the paddle doesn't move
        // this is to stop it from shaking when the ball height is close to the center height of the paddle
        if (paddle2Ycenter < ballY - paddleHeight/3) {
            paddle2Y +=  computerSpeed;
        } else if (paddle2Ycenter > ballY + paddleHeight/3){
            paddle2Y -= computerSpeed;
        }
    }

    function ballReset() {
        if (player1Score >= winScore || player2Score >= winScore) {
            showingWinScreen = true;
        }
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = 4;
    }


    function drawEverything() {
        // black background
        colorRect(0, 0, canvas.width, canvas.height, 'black');

        if (showingWinScreen) {
            canvasContext.fillStyle = 'white';
            canvasContext.font = "15px Arial";
            canvasContext.textAlign="center";
            canvasContext.fillText('Click to continue', canvas.width/2, canvas.height/2+50);
            if (player1Score >= winScore) {canvasContext.fillText('You won!', canvas.width/2, canvas.height/2-50)}
            if (player2Score >= winScore) {canvasContext.fillText('The computer won.', canvas.width/2, canvas.height/2-50)}
            return;
        }
        if (showingStartScreen) {
            canvasContext.fillStyle = 'white';
            canvasContext.font = "15px Arial";
            canvasContext.textAlign="center";
            canvasContext.fillText('Click to begin', canvas.width/2, canvas.height/2);
            return;
        }

        // left player paddle
        colorRect(0, paddle1Y, paddleThick, paddleHeight, 'white');
        // right computer paddle
        colorRect(canvas.width - paddleThick, paddle2Y, paddleThick, paddleHeight, 'white');
        // the ball
        colorCircle(ballX, ballY, ballRadius, 'white');
        // the score
        canvasContext.font = "15px Arial";
        canvasContext.fillText(player1Score, 100, 100);
        canvasContext.fillText(player2Score, canvas.width-100, 100);
        drawNet();
    }

    function colorRect(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
    }

    function colorCircle(centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
        canvasContext.fill();
    }

    function drawNet() {
        for (var i=0; i<canvas.height; i+=40) {
            colorRect(canvas.width/2-1, i, 2, 20, 'white');
        }
    }
}
