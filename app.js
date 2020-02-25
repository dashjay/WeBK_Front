//app.js

import regeneratorRuntime from './utils/regenerator-runtime/runtime'
App({
	globalData: {
		version: "0.9.0",
		"start": {
			"year": 2020,
			"month": 2,
			"day": 24
		},
		classtable: [],
		session: "",
		server: "http://localhost:8088/"
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
