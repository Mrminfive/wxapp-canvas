
Page({
    onReady() {
        console.log(this)
        console.log('canvas-text', this.selectComponent('#canvas-text'));
        console.log('wxapp-canvas', this.selectComponent('#wxapp-canvas'))
    },

    bindtap() {
        this.$refs['wxapp-canvas'].fun();
    },

    bindRefs(event) {
        this.$refs = {
            ...this.$refs,
            'wxapp-canvas': event.detail
        };
    }
});