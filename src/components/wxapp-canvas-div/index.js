
/**
 * @description 内嵌节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

import behaviors from '../../behaviors/index.js';

Component({
    behaviors: [
        behaviors.element
    ],

    data: {
        name: 'wxapp-canvas-div'
    },

    methods: {
        /**
         * 用于渲染内容
         *
         * @api public
         */
        render() {
            console.log('bbb');
        },

        /**
         * 用于预加载资源
         *
         * @return {Promise}
         * @api public
         */
        async preload() {
            return Promise.resolve();
        }
    }
});
