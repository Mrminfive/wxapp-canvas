
/**
 * @description canvas 内节点基本特征
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { asyncEach, downloadFile } from '../../utils.js';
import {
    processPixels,
    formatFontStyle,
    formatBackground,
    formatBorderStyle,
    formatBorderRadiusStyle
} from './format-style.js';

/**
 * 格式化样式配置
 *
 * @param {Object} computedStyle 获取到的样式配置
 * @param {Object} rect canvas boundingClientRect
 * @param {Function} adaptationText 文本内容适配器
 * @return {Object}
 */
function formatStyle(computedStyle, rect, adaptationText) {
    console.log(computedStyle);
    let style = {
        position: 'absolute',
        left: processPixels(computedStyle.left, rect.width),
        top: processPixels(computedStyle.top, rect.height),
        right: processPixels(computedStyle.right, rect.width),
        bottom: processPixels(computedStyle.bottom, rect.width),
        zIndex: computedStyle['z-index'] === 'auto' ? 0 : computedStyle['z-index'],

        display: computedStyle.display,
        justifyContent: computedStyle['justify-content'],
        alignItems: computedStyle['align-items'],
        padding: {
            top: parseFloat(computedStyle['padding-top']),
            left: parseFloat(computedStyle['padding-left']),
            right: parseFloat(computedStyle['padding-right']),
            bottom: parseFloat(computedStyle['padding-bottom'])
        },

        font: formatFontStyle(computedStyle),

        border: formatBorderStyle({
            top: computedStyle['border-top'],
            left: computedStyle['border-left'],
            right: computedStyle['border-right'],
            bottom: computedStyle['border-bottom']
        })
    };
    let { border, padding } = style;
    let width = processPixels(computedStyle.width, rect.width);
    let containerWidth = width - (border.left.width + border.right.width) - (padding.left + padding.right);
    style.content = adaptationText(computedStyle.content.slice(1, -1), `${style.font.style} ${style.font.weight} ${style.font.size}px ${style.font.family}`, containerWidth);
    let height = computedStyle.height === 'auto'
        ? (border.top.width + border.bottom.width) + (padding.top + padding.bottom) + style.font.lineHeight * style.content.length
        : processPixels(computedStyle.height, rect.height);
    let containerHeight = height - (border.top.width + border.bottom.width) - (padding.top + padding.bottom);

    return {
        ...style,
        width,
        height,
        containerSize: {
            width: containerWidth,
            height: containerHeight
        },
        background: formatBackground(
            computedStyle,
            { width, height }
        ),
        borderRadius: {
            'top-left': formatBorderRadiusStyle(computedStyle['border-top-left-radius'], { width, height }),
            'top-right': formatBorderRadiusStyle(computedStyle['border-top-right-radius'], { width, height }),
            'bottom-left': formatBorderRadiusStyle(computedStyle['border-bottom-left-radius'], { width, height }),
            'bottom-right': formatBorderRadiusStyle(computedStyle['border-bottom-right-radius'], { width, height })
        },
        startX: style.left >= style.right
            ? style.left
            : rect.width - style.right - width,
        startY: style.top >= style.bottom
            ? style.top
            : rect.height - style.bottom - height
    };
}

export default Behavior({
    properties: {
        csstext: {
            type: String,
            value: '',
            async observer(val, oldVal) {
                if (val !== oldVal) this._changeCsstext = true;
            }
        }
    },

    created() {
        this._resources = {};
        this._changeCsstext = true;
    },

    methods: {
        /**
         * 获取当前样式值
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Function} adaptationText 文本内容适配器
         * @return {Promise}
         * @api private
         */
        _getComputedStyle(rect, adaptationText) {
            const node = wx.createSelectorQuery().in(this).select('#canvas-element');

            this._changeCsstext = false;

            return new Promise(resolve => {
                node.fields(
                    {
                        computedStyle: [
                            'position',
                            'left',
                            'right',
                            'bottom',
                            'top',
                            'z-index',
                            'display',
                            'width',
                            'height',
                            'justify-content',
                            'align-items',
                            'font-size',
                            'font-weight',
                            'font-family',
                            'font-variant',
                            'font-style',
                            'font-stretch',
                            'line-height',
                            'padding-top',
                            'padding-bottom',
                            'padding-left',
                            'padding-right',
                            'background-color',
                            'background-position',
                            'background-size',
                            'background-repeat',
                            'background-origin',
                            'background-clip',
                            'background-color',
                            'background-image',
                            'border-left',
                            'border-right',
                            'border-top',
                            'border-bottom',
                            'border-top-left-radius',
                            'border-top-right-radius',
                            'border-bottom-left-radius',
                            'border-bottom-right-radius',
                            'box-shadow',
                            'content'
                        ]
                    },
                    res => {
                        const style = formatStyle(res, rect, adaptationText);
                        this._style = style;

                        if (style.background.image.match(/^url\("(.+)"\)$/)) {
                            const url = RegExp.$1;
                            this._resources[url] = this._resources[url];
                        }
                        resolve(style);
                    }
                ).exec();
            });
        },

        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @param {Function} adaptationText 文本内容适配器
         * @return {Promise}
         * @api private
         */
        async _preload(rect, adaptationText) {
            this._changeCsstext && await this._getComputedStyle(rect, adaptationText);
            const resources = Object.keys(this._resources);

            await asyncEach(resources, async key => {
                if (this._resources[key] == null) {
                    this._resources[key] = await downloadFile(key);
                }
            });
        }
    }
});
