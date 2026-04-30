import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE,
  IMG_BG_COVER, IMG_BG_DAY, IMG_BG_NIGHT, IMG_TITLE, IMG_BTN_PLAY,
  IMG_BTN_PAUSE, IMG_BTN_RESUME, IMG_BIRD, IMG_PIPE_UP, IMG_PIPE_DOWN,
  DAY_START_HOUR, DAY_END_HOUR
} from './config.js';
import { Bird } from './bird.js';
import { PipeManager } from './pipe.js';
import { Score } from './score.js';

// 判断当前是否为白天
const isDayTime = () => {
  const hour = new Date().getHours();
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
};

// 预加载单张图片，失败时 resolve(null) 而非 reject，保证降级
const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });

// 批量预加载
const preloadImages = async (urls) => {
  const results = await Promise.all(urls.map(loadImage));
  const failed = urls.filter((_, i) => results[i] === null);
  return { success: failed.length === 0, failed };
};

function Game() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const btnPlayRef = useRef(null);
  const hintRef = useRef(null);
  const bgCoverRef = useRef(null);
  const bgSceneRef = useRef(null);

  const [gameState, setGameState] = useState(GAME_STATE.INIT);
  const [score, setScore] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [bgFallback, setBgFallback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameRef = useRef({
    bird: null,
    pipeManager: null,
    scoreManager: null,
    animationId: null,
    currentScore: 0,
  });

  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg, duration = 2000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    setToastVisible(true);
    if (duration > 0) {
      toastTimerRef.current = setTimeout(() => setToastVisible(false), duration);
    }
  }, []);

  // 入场动画序列
  const playEnterAnimation = useCallback(() => {
    const tl = gsap.timeline();

    // 1. 背景淡入
    tl.to([bgCoverRef.current, bgSceneRef.current], {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // 2. 毛玻璃卡片从下方滑入
    tl.to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'back.out(1.4)',
    }, '-=0.5');

    // 3. 标题图从上方弹入
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    }, '-=0.4');

    // 4. 开始按钮缩放弹入
    tl.to(btnPlayRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(2)',
    }, '-=0.3');

    // 5. 提示文字淡入
    tl.to(hintRef.current, {
      opacity: 1,
      duration: 0.4,
    }, '-=0.1');
  }, []);

  // 资源加载 + 初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    gameRef.current.bird = new Bird(ctx);
    gameRef.current.pipeManager = new PipeManager(ctx);
    gameRef.current.scoreManager = new Score();

    // 初始化背景为透明，等待动画
    if (bgCoverRef.current) gsap.set(bgCoverRef.current, { opacity: 0 });
    if (bgSceneRef.current) gsap.set(bgSceneRef.current, { opacity: 0 });

    // 开始预加载
    showToast('资源加载中...', 0);

    const sceneBg = isDayTime() ? IMG_BG_DAY : IMG_BG_NIGHT;
    preloadImages([
      IMG_BG_COVER, sceneBg, IMG_TITLE, IMG_BTN_PLAY,
      IMG_BIRD, IMG_PIPE_UP, IMG_PIPE_DOWN, IMG_BTN_PAUSE, IMG_BTN_RESUME
    ]).then(({ success, failed }) => {
      if (!success) {
        setBgFallback(true);
        showToast(`部分资源加载失败，使用备用样式`, 3000);
      } else {
        showToast('加载完成！', 2000);
      }
      setAssetsLoaded(true);
    });

    return () => {
      if (gameRef.current.animationId) cancelAnimationFrame(gameRef.current.animationId);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 资源加载完成后触发入场动画
  useEffect(() => {
    if (assetsLoaded && gameState === GAME_STATE.INIT) {
      playEnterAnimation();
    }
  }, [assetsLoaded]);

  // 游戏主循环（用 ref 存 score 避免闭包陷阱）
  const gameLoopRef = useRef(null);
  gameLoopRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { bird, pipeManager, scoreManager } = gameRef.current;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    bird.update();
    pipeManager.update();

    if (bird.checkCollision(pipeManager.pipes) || bird.y > CANVAS_HEIGHT || bird.y < 0) {
      handleGameOver();
      return;
    }

    const newScore = pipeManager.checkScore(bird.x);
    console.log('Bird X:', bird.x, 'New Score:', newScore, 'Current Score:', gameRef.current.currentScore);
    if (newScore > gameRef.current.currentScore) {
      console.log('Score updated from', gameRef.current.currentScore, 'to', newScore);
      gameRef.current.currentScore = newScore;
      setScore(newScore);
    }

    pipeManager.draw();
    bird.draw();

    gameRef.current.animationId = requestAnimationFrame(() => gameLoopRef.current());
  };

  const handleStartGame = useCallback(() => {
    const card = cardRef.current;
    gsap.to(card, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'back.in(1.4)',
      onComplete: () => {
        gameRef.current.currentScore = 0;
        setScore(0);
        setIsPaused(false);
        gameRef.current.bird.reset();
        gameRef.current.pipeManager.reset();
        gameRef.current.scoreManager.reset();
        setGameState(GAME_STATE.PLAYING);
        showToast('游戏开始！', 1500);
        gameRef.current.animationId = requestAnimationFrame(() => gameLoopRef.current());
      },
    });
  }, [showToast]);

  const handleGameOver = useCallback(() => {
    if (gameRef.current.animationId) {
      cancelAnimationFrame(gameRef.current.animationId);
      gameRef.current.animationId = null;
    }
    setGameState(GAME_STATE.GAME_OVER);
  }, []);

  const handleRestart = useCallback(() => {
    const panel = document.querySelector('.game-over-panel');
    gsap.to(panel, {
      scale: 0.85,
      opacity: 0,
      duration: 0.45,
      ease: 'back.in(1.4)',
      onComplete: () => {
        gameRef.current.currentScore = 0;
        setScore(0);
        setIsPaused(false);
        gameRef.current.bird.reset();
        gameRef.current.pipeManager.reset();
        gameRef.current.scoreManager.reset();
        setGameState(GAME_STATE.PLAYING);
        showToast('重新开始！', 1500);
        gameRef.current.animationId = requestAnimationFrame(() => gameLoopRef.current());
      },
    });
  }, [showToast]);

  const handleJump = useCallback(() => {
    if (gameState === GAME_STATE.PLAYING && !isPaused) {
      gameRef.current.bird.jump();
    }
  }, [gameState, isPaused]);

  useEffect(() => {
    const handleKeyJump = () => handleJump();
    window.addEventListener('gameJump', handleKeyJump);
    return () => window.removeEventListener('gameJump', handleKeyJump);
  }, [handleJump]);

  const handlePause = useCallback(() => {
    if (gameState === GAME_STATE.PLAYING) {
      if (isPaused) {
        setIsPaused(false);
        showToast('继续游戏', 1000);
        gameRef.current.animationId = requestAnimationFrame(() => gameLoopRef.current());
      } else {
        setIsPaused(true);
        showToast('游戏已暂停', 1000);
        if (gameRef.current.animationId) {
          cancelAnimationFrame(gameRef.current.animationId);
          gameRef.current.animationId = null;
        }
      }
    }
  }, [gameState, isPaused, showToast]);

  // 游戏结束面板入场动画
  useEffect(() => {
    if (gameState === GAME_STATE.GAME_OVER) {
      const panel = document.querySelector('.game-over-panel');
      if (panel) {
        gsap.fromTo(panel,
          { scale: 0.75, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [gameState]);

  const sceneBg = isDayTime() ? IMG_BG_DAY : IMG_BG_NIGHT;

  return (
    <div className="game-wrapper">
      {/* 游戏主体：320×480，背景图层在此容器内 */}
      <div className="game-container">
        {/* 背景图层：限定在游戏主体内 */}
        <div
          ref={bgCoverRef}
          className="bg-cover"
          style={!bgFallback ? { backgroundImage: `url(${IMG_BG_COVER})` } : {}}
        />
        <div
          ref={bgSceneRef}
          className="bg-scene"
          style={!bgFallback ? { backgroundImage: `url(${sceneBg})` } : {}}
        />

        <canvas
          ref={canvasRef}
          className="game-canvas"
          onClick={handleJump}
        />

        {/* 分数和暂停按钮 */}
        {gameState === GAME_STATE.PLAYING && (
          <>
            <div className="score-display">{score}</div>
            <img
              src={isPaused ? IMG_BTN_RESUME : IMG_BTN_PAUSE}
              alt={isPaused ? '继续' : '暂停'}
              className="btn-pause"
              onClick={handlePause}
              draggable={false}
            />
            {isPaused && <div className="pause-overlay" />}
          </>
        )}

        {/* 初始界面 */}
        {gameState === GAME_STATE.INIT && (
          <div className="start-screen">
            <div ref={cardRef} className="start-screen-card">
              <img
                ref={titleRef}
                src={IMG_TITLE}
                alt="飞跃鸟"
                className="title-img"
                draggable={false}
              />

              <img
                ref={btnPlayRef}
                src={IMG_BTN_PLAY}
                alt="开始游戏"
                className="btn-play"
                onClick={handleStartGame}
                draggable={false}
              />

              <p ref={hintRef} className="hint-text">
                点击屏幕 / 按空格键控制小鸟飞行
              </p>
            </div>
          </div>
        )}

        {/* 游戏结束界面 */}
        {gameState === GAME_STATE.GAME_OVER && (
          <div className="game-over-screen">
            <div className="game-over-panel">
              <h2 className="game-over-title">游戏结束</h2>
              <div className="final-score">
                <span>本局得分</span>
                <span className="final-score-number">{score}</span>
              </div>
              <button className="btn-restart" onClick={handleRestart}>
                再来一局
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastVisible && <div className="toast">{toastMsg}</div>}
    </div>
  );
}

// 空格键跳跃支持
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    const event = new CustomEvent('gameJump');
    window.dispatchEvent(event);
  }
});

const root = createRoot(document.getElementById('root'));
root.render(<Game />);
