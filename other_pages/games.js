/************* Screen Size Check ******************/
$(document).ready(function() {
    readjustWidth();
    $(window).bind('resize', readjustWidth);
});

function readjustWidth() {
    var windowWidth = $(window).width();
    if (windowWidth < 850) {
        $('.play, .ping_pong, .snake, .invaders').addClass("hidden");
        $('.title').html("Unfortunately your screen isn't wide enough to play the games at the " +
            "moment. Please readjust your screen size. Sorry!");
    } else {
        $('.play, .ping_pong, .snake, .invaders').removeClass("hidden");
        $('.title').html("Here are a few games I wrote for fun. Enjoy!");
    }
}



/****************************************************************************************
                                    Snake
 ****************************************************************************************/

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
    var canvas = document.getElementsByClassName('SKcanvas')[0];
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function snake() {
    // initialize the canvas and prepare our page to listen for keyboard
    var canvas = document.getElementsByClassName('SKcanvas')[0];
    var canvasCtxt = canvas.getContext('2d');

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

        // 38 is up arrow, 40 is down arrow, 39 is right arrow, 37 is left arrow
        if (e.keyCode === 38 && direction !== 'D') direction = 'U';
        else if (e.keyCode === 40 && direction !== 'U') direction = 'D';
        else if (e.keyCode === 39 && direction !== 'L') direction = 'R';
        else if (e.keyCode === 37 && direction !== 'R') direction = 'L';

        // if you turn, don't register another keyboard click until the next block has been drawn
        document.removeEventListener("keydown", changeDirection, false);
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
            direction = 'R';
            return;
        }

        if (restartScreenShowing) {
            canvasCtxt.fillStyle = 'black';
            canvasCtxt.font = "15px Arial";
            canvasCtxt.textAlign="center";
            canvasCtxt.fillText("Click to play again", canvas.width/2, canvas.height/2);
            direction = 'R';
            return;
        }

        // register a keydown event (unbinds once it gets used)
        document.removeEventListener("keydown", changeDirection, false);    // so we don't add duplicates
        document.addEventListener("keydown", changeDirection, false);

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


/****************************************************************************************
                                    Ping Pong
 ****************************************************************************************/

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



/****************************************************************************************
                                    Space Invaders
 ****************************************************************************************/

var invTimerG;

function showInvaders() {
    var $IN = $('.IN');

    $('.play').css("display", "none");
    $IN.css("display", "block");

    $IN.html('Hide Space Invaders');
    $IN.attr("onclick","resetIN()");
    $('.invaders').css("display", "block");

    spaceInvaders();
}

function resetIN() {
    $('.play').css("display", "block");

    var $IN = $('.IN');
    $IN.html('Space Invaders');
    $IN.attr("onclick","showInvaders()");
    $('.invaders').css("display", "none");

    window.clearInterval(invTimerG);
    var canvas = document.getElementsByClassName('INcanvas')[0];
    var canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function spaceInvaders() {
    // initialize the canvas
    var canvas = document.getElementsByClassName('INcanvas')[0];
    var canvasCtxt = canvas.getContext('2d');

    // define the start/restart screens and register a click to get out of them
    var startScreenShowing = true;
    var winScreenShowing = false;
    var lossScreenShowing = false;

    canvas.addEventListener("mousedown", function () {
        startScreenShowing = false;
        winScreenShowing = false;
        lossScreenShowing = false;
    }, false);

    // prepare the components
    var shipSize = 40;
    var ship = new Image(); ship.src = "invaders/ship.png";
    var bullet_img = new Image(); bullet_img.src = "invaders/bullet.png";
    var alien_bullet_1 = new Image(); alien_bullet_1.src = "invaders/alien_bullet_1.png";
    var alien_bullet_2 = new Image(); alien_bullet_2.src = "invaders/alien_bullet_2.png";

    var spriteSize = 25;
    var down_1 = new Image(); down_1.src = "invaders/down_1.png";
    var up_1 = new Image(); up_1.src = "invaders/up_1.png";
    var down_2 = new Image(); down_2.src = "invaders/down_2.png";
    var up_2 = new Image(); up_2.src = "invaders/up_2.png";
    var down_3 = new Image(); down_3.src = "invaders/down_3.png";
    var up_3 = new Image(); up_3.src = "invaders/up_3.png";

    var block_uncracked = new Image(); block_uncracked.src = "invaders/block.png";
    var block_cracked_1 = new Image(); block_cracked_1.src = "invaders/block_crack_1.png";
    var block_cracked_2 = new Image(); block_cracked_2.src = "invaders/block_crack_2.png";

    var sprites, shipX, spriteCount;
    var bullet = {
        size: 5,
        onscreen: false,
        x: null,
        y: null
    };
    var invaderBullets = [];

    var blocksize = 67;
    var blocks;

    // register inputs from user (arrow keys/space bar)
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    var key_left = false;
    var key_right = false;

    function keydown(e) {
        if (e.keyCode === 39) {
            key_right = true; key_left = false;
        }
        else if (e.keyCode === 37) {
            key_left = true; key_right = false;
        }
        else if (e.keyCode === 32) shoot();
    }

    function keyup(e) {
        if (e.keyCode === 39) key_right = false;
        else if (e.keyCode === 37) key_left = false;
    }

    function shoot() {
        if (bullet.onscreen) return;      // can only have 1 bullet at a time

        bullet.onscreen = true;
        bullet.x = shipX + shipSize/2 - bullet.size/2;
        bullet.y = canvas.height - shipSize + 5;
    }

    // get the animation going (and do it once before so there isn't a delay)
    var counter = 0;
    var move_direction = true;      // to alternate sprites arms up/down
    var move_R;                     // to determine sprite direction
    draw();
    invTimerG = setInterval(function () {
        // move the player (only if 1 key is pressed & char isn't at edge)
        if (key_right && (shipX + shipSize + 5) < canvas.width) shipX += 5;
        if (key_left && shipX > 5) shipX -= 5;

        // move sprites at a slower rate
        if (counter % 25 == 0) {
            moveSprites();
            move_direction = !move_direction;
            generateInvaderShots();
        }
        counter++;

        // move bullet if it exists
        if (bullet.onscreen ) {
            bullet.y -= 10;
            if (bullet.y < 0) bullet.onscreen = false;
            checkForHits();
        }

        // move invaders bullets if they exist
        for (var i=0; i<invaderBullets.length; i++) {
            invaderBullets[i].y += 7;
            if (invaderBullets[i].y > canvas.height) invaderBullets.splice(i, 1);
        }
        checkInvaderShots();

        draw();
    }, 30);

    function draw() {
        // draw the game area
        canvasCtxt.fillStyle = 'white';
        canvasCtxt.fillRect(0, 0, canvas.width, canvas.height);

        // define the restart/start screens
        if (startScreenShowing || winScreenShowing || lossScreenShowing) {
            canvasCtxt.fillStyle = 'black';
            canvasCtxt.font = "15px Arial";
            canvasCtxt.textAlign = "center";

            // set initial locations of characters
            sprites = {
                Row_1: { locations: [], img_down: down_1, img_up: up_1},
                Row_2: { locations: [], img_down: down_3, img_up: up_3},
                Row_3: { locations: [], img_down: down_2, img_up: up_2},
                Row_4: { locations: [], img_down: down_3, img_up: up_3}
            };
            spriteCount = 40;
            shipX = canvas.width / 2 - shipSize / 2;
            move_R = true;

            // remove all bullets
            bullet.onscreen = false;
            invaderBullets = [];

            blocks = [
                { image: block_uncracked, hits: 0, x: 75, y: canvas.height - 80 },
                { image: block_uncracked, hits: 0, x: 217, y: canvas.height - 80  },
                { image: block_uncracked, hits: 0, x: 359, y: canvas.height - 80  }
            ];

            // generate the sprites
            $.each(sprites, function(key, row) {
                var d = 10;
                for (var i = 0; i < 10; i++) {
                    var y;
                    switch (key) {
                        case "Row_1": y = 10; break;
                        case "Row_2": y = spriteSize + 20; break;
                        case "Row_3": y = spriteSize * 2 + 30; break;
                        case "Row_4": y = spriteSize * 3 + 40; break;
                    }
                    var sprite = {
                        x: spriteSize * i + d * i + 1,
                        y: y
                    };

                    row.locations.push(sprite);
                }
            });
        }
        if (startScreenShowing) {
            canvasCtxt.fillText("Click to begin", canvas.width / 2, canvas.height / 2);
            return;
        }
        if (winScreenShowing) {
            canvasCtxt.fillText("Congratulations, you won! Click to play again", canvas.width / 2, canvas.height / 2);
            return;
        }
        if (lossScreenShowing) {
            canvasCtxt.fillText("The aliens invaded. Click to try again", canvas.width / 2, canvas.height / 2);
            return;
        }

        // draw the ship
        canvasCtxt.drawImage(ship, shipX, canvas.height - shipSize, shipSize, shipSize);

        // draw any blocks that may remain
        for (var i=0; i<blocks.length; i++) {
            canvasCtxt.drawImage(blocks[i].image, blocks[i].x, blocks[i].y, blocksize, blocksize/2);
        }

        // draw the sprites (& make them switch direction at the rate they move)
        $.each(sprites, function(k, row) {
            var image;
            if (move_direction) {
                image = row.img_down;
            } else {
                image = row.img_up;
            }

            for (var i = 0; i < row.locations.length; i++) {
                var sprite = row.locations[i];
                canvasCtxt.drawImage(image, sprite.x, sprite.y, spriteSize, spriteSize);
            }
        });

        // draw the bullet, if there is one
        if (bullet.onscreen) {
            canvasCtxt.drawImage(bullet_img, bullet.x, bullet.y, bullet.size, bullet.size*3);
        }

        // draw the invader bullets, if there are any
        for (var i=0; i<invaderBullets.length; i++) {
            var bull = invaderBullets[i];
            bull.dir++;

            var image;
            if (bull.dir % 2 == 0) image = alien_bullet_1;
            else image = alien_bullet_2;

            canvasCtxt.drawImage(image, bull.x, bull.y, bullet.size*2, bullet.size*6);
        }
    }

    function moveSprites() {
        var hitEdge = false;

        // check if any sprites are about to hit the edge of the map
        $.each(sprites, function(k, row) {
            for (var i = 0; i < row.locations.length; i++) {
                var sprite = row.locations[i];

                if (sprite.x + spriteSize > canvas.width && move_R) {     // right edge
                    move_R = false;
                    hitEdge = true;
                    return;
                }
                if (sprite.x - 10 < 0 && !move_R) {                     // left edge
                    move_R = true;
                    hitEdge = true;
                    return;
                }
            }
        });

        // now define movement
        $.each(sprites, function(k, row) {
            for (var i = 0; i < row.locations.length; i++) {
                var sprite = row.locations[i];

               if (hitEdge) {
                   sprite.y += 20;

                   // if they've reached the player's lever
                   if (sprite.y > (canvas.height - 50)) lossScreenShowing = true;

                   continue;  // don't move laterally if you're moving down
               }

                if (move_R) {
                    sprite.x += 10;
                } else {
                    sprite.x -= 10;
                }
            }
        });
    }

    function checkForHits() {
        // check first to see if you hit a block
        for (var i=0; i<blocks.length; i++) {
            var x1 = blocks[i].x;
            var x2 = blocks[i].x + blocksize;

            var y1 = blocks[i].y;
            var y2 = blocks[i].y + blocksize/2;

            if (bullet.x > x1 && bullet.x < x2 && bullet.y > y1 && bullet.y < y2) {
                blocks[i].hits++;

                switch (blocks[i].hits) {
                    case 3: blocks[i].image = block_cracked_1; break;
                    case 6: blocks[i].image = block_cracked_2; break;
                    case 9: blocks.splice(i, 1); break;
                }

                bullet.onscreen = false;
                return;
            }
        }

        // now check if you've hit a sprite
        $.each(sprites, function(k, row) {
            for (var i = 0; i < row.locations.length; i++) {
                var sprite = row.locations[i];

                var x1 = sprite.x;
                var x2 = sprite.x + spriteSize;

                var y1 = sprite.y;
                var y2 = sprite.y + spriteSize;

                if (bullet.x > x1 && bullet.x < x2 && bullet.y > y1 && bullet.y < y2) {
                    // remove sprite & bullet
                    row.locations.splice(i, 1);
                    spriteCount--;
                    bullet.onscreen = false;
                    return;
                }
            }
        });

        // check to see if you killed the last sprite;
        if (spriteCount == 0) winScreenShowing = true;
    }

    function checkInvaderShots() {
        for (var i=0; i < invaderBullets.length; i++) {
            var inv_bullet = invaderBullets[i];

            // check to see if an invader hit a block
            for (var j=0; j < blocks.length; j++) {
                var x1 = blocks[j].x;
                var x2 = blocks[j].x + blocksize;

                var y1 = blocks[j].y - blocksize/3;
                var y2 = blocks[j].y;

                if (inv_bullet.x > x1 && inv_bullet.x < x2 &&
                    (inv_bullet.y) > y1 && inv_bullet.y < y2) {
                    blocks[j].hits++;

                    switch (blocks[j].hits) {
                        case 3: blocks[j].image = block_cracked_1; break;
                        case 6: blocks[j].image = block_cracked_2; break;
                        case 9: blocks.splice(j, 1); break;
                    }

                    invaderBullets.splice(i, 1);
                    break;
                }
            }

            // check to see if an invader hit you
            var x_1 = shipX + 2;
            var x_2 = shipX + shipSize - 2;
            var y_1 = canvas.height - shipSize;
            var y_2 = canvas.height;

            if (inv_bullet.x > x_1 && inv_bullet.x < x_2 && inv_bullet.y > y_1 && inv_bullet.y < y_2) {
                lossScreenShowing = true;
            }
        }
    }

    function generateInvaderShots() {
        // limit the number of bullets that can be shot at once
        if (invaderBullets.length > 5) return;

        $.each(sprites, function(k, row) {
            for (var i = 0; i < row.locations.length; i++) {
                var sprite = row.locations[i];

                // generates a random number from zero to 1000
                var rand = Math.floor(Math.random() * 1000);

                // fewer sprites left -> higher chance of bullet generating
                if (spriteCount < 10) rand -= 100;

                if (Math.abs(shipX - sprite.x) < 25) {
                    // if sprite is near the player, 2% chance of shooting
                    if (rand < 20) {
                        invaderBullets.push({
                            x: sprite.x + spriteSize/2,
                            y: sprite.y + spriteSize,
                            dir: 0
                        })
                    }
                } else {
                    // 1% chance of shooting
                    if (rand < 10) {
                        invaderBullets.push({
                            x: sprite.x + spriteSize/2,
                            y: sprite.y + spriteSize,
                            dir: 0
                        })
                    }
                }
            }
        });
    }
}