import _regeneratorRuntime from '../../babel-runtime/regenerator';
import _asyncToGenerator from '../../babel-runtime/helpers/asyncToGenerator';
import _extends from '../../babel-runtime/helpers/extends';

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

    behaviors: [behaviors.wxappCanvasBehavior],

    relations: {
        'element': {
            type: 'descendant',
            target: behaviors.element,
            linked: function linked(target) {
                this._elements.push(target);
            },
            unlinked: function unlinked(target) {
                this._elements = this._elements.filter(function (element) {
                    return element.__wxExparserNodeId__ !== target.__wxExparserNodeId__;
                });
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

    created: function created() {
        this._ctx = null;
        this._elements = [];
        this._canvasRect = null;
        this._resources = {};
        this._systemInfo = wx.getSystemInfoSync();
    },
    attached: function attached() {
        this.triggerEvent('ref', this);
    },
    ready: function ready() {
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
        _getCanvasRect: function _getCanvasRect(refresh) {
            var _this = this;

            return !refresh && this._canvasRect ? Promise.resolve(_extends({}, this._canvasRect)) : new Promise(function (resolve) {
                var query = wx.createSelectorQuery().in(_this);

                query.select('#wxapp-canvas-view').boundingClientRect(function (res) {
                    _this._canvasRect = res;
                    _this.setData({
                        width: res.width,
                        height: res.height
                    }, resolve);
                }).exec();
            });
        },


        /**
         * 初始化 canvas
         *
         * @return {Promise}
         * @api private
         */
        _initCanvas: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this._ctx = wx.createCanvasContext('wxapp-canvas', this);
                                this._aidCtx = wx.createCanvasContext('wxapp-aid-canvas', this);
                                _context.next = 4;
                                return this._getCanvasRect(true);

                            case 4:
                                _context.t0 = this.data.preload;

                                if (!_context.t0) {
                                    _context.next = 8;
                                    break;
                                }

                                _context.next = 8;
                                return this.preload();

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _initCanvas() {
                return _ref.apply(this, arguments);
            }

            return _initCanvas;
        }(),


        /**
         * 预加载资源
         *
         * @return {Promise}
         * @api public
         */
        preload: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                var _this2 = this;

                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._getCanvasRect();

                            case 2:
                                _context2.next = 4;
                                return Promise.all(this._elements.filter(function (element) {
                                    return element.preload;
                                }).map(function (element) {
                                    console.log(element);
                                    return element;
                                }).map(function (element) {
                                    return element.preload(_extends({}, _this2._canvasRect), {
                                        adaptationText: _this2.adaptationText.bind(_this2),
                                        measureText: _this2.measureText.bind(_this2)
                                    });
                                }));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function preload() {
                return _ref2.apply(this, arguments);
            }

            return preload;
        }(),


        /**
         * 绘制面板
         *
         * @return {Promise}
         * @api public
         */
        draw: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var _this3 = this;

                var drawCanvas, elements;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                drawCanvas = function drawCanvas(reserve) {
                                    return new Promise(function (resolve) {
                                        return _this3._ctx.draw(reserve, resolve);
                                    });
                                };

                                asyncEach(this._elements, function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(element) {
                                        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.t0 = element.preload;

                                                        if (!_context3.t0) {
                                                            _context3.next = 4;
                                                            break;
                                                        }

                                                        _context3.next = 4;
                                                        return element.preload(_extends({}, _this3._canvasRect), {
                                                            adaptationText: _this3.adaptationText.bind(_this3),
                                                            measureText: _this3.measureText.bind(_this3)
                                                        });

                                                    case 4:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this3);
                                    }));

                                    return function (_x) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());

                                elements = this._elements.sort(function (first, next) {
                                    return first._style.zIndex - next._style.zIndex;
                                });
                                // const drawAidCanvas = reserve => new Promise(resolve => this._aidCtx.draw(reserve, resolve));

                                // 擦除面板

                                _context5.next = 5;
                                return drawCanvas();

                            case 5:

                                asyncEach(elements, function () {
                                    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(element) {
                                        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        // TODE: 暂时找不到方法实现透明背景
                                                        _this3._ctx.save();
                                                        element.render(_this3._ctx, _extends({}, _this3._canvasRect));
                                                        _context4.next = 4;
                                                        return drawCanvas(true);

                                                    case 4:
                                                        _context4.t0 = ~_this3._systemInfo.system.indexOf('Android');

                                                        if (!_context4.t0) {
                                                            _context4.next = 8;
                                                            break;
                                                        }

                                                        _context4.next = 8;
                                                        return new Promise(function (res) {
                                                            return setTimeout(res, 50);
                                                        });

                                                    case 8:
                                                        _this3._ctx.restore();

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

                                                    case 9:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this3);
                                    }));

                                    return function (_x2) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function draw() {
                return _ref3.apply(this, arguments);
            }

            return draw;
        }(),


        /**
         * 导出画板上下文
         *
         * @return {Object} ctx
         * @api public
         */
        getContext: function getContext() {
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
        adaptationText: function adaptationText(str, font, maxWidth) {
            var ctx = this._aidCtx;

            ctx.font = font;

            var width = ctx.measureText(str).width;

            function calc(str) {
                var len = str.length;
                var idx = 0;
                var result = [];

                while (idx < len) {
                    var nowStr = str.substring(0, idx + 1);
                    var strWidth = ctx.measureText(nowStr).width;

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
        measureText: function measureText(str, font) {
            var ctx = this._aidCtx;
            ctx.font = font;
            return ctx.measureText(str).width;
        }
    }
});