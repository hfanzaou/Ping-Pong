import p5Types from 'p5';

export class Spark {
    x: number; y: number; xVel: number;
    pos; vel; lifespan; p5: p5Types;
    constructor(x: number, y: number, xVel: number, p5: p5Types) {
      this.x = x;
      this.y = y;
      this.xVel = xVel;
      this.p5 = p5;
      this.pos = p5.createVector(x, y);
      this.lifespan = 255;
      this.vel = p5.createVector(p5.random(0, xVel), p5.random(-xVel, xVel));
      this.vel.normalize();
      this.vel.mult(p5.random(0, 10));
    }
  
    // we just want the direction
    // then add random speed
  
    update() {
      this.vel.mult(0.95);
      this.lifespan -= 5;
      this.pos.add(this.vel);
    }
  
    done() {
      return this.lifespan < 0;
    }
  
    show() {
      if (!this.done()) {
        this.p5.noStroke();
        this.p5.fill(255, this.lifespan);
        this.p5.rect(this.pos.x, this.pos.y, this.lifespan/20, this.lifespan/20, 3);
      }
    }
  }