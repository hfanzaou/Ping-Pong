import p5Types from 'p5';
import { WIDTH, HEIGHT } from './constants';

export class LightningForge {
    x: number;
    y: number;
    lifespan: number;
    history: {x: number, y: number}[];
   
    constructor() {
      this.x = WIDTH/2;
      this.y = HEIGHT/2;
      this.lifespan = 355;
      this.history = [];
    }
    resetLightningForge () {
      this.x = WIDTH/2;
      this.y = HEIGHT/2;
      this.lifespan = 355;
      this.history = [];
    }
    
    forgeIsFormed() {
      return this.lifespan < 0;
    }
    
    update(p5: p5Types) {
      this.lifespan -= 5;
      
      for (var i = 0; i < this.history.length; i++) {
        this.history[i].x += p5.random(-2, 2);
        this.history[i].y += p5.random(-5, 5);
      }
  
      var v = p5.createVector(this.x, this.y);
      this.history.push(v); 
      if (this.history.length > 100) {
        this.history.splice(0, 1);
      }
    }
    
    show(p5: p5Types) {
      p5.push();
      p5.stroke(255);
      p5.strokeWeight(4);
      //p5.line(WIDTH/2, 0, WIDTH/2, HEIGHT);
      p5.noFill();
      p5.beginShape();
      for (var i = 0; i < this.history.length; i++) {
        var pos = this.history[i];
        p5.vertex(pos.x, pos.y);
      }
      p5.endShape(p5.CLOSE);
      p5.pop();
    }
  }
  