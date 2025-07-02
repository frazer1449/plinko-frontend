import Matter from "matter-js";
import {CATEGORY_BALL, CATEGORY_BUCKET, CATEGORY_PEG} from "./constants"
const { Bodies, Composite } = Matter;

class Peg {
    constructor(x, y, r, world){
        this.r = r
        this.body = Bodies.circle(x, y, this.r, {isStatic: true, collisionFilter: {
            category: CATEGORY_PEG,
            mask: CATEGORY_BALL
          }})
        this.body.label = "Peg";
        Composite.add(world, this.body)
    }
    display(p5){
        const pos = this.body.position;
        p5.push();
        p5.translate(pos.x,pos.y)
        p5.circle(0, 0, this.r * 2)
        p5.pop();
    }
}

export default Peg;