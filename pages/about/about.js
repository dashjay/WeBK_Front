let globalData = getApp().globalData;
const util = require('../../utils/util.js')
Page({
	data: {
		memberName: 'echo.', //昵称
		isLogin: false,
		color: "",
		navigate: [{
			url: "/pages/table/table",
			type: "switchTab",
			text: "我的课表"
		}],
		copyright: " Copyright © 2019-2020 贝壳杂货铺"

	},
	onLoad: function(options) {
		this.setData({
			color: globalData.color_data.color
		})
		wx.setNavigationBarColor({ //设置导航栏颜色
			frontColor: '#ffffff', //注意frontColor的值只能为000000或者111111
			backgroundColor: globalData.color_data.color,
			animation: {
				duration: 600,
				timingFunc: 'easeInOut'
			}
		});
	},
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
		wx.showModal({
			title: "修复课表",
			content: "该操作清理所有缓存,慎用此功能,您是否还要继续?",
			confirmColor: "red",
			confirmText: "清除缓存",
			cancelColor: "blakc",
			cancelText: "返回",
			success(res) {
				if (res.confirm) {
					try {
						wx.clearStorage()
						wx.showToast({
							title: "正在重启,请稍等",
							icon: "none",
							duration: 1000
						})
						setTimeout(function() {
							wx.reLaunch({
								url: "/pages/table/table"
							})
						}, 1000);

					} catch (e) {
						wx.showToast({
							title: e,
							icon: "none"
						})
						wx.reLaunch({
							url: "/pages/table/table"
						})
					}
				}
			}
		})
	}
})
