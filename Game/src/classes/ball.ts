const WIDTH = 700;
const HEIGHT = 450;

export class Ball {
    x: number;
    y: number;
    xdir: number;
    ydir: number;
    speed: number;
    diam: number;

    constructor(x: number, y: number, xdir: number, ydir: number, speed: number, diam: number) {
        this.x = x;
        this.y = y;
        this.xdir = xdir;
        this.ydir = ydir;
        this.speed = speed;
        // this.speedY = speed;
        this.diam = diam;
    }
}
  