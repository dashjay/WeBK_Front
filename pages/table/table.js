const app = getApp()
const util = require('../../utils/util.js')
const fab = require("../../utils/fab.js")
const colors = require("../../utils/colors.js")
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'

Page({
	data: {
		//fabs
		left: 0,
		right: 80,
		bottom: 100,
		bgColor: app.globalData.color_data.color,
		tColor: "#FFFFFF",
		//fabs end

		//drawer
		regionArr: colors,
		showModalStatus: false,
		animationData: "",
		regionTxt: "粤",
		tabIndex: 26,
		//drawer
		lastX: 0,
		currentGesture: '',
		week_num: 1,
		uid: '',
		list: fab,
		modal: false,
		button: [{
			text: "给他评价",
			type: 'blue',
			plain: true
		}],
		current_course: null,
		animation: true,
		week: ['一', '二', '三', '四', '五'],
		date_list: [],
		durations: ["8:00-9:35", "9:55-11:30", "1:30-3:05", "3:20-4:55"],
		bg_img: "",
	},


	isNotExisted: function(item) {
		if (item == "" || item == null) {
			return true
		}
		return false
	},

	haveData: function() {
		if (
			this.isNotExisted(app.globalData.classtable) ||
			this.isNotExisted(app.globalData.start)
		) {
			return false
		}
		return true
	},
	onLoad: function(options) {
		let table = wx.getStorageSync("classtable")
		if (table) {
			app.globalData.classtable = table;
		}
		let openid = wx.getStorageSync("openid")
		if (openid) {
			app.globalData.openid = openid;
		}

		let bg_img = wx.getStorageSync('bg_img')
		if (bg_img) {
			this.setData({
				bg_img: bg_img
			})
		}

		this.SetColor(app.globalData.color_data)
	},

	async Login() {
		let that = this;
		// 获取到Code
		let code = await app.GetCode()
		let Rescode2Session = await app.Code2Session(code)
		// 获取成功
		if (Rescode2Session.data.status) {
			let obj = Rescode2Session.data.object;
			app.globalData.openid = obj.openid;
			wx.setStorageSync("openid", obj.openid)

			wx.showToast({
				title: "首次开启小程序,下拉获取课表",
				icon: "none",
				duration: 1500
			})
		} else {
			wx.showModal({
				title: "登录失败,请稍后重试",
				confirmColor: "green",
				confirmText: "重试",
				cancelColor: "red",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						ws.showLoading()
						setTimeout(function() {
							that.Login()
						}, 1000);
					} else {
						wx.showToast({
							title: "当前程序出错",
							icon: "none"
						})
					}
				}
			})
		}
	},

	onShow: function() {
		// 如果没有数据
		if (!this.haveData()) {
			if (app.globalData.session == "") {
				this.Login();
			} else {
				wx.showToast({
					title: "登录成功,下拉尝试获取课表",
					icon: "none"
				})
			}
		} else {
			this.incrementZero();
		}
	},

	LoadData() {
		let that = this;
		wx.request({
			url: app.globalData.server + "api/get_table",
			header: {
				openid: app.globalData.openid,
			},
			success(res) {
				if (res.data.code == "SUCCESS") {
					let body = res.data.body;

					for (var i = 1; i <= Object.keys(body.map).length; i++) { //每天6节课 12个时区

						for (var j = 1; j <= Object.keys(body.map[i]).length; j++) { // 七天

							if (Object.keys(body.map[i][j]).length == 0) {
								continue;
							}


							// console.log(body.map[i][j]) // 第j天的第i节课
							body.map[i][j].forEach(x => {

								var weeks
								let getweek = x.SKZCZFC.replace("周", "")
								if (getweek.indexOf("单") != -1) {
									let temp = getweek.replace("单", "")
									weeks = that.SplitRange(temp, '单')

								} else if (getweek.indexOf("双") != -1) {
									let temp = getweek.replace("双", "")
									weeks = that.SplitRange(temp, '双')

								} else {
									weeks = that.SplitRange(getweek, '无')

								}

								app.globalData.classtable.push({
									"name": x.courseName,
									"place": (x["classroom.roomNickname"] != null ? x["classroom.roomNickname"] : '未知地点'),
									"day_of_week": j, // 周几
									"class_of_day": (i * 2) - 1, //第几节课
									"duration": 2,
									"week_num": weeks,
									"id": x["classroom.id"],
								})
							})


						}
					}
				} else {
					wx.showModal({
						title: "获取课表失败",
						content: "未在公众号绑定贝壳教务,关注「贝壳杂货铺」后,在菜单实现绑定后方可使用此功能。",
						confirmColor: "#0f0",
						confirmText: "二维码",
						cancelColor: "#f00",
						cancelText: "下次再说",
						success: (res) => {
							if (res.confirm) {
								wx.previewImage({
									urls: ["https://misc-1256941979.cos.ap-chengdu.myqcloud.com/qrcode_for_gh_88acb973f6e6_258.jpg"]
								})
							}
						}
					})
				}

				wx.setStorageSync("classtable", app.globalData.classtable)
				that.incrementZero();
			}
		})
	},

	onPullDownRefresh: function() {
		setTimeout(this.LoadData, 500)
		setTimeout(wx.stopPullDownRefresh, 500)
	},

	getWeekList: function(diff_day) {
		var week_num = parseInt(diff_day / 7 + 1)
		this.setData({
			week_num: week_num,
		})
		var week_list = []

		for (var i = 0; i < app.globalData.classtable.length; i++) {
			if (app.globalData.classtable[i].week_num.indexOf(week_num) != -1) {
				// console.log(app.globalData.classtable[i])
				week_list.push({
					day_of_week: app.globalData.classtable[i].day_of_week,
					class_of_day: app.globalData.classtable[i].class_of_day,
					duration: app.globalData.classtable[i].duration,
					name: app.globalData.classtable[i].name,
					place: app.globalData.classtable[i].place,
					id: app.globalData.classtable[i].id
				})
			}
		}
		return week_list
	},

	updateScreen: function() {
		if (!this.haveData()) {
			return
		}
		// 获得今天日期
		var now = new Date()

		// 获得开始日期
		var temp = app.globalData.start
		var start = new Date(temp.year, temp.month - 1, temp.day)


		var diff_day_without_increment = parseInt((now - start) / (1000 * 60 * 60 * 24))

		var diff_day = diff_day_without_increment + this.data.increment
		if (diff_day < 0) {
			diff_day = 0
		}

		var week_list = this.getWeekList(diff_day)
		this.setData({
			week_list: week_list
		})

		wx.setNavigationBarTitle({
			title: "第" + this.data.week_num + "周"
		})

		let temp_date = []
		var temp = 0;
		for (; temp < 5; temp++) {
			var ags = app.globalData.start
			var today = new Date(ags.year, ags.month - 1, ags.day)
			today.setDate(start.getDate() + temp + ((this.data.week_num - 1) * 7))

			temp_date.push(today.getMonth() + "/" + today.getDate())
		}
		this.setData({
			date_list: temp_date
		})
	},

	FormatTime(t) {
		return t.getMonth() + "/" + t.getDate()
	},
	incrementAdd: function() {
		var increment = this.data.increment + 7
		this.setData({
			increment: increment
		})
		this.updateScreen()
	},

	incrementSub: function() {
		var increment = this.data.increment - 7
		this.setData({
			increment: increment
		})
		this.updateScreen()
	},

	incrementZero: function() {
		this.setData({
			increment: 0
		})


		this.updateScreen()
	},


	handleTouchMove: function(event) {
		var currentX = event.touches[0].pageX
		var tx = currentX - this.data.lastX
		if (tx < -100) {
			this.data.currentGesture = 'left'
		} else if (tx > 100) {
			this.data.currentGesture = 'right'
		}
	},


	handleTouchStart: function(event) {
		this.data.lastX = event.touches[0].pageX
	},

	handleTouchEnd: function(event) {
		// console.log(this.data.currentGesture);
		if (this.data.currentGesture == 'left') {
			this.incrementAdd()
		}
		if (this.data.currentGesture == 'right') {
			this.incrementSub()
		}
		this.data.currentGesture = 0;
	},


	SplitRange: function(str, type) {
		let weeks = []
		let temp = str.split("-")
		if (temp.length > 1) {
			let f = Number(temp[0])
			let t = Number(temp[1])
			// 处理单双
			if (type == '双') {
				for (; f <= t; f++) {
					if (f % 2 == 0) {
						weeks.push(f)
					}
				}
			}

			if (type == '单') {
				for (; f <= t; f++) {
					if (f % 2 == 1) {
						weeks.push(f)
					}
				}
			}

			if (type == '无') {
				for (; f <= t; f++) {
					weeks.push(f)
				}
			}

		} else {
			weeks.push(Number(temp[0]))
		}
		return weeks;
	},
	OnClick: function(e) {
		var target
		let id = e.currentTarget.dataset.id
		// console.log(id);
		this.data.week_list.forEach(x => {
			if (x.id == id) {
				target = x;
				return
			}
		})

		this.setData({
			current_course: target,
			modal: true,
		})

		// console.log(target);
	},
	handleClick: function(e) {
		console.log(e);
		wx.showToast({
			title: "当前功能正在开发",
			icon: "none",
		})
	},

	hideModal: function() {
		this.setData({
			modal: false
		})
	},
	onShareAppMessage: function(e) {
		return {
			title: '快看看你的课表',
			path: 'pages/table/table'
		}
	},
	onClick(e) {
		let that = this;
		let index = e.detail.index
		switch (index) {
			case -1:
				break;
			case 0:
				this.showModal()
				break;
			case 1:
				wx.chooseImage({
					count: 1,
					success(res) {
						// 获取临时存储路径
						const tfp = res.tempFilePaths
						const fs = wx.getFileSystemManager()
						fs.saveFile({
							tempFilePath: tfp[0], // 传入一个临时文件路径
							success(res) {
								// console.log('图片缓存成功', res.savedFilePath) // res.savedFilePath 为一个本地缓存文件路径  
								wx.setStorageSync('bg_img', res.savedFilePath)
								that.setData({
									bg_img: res.savedFilePath
								})
								wx.showToast({
									title: "设置成功",
								})
							}
						})
					}
				})
				break;
			case 2:
				util.toast("您点击了悬浮按钮2");
				break;
			default:
				break;
		}
	},

	// Drawer start
	showModal: function() {
		// 显示遮罩层
		// 创建动画实例 
		var animation = wx.createAnimation({
			duration: 220,
			timingFunction: "linear",
			delay: 0
		})
		//执行第一组动画：Y轴偏移500px后(盒子高度是500px) ，停
		animation.translateY(500).step()
		//导出动画对象赋给数据对象储存
		this.setData({
			animationData: animation.export(),
			showModalStatus: true
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this), 200)
	},

	// 点击空白区域关闭颜色盘
	hideModal: function() {
		this.setData({
			showModalStatus: false
		})
	},

	// 切换颜色
	getRegion: function(e) {
		// 获取选择的列表
		const index = e.currentTarget.dataset.index
		let t = this.data.regionArr[index]
		this.setData({
			regionTxt: this.data.regionArr[index],
			tabIndex: index,
			showModalStatus: false,
			bgColor: t.color,
			tColor: t.text_color
		})

		app.globalData.color_data = t // 将全局的颜色设置为该颜色方便其他页面跟着选择
		this.SetColor(t)

	},
	SetColor(t) {
		wx.setNavigationBarColor({ //设置导航栏颜色
			frontColor: '#ffffff', //frontColor的值只能为000000或者111111
			backgroundColor: t.color,
			animation: {
				duration: 600,
				timingFunc: 'easeInOut'
			}
		});

		wx.setStorageSync("color_data", t);

		let rea = this.data.regionArr
		for (var i = 0; i < 18; i++) {
			rea[i].text_color = t.text_color
		}
		for (var i = 18; i < rea.length; i++) {
			rea[i].color = t.color
		}

		this.setData({
			regionArr: rea
		})
	}
	//Drawer end

})
