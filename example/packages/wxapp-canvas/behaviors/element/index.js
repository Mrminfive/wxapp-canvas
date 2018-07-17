import _regeneratorRuntime from '../../babel-runtime/regenerator';
import _asyncToGenerator from '../../babel-runtime/helpers/asyncToGenerator';

/**
 * @description canvas 内节点基本特征
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { asyncEach, downloadImage } from '../../utils.js';
import { formatStyle } from './format-style.js';

export default Behavior({
    properties: {
        csstext: {
            type: String,
            value: '',
            observer: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(val, oldVal) {
                    return _regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    if (val !== oldVal) this._changeCsstext = true;

                                case 1:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function observer(_x, _x2) {
                    return _ref.apply(this, arguments);
                }

                return observer;
            }()
        }
    },

    created: function created() {
        this._resources = {};
        this._changeCsstext = true;
    },


    methods: {
        /**
         * 获取当前样式值
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Object} utils 工具方法
         * @param {Function} utils.adaptationText 文本内容适配器
         * @param {Function} utils.measureText 文本测量
         * @return {Promise}
         * @api private
         */
        _getComputedStyle: function _getComputedStyle(rect, utils) {
            var _this = this;

            var node = wx.createSelectorQuery().in(this).select('#canvas-element');

            this._changeCsstext = false;

            return new Promise(function (resolve) {
                node.fields({
                    computedStyle: ['position', 'left', 'right', 'bottom', 'top', 'z-index', 'display', 'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'overflow', 'color', 'font-size', 'font-weight', 'font-family', 'font-variant', 'font-style', 'font-stretch', 'text-align', 'vertical-align', 'line-height', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'background-color', 'background-position', 'background-size', 'background-repeat', 'background-origin', 'background-clip', 'background-image', 'border-left', 'border-right', 'border-top', 'border-bottom', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'box-shadow', 'content']
                }, function (res) {
                    var style = formatStyle(res, rect, utils);
                    _this._style = style;
                    if (style.background._imageUrl) {
                        var url = style.background._imageUrl;
                        _this._resources[url] = _this._resources[url];
                    }
                    resolve(style);
                }).exec();
            });
        },


        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Object} utils 工具方法
         * @param {Function} utils.adaptationText 文本内容适配器
         * @param {Function} utils.measureText 文本测量
         * @return {Promise}
         * @api private
         */
        _preload: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(rect, utils) {
                var _this2 = this;

                var resources;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.t0 = this._changeCsstext;

                                if (!_context3.t0) {
                                    _context3.next = 4;
                                    break;
                                }

                                _context3.next = 4;
                                return this._getComputedStyle(rect, utils);

                            case 4:
                                resources = Object.keys(this._resources);
                                _context3.next = 7;
                                return asyncEach(resources, function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(key) {
                                        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _this2.setData({
                                                            log: _this2._resources[key] == null
                                                        });

                                                        if (!(_this2._resources[key] == null)) {
                                                            _context2.next = 10;
                                                            break;
                                                        }

                                                        if (!_this2.$canvas._resources[key]) {
                                                            _context2.next = 6;
                                                            break;
                                                        }

                                                        _this2._resources[key] = _this2.$canvas._resources[key];
                                                        _context2.next = 9;
                                                        break;

                                                    case 6:
                                                        _context2.next = 8;
                                                        return downloadImage(key);

                                                    case 8:
                                                        _this2._resources[key] = _context2.sent;

                                                    case 9:
                                                        _this2.$canvas._resources[key] = _this2._resources[key];

                                                    case 10:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x5) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _preload(_x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return _preload;
        }()
    }
});