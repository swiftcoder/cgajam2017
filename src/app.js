"use strict";

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");
const sound = require("p5/lib/addons/p5.sound")




import {Intro} from "./intro";
import {Menu} from "./menu";
import {Game} from "./game";

let intro;
let menu;
let game;
let current;
let noise;
let flt;

function main(p) {

    let game;
    let s;

    p.preload = function() {
      // s = p.loadSound('../art/funner_runner.ogg');
    }

    p.setup = function() {
        noise = new p5.Noise('brown');
        // noise.amp(0.2);
        // noise.start();
        flt = new p5.BandPass();
        // set the BandPass frequency based on mouseX
         flt.freq(1000);
         // give the flt a narrow band (lower res = wider bandpass)
         flt.res(1000);

        // s.rate(1);
        // s.loop();
        //
        // console.log(s)


        p.createCanvas(640, 480);
        p.frameRate(30);

        intro = new Intro(p, () => {current = menu;});
        menu = new Menu(p, () => {current = game;});
        game = new Game(p);

        current = intro;
    }

    p.draw = function() {
        current.draw();
    };

    p.keyPressed = function() {
        current.keyPressed();
    };
}

new p5(main);
