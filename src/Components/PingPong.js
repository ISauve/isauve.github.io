import React, { Component } from 'react';

class PingPong extends Component {
    constructor(props) {
        super(props);
        this.state = { level: "1" };
        this.canvasRef = React.createRef();
        this.onLevelChanged = this.onLevelChanged.bind(this);
    }

    componentDidMount() {
        var self = this;

        // initialize the canvas
        let canvas = self.canvasRef.current;
        let canvasContext = canvas.getContext('2d');

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
                    var level = self.state.level;
                    switch (level) {
                        case "1":
                            ballRadius = 10;
                            ballSpeedX = 10; ballSpeedY = 4;
                            paddleHeight= 100;
                            computerSpeed = 6;
                            break;
                        case "2":
                            ballRadius = 7.5;
                            ballSpeedX = 11; ballSpeedY = 4.5;
                            paddleHeight= 75;
                            computerSpeed = 7;
                            break;
                        case "3":
                            ballRadius = 5;
                            ballSpeedX = 12; ballSpeedY = 5;
                            paddleHeight = 50;
                            computerSpeed = 8;
                            break;
                        default: break;
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
        self.ppTimerG = setInterval(function() { moveEverything(); drawEverything() }, 30);

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

    componentWillUnmount() {
        window.clearInterval(this.ppTimerG);
    }

    onLevelChanged = (e) => {
        this.setState({
            level: e.currentTarget.value
        });

        console.log("now playing level " + e.currentTarget.value);
    }

    render() {
        var self = this;
        return  <div>
                    <p className="PPrules">
                        Use your mouse to control the left paddle and get the ball past the computer. First to 3 wins!
                    </p>
                    <p className="PPdifficulty">
                        Select a difficulty below. Changes in difficulty take effect when a new game starts.
                    </p>
                    <form className="PPlevels" action="">
                        <input  type="radio" value="1" onChange={self.onLevelChanged}
                                checked={self.state.level === "1"}
                        /> Easy &nbsp; &nbsp;
                        <input  type="radio" value="2" onChange={self.onLevelChanged}
                                checked={self.state.level === "2"}
                        /> Medium &nbsp; &nbsp;
                        <input  type="radio" value="3" onChange={self.onLevelChanged}
                                checked={self.state.level === "3"}
                        /> Hard
                    </form>
                    <canvas className="PPcanvas" ref={self.canvasRef} width="500" height="300"></canvas>
                </div>
    }
}

export default PingPong;
