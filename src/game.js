'use strict';

const startX = 150;
const startY = 150;
const bmp = 130
const speed = 1.5;
let gravity = 1.0;
const jumpVelocity = -17;

function Player() {
    this.x = startX;
    this.y = startY;
    this.w = 5;
    this.h = 5;
    this.vy = 0;
    this.onGround = -10000;
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

function Generator(bpm, beats_per_bar, beats_per_note) {
    let beats_per_minute = bpm * beats_per_bar / beats_per_note;
    this.frames_per_beat = 30 * 60 / beats_per_minute;
    this.measure_length = beats_per_bar
    console.log("frames per beat: " + this.frames_per_beat + " measure length: " + this.measure_length);

    this.beatLength = function() {
        return this.frames_per_beat * speed;
    }
}

let background;
let screenArea = new Block(0, 0, 640, 480);
let player = new Player();
let blocks = [];
let trail = [];
let spaceBarDown = -10000;
let tick = 0;

let generator = new Generator(bmp, 3, 8);

/* Returns true if two blocks collide, false otherwise */
function collideBlocks(a, b) {
    return (a.x+a.w >= b.x && a.x <= b.x+b.w &&
            a.y+a.h >= b.y && a.y <= b.y+b.h);
}

function onGround() {
    return (tick - player.onGround) < 50;
}

function gravityInverter(){
  gravity = -1 * gravity
}

function jump() {
    if ((tick - spaceBarDown) < 250 && onGround()) {
        if (gravity < 0){
            player.vy = - 2 * jumpVelocity;
        }
        else{
            player.vy = 1.3 * jumpVelocity;
        }
        spaceBarDown = -10000;
        console.log('player_jumped: ' + tick);
    }
    else {
      if ((tick - spaceBarDown) < 250) {
        player.vy = jumpVelocity / 2;
        spaceBarDown = -10000;
        console.log('player_jumped: ' + tick);
      }
    }
}

function move() {
    player.x += speed;
    if (!onGround() || player.vy < 0) {
        player.vy += gravity;
        player.y += player.vy;
        if (player.x % bmp == 0) {
          gravity = gravity * (2 * randomRange(-1, 1))
          console.log(tick, gravity)
        }
        if (player.x % 64 == 0) {
          gravity = 1
        }
    }

    player.vy *= 0.6;
}

function collide() {
    for (let i = 0; i < blocks.length; ++i) {
        let b = blocks[i];
        if (collideBlocks(player, b)) {
            if (!onGround()) {
                console.log('player_landed: ' + tick);
            }
            player.vy = 0;
            player.y = b.y - player.h;
            player.onGround = tick;
            break;
        }
    }
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

function randomChoice(a) {
    return a[Math.floor(Math.random()*a.length)];
}

let lastW = 0;
let prevW = 0;

function updateBlocks() {
    let screen = screenArea.offset(player.x - startX, 0);

    // remove blocks which are entirely outside the screen
    for (let i = blocks.length-1; i >= 0; --i) {
        let b = blocks[i];
        if (!collideBlocks(screen, b)) {
            blocks.splice(i, 1);
        }
    }

    // make sure we have at least 10 blocks
    while (blocks.length < 10) {
        let x = startX - 150;
        let y = 240;
        if (blocks.length > 0) {
            let b = blocks[blocks.length-1];
            x = b.x + b.w;
            y = b.y;
        }

        let w = 0;
        if (lastW == -1) {
            w = (prevW != 0) ? 1 : 0;
        } else if (lastW == 1 && prevW != 0) {
            w = (prevW != 0) ? -1 : 0;
        } else if (lastW == 0) {
            w = randomChoice([-1, 1]);
        }
        prevW = lastW;
        lastW = w;

        console.log("w," , w, "lastW", lastW)

        if (w == 1) { // step up
            for (let i = 0; i < generator.measure_length; ++i) {
                let gap = generator.beatLength()/4;
                blocks.push(new Block(x+gap, y, generator.beatLength() - gap, 10));
                x += generator.beatLength();
                y -= 50;
            }
        } else if (w == -1) { // drop down
            for (let i = 0; i < generator.measure_length; ++i) {
                let gap = generator.beatLength()/2;
                console.log("gap")
                blocks.push(new Block(x+gap, y, generator.beatLength() - gap, 10));
                x += generator.beatLength();
                y += 50;
            }
        } else if (w == 0) { // flat
            for (let i = 0; i < generator.measure_length; ++i) {
                let gap = generator.beatLength()/2;
                blocks.push(new Block(x+gap, y, generator.beatLength() - gap, 10));
                x += generator.beatLength();
            }
        }


    }
}

function doTrail() {
    trail.push(new Block(player.x, player.y, 1, 1));

    // remove old particles
    if (trail.length > 200) {
        trail = trail.splice(trail.length - 100, 100);
    }
}

function simulate() {
    jump();
    move();
    collide();
    resetOnDeath();

    updateBlocks();
    doTrail();
}

export const Game = function(p) {
    // p.loadSound('../art/funner_runner.ogg')
    // p.start()

    console.log(p)


    background = p.loadImage("art/backgroundCGA2.png");

    this.draw = function() {
        tick = p.millis();

        p.background('#55ffff');
        p.image(background, Math.floor(-player.x/2 % (background.width / 2)), 0);
        p.stroke('#ffffff');
        p.strokeWeight(1);

        p.textSize(32);
        p.text(gravity, 10, 30);
        p.fill(0, 102, 153);

        simulate();

        // move everything backwards by the amount the player has moved forwards
        p.translate(-player.x + startX, 0);

        p.fill('#ff55ff');
        p.rect(player.x, player.y, 5, 5);

        p.fill('#000000');
        for (let i = 0; i < blocks.length; ++i) {
            let b = blocks[i];
            p.rect(b.x, b.y, b.w, b.h);
        }

        p.fill('#aaaaaa');
        for (let i = 0; i < trail.length; ++i) {
            let b = trail[i];
            p.rect(b.x, b.y, b.w, b.h);
        }
    };

    this.keyPressed = function() {
        if (p.keyCode == 32) { // spacebar
            spaceBarDown = p.millis();
        }
        if (p.keyCode == 93) {
          gravityInverter()
        }
    };
}
