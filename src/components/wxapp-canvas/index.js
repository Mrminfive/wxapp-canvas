
/**
 * @description cancas节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

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
                console.log('linked: ', target);
                setTimeout(() => {
                    target._getComputedStyle();
                });
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
                        .select('#wxapp-canvas')
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
                    .map(element => element.preload({ ...this._canvasRect }))
            );
        },

        /**
         * 绘制面板
         *
         * @return {Promise}
         * @api public
         */
        async draw() {
            let idx = 0;
            const elements = this._elements.sort((first, next) => first.zIndex - next.zIndex);
            const drawCanvas = reserve => new Promise(resolve => this._ctx.draw(reserve, resolve));

            // 擦除面板
            await drawCanvas();

            while (idx < elements.length) {
                let element = elements[idx];
                element.preload && await element.preload({ ...this._canvasRect });
                this._ctx.save();
                element.render(this._ctx, { ...this._canvasRect });
                await drawCanvas(true);
                this._ctx.restore();
                idx++;
            }
        },

        /**
         * 导出画板上下文
         *
         * @return {Object} ctx
         * @api public
         */
        getContext() {
            return this._ctx;
        }
    }
});
