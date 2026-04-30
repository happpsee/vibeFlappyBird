<!--
 * @Author: userName userEmail
 * @Date: 2026-04-30 13:41:02
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-30 19:43:28
 * @FilePath: \vibeProject\claude.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 项目名称： 飞跃鸟

## 产品愿景
 为国内喜爱游戏的玩家提供一个点击即玩的Web小游戏，特色是简单易上手，页面美规

 
## 功能需求(精简板)
- 游戏初始: 游戏的初始状态，一开始处于这个界面，提供按钮点击开始游戏
- 游戏玩法: 玩家操控目标鸟点击控制高度躲避障碍, 如果躲避一个障碍则玩家得分加1，否则目标鸟死亡游戏失败游戏结束
- 重新开始： 玩家游戏失败后可以重新开始游戏
- 换肤功能： 玩家可以选择已有的目标鸟皮肤用于更换游戏目标鸟的外观
- 游戏界面大小为320px * 480px 处于整个页面中心

## 约束
 ### 技术栈 
  - React18、GSAP、Vite
 ### 代码规范
  #### 命名约定
  - 变量、函数命名使用 camelCase: `birdY`, `uodateScore()`
  - 常量使用 UPPER_SNAKE_CASE: `GRAVITY`, `CANVAS_WINDTH`
  - CSS类名使用kebab-case: `game-canvas`, `btn-start` 
  #### 代码风格
  - 缩进统一使用2 个空格
  - 语句末尾必须加分号
  - 函数保持简短，每个函数只做一件事
  - 异步操作使用async /await
  - 注释使用中文，解释"为什么"而不是“是什么”
 ### 交互
  整个游戏必须有良好的交互效果，每个状态之前的切换都需要有过场动画，
  整个资源加载都需要使用toast提示用户
 ### 技术要求
   使用 Canvas API 渲染， 帧率60fps,RAF驱动
   计分不做持久化，仅存于内存中
 ### 目录结构
  flapp-bird/
  |--- index.html #入口页面
  |--- css/
  | |--- style.css #全局样式
  |--- js/
  | |--- main.js #游戏初始化，主循环
  | |--- bird.js #鸟的物理、绘制、控制，焕肤
  | |--- pipe.js # 障碍物（管道）的生成与移动
  | |--- score.js #记分与显示
  | |--- config.js游戏常量配置
  | |--- .... #其它js文件
  |--- assets/ #所有的图片资源
  | |--- skins/ #鸟的皮肤图片
  | |--- ....#游戏界面，其它界面需要的图片
  | |--- docs/ 
  |   |--- PRD/ #需求文档
    
## 启动方式
  - pnpm run dev启动

## 验收标准
  所有需求的验收标准的前提是浏览器控制台必须没有报错，否则必须重新修改代码