import _regeneratorRuntime from '/babel-runtime/regenerator';
import _asyncToGenerator from '/babel-runtime/helpers/asyncToGenerator';
import _extends from '/babel-runtime/helpers/extends';

/**
 * 下载图片
 *
 * @param {String} src 图片路径
 * @return {Promise}
 */
var downloadImage = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(src) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', promisify('getImageInfo')({
                            src: src
                        }));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function downloadImage(_x3) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * 下载文件
 *
 * @param {String} url 资源路径
 * @return {Promise}
 */


var downloadFile = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(url) {
        var _ref3, tempFilePath, statusCode;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!checkIsWxFliePath(url)) {
                            _context2.next = 4;
                            break;
                        }

                        return _context2.abrupt('return', url);

                    case 4:
                        if (!checkIsNetworkFile(url)) {
                            _context2.next = 14;
                            break;
                        }

                        _context2.next = 7;
                        return promisify('downloadFile')({
                            url: url
                        });

                    case 7:
                        _ref3 = _context2.sent;
                        tempFilePath = _ref3.tempFilePath;
                        statusCode = _ref3.statusCode;


                        if (statusCode !== 200 && statusCode !== 304) {
                            errorInfo('download file error, status code is ' + statusCode);
                        }

                        return _context2.abrupt('return', tempFilePath);

                    case 14:
                        errorInfo('The file url must be a network file or a wechat file');

                    case 15:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function downloadFile(_x4) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * 保存图片到相册
 *
 * @param {String} filePath 图片文件路径
 * @return {Promise}
 */


var saveImageToPhotosAlbum = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(filePath) {
        var info;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return downloadImage(filePath);

                    case 2:
                        info = _context3.sent;
                        _context3.next = 5;
                        return promisify('saveImageToPhotosAlbum')({
                            filePath: info.path
                        });

                    case 5:
                        return _context3.abrupt('return', _context3.sent);

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function saveImageToPhotosAlbum(_x5) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * 异步迭代数组
 *
 * @param {Array} arr 需要迭代的数组
 * @param {AsyncFunction} callback 操作函数
 * @param {Any} callback.value 当前迭代值
 * @param {Number} callback.index 当前迭代索引
 */


var asyncEach = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(arr, callback) {
        var idx;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        idx = 0;

                    case 1:
                        if (!(idx < arr.length)) {
                            _context4.next = 7;
                            break;
                        }

                        _context4.next = 4;
                        return callback(arr[idx], idx);

                    case 4:
                        idx++;
                        _context4.next = 1;
                        break;

                    case 7:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function asyncEach(_x6, _x7) {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * 设置对象深层属性
 *
 * @param {Object} obj 需要设置的对象
 * @param {String} key 需要设置的 key 值，用 . 代表嵌套层级
 * @return {Object} 设置好的对象
 */


/**
 * @description 工具集
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

/**
 * 异常信息提示
 *
 * @param {String} info 异常提示信息
 */
function errorInfo(info) {
    var message = '[wxapp-canvas] Error: ' + info;

    if (typeof console !== 'undefined') {
        console.error(message);
    }

    /* eslint-disable */
    try {
        throw new Error(message);
    } catch (x) {}
    /* eslint-enable */
}

/**
 * 检查是否为微信文件路径
 *
 * @param {String} url 资源路径
 * @param {Boolean}
 */
function checkIsWxFliePath(url) {
    // 增加对开发者工具路径的适配
    return (/^wxfile:\/\/(tmp|store)/.test(url) || /^http:\/\/(tmp|store)\//.test(url)
    );
}

/**
 * 检查是否为网络文件路径
 *
 * @param {String} url 资源路径
 * @return {Boolean}
 */
function checkIsNetworkFile(url) {
    return (/^(http|https):\/\/(?!(tmp|store)\/)/.test(url)
    );
}

/**
 * wx api promise 装饰器
 *
 * @param {String} method 需要处理的wx接口
 * @return {Promise}
 */
function promisify(method) {
    return function () {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
            var md = wx[method];

            if (md && typeof md === 'function') {
                md.apply(undefined, [_extends({}, option, {
                    success: function success() {
                        option.success && typeof option.success === 'function' && option.success();
                        resolve.apply(undefined, arguments);
                    },
                    fail: function fail() {
                        option.fail && typeof option.fail === 'function' && option.fail();
                        reject.apply(undefined, arguments);
                    }
                })].concat(args));
            } else {
                errorInfo('wx method must be a function');
            }
        });
    };
}

/**
 * promise wx apis
 *
 * @param {Array} methods 需要处理的所有wx接口
 * @return {Object} 处理过后的接口对象集合
 */
function promisifyList() {
    var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var result = {};

    if (Array.isArray(methods)) {
        methods.forEach(function (method) {
            result[method] = promisify(method);
        });
    } else {
        errorInfo('wx method list must be a array');
    }
};function setObjectKey(obj, key, val) {
    var keys = key.split('.');

    return keys.reduce(function (res, key, idx) {
        if (idx === keys.length - 1) {
            res[key] = val;
            return obj;
        } else {
            res[key] = res[key] || {};
            return res[key];
        }
    }, obj);
}

/**
 * 绘制一个圆角四边形
 *
 * @param {Object} ctx canvas 上下文
 * @param {Number} lineWidth 边宽
 * @param {Number} startX 左上角X轴坐标
 * @param {Number} startY 左上角Y轴坐标
 * @param {Number} width 宽度
 * @param {Number} height 高度
 * @param {Object} borderRadius 边角
 * @param {Array} borderRadius['top-left']
 * @param {Array} borderRadius['top-right']
 * @param {Array} borderRadius['bottom-right']
 * @param {Array} borderRadius['bottom-left']
 */
function drawRing(ctx, lineWidth, startX, startY, width, height, borderRadius) {
    var KAPPA = 0.5522848;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startX + borderRadius['top-left'][0], startY);
    ctx.lineTo(startX + width - borderRadius['top-right'][0], startY);
    ctx.bezierCurveTo(startX + width - borderRadius['top-right'][0] * (1 - KAPPA), startY, startX + width, startY + borderRadius['top-right'][1] * (1 - KAPPA), startX + width, startY + borderRadius['top-right'][1]);
    ctx.lineTo(startX + width, startY + height - borderRadius['bottom-right'][1]);
    ctx.bezierCurveTo(startX + width, startY + height - borderRadius['bottom-right'][1] * (1 - KAPPA), startX + width - borderRadius['bottom-right'][0] * (1 - KAPPA), startY + height, startX + width - borderRadius['bottom-right'][0], startY + height);
    ctx.lineTo(startX + borderRadius['bottom-left'][0], startY + height);
    ctx.bezierCurveTo(startX + borderRadius['bottom-left'][0] * (1 - KAPPA), startY + height, startX, startY + height - borderRadius['bottom-left'][1] * (1 - KAPPA), startX, startY + height - borderRadius['bottom-left'][1]);
    ctx.lineTo(startX, startY + borderRadius['top-left'][1]);
    ctx.bezierCurveTo(startX, startY + borderRadius['top-left'][1] * (1 - KAPPA), startX + borderRadius['top-left'][0] * (1 - KAPPA), startY, startX + borderRadius['top-left'][0], startY);
    ctx.closePath();
    // TODO：这里加上透明描边，以解决路径错乱问题（不是很理解）
    ctx.strokeStyle = 'transparent';
    ctx.stroke();
}

export { errorInfo, checkIsWxFliePath, checkIsNetworkFile, promisify, promisifyList, downloadFile, downloadImage, saveImageToPhotosAlbum, asyncEach, setObjectKey, drawRing };