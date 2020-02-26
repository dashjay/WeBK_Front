let globalData = getApp().globalData;
const util = require('../../utils/util.js')
Page({
	data: {
		memberName: 'echo.', //昵称
		isLogin: false
	},
	onLoad: function(options) {},
	onShow: function() {
		let isLogin = globalData.isLogin;
		if (isLogin) {
			this.setData({
				isLogin: isLogin,
				memberName: util.formatNum(wx.getStorageSync("thorui_mobile") || 'echo.')
			});
		}
	},
	logout: function() {
		wx.showModal({
			title: '提示',
			content: '确定退出登录？',
			confirmColor: '#5677FC',
			success: (res) => {
				if (res.confirm) {
					wx.clearStorage()
					wx.reLaunch({
						url: '../login/login'
					})
				}
			}
		});
	},
	edit() {
		wx.showToast({
			title: '功能开发中~',
			icon: "none"
		})
	},
	tapEvent: function(e) {
		let index = e.currentTarget.dataset.index;
		let url = "";
		switch (index) {
			case "1":
				wx.showToast({
					title: "开发中",
					icon: "none",
					duration: 1000
				})
				return;
			case "2":
				url = "../rate/rate"
				break;
			case "3":
				wx.showToast({
					title: "开发中",
					icon: "none",
					duration: 1000
				})
				break;
			case "6":
				{
					url = '../log/log'
					break;
				}
		}

		wx.navigateTo({
			url: url
		})
	},
	call: function() {
		wx.showModal({
			title: 'Contact Me',
			content: "wx号:zhaofang0903",
			confirmColor: "green",
			confirmText: "OK",
			showCancel: false,
		})
	},
	previewReward: function() {
		wx.previewImage({
			urls: ["https://misc-1256941979.cos.ap-chengdu.myqcloud.com/appraciate.JPG"]
		})
	}
})
