"use strict";

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");
const menu = require("./menu");

console.log("Menu: ", menu);

function Player() {
    this.x = 50;
    this.y = 50;
    this.vy = 0;
    this.w = 5;
    this.h = 5;
    this.onGround = false;
}

function Block(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

let player = new Player();
let blocks = [new Block(20, 440, 100, 10), new Block(140, 420, 100, 10)];

function move() {
    player.x += 0.2;
    player.y += 4 + player.vy;
    player.vy *= 0.9;
}

function collide() {
    for (var i = 0; i < blocks.length; ++i) {
        let b = blocks[i];
        if (
            player.x >= b.x &&
            player.x <= b.x + b.w &&
            player.y >= b.y &&
            player.y <= b.y + b.h
        ) {
            player.y = b.y - player.h;
            player.onGround = true;
            return; // leave before resetting the onGround flag to false
        }
    }
    player.onGround = false;
}

function jump() {
    if (player.onGround) {
        player.vy = -25;
    }
}

function gameRunning(p) {
    return function() {
        p.background("magenta");

        p.noStroke();

        p.fill("cyan");
        p.rect(player.x, player.y, 5, 5);

        p.fill("black");
        for (var i = 0; i < blocks.length; ++i) {
            let b = blocks[i];
            p.rect(b.x, b.y, b.w, b.h);
        }

        move();
        collide();

        if (p.keyIsDown(32)) {
            // Space bar
            jump();
        }
    };
}

function game(p) {
    p.setup = function() {
        p.createCanvas(640, 480);
    };

    p.draw = menu.gameMenu(p);
}

new p5(game);
