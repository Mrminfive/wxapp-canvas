
/**
 * @description cancas节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { promisify, asyncEach } from '../../utils.js';
import behaviors from '../../behaviors/index.js';

Component({
    externalClasses: ['class-name'],

    behaviors: [
        behaviors.wxappCanvasBehavior
    ],

    relations: {
        'element': {
            type: 'descendant',
            target: behaviors.element,
            linked(target) {
                this._elements.push(target);
            },
            unlinked(target) {
                this._elements = this._elements.filter(element => element.__wxExparserNodeId__ !== target.__wxExparserNodeId__);
            }
        }
    },

    properties: {
        preload: {
            type: Boolean,
            value: true
        }
    },

    data: {
        name: 'wxapp-canvas',
        width: null,
        height: null
    },

    created() {
        this._ctx = null;
        this._elements = [];
        this._canvasRect = null;
        this._resources = {};
        this._systemInfo = wx.getSystemInfoSync();
    },

    attached() {
        this.triggerEvent('ref', this);
    },

    ready() {
        this._initCanvas();
    },

    methods: {
        /**
         * 获取 canvas 大小
         *
         * @param {Boolean} refresh 是否更新 canvas 大小
         * @return {Promise}
         * @api private
         */
        _getCanvasRect(refresh) {
            return !refresh && this._canvasRect
                ? Promise.resolve({ ...this._canvasRect })
                : new Promise(resolve => {
                    let query = wx.createSelectorQuery().in(this);

                    query
                        .select('#wxapp-canvas-view')
                        .boundingClientRect(res => {
                            this._canvasRect = res;
                            this.setData({
                                width: res.width,
                                height: res.height
                            }, resolve);
                        })
                        .exec();
                });
        },

        /**
         * 初始化 canvas
         *
         * @return {Promise}
         * @api private
         */
        async _initCanvas() {
            this._ctx = wx.createCanvasContext('wxapp-canvas', this);
            this._aidCtx = wx.createCanvasContext('wxapp-aid-canvas', this);
            await this._getCanvasRect(true);
            this.data.preload && await this.preload();
        },

        /**
         * 预加载资源
         *
         * @return {Promise}
         * @api public
         */
        async preload() {
            await this._getCanvasRect();
            await Promise.all(
                this._elements
                    .filter(element => element.preload)
                    .map(element => element.preload(
                        { ...this._canvasRect },
                        {
                            adaptationText: this.adaptationText.bind(this),
                            measureText: this.measureText.bind(this)
                        }
                    ))
            );
        },

        /**
         * 绘制面板
         *
         * @return {Promise}
         * @api public
         */
        async draw() {
            const drawCanvas = reserve => new Promise(resolve => this._ctx.draw(reserve, resolve));

            await asyncEach(this._elements, async element => {
                element.preload && await element.preload(
                    { ...this._canvasRect },
                    {
                        adaptationText: this.adaptationText.bind(this),
                        measureText: this.measureText.bind(this)
                    }
                );
            });

            const elements = this._elements.sort((first, next) => first._style.zIndex - next._style.zIndex);
            // const drawAidCanvas = reserve => new Promise(resolve => this._aidCtx.draw(reserve, resolve));

            // 擦除面板
            await drawCanvas();

            await asyncEach(elements, async element => {
                // TODE: 暂时找不到方法实现透明背景
                this._ctx.save();
                element.render(this._ctx, { ...this._canvasRect });
                this._ctx.restore();
                await drawCanvas(true);
                // hack处理安卓端绘制错乱bug
                ~this._systemInfo.system.indexOf('Android') && await new Promise(res => setTimeout(res, 50));

                // TODE: hack 方法，但会产生毛边
                // let { width: w, height: h } = this._canvasRect;
                // let { width, height, startX, startY } = element._style;
                // this._aidCtx.save();
                // this._aidCtx.clearRect(0, 0, w, h);
                // element.render(this._aidCtx, { ...this._canvasRect });
                // await drawAidCanvas(false);
                // let { data: baseData } = await promisify('canvasGetImageData')({
                //     canvasId: 'wxapp-canvas',
                //     x: startX, y: startY,
                //     width, height
                // }, this);
                // let { data: aidData } = await promisify('canvasGetImageData')({
                //     canvasId: 'wxapp-aid-canvas',
                //     x: startX, y: startY,
                //     width, height
                // }, this);
                // for (let i = 0; i < aidData.length / 4; i++) {
                //     let idx = i * 4;
                //     if (aidData[idx] + aidData[idx + 1] + aidData[idx + 2] === 0) {
                //         aidData[idx] = baseData[idx];
                //         aidData[idx + 1] = baseData[idx + 1];
                //         aidData[idx + 2] = baseData[idx + 2];
                //         aidData[idx + 3] = baseData[idx + 3];
                //     }
                // }
                // await promisify('canvasPutImageData')({
                //     canvasId: 'wxapp-canvas',
                //     data: aidData,
                //     x: startX, y: startY,
                //     width, height
                // }, this);
                // this._aidCtx.restore();
            });
        },

        /**
         * 导出画板上下文
         *
         * @return {Object} ctx
         * @api public
         */
        getContext() {
            return this._ctx;
        },

        /**
         * 适配文本
         *
         * @param {String} str 需要适配的文本
         * @param {Object} font 文本样式
         * @param {Number} maxWidth 最大容器宽度
         * @return {Array} 分段好的文本
         * @api public
         */
        adaptationText(str, font, maxWidth) {
            let ctx = this._aidCtx;

            ctx.font = font;

            let width = ctx.measureText(str).width;

            function calc(str) {
                let len = str.length;
                let idx = 0;
                let result = [];

                while (idx < len) {
                    let nowStr = str.substring(0, idx + 1);
                    let strWidth = ctx.measureText(nowStr).width;

                    if (strWidth <= maxWidth) {
                        result[0] = {
                            text: nowStr,
                            width: strWidth
                        };
                    } else {
                        break;
                    }

                    idx++;
                }

                return idx === len ? result : result.concat(calc(str.substring(idx)));
            }

            return width > maxWidth ? calc(str) : [{ text: str, width: width }];
        },

        /**
         * 测量文本
         *
         * @param {String} str 需要适配的文本
         * @param {Object} font 文本样式
         * @return {Number} 文本宽度
         * @api public
         */
        measureText(str, font) {
            let ctx = this._aidCtx;
            ctx.font = font;
            return ctx.measureText(str).width;
        }
    }
});
