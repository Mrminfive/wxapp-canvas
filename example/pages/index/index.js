
Page({
    data: {
        csstext: `
            content: "${'这是我的内容啊'}"
        `
    },

    onReady() {

    },

    bindtap() {
        wx.showLoading({
            title: '拼命绘制中'
        });
        this.$refs['wxapp-canvas']
            .draw()
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    bindRefs(event) {
        this.$refs = {
            ...this.$refs,
            'wxapp-canvas': event.detail
        };
    }
});
