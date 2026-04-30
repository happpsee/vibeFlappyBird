import { PIPE_WIDTH, PIPE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, PIPE_MIN_HEIGHT, PIPE_MAX_HEIGHT, IMG_PIPE_UP, IMG_PIPE_DOWN } from './config.js';

export class PipeManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.pipes = [];
    this.lastPipeTime = 0;
    this.pipeInterval = 1500;
    this.totalScored = 0;
    this.pipeUpImage = new Image();
    this.pipeUpImage.src = IMG_PIPE_UP;
    this.pipeDownImage = new Image();
    this.pipeDownImage.src = IMG_PIPE_DOWN;
    this.imagesLoaded = false;

    Promise.all([
      new Promise(resolve => { this.pipeUpImage.onload = resolve; }),
      new Promise(resolve => { this.pipeDownImage.onload = resolve; })
    ]).then(() => { this.imagesLoaded = true; });
  }

  update() {
    const currentTime = Date.now();

    if (currentTime - this.lastPipeTime > this.pipeInterval) {
      this.addPipe();
      this.lastPipeTime = currentTime;
    }

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].x -= PIPE_SPEED;

      if (this.pipes[i].x + PIPE_WIDTH < 0) {
        this.pipes.splice(i, 1);
      }
    }
  }

  addPipe() {
    const rand = Math.random();
    let pipeConfig;

    if (rand < 0.3) {
      // 仅下段：高度 120-200px
      const bottomHeight = Math.random() * (200 - 120) + 120;
      pipeConfig = {
        x: CANVAS_WIDTH + 10,
        topHeight: 0,
        bottomY: CANVAS_HEIGHT - bottomHeight,
        bottomHeight: bottomHeight,
        width: PIPE_WIDTH,
        scored: false,
        type: 'bottom'
      };
    } else if (rand < 0.6) {
      // 仅上段：高度 120-200px
      const topHeight = Math.random() * (200 - 120) + 120;
      pipeConfig = {
        x: CANVAS_WIDTH + 10,
        topHeight: topHeight,
        bottomY: 0,
        bottomHeight: 0,
        width: PIPE_WIDTH,
        scored: false,
        type: 'top'
      };
    } else {
      // 上下同时：高度 80-180px，确保间隙 ≥80px
      let topHeight, bottomHeight, gap;
      do {
        topHeight = Math.random() * (180 - 80) + 80;
        bottomHeight = Math.random() * (180 - 80) + 80;
        gap = CANVAS_HEIGHT - topHeight - bottomHeight;
      } while (gap < 80);

      pipeConfig = {
        x: CANVAS_WIDTH + 10,
        topHeight: topHeight,
        bottomY: CANVAS_HEIGHT - bottomHeight,
        bottomHeight: bottomHeight,
        width: PIPE_WIDTH,
        scored: false,
        type: 'both'
      };
    }

    this.pipes.push(pipeConfig);
  }

  draw() {
    for (const pipe of this.pipes) {
      if (this.imagesLoaded) {
        if (pipe.topHeight > 0) {
          this.ctx.drawImage(this.pipeDownImage, pipe.x, 0, pipe.width, pipe.topHeight);
        }
        if (pipe.bottomHeight > 0) {
          this.ctx.drawImage(this.pipeUpImage, pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        }
      } else {
        // 降级方案
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.strokeStyle = '#2E7D32';
        this.ctx.lineWidth = 3;

        if (pipe.topHeight > 0) {
          this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
          this.ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        }
        if (pipe.bottomHeight > 0) {
          this.ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
          this.ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        }
      }
    }
  }

  checkScore(birdX) {
    let newlyScored = 0;
    for (const pipe of this.pipes) {
      if (!pipe.scored && pipe.x + pipe.width < birdX) {
        console.log('Pipe passed! Pipe X:', pipe.x, 'Bird X:', birdX, 'Current totalScored:', this.totalScored);
        pipe.scored = true;
        this.totalScored++;
        newlyScored++;
        console.log('After increment, totalScored:', this.totalScored);
      }
    }
    console.log('Total pipes:', this.pipes.length, 'Total scored counter:', this.totalScored, 'Newly scored this frame:', newlyScored);
    return this.totalScored;
  }

  reset() {
    this.pipes = [];
    this.totalScored = 0;
    this.lastPipeTime = Date.now();
  }
}
