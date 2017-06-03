'use strict';

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

const startX = 150;
const startY = 50;

function Player() {
    this.x = startX;
    this.y = startY;
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
let trail = [];
let spaceBarDown = -10000;
let tick = 0;

/* Returns true if two blocks collide, false otherwise */
function collideBlocks(a, b) {
    return (a.x+a.w >= b.x && a.x <= b.x+b.w &&
            a.y+a.h >= b.y && a.y <= b.y+b.h);
}

function jump() {
    if ((tick - spaceBarDown) < 250 && player.onGround) {
        player.vy = -25;
        spaceBarDown = false;
        console.log('player_jumped: ' + tick);
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
            if (!player.onGround) {
                console.log('player_landed: ' + tick);
            }
            player.y = b.y - player.h;
            player.onGround = true;
            return; // leave before resetting the onGround flag to false
        }
    }
    player.onGround = false;
}

function resetOnDeath() {
    if (player.y > screenArea.y + screenArea.h) {
        player.x = startX;
        player.y = startY;
        blocks = [];
        trail = [];
        console.log('player_dead: ' + tick);
    }
}

function randomRange(lo, hi) {
    return lo + Math.random()*(hi - lo);
}

function randomIntRange(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function updateBlocks() {
    let screen = screenArea.offset(player.x - startX, 0);

    // remove blocks which are entirely outside the screen
    for (var i = blocks.length-1; i >= 0; --i) {
        let b = blocks[i];
        if (!collideBlocks(screen, b)) {
            blocks.splice(i, 1);
        }
    }

    // make sure we have at least 10 blocks
    while (blocks.length < 10) {
        let x = startX - 100;
        let y = startY + 50;
        if (blocks.length > 0) {
            let b = blocks[blocks.length-1];
            x = b.x + b.w;
            y = b.y;
        }

        let w = randomIntRange(0, 3);
        if (w < 1 && y > screenArea.y + 150) { // step up
            x += randomRange(10, 20);
            y += randomRange(-60, -40);
        } else if (w < 2 && y < screenArea.y + screenArea.h - 150) { // drop down
            x += randomRange(90, 130);
            y += randomRange(40, 60);
        } else { // flat
            x += randomRange(80, 120);
        }

        blocks.push(new Block(x, y, randomRange(125, 250), 10));
    }
}

function doTrail() {
    trail.push(new Block(player.x, player.y, 1, 1));

    // remove old particles
    if (trail.length > 100) {
        trail = trail.splice(trail.length - 100, 100);
    }
}

function game(p) {

    p.setup = function() {
        p.createCanvas(640, 480);
        p.frameRate(30);
    }

    p.draw = function() {
        tick = p.millis();

        p.background('magenta');
        p.noStroke();

        jump();
        move();
        collide();
        resetOnDeath();

        updateBlocks();
        doTrail();

        // move everything backwards by the amount the player has moved forwards
        p.translate(-player.x + startX, 0);

        p.fill('cyan');
        p.rect(player.x, player.y, 5, 5);

        p.fill('black');
        for (var i = 0; i < blocks.length; ++i) {
            let b = blocks[i];
            p.rect(b.x, b.y, b.w, b.h);
        }

        p.fill('white');
        for (var i = 0; i < trail.length; ++i) {
            let b = trail[i];
            p.rect(b.x, b.y, b.w, b.h);
        }
    };

    p.keyPressed = function() {
        if (p.keyCode == 32) { // spacebar
            spaceBarDown = p.millis();
        }
    };
}

new p5(game);
