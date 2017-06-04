global.jQuery = require("jQuery");
const bootstrap = require("bootstrap");
const p5 = require("p5");
import { MenuItem } from "./menuItem";

const height = 480;
const width = 640;
const selectText = 96;
const blockWidth = width / 3;
const blockHeight = height / 3 - selectText / 3;
let select = 0;

export const Menu = function(p, go) {
    let menuItems = [[], [], []];

    for (var i = 0; i < 3; i++) {
        menuItems[0].push(
            new MenuItem(
                blockWidth * i,
                blockHeight * 0,
                blockWidth,
                blockHeight,
                i,
                p
            )
        );
        menuItems[1].push(
            new MenuItem(
                blockWidth * i,
                blockHeight * 1,
                blockWidth,
                blockHeight,
                i + 3,
                p
            )
        );
        menuItems[2].push(
            new MenuItem(
                blockWidth * i,
                blockHeight * 2,
                blockWidth,
                blockHeight,
                i + 6,
                p
            )
        );
    }

    let img = p.loadImage("../art/ChooseCharacterCGA2.png");

    this.draw = function() {
        p.image(img, 0, 0);
        for (let row of menuItems) {
            for (let item of row) {
                item.display();
            }
        }
    }

    this.keyPressed = function() {
        if (p.keyCode === 32) {
            go();
            return;
        }

        for (let row of menuItems) {
            for (let item of row) {
                if (item.id === select) {
                    item.highlight();
                } else {
                    item.unHighlight();
                }
            }
        }
        if (select < 8) {
            select += 1;
        } else {
            select = 0;
        }
    };
};
