let globalData = getApp().globalData;
const util = require('../../utils/util.js')
Page({
	data: {
		loadding: false,
		show: false,
		bottom: 0,
		current: 0,
		conv: "1",
		beauty: 3,
		response: 3,
		text: ""
	},
	onLoad: function(options) {

	},
	change: function(e) {
		let a = e.currentTarget.dataset.type
		switch (a) {
			case "beauty":
				this.setData({
					beauty: e.detail.index
				})
				return
			case "response":
				this.setData({
					response: e.detail.index
				})
				return
		}
	},
	// 更改radio选项
	tapChange: function(e) {
		this.setData({
			conv: e.detail.value
		})

	},
	// 输入
	Input: function(e) {
		this.setData({
			text: e.detail.value
		})
	},
	// 提交表单
	Submit: function() {
		wx.showLoading({
			mask: true
		})
		let data = {
			beauty: this.data.beauty,
			response: this.data.response,
			conv: this.data.conv,
			text: this.data.text
		}
		wx.request({
			url: globalData.server + "api/rate",
			method: "POST",
			header: {
				'session': globalData.session
			},
			data: data,
			success: (res) => {
				wx.showToast({
					title:"评价成功",
				})
				setTimeout(function() {
					wx.navigateBack({})
				}, 600);
			},
			complete: () => {
				wx.hideLoading()
			}
		})
	}
})
