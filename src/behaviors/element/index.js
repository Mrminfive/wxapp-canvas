
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
         * @param {Object} utils 工具方法
         * @param {Function} utils.adaptationText 文本内容适配器
         * @param {Function} utils.measureText 文本测量
         * @return {Promise}
         * @api private
         */
        _getComputedStyle(rect, utils) {
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
                            'min-width',
                            'max-width',
                            'min-height',
                            'max-height',
                            'overflow',
                            'color',
                            'font-size',
                            'font-weight',
                            'font-family',
                            'font-variant',
                            'font-style',
                            'font-stretch',
                            'text-align',
                            'vertical-align',
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
                        const style = formatStyle(res, rect, utils);
                        this._style = style;

                        if (style.background.image.match(/^url\("(.+)"\)$/)) {
                            const url = RegExp.$1;
                            style.background._src = url;
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
         * @param {Object} utils 工具方法
         * @param {Function} utils.adaptationText 文本内容适配器
         * @param {Function} utils.measureText 文本测量
         * @return {Promise}
         * @api private
         */
        async _preload(rect, utils) {
            this._changeCsstext && await this._getComputedStyle(rect, utils);
            const resources = Object.keys(this._resources);

            await asyncEach(resources, async key => {
                if (this._resources[key] == null) {
                    this._resources[key] = await downloadImage(key);
                }
            });
        }
    }
});
