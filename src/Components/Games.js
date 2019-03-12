import React, { Component } from 'react';
import Snake from './Snake.js';
import SpaceInvaders from './SpaceInvaders.js';
import PingPong from './PingPong.js';

class Games extends Component {
    constructor() {
        super();
        this.state = {
            snakeOpen: false,
            SIOpen: false,
            pongOpen: false
        };

        this.toggleSnake = this.toggleSnake.bind(this);
        this.toggleSI = this.toggleSI.bind(this);
        this.togglePong = this.togglePong.bind(this);
    }

    toggleSnake = () => {
        this.setState({
            snakeOpen: !this.state.snakeOpen,
            SIOpen: false,
            pongOpen: false
        });
    };

    toggleSI = () => {
        this.setState({
            snakeOpen: false,
            SIOpen: !this.state.SIOpen,
            pongOpen: false
        });
    };

    togglePong = () => {
        this.setState({
            snakeOpen: false,
            SIOpen: false,
            pongOpen: !this.state.pongOpen
        });
    };

    render() {
        var Game;
        if (this.state.snakeOpen) {
            Game = <Snake/>
        } else if (this.state.SIOpen) {
            Game = <SpaceInvaders/>
        } else if (this.state.pongOpen) {
            Game = <PingPong/>
        }

        var self = this;
        return  <div className="gamesBox">
                    <button  onClick={ () => { self.toggleSnake() }}> Play Snake </button>
                    <button  onClick={ () => { self.toggleSI() }}> Play Space Invaders </button>
                    <button  onClick={ () => { self.togglePong() }}> Play Pong </button>
                    { Game }
                </div>
    }
}

export default Games;
