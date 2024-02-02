import p5Types from "p5";
import { goalScored } from "../components/gameLogic";
import { BALL_DIAMETER, WIDTH, HEIGHT } from "./constants";
import { gameConfig } from "./gameConfig";

export class Ball {
    x: number;
    y: number;
    xdir: number;
    ydir: number;
    speed: number;
    radius : number;
    type: string;
    yoff: number;
    vel: p5Types.Vector;
    
    constructor(p5:p5Types, config: gameConfig) {
      this.x = (WIDTH/2) * (config.canvasWidth / WIDTH);
      this.y = (HEIGHT/2) * (config.canvasHeight / HEIGHT);
      this.xdir = 1;
      this.ydir = 0;
      this.speed = config.ballSpeed * (config.canvasWidth / WIDTH); // Adjust speed based on resolution
      this.radius = config.ballSize * (config.canvasWidth / WIDTH); // Adjust size based on resolution
      this.type = config.ballType;
      this.vel = p5.createVector(this.xdir, this.ydir);
      this.yoff = p5.random(1000);
    }
  
    updatePosition(canvasWidth: number, canvasHeight: number) {
      this.x += (this.xdir * this.speed) * (canvasWidth / WIDTH);
      this.y += (this.ydir * this.speed) * (canvasHeight / HEIGHT);
      this.vel.x = (this.xdir * this.speed) * (canvasWidth / WIDTH);
      this.vel.y = (this.ydir * this.speed) * (canvasHeight / HEIGHT);
    }

    reset(p5: p5Types, config: gameConfig) {
      this.x = (WIDTH/2) * (config.canvasWidth / WIDTH);
      this.y = (HEIGHT/2) * (config.canvasHeight / HEIGHT);
      this.xdir = this.xdir * -1;
      this.ydir = 0;
      this.speed = config.ballSpeed * (config.canvasWidth / WIDTH); // Adjust speed based on resolution
      this.vel.x = this.xdir * this.speed * (config.canvasWidth / WIDTH);
      this.vel.y = this.ydir * this.speed * (config.canvasHeight / HEIGHT);
    }

    inDangerZone(canvasWidth: number) {
        return (this.x < 200 * (canvasWidth / WIDTH) || this.x > canvasWidth - 200 * (canvasWidth / WIDTH));
    }
    
    show (p: p5Types, canvasWidth: number) {
        if (!goalScored) {
          if (this.type === "circle") {
            p.fill(255);
            p.ellipse(this.x, this.y, this.radius, this.radius);
          }
          else if (this.type === "ghost") {
            this.ghostBall(p, canvasWidth, HEIGHT);
          }
          else if (this.type === "square") {
            p.fill(255);
            p.rect(this.x, this.y, this.radius, this.radius);
          }
      } 
    }

    resize(config: gameConfig) {
      this.x = this.x * (config.canvasWidth / WIDTH);
      this.y = this.y * (config.canvasHeight / HEIGHT);
      this.speed = this.speed * (config.canvasWidth / WIDTH);
      this.radius = config.ballSize * (config.canvasWidth / WIDTH);
      this.vel.x = this.vel.x * (config.canvasWidth / WIDTH);
      this.vel.y = this.vel.y * (config.canvasHeight / HEIGHT);
    }

    ghostBall(p: p5Types, canvasWidth: number, canvasHeight: number) {
      p.noStroke();
      p.fill(255);
      var danger = this.inDangerZone(canvasWidth);
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.vel.heading() - 80);
      p.beginShape();
      var xoff = 0;
      for (var a = 0; a < p.TWO_PI; a += 0.1) {
        var offset;
        if (a > p.PI/6 && a < 5 * p.PI/6) {
          offset = p.map(p.noise(xoff, this.yoff), 0, 1, -0.31 * this.radius, 0.78 * this.radius);
        } else {
          offset = p.map(p.noise(xoff, this.yoff), 0, 1, -0.08 * this.radius, 0.08 * this.radius);
        }
        var r = this.radius + offset;
        var x = r * p.cos(a);
        var y = r * p.sin(a);
        p.vertex(x, y);
        xoff += 0.1;
      }
      p.endShape(p.CLOSE);
  
      this.yoff += 0.08;
  
      var eyeOffset = 0.23 * this.radius;
  
      p.stroke(54);
      p.fill(54);
      if (danger) {
        p.textSize(0.7 * this.radius);
        p.text(">", -eyeOffset * 2, 0);
        p.text("<", eyeOffset/2, 0);
      } else {
        p.ellipse(-eyeOffset, -eyeOffset, 0.26 * this.radius, 0.5 * this.radius);
        p.ellipse(eyeOffset, -eyeOffset, 0.26 * this.radius, 0.5 * this.radius);
      }
      p.pop();
    }
}
