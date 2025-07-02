import Matter from "matter-js";
import {CATEGORY_BALL, CATEGORY_BUCKET, CATEGORY_PEG} from "./constants"
const { Bodies, Composite } = Matter;

class Bucket {
    constructor(x, y, w, h, world, multiplier){
        this.w = w
        this.h = h
        this.body = Bodies.rectangle(x, y, this.w, this.h, {isStatic: true, isSensor: true, collisionFilter: {
            category: CATEGORY_BUCKET,
            mask: CATEGORY_BALL
          }})
        this.body.label = "Bucket"
        this.multiplier = multiplier
        Composite.add(world, this.body)
    }

    triggerShake() {
        this.shakeTimer = 10;
    }

    display(p5){
        let offsetY = 0;
        if (this.shakeTimer > 0) {
        offsetY = Math.sin(this.shakeTimer * 0.5) * 3; // up/down motion
        this.shakeTimer--;
        }

        const pos = this.body.position;
        p5.push();
        p5.rectMode(p5.CENTER);
        p5.translate(pos.x,pos.y+ offsetY);
        p5.rect(0, 0, this.w, this.h);

        // display multiplier
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(`${this.multiplier}x`, 0, 0);
        p5.pop();
    }
}

export default Bucket;