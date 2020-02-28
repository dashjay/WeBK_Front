//app.js

import regeneratorRuntime from './utils/regenerator-runtime/runtime'
App({
	globalData: {
		version: "0.9.2",
		// 一个学期开始的时间
		"start": {
			"year": 2020,
			"month": 2,
			"day": 24
		},
		classtable: [],
		session: "",
		openid: "",
		color_data: {
			color: "#987332",
			text_color: "#FFFFFF"
		},
		server: "https://dev.vincenteliang.cn/"
	},
	onLaunch() {

		// 课程表颜色
		let color_data = wx.getStorageSync("color_data")
		if (color_data) {
			this.globalData.color_data = color_data
			wx.setNavigationBarColor({ //设置导航栏颜色
				frontColor: '#ffffff', //注意frontColor的值只能为000000或者111111
				backgroundColor: color_data.color,
				animation: {
					duration: 600,
					timingFunc: 'easeInOut'
				}
			});
		}
	},
	GetCode() {
		return new Promise(function(resolve, reject) {
			wx.login({
				success: (res) => {
					resolve(res.code)
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	},

	Code2Session(code) {
		let that = this;
		return new Promise(function(resolve, reject) {
			wx.request({
				url: that.globalData.server + "api/login?code=" + code,
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					reject(err)
				},
				complete: () => {
					wx.hideLoading();
				}
			})
		}).catch(err => {
			return err
		})
	}
})
