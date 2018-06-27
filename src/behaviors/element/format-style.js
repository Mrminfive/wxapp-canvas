
/**
 * @description 样式格式画函数集
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { setObjectKey } from '../../utils.js';

const splitReg = /\s(?!([^()]*\))(?!\)))/;

/**
 * 解析像素值
 *
 * @param {String} setting 设置的值
 * @param {Number} total 100%的实际像素值
 * @param {Number} max 最大值
 * @return {Number} 实际像素值
 */
function processPixels(setting, total, max) {
    let result;

    if (setting === 'auto') {
        result = null;
    } else if (/^calc\(.+\)$/.test(setting)) {
        let match = setting.match(/^calc\((.+)\s\+\s(.+)\)$/);
        result = processPixels(match[1], total) + processPixels(match[2], total);
    } else if (/^.*%$/.test(setting)) {
        result = total * (setting.substring(0, setting.length - 1) / 100);
    } else {
        result = parseFloat(setting);
    }

    return result != null && max != null
        ? result > max ? max : result
        : result;
}

/**
 * 格式化字体样式
 *
 * @param {Object} style 样式配置
 * @return {Object} 字体配置
 */
function formatFontStyle(style) {
    return {
        style: style['font-style'],
        variant: style['font-variant'],
        weight: style['font-weight'],
        stretch: style['font-stretch'],
        size: processPixels(style['font-size'], 20),
        lineHeight: style['line-height'] === 'normal'
            ? 1.33 * processPixels(style['font-size'], 20)
            : parseFloat(style['line-height']),
        family: style['font-family']
    };
}

/**
 * 格式化背景样式
 *
 * @param {Object} style 背景配置
 * @param {Object} rect 容器规格
 * @param {Number} rect.width 容器宽
 * @param {Number} rect.height 容器高
 * @return {Object} 背景配置
 */
function formatBackground(style, rect) {
    function filterSize(size) {
        let defaultVals = ['auto', 'cover', 'contain'];
        let match = size.split(splitReg).filter(item => item != null);

        if (match.length === 2) {
            return [
                processPixels(match[0], rect.height),
                processPixels(match[1], rect.width)
            ];
        } else if (match.length === 1 && !defaultVals.includes(match[0])) {
            return [
                processPixels(match[0], rect.height),
                processPixels(match[0], rect.width)
            ];
        } else {
            return size;
        }
    }

    return {
        color: style['background-color'],
        origin: style['background-origin'],
        clip: style['background-clip'],
        position: {
            x: processPixels(style['background-position'].split(' ')[0], rect.width),
            y: processPixels(style['background-position'].split(' ')[1], rect.height)
        },
        repeat: style['background-repeat'],
        size: filterSize(style['background-size']),
        image: style['background-image']
    };
}

/**
 * 格式化边框样式
 *
 * @param {Object} border 各个边框的配置
 * @param {String} border.top 顶部边框
 * @param {String} border.left 左部边框
 * @param {String} border.right 右部边框
 * @param {String} border.bottom 底部边框
 * @return {Object} 各个边框的配置
 */
function formatBorderStyle(border) {
    return Object
        .keys(border)
        .reduce((result, key) => {
            let match = border[key].split(splitReg).filter(item => item != null);

            result[key] = {
                width: parseFloat(match[0]),
                style: match[1],
                color: match[2]
            };

            return result;
        }, {});
}

/**
 * 格式化borderRaidus
 *
 * @param {String} csstext 边角样式
 * @param {Object} rect 容器规格
 * @param {Number} rect.width 容器宽
 * @param {Number} rect.height 容器高
 * @return {Array} 边角在水平及垂直方向上的半径
 */
function formatBorderRadiusStyle(csstext, rect) {
    let match = csstext.split(' ');

    if (match.length === 1) {
        match = Array(2).fill(match[0]);
    }

    return [
        processPixels(match[0], rect.width, rect.width / 2),
        processPixels(match[1], rect.height, rect.height / 2)
    ];
}

export {
    processPixels,
    formatFontStyle,
    formatBackground,
    formatBorderStyle,
    formatBorderRadiusStyle
};
