
/**
 * @description 插件主入口，对外暴露常用 util 函数及 canvas-div 自定义节点 behaviors，便于外部扩展
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import utils from './utils.js';
import behaviors from './behaviors/index.js';

export default {
    ...utils,
    ...behaviors
};
