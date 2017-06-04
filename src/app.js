"use strict";

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");

import {Menu} from "./menu";
import {Game} from "./game";

let menu;
let game;
let current;

function main(p) {

    let game;

    p.setup = function() {
        p.createCanvas(640, 480);
        p.frameRate(60);

        menu = new Menu(p, () => {current = game;});
        game = new Game(p);

        current = menu;
    }

    p.draw = function() {
        current.draw();
    };

    p.keyPressed = function() {
        current.keyPressed();
    };
}

new p5(main);
