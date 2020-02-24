let globalData = getApp().globalData;
const util = require('../../utils/util.js')
Page({
	data: {
		version: globalData.version,
		logList: [{
				version: "origin",
				date: "2020-02-23",
				log: ["本项目稳定后，会同步同时编写QQ小程序Web端等，项目发起人为某差生。"]
			},
			{
				version: "0.9.0",
				date: "2020-02-24",
				log: ["1.增加「我」页面", "2.bug修复，以及部分兼容问题修复，代码优化"]
			}
		].reverse()
	},
	onLoad: function(options) {

	},
	getLink(e) {
		let link = e.currentTarget.dataset.link
		wx.setClipboardData({
			data: link,
			success(res) {
				wx.getClipboardData({
					success(res) {
						util.toast("链接已复制", 2000, true)
					}
				})
			}
		})
	}
})
