import _regeneratorRuntime from '../../babel-runtime/regenerator';
import _asyncToGenerator from '../../babel-runtime/helpers/asyncToGenerator';
import _slicedToArray from '../../babel-runtime/helpers/slicedToArray';
import _toConsumableArray from '../../babel-runtime/helpers/toConsumableArray';

/**
 * @description 内嵌节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import behaviors from '../../behaviors/index.js';
import { drawRing } from '../../utils.js';

Component({
    externalClasses: ['class-name'],

    behaviors: [behaviors.element],

    relations: {
        'element': {
            type: 'ancestor',
            target: behaviors.wxappCanvasBehavior,
            linked: function linked(target) {
                this.$canvas = target;
            }
        }
    },

    data: {
        name: 'wxapp-canvas-div',
        log: ''
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
        _drawContainer: function _drawContainer(ctx, rect) {
            var _style = this._style,
                startX = _style.startX,
                startY = _style.startY,
                width = _style.width,
                height = _style.height,
                borderRadius = _style.borderRadius,
                boxShadow = _style.boxShadow;

            // 用于限定绘画区域

            ctx.save();
            drawRing(ctx, 1, startX, startY, width, height, borderRadius);

            // TODE: 用于绘制阴影，但会导致无法设置透明背景
            if (boxShadow.length > 0) {
                ctx.save();
                boxShadow.forEach(function (set) {
                    ctx.setShadow(set.offsetX, set.offsetY, set.blur, set.color);
                });
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fill();
                ctx.restore();
            }

            ctx.clip();

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
        _drawBorder: function _drawBorder(ctx, rect) {
            var _style2 = this._style,
                startX = _style2.startX,
                startY = _style2.startY,
                width = _style2.width,
                height = _style2.height,
                border = _style2.border,
                borderRadius = _style2.borderRadius;

            // 绘制4边

            drawBorder();

            // 绘制4边角
            drawCorner();

            // 擦除内容区域
            clearContent();

            function drawBorder() {
                var pointMap = [{
                    key: 'top',
                    width: (height - border.top.width - border.bottom.width) / 2,
                    moveTo: [startX + border.left.width, startY],
                    lineTo: [startX + width - border.right.width, startY]
                }, {
                    key: 'right',
                    width: (width - border.left.width - border.right.width) / 2,
                    moveTo: [startX + width, startY + border.top.width],
                    lineTo: [startX + width, startY + height - border.bottom.width]
                }, {
                    key: 'bottom',
                    width: (height - border.top.width - border.bottom.width) / 2,
                    moveTo: [startX + width - border.right.width, startY + height],
                    lineTo: [startX + border.left.width, startY + height]
                }, {
                    key: 'left',
                    width: (width - border.left.width - border.right.width) / 2,
                    moveTo: [startX, startY + height - border.bottom.width],
                    lineTo: [startX, startY + border.top.width]
                }];

                ctx.save();
                pointMap.forEach(function (item, idx) {
                    ctx.beginPath();
                    ctx.lineWidth = (border[item.key].width + item.width) * 2;
                    ctx.moveTo.apply(ctx, _toConsumableArray(item.moveTo));
                    ctx.lineTo.apply(ctx, _toConsumableArray(item.lineTo));
                    ctx.setStrokeStyle(border[item.key].color);
                    ctx.stroke();
                });
                ctx.restore();
            }

            function drawCorner() {
                var sizes = [(width - border.right.width) / (height - border.bottom.width) > border.left.width / border.top.width ? [height / 2 * (border.left.width / border.top.width), height / 2] : [width / 2, width / 2 / (border.left.width / border.top.width)], (width - border.left.width) / (height - border.bottom.width) > border.right.width / border.top.width ? [height / 2 * (border.right.width / border.top.width), height / 2] : [width / 2, width / 2 / (border.right.width / border.top.width)], (width - border.left.width) / (height - border.top.width) > border.right.width / border.bottom.width ? [height / 2 * (border.right.width / border.bottom.width), height / 2] : [width / 2, width / 2 / (border.right.width / border.bottom.width)], (width - border.right.width) / (height - border.bottom.width) > border.left.width / border.top.width ? [height / 2 * (border.left.width / border.bottom.width), height / 2] : [width / 2, width / 2 / (border.left.width / border.bottom.width)]];
                var points = [[startX, startY, startX + sizes[0][0], startY + sizes[0][1], startX + sizes[0][0], startY + height / 2, startX, startY + height / 2, border.left.color], [startX, startY, startX + sizes[0][0], startY + sizes[0][1], startX + width / 2, startY + sizes[0][1], startX + width / 2, startY, border.top.color], [startX + width, startY, startX + width - sizes[1][0], startY + sizes[1][1], startX + width / 2, startY + sizes[1][1], startX + width / 2, startY, border.top.color], [startX + width, startY, startX + width - sizes[1][0], startY + sizes[1][1], startX + width - sizes[1][0], startY + height / 2, startX + width, startY + height / 2, border.right.color], [startX + width, startY + height, startX + width - sizes[2][0], startY + height - sizes[2][1], startX + width - sizes[2][0], startY + height / 2, startX + width, startY + height / 2, border.right.color], [startX + width, startY + height, startX + width - sizes[2][0], startY + height - sizes[2][1], startX + width / 2, startY + height - sizes[2][1], startX + width / 2, startY + height, border.bottom.color], [startX, startY + height, startX + sizes[3][0], startY + height - sizes[3][1], startX + width / 2, startY + height - sizes[3][1], startX + width / 2, startY + height, border.bottom.color], [startX, startY + height, startX + sizes[3][0], startY + height - sizes[3][1], startX + sizes[3][0], startY + height / 2, startX, startY + height / 2, border.left.color]];

                ctx.save();
                points.forEach(function (setting) {
                    var _setting = _slicedToArray(setting, 9),
                        ax = _setting[0],
                        ay = _setting[1],
                        bx = _setting[2],
                        by = _setting[3],
                        cx = _setting[4],
                        cy = _setting[5],
                        dx = _setting[6],
                        dy = _setting[7],
                        style = _setting[8];

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.lineTo(cx, cy);
                    ctx.lineTo(dx, dy);
                    ctx.closePath();
                    ctx.fillStyle = style;
                    ctx.fill();
                });
                ctx.restore();
            }

            function clearContent() {
                ctx.restore();
                ctx.save();
                drawRing(ctx, 1, startX + border.left.width, startY + border.top.width, width - border.left.width - border.right.width, height - border.top.width - border.bottom.width, {
                    'top-left': [borderRadius['top-left'][0] < border.left.width ? 0 : borderRadius['top-left'][0] - border.left.width, borderRadius['top-left'][1] < border.top.width ? 0 : borderRadius['top-left'][1] - border.top.width],
                    'top-right': [borderRadius['top-right'][0] < border.right.width ? 0 : borderRadius['top-right'][0] - border.right.width, borderRadius['top-right'][1] < border.top.width ? 0 : borderRadius['top-right'][1] - border.top.width],
                    'bottom-right': [borderRadius['bottom-right'][0] < border.right.width ? 0 : borderRadius['bottom-right'][0] - border.right.width, borderRadius['bottom-right'][1] < border.bottom.width ? 0 : borderRadius['bottom-right'][1] - border.bottom.width],
                    'bottom-left': [borderRadius['bottom-left'][0] < border.left.width ? 0 : borderRadius['bottom-left'][0] - border.left.width, borderRadius['bottom-left'][1] < border.bottom.width ? 0 : borderRadius['bottom-left'][1] - border.bottom.width]
                });

                ctx.clip();
                ctx.clearRect(startX + border.left.width, startY + border.top.width, width - border.left.width - border.right.width, height - border.top.width - border.bottom.width);
            }

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
        _drawBackground: function _drawBackground(ctx, rect) {
            var _style3 = this._style,
                startX = _style3.startX,
                startY = _style3.startY,
                width = _style3.width,
                height = _style3.height,
                border = _style3.border,
                padding = _style3.padding,
                background = _style3.background,
                containerSize = _style3.containerSize;

            var contentSize = {
                width: containerSize.width + padding.left + padding.right,
                height: containerSize.height + padding.top + padding.bottom
            };
            var resources = this._resources;
            var self = this;

            drawBackgroundColor();
            drawBackgroundImage();
            // 背景色
            function drawBackgroundColor() {
                ctx.fillStyle = background.color;
                ctx.fillRect(startX, startY, width, height);
            }
            // 背景图
            function drawBackgroundImage() {
                var size = background.size;
                var renderPhalanx = void 0;

                if (typeof size === 'string') {
                    switch (size) {
                        case 'auto':
                            size = background._imageUrl ? [resources[background._imageUrl].width, resources[background._imageUrl].height] : [contentSize.width, contentSize.height];
                            break;
                        case 'contain':
                            if (background._imageUrl) {
                                var resource = resources[background._imageUrl];
                                var proportion = resource.height / resource.width;
                                var containerProportion = contentSize.height / contentSize.width;

                                size = proportion > containerProportion ? [contentSize.width, contentSize.width * proportion] : [contentSize.height * proportion, contentSize.height];
                            } else {
                                size = [contentSize.width, contentSize.height];
                            }
                            break;
                        case 'cover':
                            size = [contentSize.width, contentSize.height];
                            break;
                    }
                }

                switch (background.repeat) {
                    case 'repeat-x':
                        renderPhalanx = [Math.ceil(contentSize.width / size[0]), 1];
                        break;
                    case 'repeat-y':
                        renderPhalanx = [1, Math.ceil(contentSize.height / size[1])];
                        break;
                    case 'no-repeat':
                        renderPhalanx = [1, 1];
                        break;
                    case 'repeat':
                    default:
                        renderPhalanx = [Math.ceil(contentSize.width / size[0]), Math.ceil(contentSize.height / size[1])];
                }

                for (var yi = 0; yi < renderPhalanx[1]; yi++) {
                    for (var xi = 0; xi < renderPhalanx[0]; xi++) {
                        (function () {
                            switch (background._imageType) {
                                case 'image':
                                    ctx.drawImage(resources[background._imageUrl].path, startX + border.left.width + size[0] * xi, startY + border.top.width + size[1] * yi, size[0], size[1]);
                                    break;
                                case 'linear-gradient':
                                    var startPoint = void 0;
                                    var endPoint = void 0;
                                    var dot = [startX + border.left.width + background.position.x + size[0] * (xi + 0.5), startY + border.top.width + background.position.y + size[1] * (yi + 0.5)];
                                    var angle = background._imageGradient.angle + 180;
                                    var R = Math.sqrt(Math.pow(size[0], 2) + Math.pow(size[1], 2)) / 2;
                                    var mX = Math.abs(Math.sin(angle / 360 * 2 * Math.PI) * R);
                                    var mY = Math.abs(Math.cos(angle / 360 * 2 * Math.PI) * R);

                                    // 区分所处象限
                                    switch (Math.ceil(angle % 360 / 90)) {
                                        case 0:
                                        case 1:
                                            startPoint = [dot[0] + mX, dot[1] - mY];
                                            endPoint = [dot[0] - mX, dot[1] + mY];
                                            break;
                                        case 2:
                                            startPoint = [dot[0] + mX, dot[1] + mY];
                                            endPoint = [dot[0] - mX, dot[1] - mY];
                                            break;
                                        case 3:
                                            startPoint = [dot[0] - mX, dot[1] + mY];
                                            endPoint = [dot[0] + mX, dot[1] - mY];
                                            break;
                                        case 4:
                                            startPoint = [dot[0] - mX, dot[1] - mY];
                                            endPoint = [dot[0] + mX, dot[1] + mY];
                                            break;
                                    }
                                    var grd = ctx.createLinearGradient.apply(ctx, _toConsumableArray(startPoint).concat(_toConsumableArray(endPoint)));
                                    background._imageGradient.stopPoint.forEach(function (item) {
                                        grd.addColorStop(parseFloat(item[1]) / 100, item[0]);
                                    });

                                    ctx.setFillStyle(grd);
                                    ctx.fillRect(startX + border.left.width + background.position.x + size[0] * xi, startY + border.top.width + background.position.y + size[1] * yi, size[0], size[1]);
                                    break;
                            }
                        })();
                    }
                }
            }

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
        _drawContent: function _drawContent(ctx, rect) {
            var _style4 = this._style,
                content = _style4.content,
                padding = _style4.padding,
                border = _style4.border,
                startX = _style4.startX,
                startY = _style4.startY,
                font = _style4.font,
                containerSize = _style4.containerSize,
                overflow = _style4.overflow;

            var alignMap = {
                'top': 0,
                'middle': 0.5,
                'bottom': 1,
                'left': 0,
                'center': 0.5,
                'right': 1
            };

            overflow !== 'hidden' && ctx.restore();
            ctx.save();
            ctx.font = font.style + ' ' + font.weight + ' ' + font.size + 'px ' + font.family;
            ctx.fillStyle = font.color;
            ctx.textBaseline = 'middle';
            content.forEach(function (item, idx) {
                ctx.fillText(item.text, startX + border.left.width + padding.left + alignMap[font.textAlign] * (containerSize.width - item.width), startY + border.top.width + padding.top +
                // 这里是因为字体基准线设置成 middle
                font.lineHeight * (idx + 0.5) +
                // 这里为了实现字体设置垂直方向上的位置
                alignMap[font.verticalAlign] * (containerSize.height - content.length * font.lineHeight));
            });
            ctx.restore();

            return this;
        },


        /**
         * 用于渲染内容
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @api public
         */
        render: function render(ctx, rect) {
            var border = this._style.border;


            this._drawContainer(ctx, rect);

            Object.keys(border).reduce(function (result, key) {
                return result + border[key].width;
            }, 0) && this._drawBorder(ctx, rect);

            this._drawBackground(ctx, rect)._drawContent(ctx, rect);

            ctx.restore();
        },


        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Object} utils 工具方法
         * @param {Function} utils.adaptationText 文本内容适配器
         * @param {Function} utils.measureText 文本测量
         * @return {Promise}
         * @api public
         */
        preload: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(rect, utils) {
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._preload(rect, utils);

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function preload(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return preload;
        }()
    }
});