import React, { useRef, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import Matter from "matter-js";
import Sketch from "react-p5";
import Ball from "./Entities/Ball";
import Peg from "./Entities/Peg";
import Bucket from "./Entities/Bucket";
import {AuthContext} from "../../context/AuthContext.js";

const { Engine, Body, Bodies, Composite, Events} = Matter;

let world;
// Make PlinkoSketch a forwardRef component
const PlinkoSketch = forwardRef(({ rows = 10, betAmount = 0, risk = "medium" }, ref) => {
  const {balance, setBalance} = useContext(AuthContext);
  const engine = useRef();
  const pegs = useRef([]);
  const buckets = useRef([]);
  const balls = useRef([]);
  const removedBallBodies = useRef(new Set());
  const betAmountRef = useRef(betAmount);

  useEffect(() => {
    betAmountRef.current = betAmount;
  }, [betAmount]);

  // Expose dropBall function to parent using ref
  useImperativeHandle(ref, () => ({
    dropBall: () => {
      if (!engine.current || !engine.current.world) return;
      balls.current.push(new Ball(800 / 2, 0, 9, engine.current.world));
    },
  }));

  useEffect(() => {
    if (!engine.current || !engine.current.world) return;
    const world = engine.current.world;

    Matter.Composite.clear(world, false);
    pegs.current = [];
    buckets.current = [];
    balls.current = [];
    removedBallBodies.current.clear();

    const multipliers = getMultiplierList(rows, risk);

    const pegRadius = 6;
    const pegSpacingX = 40;
    const pegSpacingY = 40;

    for (let row = 0; row < rows; row++) {
      let count = row + 2;
      for (let i = 0; i < count; i++) {
        let x = 800 / 2 - ((count - 1) * pegSpacingX) / 2 + i * pegSpacingX;
        let y = 100 + row * pegSpacingY;
        pegs.current.push(new Peg(x, y, pegRadius, world));
      }
    }

    const bucketWidth = 36;
    const gap = 4;
    const total = Number(rows) + 4;
    const totalWidth = total * bucketWidth + (total - 1) * gap;
    const startX = (800 - totalWidth) / 2;

    for (let i = 0; i < total; i++) {
      let x = startX + i * (bucketWidth + gap) + bucketWidth / 2;
      let y = 600 - (12 - rows) * 36;
      buckets.current.push(new Bucket(x, y, bucketWidth, 36, world, multipliers[i]));
    }
  }, [rows, risk]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 700).parent(canvasParentRef);

    let width = p5.width;
    engine.current = Engine.create();
    world = engine.current.world;

    pegs.current = [];
    buckets.current = [];
    balls.current = [];
    removedBallBodies.current.clear();

    const multipliers = getMultiplierList(rows, risk);

    const pegRadius = 6;
    const pegSpacingX = 40;
    const pegSpacingY = 40;

    for (let row = 0; row < rows; row++) {
      let count = row + 2;
      for (let i = 0; i < count; i++) {
        let x = width / 2 - ((count - 1) * pegSpacingX) / 2 + i * pegSpacingX;
        let y = 100 + row * pegSpacingY;
        pegs.current.push(new Peg(x, y, pegRadius, world));
      }
    }

    const bucketWidth = 36;
    const gap = 4;
    const total = rows + 4;
    const totalWidth = total * bucketWidth + (total - 1) * gap;
    const startX = (width - totalWidth) / 2;

    for (let i = 0; i < total; i++) {
      let x = startX + i * (bucketWidth + gap) + bucketWidth / 2;
      let y = 600 - (12 - rows) * 36;
      buckets.current.push(new Bucket(x, y, bucketWidth, 36, world, multipliers[i]));
    }

    Events.on(engine.current, "collisionStart", function (event) {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (
          (bodyA.label === "Ball" && bodyB.label === "Bucket") ||
          (bodyA.label === "Bucket" && bodyB.label === "Ball")
        ) {
          const ball = bodyA.label === "Ball" ? bodyA : bodyB;
          const bucket = bodyA.label === "Bucket" ? bodyA : bodyB;

          if (removedBallBodies.current.has(ball)) return;
          removedBallBodies.current.add(ball);
          if (removedBallBodies.current.size > 100) removedBallBodies.current.clear();

          Composite.remove(world, ball);
          balls.current = balls.current.filter(b => b.body !== ball);

          const bucketInstance = buckets.current.find(b => b.body === bucket);
          if (bucketInstance) {
            bucketInstance.triggerShake();
            
            const multiplier = bucketInstance.multiplier;
            const winnings = Number(betAmountRef.current) * multiplier;
            // console.log("typeof betAmount", typeof betAmount); 
            // console.log("Number(betAmount)", Number(betAmount)); 
            // console.log("multiplier", multiplier);
            setBalance(prev => prev + winnings);
          }
        }
      });
    });

    // p5.mousePressed = () => {
    //   balls.current.push(new Ball(width / 2, 0, 9, world));
    // };
  };

  const draw = (p5) => {
    if (!engine.current || !engine.current.world) return;

    Engine.update(engine.current);
    p5.background(255);

    for (let i = 0; i < buckets.current.length; i++) {
      buckets.current[i].display(p5);
    }
    for (let i = 0; i < pegs.current.length; i++) {
      pegs.current[i].display(p5);
    }
    for (let i = 0; i < balls.current.length; i++) {
      const centerX = p5.width / 2;
      const dx = centerX - balls.current[i].body.position.x;
      Matter.Body.applyForce(balls.current[i].body, balls.current[i].body.position, {
        x: dx * 0.000001,
        y: 0,
      });
      balls.current[i].display(p5);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
});

export default PlinkoSketch;

// function to display Multipliers
export function getMultiplierList(rows, risk) {
  const table = {
    8: {
      low:    [2.5, 2, 1.5, 1.2, 1, 0.8, 0.8, 1, 1.2, 1.5, 2, 2.5],
      medium: [4, 2.5, 1.8, 1.2, 0.9, 0.6, 0.6, 0.9, 1.2, 1.8, 2.5, 4],
      high:   [8, 4, 2.5, 1.5, 0.8, 0.2, 0.2, 0.8, 1.5, 2.5, 4, 8]
    },
    10: {
      low:    [5.5, 4.5, 3.5, 2.5, 2, 1.5, 1.2, 1.2, 1.5, 2, 2.5, 3.5, 4.5, 5.5],
      medium: [8, 6, 4.5, 3.2, 2.2, 1.5, 1, 1, 1.5, 2.2, 3.2, 4.5, 6, 8],
      high:   [10, 6, 4, 2.5, 1.2, 0.3, 0.2, 0.2, 0.3, 1.2, 2.5, 4, 6, 10]
    },
    12: {
      low:    [6.5, 5.5, 4.5, 4, 3.5, 3, 2.5, 2, 2, 2.5, 3, 3.5, 4, 4.5, 5.5, 6.5],
      medium: [10, 8, 6.5, 5.2, 4, 3, 2.2, 1.5, 1.5, 2.2, 3, 4, 5.2, 6.5, 8, 10],
      high:   [15, 10, 7, 5.2, 3.2, 1.5, 0.5, 0.2, 0.2, 0.5, 1.5, 3.2, 5.2, 7, 10, 15]
    }
  };

  const safeRows = table[rows] || table[10];
  const safeRisk = safeRows[risk] || safeRows["medium"];
  return safeRisk;
}