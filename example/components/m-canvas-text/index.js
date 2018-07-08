
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
            target: behaviors.wxappCanvasBehavior,
            linked(target) {
                this.$canvas = target;
            }
        }
    },

    methods: {
        /**
         * 用于自定义渲染内容
         *
         * @api public
         */
        render(ctx) {
            // do some thing
            let { font, startX, startY, content } = this._style;
            ctx.font = `${font.style} ${font.weight} ${font.size}px ${font.family}`;
            ctx.fillStyle = font.color;
            ctx.textBaseline = 'middle';
            content.forEach(item => {
                ctx.fillText(
                    item.text,
                    startX,
                    startY
                );
            });
            console.log('draw');
        },

        /**
         * 用于预加载资源
         *
         * @return {Promise}
         * @api public
         */
        preload(rect, adaptationText) {
            return this._preload(rect, adaptationText)
                .then(() => {
                    // do some thing
                });
        }
    }
});
