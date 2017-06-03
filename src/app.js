'use strict';

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

function Player() {
    this.x = 50;
    this.y = 50;

    this.move = function() {
        player.x += 1;
        player.y += 1;
    }
}

let player = new Player();

function game(p) {

    p.setup = function() {
        p.createCanvas(640, 480);
    }

    p.draw = function() {
        p.background('magenta');

        p.noStroke();

        p.fill('cyan');
        p.rect(player.x, player.y, 5, 5);

        p.fill('black');
        p.rect(20, 440, 100, 10);

        player.move();
    }
}

new p5(game);
