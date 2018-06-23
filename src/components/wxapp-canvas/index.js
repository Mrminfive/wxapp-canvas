
/**
 * @description cancas节点
 * @author: minfive
 * @createDate: 2018-06-24
 * @lastModify minfive
 * @lastDate: 2018-06-24
 */

Component({
    data: {
        name: 'wxapp-canvas'
    },

    methods: {
        async fun() {
            console.log('aaa');
            console.log('bbb');
        }
    },

    attached() {
        this.triggerEvent('ref', this);
    }
});
