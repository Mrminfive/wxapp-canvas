
/**
 * @description 自定义节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

const { element } = requirePlugin('wxappCanvas');

Component({
    behaviors: [
        element
    ],

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
