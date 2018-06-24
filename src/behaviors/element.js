
/**
 * @description canvas 内节点基本特征
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import { asyncEach, downloadFile } from '../utils.js';

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
    },

    methods: {
        /**
         * 获取当前样式值
         *
         * @param {Object} rect canvas boundingClientRect
         * @return {Promise}
         * @api private
         */
        _getComputedStyle() {
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
                            'font',
                            'line-height',
                            'padding-top',
                            'padding-bottom',
                            'padding-left',
                            'padding-right',
                            'background',
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
                        console.log(res);
                        resolve();
                    }
                ).exec();
            });
        },

        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @return {Promise}
         * @api private
         */
        async _preload(rect) {
            this._changeCsstext && await this._getComputedStyle(rect);
            const resources = Object.keys(this._resources);

            await asyncEach(resources, async key => {
                if (this._resources[key] == null) {
                    this._resources[key] = await downloadFile(key);
                }
            });
        }
    }
});
