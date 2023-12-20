
export class Ball {
    x: number;
    y: number;
    xdir: number;
    ydir: number;
    speed: number;

    constructor(x: number, y: number, xdir: number, ydir: number, speed: number) {
        this.x = x;
        this.y = y;
        this.xdir = xdir;
        this.ydir = ydir;
        this.speed = speed;
    }

    updatePosition() {
        // const elapsedSeconds = elapsedTime / 1000;
        this.x += (this.xdir * this.speed);
        this.y += (this.ydir * this.speed);
    }
}
