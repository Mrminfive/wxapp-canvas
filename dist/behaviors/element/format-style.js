import _extends from '../../babel-runtime/helpers/extends';

/**
 * @description 样式格式画函数集
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { errorInfo } from '../../utils.js';

var splitReg = /\s(?!([^()]*\))(?!\)))/;

/**
 * 解析像素值
 *
 * @param {String} setting 设置的值
 * @param {Number} total 100%的实际像素值
 * @param {Number} max 最大值
 * @return {Number} 实际像素值
 */
function processPixels(setting, total, max) {
    var result = void 0;

    if (setting === 'auto') {
        result = null;
    } else if (/^calc\(.+\)$/.test(setting)) {
        var match = setting.match(/^calc\((.+)\s\+\s(.+)\)$/);
        result = processPixels(match[1], total) + processPixels(match[2], total);
    } else if (/^.*%$/.test(setting)) {
        result = total * (setting.substring(0, setting.length - 1) / 100);
    } else {
        result = parseFloat(setting);
    }

    return result != null && max != null ? result > max ? max : result : result;
}

/**
 * 格式化字体样式
 *
 * @param {Object} style 样式配置
 * @return {Object} 字体配置
 */
function formatFontStyle(style) {
    var size = Math.round(processPixels(style['font-size'], 20));
    return {
        color: style['color'],
        style: style['font-style'],
        variant: style['font-variant'],
        weight: style['font-weight'],
        stretch: style['font-stretch'],
        size: size,
        lineHeight: style['line-height'] === 'normal' ? 1.33 * size : parseFloat(style['line-height']),
        family: style['font-family'],
        textAlign: ['center', 'left', 'right'].includes(style['text-align']) ? style['text-align'] : 'left',
        verticalAlign: ['top', 'middle', 'bottom'].includes(style['vertical-align']) ? style['vertical-align'] : 'top'
    };
}

/**
 * 格式化盒模型大小
 *
 * @param {Object} computedStyle 未处理的样式配置
 * @param {Object} style 样式配置
 * @param {Object} rect 容器规格
 * @param {Object} utils 工具方法
 * @param {Function} utils.adaptationText 文本内容适配器
 * @param {Function} utils.measureText 文本测量
 * @return {Object} 规格
 */
function formatSize(computedStyle, style, rect, utils) {
    var adaptationText = utils.adaptationText,
        measureText = utils.measureText;

    var font = style.font.style + ' ' + style.font.weight + ' ' + style.font.size + 'px ' + style.font.family;
    var contentText = computedStyle.content.slice(1, -1);
    var border = style.border,
        padding = style.padding;

    var result = {
        width: processPixels(computedStyle['width'], rect.width),
        height: processPixels(computedStyle['height'], rect.height),
        minWidth: computedStyle['min-width'] === 'none' ? null : processPixels(computedStyle['min-width'], rect.width),
        maxWidth: computedStyle['max-width'] === 'none' ? null : processPixels(computedStyle['max-width'], rect.width),
        minHeight: computedStyle['min-height'] === 'none' ? null : processPixels(computedStyle['min-height'], rect.height),
        maxHeight: computedStyle['max-height'] === 'none' ? null : processPixels(computedStyle['max-height'], rect.height),
        containerSize: {
            width: null,
            height: null
        }
    };

    if (result.minWidth != null && result.maxWidth != null && result.minWidth > result.maxWidth) {
        result.maxWidth = result.minWidth;
    }

    if (result.maxHeight != null && result.maxHeight != null && result.minHeight > result.maxHeight) {
        result.maxHeight = result.minHeight;
    }

    if (result.width == null) {
        result.width = measureText(contentText, font) + border.left.width + border.right.width + padding.left + padding.right;
    }
    result.minWidth && result.width < result.minWidth && (result.width = result.minWidth);
    result.maxWidth && result.width > result.maxWidth && (result.width = result.maxWidth);
    result.containerSize.width = result.width - border.left.width - border.right.width - padding.left - padding.right;
    result.content = adaptationText(contentText, font, result.containerSize.width);

    if (result.height == null) {
        result.height = border.top.width + border.bottom.width + (padding.top + padding.bottom) + style.font.lineHeight * result.content.length;
    }
    result.minHeight && result.height < result.minHeight && (result.height = result.minHeight);
    result.maxHeight && result.height > result.maxHeight && (result.height = result.maxHeight);
    result.containerSize.height = result.height - border.top.width - border.bottom.width - padding.top - padding.bottom;

    return result;
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
        var defaultVals = ['auto', 'cover', 'contain'];
        var match = size.split(splitReg).filter(function (item) {
            return item != null;
        });

        if (match.length === 2) {
            return [processPixels(match[0], rect.width), processPixels(match[1], rect.height)];
        } else if (match.length === 1 && !defaultVals.includes(match[0])) {
            return [processPixels(match[0], rect.width), processPixels(match[0], rect.height)];
        } else {
            return size;
        }
    }

    var setting = {
        color: style['background-color'],
        origin: style['background-origin'],
        clip: style['background-clip'],
        position: {
            // TODE: 图像定位
            // x: rect.width / 2 - processPixels(style['background-position'].split(' ')[0], rect.width),
            // y: rect.height / 2 - processPixels(style['background-position'].split(' ')[1], rect.height)
            x: 0, y: 0
        },
        repeat: style['background-repeat'],
        size: filterSize(style['background-size']),
        image: style['background-image']
    };
    // linear-gradient(50deg, rgb(0, 0, 0), rgb(255, 0, 0) 50%, rgb(0, 153, 0))
    if (setting.image.match(/^url\("(.+)"\)$/)) {
        setting._imageType = 'image';
        setting._imageUrl = RegExp.$1;
    } else if (setting.image.match(/^linear-gradient\((.+)\)$/)) {
        var match = RegExp.$1.split(/,\sr/g).map(function (item, idx) {
            return idx === 0 ? item : 'r' + item;
        });
        var angle = ~match[0].indexOf('rgb') ? 180 : parseFloat(match.shift());

        setting._imageType = 'linear-gradient';
        setting._imageGradient = {
            angle: angle,
            stopPoint: match.map(function (item) {
                var ms = item.match(/^(rgb\(.+\))\s*(\S*)$/);
                if (ms[2] === '') errorInfo('The linear gradient format should follow "linear-gradient(50deg, #000 0%, #f00 50%, #090 100%)"');

                return [ms[1], ms[2]];
            })
        };
    }

    return setting;
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
    return Object.keys(border).reduce(function (result, key) {
        var match = border[key].split(splitReg).filter(function (item) {
            return item != null;
        });

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
    var match = csstext.split(' ');

    if (match.length === 1) {
        match = Array(2).fill(match[0]);
    }

    return [processPixels(match[0], rect.width, rect.width / 2), processPixels(match[1], rect.height, rect.height / 2)];
}

/**
 * 格式化 boxShadow
 *
 * @param {String} csstext 阴影样式
 * @return {Array} 阴影配置
 */
function formatBoxShadow(csstext) {
    var shadows = csstext === 'none' ? [] : csstext.split(', r').filter(function (set) {
        return set != null;
    }).map(function (set, idx) {
        var match = (idx === 0 ? set : 'r' + set).split(splitReg).filter(function (item) {
            return item != null;
        });
        return {
            color: match[0],
            offsetX: parseFloat(match[1]),
            offsetY: parseFloat(match[2]),
            blur: parseFloat(match[3])
        };
    });

    return shadows;
}

/**
 * 格式化样式配置
 *
 * @param {Object} computedStyle 获取到的样式配置
 * @param {Object} rect canvas boundingClientRect
 * @param {Object} utils 工具方法
 * @param {Function} utils.adaptationText 文本内容适配器
 * @param {Function} utils.measureText 文本测量
 * @return {Object}
 */
function formatStyle(computedStyle, rect, utils) {
    var style = {
        position: 'absolute',
        left: processPixels(computedStyle.left, rect.width),
        top: processPixels(computedStyle.top, rect.height),
        right: processPixels(computedStyle.right, rect.width),
        bottom: processPixels(computedStyle.bottom, rect.width),
        zIndex: computedStyle['z-index'] === 'auto' ? 0 : computedStyle['z-index'],
        overflow: ['hidden', 'visible'].includes(computedStyle['overflow']) ? computedStyle['overflow'] : 'visible',

        display: computedStyle.display,
        padding: {
            top: parseFloat(computedStyle['padding-top']),
            left: parseFloat(computedStyle['padding-left']),
            right: parseFloat(computedStyle['padding-right']),
            bottom: parseFloat(computedStyle['padding-bottom'])
        },
        boxShadow: formatBoxShadow(computedStyle['box-shadow']),

        font: formatFontStyle(computedStyle),

        border: formatBorderStyle({
            top: computedStyle['border-top'],
            left: computedStyle['border-left'],
            right: computedStyle['border-right'],
            bottom: computedStyle['border-bottom']
        })
    };

    Object.assign(style, formatSize(computedStyle, style, rect, utils));

    style.left === null && style.right === null && (style.left = 0);
    style.top === null && style.bottom === null && (style.top = 0);

    var padding = style.padding,
        width = style.width,
        height = style.height;

    return _extends({}, style, {
        background: formatBackground(computedStyle, {
            width: style.width - padding.left - padding.right,
            height: style.height - padding.top - padding.bottom
        }),
        borderRadius: {
            'top-left': formatBorderRadiusStyle(computedStyle['border-top-left-radius'], { width: width, height: height }),
            'top-right': formatBorderRadiusStyle(computedStyle['border-top-right-radius'], { width: width, height: height }),
            'bottom-left': formatBorderRadiusStyle(computedStyle['border-bottom-left-radius'], { width: width, height: height }),
            'bottom-right': formatBorderRadiusStyle(computedStyle['border-bottom-right-radius'], { width: width, height: height })
        },
        startX: style.left === null ? rect.width - style.right - width : style.right === null ? style.left : style.left >= style.right ? style.left : rect.width - style.right - width,
        startY: style.top === null ? rect.height - style.bottom - height : style.bottom === null ? style.top : style.top >= style.bottom ? style.top : rect.height - style.bottom - height
    });
}

export { processPixels, formatSize, formatFontStyle, formatBackground, formatBorderStyle, formatBorderRadiusStyle, formatBoxShadow, formatStyle };