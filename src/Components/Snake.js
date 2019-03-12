import React, { Component } from 'react';

class Snake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            score: 0,
            highScore: 0,
        };

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        var self = this;

        // initialize the canvas and prepare our page to listen for keyboard
        let canvas = self.canvasRef.current;
        let canvasCtxt = canvas.getContext('2d');

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
        self.snakeTimerG = setInterval(function () { draw(); move(); }, 60);

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

            self.setState({
                score: score,
                highScore: highScore,
            });
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
                default: break;
            }

            // check if the snake hits the wall
            head = snake[snake.length-1];
            if (head.x + snakeSize > canvas.width || head.x < 0 || head.y + snakeSize >  canvas.height || head.y < 0) {
                reset();
            }

            // check if the snake hits itself by seeing if the head coordinates already exist
            // exist within the snake array (other than itself of course)
            for (var j=0; j < snake.length-1; j++) {
                if (snake[j].x === head.x && snake[j].y === head.y) {
                    reset();
                }
            }

            // check if the snake hit the food
            if (head.x === food.x && head.y === food.y) {
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
            if (direction === 'U') snake.push({x: oldHead.x, y: oldHead.y - snakeSize});
            if (direction === 'D') snake.push({x: oldHead.x, y: oldHead.y + snakeSize});
            if (direction === 'L') snake.push({x: oldHead.x - snakeSize, y: oldHead.y});
            if (direction === 'R') snake.push({x: oldHead.x + snakeSize, y: oldHead.y});
        }
    }

    componentWillUnmount() {
        window.clearInterval(this.snakeTimerG);
    }

    render() {
        var self = this;
        return  <div>
                    <p className="SKrules"> Play with A/W/D/S or with the arrow keys </p>
                    <p className="SKscore"> Score: {self.state.score} <br/> High Score: {self.state.highScore} </p>
                    <canvas className="SKcanvas" ref={self.canvasRef} height="250" width = "500"></canvas>
                </div>
    }
}

export default Snake;
