import React, { Component } from 'react';

class SpaceInvaders extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        var self = this;

        // initialize the canvas
        let canvas = self.canvasRef.current;
        let canvasCtxt = canvas.getContext('2d');

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
        var ship = new Image(); ship.src = require("../images/invaders/ship.png");
        var bullet_img = new Image(); bullet_img.src = require("../images/invaders/bullet.png");
        var alien_bullet_1 = new Image(); alien_bullet_1.src = require("../images/invaders/alien_bullet_1.png");
        var alien_bullet_2 = new Image(); alien_bullet_2.src = require("../images/invaders/alien_bullet_2.png");

        var spriteSize = 25;
        var down_1 = new Image(); down_1.src = require("../images/invaders/down_1.png");
        var up_1 = new Image(); up_1.src = require("../images/invaders/up_1.png");
        var down_2 = new Image(); down_2.src = require("../images/invaders/down_2.png");
        var up_2 = new Image(); up_2.src = require("../images/invaders/up_2.png");
        var down_3 = new Image(); down_3.src = require("../images/invaders/down_3.png");
        var up_3 = new Image(); up_3.src = require("../images/invaders/up_3.png");

        var block_uncracked = new Image(); block_uncracked.src = require("../images/invaders/block.png");
        var block_cracked_1 = new Image(); block_cracked_1.src = require("../images/invaders/block_crack_1.png");
        var block_cracked_2 = new Image(); block_cracked_2.src = require("../images/invaders/block_crack_2.png");

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
        self.invadersTimerG = setInterval(function () {
            // move the player (only if 1 key is pressed & char isn't at edge)
            if (key_right && (shipX + shipSize + 5) < canvas.width) shipX += 5;
            if (key_left && shipX > 5) shipX -= 5;

            // move sprites at a slower rate
            if (counter % 25 === 0) {
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
                Object.entries(sprites).forEach(([key, row]) => {
                    var d = 10;
                    for (var i = 0; i < 10; i++) {
                        var y;
                        switch (key) {
                            case "Row_1": y = 10; break;
                            case "Row_2": y = spriteSize + 20; break;
                            case "Row_3": y = spriteSize * 2 + 30; break;
                            case "Row_4": y = spriteSize * 3 + 40; break;
                            default: break;
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
            Object.entries(sprites).forEach(([k, row]) => {
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
            for (var j=0; j<invaderBullets.length; j++) {
                var bull = invaderBullets[j];
                bull.dir++;

                var image;
                if (bull.dir % 2 === 0) image = alien_bullet_1;
                else image = alien_bullet_2;

                canvasCtxt.drawImage(image, bull.x, bull.y, bullet.size*2, bullet.size*6);
            }
        }

        function moveSprites() {
            var hitEdge = false;

            // check if any sprites are about to hit the edge of the map
            Object.entries(sprites).forEach(([k, row]) => {
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
            Object.entries(sprites).forEach(([k, row]) => {
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
                        default: break;
                    }

                    bullet.onscreen = false;
                    return;
                }
            }

            // now check if you've hit a sprite
            Object.entries(sprites).forEach(([k, row]) => {
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
            if (spriteCount === 0) winScreenShowing = true;
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
                            default: break;
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

            Object.entries(sprites).forEach(([k, row]) => {
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

    componentWillUnmount() {
        window.clearInterval(this.invadersTimerG);
    }

    render() {
        var self = this;
        return  <div>
                    <p className="SIrules"> Move your ship left/right with the arrows, shoot with the space bar </p>
                    <canvas className="SIcanvas" ref={self.canvasRef} height="350" width = "500"></canvas>
                </div>
    }
}

export default SpaceInvaders;
