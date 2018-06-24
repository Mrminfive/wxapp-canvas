
/**
 * @description 自定义节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

const { behaviors } = requirePlugin('wxappCanvas');

Component({
    externalClasses: ['class-name'],

    behaviors: [
        behaviors.element
    ],

    relations: {
        'element': {
            type: 'ancestor',
            target: behaviors.wxappCanvasBehavior
        }
    },

    methods: {
        /**
         * 用于自定义渲染内容
         *
         * @api public
         */
        render() {
            // do some thing
        },

        /**
         * 用于预加载资源
         *
         * @return {Promise}
         * @api public
         */
        preload() {
            // do some thing
            return Promise.resolve();
        }
    }
});
