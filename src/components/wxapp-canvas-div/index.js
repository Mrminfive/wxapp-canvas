
/**
 * @description 内嵌节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import behaviors from '../../behaviors/index.js';

Component({
    externalClasses: ['class-name'],

    behaviors: [
        behaviors.element
    ],

    relations: {
        'element': {
            type: 'ancestor',
            target: behaviors.wxappCanvasBehavior,
            linked(target) {
                this.$canvas = target;
            }
        }
    },

    data: {
        name: 'wxapp-canvas-div'
    },

    methods: {
        /**
         * 用于渲染内容
         *
         * @param {Object} ctx canvas 上下文
         * @param {Object} rect canvas boundingClientRect
         * @api public
         */
        render(ctx, rect) {
            console.log('bbb');
        },

        /**
         * 用于预加载资源
         *
         * @param {Object} rect canvas boundingClientRect
         * @return {Promise}
         * @api public
         */
        async preload(rect) {
            await this._preload(rect);
            console.log('div');
        }
    }
});
