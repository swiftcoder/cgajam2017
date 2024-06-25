"use strict";

global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");
const sound = require("p5/lib/addons/p5.sound")




import { Intro } from "./intro";
import { Menu } from "./menu";
import { Game } from "./game";

const JUMP_SOUNDS = [
    "../art/JUMP_01.wav",
    "../art/JUMP_02.wav"
];

const LAND_SOUNDS = [
    "../art/LAND_01.wav",
    "../art/LAND_02.wav"
];

const DEATH_SOUNDS = [
    "../art/JacksonDeath.wav",
    "../art/DEATH_01.wav",
    "../art/DEATH_02.wav"
];

const CHARACTERS = [
    "JEM",
    "MJ",
    "ALF",
    "Optimus",
    "Drake",
    "Madonna",
    "Ashton",
    "??", // no idea who this gal is
    "Borat"
]

let intro;
let menu;
let game;
let current;
let noise;
let flt;

let jumpSounds = [];
let landSounds = [];
let deathSounds = [];

let characterSounds = {};
let characterSelection = "";

function main(p) {

    let game;
    let music;

    p.preload = function () {
        music = p.loadSound('../art/funner_runner.ogg');

        // load jumps
        JUMP_SOUNDS.forEach(function (path) {
            let sound = p.loadSound(path);
            jumpSounds.push(sound);
        });

        // load lands
        LAND_SOUNDS.forEach(function (path) {
            let sound = p.loadSound(path);
            landSounds.push(sound);
        });

        // load deaths
        DEATH_SOUNDS.forEach(function (path) {
            let sound = p.loadSound(path);
            deathSounds.push(sound);
        });
    }

    p.setup = function () {
        noise = new p5.Noise('brown');
        noise.amp(0.2);
        noise.start();
        flt = new p5.BandPass();
        // set the BandPass frequency based on mouseX
        flt.freq(1000);
        // give the flt a narrow band (lower res = wider bandpass)
        flt.res(1000);

        music.rate(1);
        music.loop();

        console.log(music)

        p.createCanvas(640, 480);
        p.frameRate(60);

        intro = new Intro(p, () => { current = menu; });
        menu = new Menu(p, (characterSelectionIndex) => {
            current = game;
            characterSelection = CHARACTERS[characterSelectionIndex];

            if (characterSelection === "MJ") {
                characterSounds.jump = jumpSounds[0];
                characterSounds.land = jumpSounds[1];
                characterSounds.death = deathSounds[0]; // lol
            } else {
                characterSounds.jump = jumpSounds[1];
                characterSounds.land = landSounds[0];
                characterSounds.death = deathSounds[1];
            }

            if (characterSelection === "Drake") {
                characterSounds.death = deathSounds[2]; // laugh at Drake
            }
        });
        game = new Game(p, characterSounds);

        current = intro;
    }

    p.draw = function () {
        current.draw();
    };

    p.keyPressed = function () {
        current.keyPressed();
    };
}

new p5(main);
