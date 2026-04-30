import { BIRD_SIZE, GRAVITY, JUMP_FORCE, CANVAS_HEIGHT, IMG_BIRD, COLLISION_TOLERANCE, MAX_FALL_SPEED } from './config.js';

export class Bird {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 80;
    this.y = 200;
    this.velocity = 0;
    this.size = BIRD_SIZE;
    this.rotation = 0;
    this.image = new Image();
    this.image.src = IMG_BIRD;
    this.imageLoaded = false;
    this.image.onload = () => { this.imageLoaded = true; };
  }

  // 更新鸟的位置
  update() {
    this.velocity += GRAVITY;
    if (this.velocity > MAX_FALL_SPEED) this.velocity = MAX_FALL_SPEED;
    this.y += this.velocity;

    // 根据速度调整旋转角度
    this.rotation = Math.min(Math.max(this.velocity * 4, -30), 90);
  }

  // 绘制鸟
  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.imageLoaded) {
      this.ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      // 降级方案：绘制黄色小鸟
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      this.ctx.fill();

      // 绘制眼睛
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(8, -5, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(10, -5, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // 绘制嘴巴
      this.ctx.fillStyle = '#FF6B35';
      this.ctx.beginPath();
      this.ctx.moveTo(15, 0);
      this.ctx.lineTo(25, -3);
      this.ctx.lineTo(25, 3);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // 跳跃
  jump() {
    this.velocity = JUMP_FORCE;
  }

  // 重置鸟的状态
  reset() {
    this.y = 200;
    this.velocity = 0;
    this.rotation = 0;
  }

  // 碰撞检测（带容差）
  checkCollision(pipes) {
    const tolerance = COLLISION_TOLERANCE;
    for (const pipe of pipes) {
      if (
        this.x + this.size / 2 - tolerance > pipe.x &&
        this.x - this.size / 2 + tolerance < pipe.x + pipe.width
      ) {
        if (pipe.topHeight > 0 && this.y - this.size / 2 + tolerance < pipe.topHeight) {
          return true;
        }
        if (pipe.bottomY > 0 && this.y + this.size / 2 - tolerance > pipe.bottomY) {
          return true;
        }
      }
    }
    return false;
  }
}
