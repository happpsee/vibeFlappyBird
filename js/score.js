export class Score {
  constructor() {
    this.currentScore = 0;
    this.bestScore = this.loadBestScore();
  }

  // 增加分数
  addScore() {
    this.currentScore++;
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      this.saveBestScore();
    }
  }

  // 获取当前分数
  getCurrentScore() {
    return this.currentScore;
  }

  // 获取最高分
  getBestScore() {
    return this.bestScore;
  }

  // 重置当前分数
  reset() {
    this.currentScore = 0;
  }

  // 保存最高分到 localStorage
  saveBestScore() {
    try {
      localStorage.setItem('flappyBirdBestScore', this.bestScore.toString());
    } catch (e) {
      console.warn('无法保存最高分:', e);
    }
  }

  // 从 localStorage 加载最高分
  loadBestScore() {
    try {
      const saved = localStorage.getItem('flappyBirdBestScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      console.warn('无法加载最高分:', e);
      return 0;
    }
  }
}
