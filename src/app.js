'use strict';

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

function Player() {
    this.x = 50;
    this.y = 50;
    this.w = 5;
    this.h = 5;
    this.vy = 0;
    this.onGround = false;
}

function Block(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    /* move this box by the specified distance */
    this.offset = function(x, y) {
        return new Block(this.x+x, this.y+y, this.w, this.h);
    }
}

let screenArea = new Block(0, 0, 640, 480);
let player = new Player();
let blocks = [];
let spaceBarDown = false;

/* Returns true if two blocks collide, false otherwise */
function collideBlocks(a, b) {
    return (a.x+a.w >= b.x && a.x <= b.x+b.w &&
            a.y+a.h >= b.y && a.y <= b.y+b.h);
}

function jump() {
    if (spaceBarDown && player.onGround) {
        player.vy = -25;
        spaceBarDown = false;
    }
}

function move() {
    player.x += 6.0;
    player.y += 10 + player.vy;
    player.vy *= 0.9;
}

function collide() {
    for (var i = 0; i < blocks.length; ++i) {
        let b = blocks[i];
        if (collideBlocks(player, b)) {
            player.y = b.y - player.h;
            player.onGround = true;
            return; // leave before resetting the onGround flag to false
        }
    }
    player.onGround = false;
}

function resetOnDeath() {
    if (player.y > screenArea.y + screenArea.h) {
        player.x = 50;
        player.y = 50;
        blocks = [];
    }
}

function randomRange(lo, hi) {
    return lo + Math.random()*(hi - lo);
}

function updateBlocks() {
    let screen = screenArea.offset(player.x - 50, 0);

    // remove blocks which are entirely outside the screen
    for (var i = blocks.length-1; i >= 0; --i) {
        let b = blocks[i];
        if (!collideBlocks(screen, b)) {
            blocks.splice(i, 1);
        }
    }

    // make sure we have at least 10 blocks
    while (blocks.length < 10) {
        // always start 20 units after the last block
        let x = 20;
        let y = 240;
        if (blocks.length > 0) {
            let b = blocks[blocks.length-1];
            x = b.x + b.w;
            y = b.y;
        }

        x += randomRange(10, 30);
        y += randomRange(-30, 60);
        blocks.push(new Block(x, y, randomRange(100, 300), 10));
    }
}

function game(p) {

    p.setup = function() {
        p.createCanvas(640, 480);
        p.frameRate(30);
    }

    p.draw = function() {
        p.background('magenta');
        p.noStroke();

        jump();
        move();
        collide();
        resetOnDeath();

        updateBlocks();

        // move everything backwards by the amount the player has moved forwards
        p.translate(-player.x + 50, 0);

        p.fill('cyan');
        p.rect(player.x, player.y, 5, 5);

        p.fill('black');
        for (var i = 0; i < blocks.length; ++i) {
            let b = blocks[i];
            p.rect(b.x, b.y, b.w, b.h);
        }
    };

    p.keyPressed = function() {
        if (p.keyCode == 32) { // spacebar
            spaceBarDown = true;
        }
    };
}

new p5(game);
