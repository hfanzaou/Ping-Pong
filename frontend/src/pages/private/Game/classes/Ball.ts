import p5Types from "p5";
import { goalScored } from "../components/gameLogic";
import { BALL_DIAMETER, WIDTH, HEIGHT } from "./constants";

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
    
    constructor(p5:p5Types, speed: number, size: number, type: string) {
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
        this.xdir = 1;
        this.ydir = 0;
        this.speed = speed;
        this.radius = size;
        this.type = type;
        this.vel = p5.createVector(this.xdir, this.ydir);
        this.yoff = p5.random(1000);
    }
    
    updatePosition() {
        this.x += (this.xdir * this.speed);
        this.y += (this.ydir * this.speed);
        this.vel.x = (this.xdir * this.speed);
        this.vel.y = (this.ydir * this.speed);
    }
    reset(p5: p5Types) {
      this.x = WIDTH/2;
      this.y = HEIGHT/2;
      this.xdir = this.xdir * -1;
      this.ydir = p5.random(-1, 1);
      this.vel.x = this.xdir * this.speed;
      this.vel.y = this.ydir * this.speed;
    }

    inDangerZone() {
        return (this.x < 200 || this.x > WIDTH - 200);
    }
    
    show (p: p5Types) {
        if (!goalScored) {
            p.noStroke();
            p.fill(255);
            var danger = this.inDangerZone();
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
}
