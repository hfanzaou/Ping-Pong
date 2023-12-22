
export class Ball {
    x: number;
    y: number;
    xdir: number;
    ydir: number;
    speed: number;
    // private lastUpdateTime: number;

    constructor(x: number, y: number, xdir: number, ydir: number, speed: number) {
        this.x = x;
        this.y = y;
        this.xdir = xdir;
        this.ydir = ydir;
        this.speed = speed;
        // this.lastUpdateTime = 0;
    }

    updatePosition() {
        // const now = Date.now();
        // if (this.lastUpdateTime === 0) this.lastUpdateTime = now;
        // const deltaTime = (now - this.lastUpdateTime) / 1000;
    
        this.x += (this.xdir * this.speed);
        this.y += (this.ydir * this.speed);
        // this.lastUpdateTime = now;
    }
}
