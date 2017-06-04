'use strict';

export const Intro = function(p, go) {

    let frame1 = p.loadImage("art/mainscreenCGA2-1.png");
    let frame2 = p.loadImage("art/mainscreenCGA2-2.png");

    let frame = frame1;

    let count = 0;

    this.draw = function() {
        p.image(frame, 0, 0);

        if (++count > 120) {
            count = 0;
            frame = (frame === frame1) ? frame2 : frame1;
        }
    };

    this.keyPressed = function() {
        go();
    };

}
