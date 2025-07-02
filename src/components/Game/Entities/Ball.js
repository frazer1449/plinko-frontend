import Matter from "matter-js";
import {CATEGORY_BALL, CATEGORY_BUCKET, CATEGORY_PEG} from "./constants"
const { Bodies, Body, Composite } = Matter;

class Ball{
    constructor(x, y, r, world){
        this.r = r
        this.body = Bodies.circle(x, y, this.r, {restitution: 0.15,friction: 0,
            collisionFilter: {
                category: CATEGORY_BALL,
                mask: CATEGORY_PEG | CATEGORY_BUCKET
              }
        })
        Body.setAngularVelocity(this.body, Math.random(-0.02, 0.02));
        this.body.label = "Ball";
        Composite.add(world, this.body)
    }
    display(p5) {
        const pos = this.body.position;
        p5.push();
        p5.translate(pos.x, pos.y);
        p5.fill(100, 150, 255);
        p5.noStroke();
        p5.circle(0, 0, this.r * 2);
        p5.pop();
      }
}

export default Ball;