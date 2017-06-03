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

function Block(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

let player = new Player();
let blocks = [new Block(20, 440, 100, 10), new Block(140, 420, 100, 10)];

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
        for (var i = 0; i < blocks.length; ++i) {
            let b = blocks[i];
            p.rect(b.x, b.y, b.w, b.h);
        }

        player.move();
    }
}

new p5(game);
