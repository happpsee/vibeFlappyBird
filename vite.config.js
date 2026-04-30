/*
 * @Author: userName userEmail
 * @Date: 2026-04-30 13:47:30
 * @LastEditors: userName userEmail
 * @LastEditTime: 2026-04-30 20:55:44
 * @FilePath: \vibeProject\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base:"./",
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
