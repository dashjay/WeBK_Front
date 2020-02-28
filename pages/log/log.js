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
				log: ["1.增加「我」页面", "2.bug修复，以及部分兼容问题修复，代码优化，样式调整"]
			},
			{
				version: "0.9.1",
				date: "2020-02-26",
				log: ["1.修复日期功能", "2.修复课表获取不到问题"]
			},
			{
				version: "0.9.2",
				date: "2020-02-27",
				log: ["1.自定义背景和字体颜色", "2.优化过度效果"]
			},
			{
				version: "0.9.3",
				date: "2020-02-28",
				log: ["1.自定义背景图片"]
			}, {
				version: "0.9.4",
				date: "2020-02-28",
				log: ["1.紧急修复变量重名漏洞", "2.增加自定义图片设置"]
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
