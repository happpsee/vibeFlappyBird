/*
 * @Author: userName userEmail
 * @Date: 2026-04-30 20:45:14
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-30 21:02:15
 * @FilePath: \vibeProject\js\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 图片资源导入
import imgBgCover from '../assets/images/bgc.png';
import imgBgDay from '../assets/images/bg_day.png';
import imgBgNight from '../assets/images/bg_night.png';
import imgTitle from '../assets/images/title.png';
import imgBtnPlay from '../assets/images/button_play.png';
import imgBird from '../assets/images/bird.png';
import imgPipeUp from '../assets/images/pipe_up.png';
import imgPipeDown from '../assets/images/pipe_down.png';
import imgBtnPause from '../assets/images/button_pause.png';
import imgBtnResume from '../assets/images/button_resume.png';

// 游戏配置常量
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 480;

// 图片资源路径
export const IMG_BG_COVER = imgBgCover;
export const IMG_BG_DAY = imgBgDay;
export const IMG_BG_NIGHT = imgBgNight;
export const IMG_TITLE = imgTitle;
export const IMG_BTN_PLAY = imgBtnPlay;
export const IMG_BIRD = imgBird;
export const IMG_PIPE_UP = imgPipeUp;
export const IMG_PIPE_DOWN = imgPipeDown;
export const IMG_BTN_PAUSE = imgBtnPause;
export const IMG_BTN_RESUME = imgBtnResume;

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
