'use strict';

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

let message = "hello world!";
console.log(message);

function Player() {
    this.x = 50;
    this.y = 50;
}

function move() {
    player.x += 1;
    player.y += 1;
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

        move();
    }
}

new p5(game);
