
Page({
    data: {
        csstext: `
            background-color: #432434;
            content: "${'这是我的内容啊'}"
        `
    },

    onReady() {

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
