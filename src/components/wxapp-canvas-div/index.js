
/**
 * @description 内嵌节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import behaviors from '../../behaviors/index.js';

Component({
    externalClasses: ['class-name'],

    behaviors: [
        behaviors.element
    ],

    relations: {
        'element': {
            type: 'ancestor',
            target: behaviors.wxappCanvasBehavior,
            linked(target) {
                this.$canvas = target;
            }
        }
    },

    data: {
        name: 'wxapp-canvas-div'
    },

    methods: {
        /**
         * 渲染容器
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @return {Object} this
         * @api private
         */
        _drawContainer(ctx, rect) {
            const KAPPA = 0.5522848;
            let { startX, startY, width, height, border, borderRadius } = this._style;;
            let minBorderWidth = Math.min(...Object.keys(border).map(key => border[key].width));

            // 对外扩张1像素用于限定绘画区域
            drawRing(
                1,
                startX - 1,
                startY - 1,
                width + 2,
                height + 2,
                Object.keys(borderRadius).reduce((result, key) => {
                    let setting = borderRadius[key];
                    result[key] = [
                        setting[0] + 1,
                        setting[1] + 1
                    ];
                    return result;
                }, {})
            );
            ctx.clip();

            drawRing(
                minBorderWidth * 2,
                startX,
                startY,
                width,
                height,
                borderRadius,
                border
            );
            ctx.stroke();

            // 画圈
            function drawRing(lineWidth, startX, startY, width, height, borderRadius, border) {
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(
                    startX + borderRadius['top-left'][0],
                    startY
                );
                border && (ctx.strokeStyle = border.top.color);
                ctx.lineTo(
                    startX + width - borderRadius['top-right'][0],
                    startY
                );
                ctx.bezierCurveTo(
                    startX + width - borderRadius['top-right'][0] * (1 - KAPPA),
                    startY,
                    startX + width,
                    startY + borderRadius['top-right'][1] * (1 - KAPPA),
                    startX + width,
                    startY + borderRadius['top-right'][1]
                );
                border && (ctx.strokeStyle = border.right.color);
                ctx.lineTo(
                    startX + width,
                    startY + height - borderRadius['bottom-right'][1]
                );
                ctx.bezierCurveTo(
                    startX + width,
                    startY + height - borderRadius['bottom-right'][1] * (1 - KAPPA),
                    startX + width - borderRadius['bottom-right'][0] * (1 - KAPPA),
                    startY + height,
                    startX + width - borderRadius['bottom-right'][0],
                    startY + height
                );
                border && (ctx.strokeStyle = border.bottom.color);
                ctx.lineTo(
                    startX + borderRadius['bottom-left'][0],
                    startY + height
                );
                ctx.bezierCurveTo(
                    startX + borderRadius['bottom-left'][0] * (1 - KAPPA),
                    startY + height,
                    startX,
                    startY + height - borderRadius['bottom-left'][1] * (1 - KAPPA),
                    startX,
                    startY + height - borderRadius['bottom-left'][1]
                );
                border && (ctx.strokeStyle = border.left.color);
                ctx.lineTo(
                    startX,
                    startY + borderRadius['top-left'][1]
                );
                ctx.bezierCurveTo(
                    startX,
                    startY + borderRadius['top-left'][1] * (1 - KAPPA),
                    startX + borderRadius['top-left'][0] * (1 - KAPPA),
                    startY,
                    startX + borderRadius['top-left'][0],
                    startY
                );
                ctx.closePath();
            }

            return this;
        },

        /**
         * 渲染边框
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @return {Object} this
         * @api private
         */
        _drawBorder(ctx, rect) {
            let { startX, startY, width, height, border } = this._style;
            let pointMap = [
                { key: 'top', lineTo: [startX + width, startY] },
                { key: 'right', lineTo: [startX + width, startY + height] },
                { key: 'bottom', lineTo: [startX, startY + height] },
                { key: 'left', lineTo: [startX, startY] }
            ];

            pointMap.forEach((item, idx) => {
                ctx.beginPath();
                ctx.lineWidth = border[item.key].width * 2;
                ctx.moveTo(...pointMap[idx === 0 ? 3 : idx - 1].lineTo);
                ctx.lineTo(...item.lineTo);
                ctx.setStrokeStyle(border[item.key].color);
                ctx.stroke();
            });

            return this;
        },

        /**
         * 渲染背景
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @return {Object} this
         * @api private
         */
        _drawBackground() {
            return this;
        },

        /**
         * 渲染内容
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @return {Object} this
         * @api private
         */
        _drawContent() {
            return this;
        },

        /**
         * 用于渲染内容
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @api public
         */
        render(...args) {
            this
                ._drawContainer(...args)
                ._drawBorder(...args)
                ._drawBackground(...args)
                // ._drawBorder(...args)
                ._drawContent(...args);
        },

        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Function} adaptationText 文本内容适配器
         * @return {Promise}
         * @api public
         */
        async preload(rect, adaptationText) {
            await this._preload(rect, adaptationText);
        }
    }
});
