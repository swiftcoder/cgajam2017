'use strict';

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

import {Game} from "./game";

let game;
let current;

function main(p) {

    let game;

    p.setup = function() {
        p.createCanvas(640, 480);
        p.frameRate(60);

        game = new Game(p);
        current = game;
    }

    p.draw = function() {
        current.draw();
    };

    p.keyPressed = function() {
        current.keyPressed();
    };
}

new p5(main);
