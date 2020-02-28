let globalData = getApp().globalData;

Page({
	data: {
		bg_img: "",
		valuex: 100,
		valuey: 100,
		background_repeat: 'no-repeat',
		background_size: 'cover',
		background_position: 'center',
		dataList: [{
			key: "left top",
			name: "左上",
			size: 30
		}, {
			key: "center top",
			name: "中上",
			size: 30
		}, {
			key: "right top",
			name: "右上",
			size: 30
		}, {
			key: "left center",
			name: "左中",
			size: 30
		}, {
			key: "center center",
			name: "中央",
			size: 30
		}, {
			key: "right center",
			name: "右中",
			size: 30
		}, {
			key: "left bottom",
			name: "左下",
			size: 30
		}, {
			key: "center bottom",
			name: "中下",
			size: 30
		}, {
			key: "right bottom",
			name: "右下",
			size: 30
		}]
	},
	onLoad: function(options) {
		let base64img = wx.getStorageSync('base64img')
		if (base64img) {
			this.setData({
				bg_img: base64img
			})
		}
	},

	detail: function(e) {

		let s = e.currentTarget.dataset.s
		let t = e.currentTarget.dataset.t
		switch (s) {
			case "repeat":
				this.setData({
					background_repeat: t
				})
				break;
			case "size":

				this.setData({
					background_size: t
				})
				break
			case "position":
				this.setData({
					background_position: t
				})
		}
	},

	changex: function(e) {
		let x = e.detail.value;
		let y = this.data.valuey;
		let target = x.toString() + "% " + y.toString() + "%"

		this.setData({
			valuex: e.detail.value,
			background_size: target
		})
	},
	changey: function(e) {
		let x = e.detail.value;
		let y = this.data.valuey;
		let target = x.toString() + "% " + y.toString() + "%"
		this.setData({
			valuey: e.detail.value,
			background_size: target
		})
	},

	confirm() {
		let setting = {
			background_repeat: this.data.background_repeat,
			background_position: this.data.background_position,
			background_size: this.data.background_size,
		}

		wx.setStorageSync("setting", setting)
		wx.navigateBack({})
	}

})
