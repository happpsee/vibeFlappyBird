/*
 * @Author: userName userEmail
 * @Date: 2026-04-30 20:45:14
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-30 21:02:15
 * @FilePath: \vibeProject\js\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 游戏配置常量
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 480;

// 图片资源路径
export const IMG_BG_COVER = '../assets/images/bgc.png';
export const IMG_BG_DAY = '../assets/images/bg_day.png';
export const IMG_BG_NIGHT = '../assets/images/bg_night.png';
export const IMG_TITLE = '../assets/images/title.png';
export const IMG_BTN_PLAY = '../assets/images/button_play.png';
export const IMG_BIRD = '../assets/images/bird.png';
export const IMG_PIPE_UP = '../assets/images/pipe_up.png';
export const IMG_PIPE_DOWN = '../assets/images/pipe_down.png';
export const IMG_BTN_PAUSE = '../assets/images/button_pause.png';
export const IMG_BTN_RESUME = '../assets/images/button_resume.png';

// 昼夜判断阈值（小时，24 小时制）
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 18;

// 物理参数
export const GRAVITY = 0.3;
export const JUMP_FORCE = -6;
export const BIRD_SIZE = 40;
export const MAX_FALL_SPEED = 8;

// 管道参数
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 80;
export const PIPE_SPEED = 3;
export const PIPE_SPAWN_INTERVAL = 1500; // 毫秒
export const PIPE_MIN_HEIGHT = 80;
export const PIPE_MAX_HEIGHT = 200;
export const COLLISION_TOLERANCE = 4;

// 游戏状态
export const GAME_STATE = {
  INIT: 'init',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver'
};
