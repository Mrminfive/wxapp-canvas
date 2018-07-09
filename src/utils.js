
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
    const message = `[wxapp-canvas] Error: ${info}`;

    if (typeof console !== 'undefined') {
        console.error(message);
    }

    /* eslint-disable */
    try {
        throw new Error(message);
    } catch (x) { }
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
    return /^wxfile:\/\/(tmp|store)/.test(url) || /^http:\/\/(tmp|store)\//.test(url);
}

/**
 * 检查是否为网络文件路径
 *
 * @param {String} url 资源路径
 * @return {Boolean}
 */
function checkIsNetworkFile(url) {
    return /^(http|https):\/\/(?!(tmp|store)\/)/.test(url);
}

/**
 * wx api promise 装饰器
 *
 * @param {String} method 需要处理的wx接口
 * @return {Promise}
 */
function promisify(method) {
    return function(option = {}, ...args) {
        return new Promise((resolve, reject) => {
            let md = wx[method];

            if (md && typeof md === 'function') {
                md({
                    ...option,
                    success(...args) {
                        option.success && typeof option.success === 'function' && option.success();
                        resolve(...args);
                    },
                    fail(...args) {
                        option.fail && typeof option.fail === 'function' && option.fail();
                        reject(...args);
                    }
                }, ...args);
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
function promisifyList(methods = []) {
    let result = {};

    if (Array.isArray(methods)) {
        methods.forEach(method => {
            result[method] = promisify(method);
        });
    } else {
        errorInfo('wx method list must be a array');
    }
};

/**
 * 下载图片
 *
 * @param {String} src 图片路径
 * @return {Promise}
 */
async function downloadImage(src) {
    // let tempPath = await downloadFile(src);
    return promisify('getImageInfo')({
        src
    });
}

/**
 * 下载文件
 *
 * @param {String} url 资源路径
 * @return {Promise}
 */
async function downloadFile(url) {
    // console.log(url)
    if (checkIsWxFliePath(url)) {
        return url;
    } else if (checkIsNetworkFile(url)) {
        let {
            tempFilePath,
            statusCode
        } = await promisify('downloadFile')({
            url
        });

        if (statusCode !== 200 && statusCode !== 304) {
            errorInfo('download file error, status code is ' + statusCode);
        }

        return tempFilePath;
    } else {
        errorInfo('The file url must be a network file or a wechat file');
    }
}

/**
 * 保存图片到相册
 *
 * @param {String} filePath 图片文件路径
 * @return {Promise}
 */
async function saveImageToPhotosAlbum(filePath) {
    const info = await downloadImage(filePath);

    return await promisify('saveImageToPhotosAlbum')({
        filePath: info.path
    });
}

/**
 * 异步迭代数组
 *
 * @param {Array} arr 需要迭代的数组
 * @param {AsyncFunction} callback 操作函数
 * @param {Any} callback.value 当前迭代值
 * @param {Number} callback.index 当前迭代索引
 */
async function asyncEach(arr, callback) {
    let idx = 0;

    while (idx < arr.length) {
        await callback(arr[idx], idx);
        idx++;
    }
}

/**
 * 设置对象深层属性
 *
 * @param {Object} obj 需要设置的对象
 * @param {String} key 需要设置的 key 值，用 . 代表嵌套层级
 * @return {Object} 设置好的对象
 */
function setObjectKey(obj, key, val) {
    let keys = key.split('.');

    return keys.reduce((res, key, idx) => {
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
    const KAPPA = 0.5522848;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(
        startX + borderRadius['top-left'][0],
        startY
    );
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
    // TODO：这里加上透明描边，以解决路径错乱问题（不是很理解）
    ctx.strokeStyle = 'transparent';
    ctx.stroke();
}

export {
    errorInfo,
    checkIsWxFliePath,
    checkIsNetworkFile,
    promisify,
    promisifyList,
    downloadFile,
    downloadImage,
    saveImageToPhotosAlbum,
    asyncEach,
    setObjectKey,
    drawRing
};
