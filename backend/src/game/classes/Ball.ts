import { WIDTH, HEIGHT } from './constants';

export class Ball {
    x: number;
    y: number;
    xdir: number;
    ydir: number;
    speed: number;
    radius : number;
    type: string;
    
    constructor(speed: number, size: number, type: string) {
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
        this.xdir = 1;
        this.ydir = 0;
        this.speed = speed;
        this.radius = size;
        this.type = type;
    }

    updatePosition() {
        this.x += (this.xdir * this.speed);
        this.y += (this.ydir * this.speed);
    }

    reset(ballSpeed: number) {
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
        this.xdir = this.xdir * -1;
        this.ydir = 0;
        this.speed = ballSpeed;
      }
}
