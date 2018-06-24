
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
    return function(option = {}) {
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
                });
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
 * 下载文件
 *
 * @param {String} url 资源路径
 * @return {Promise}
 */
async function downloadFile(url) {
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
    const url = await downloadFile(filePath);

    return await promisify('saveImageToPhotosAlbum')({
        filePath: url
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

export {
    errorInfo,
    checkIsWxFliePath,
    checkIsNetworkFile,
    promisify,
    promisifyList,
    downloadFile,
    saveImageToPhotosAlbum,
    asyncEach
};
