const app = getApp()
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'

Page({
	data: {
		colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
		lastX: 0,
		currentGesture: '',
		week_num: 3,
		uid: '',
		modal: false,
		button: [{
			text: "给他评价",
			type: 'blue',
			plain: true
		}, ],
		current_course: null,
		animation: true,

		durations: ["8:00-9:35", "9:55-11:30", "1:30-3:05", "3:20-4:55"]
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
		let session = wx.getStorageSync("session")
		if (session) {
			app.globalData.session = session;
		}
	},

	async Login() {
		let that = this;
		// 获取到Code
		let code = await app.GetCode()
		let Rescode2Session = await app.Code2Session(code)
		// 获取成功
		if (Rescode2Session.data.status) {
			let obj = Rescode2Session.data.object;
			app.globalData.session = obj.session_key;
			wx.setStorageSync("session", obj.session_key)
			console.log("储存session成功", obj.session_key)

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
					title: "登录成功"
				})
			}
		} else {
			this.incrementZero();
		}
	},

	LoadData() {
		let that = this;
		wx.request({
			url: app.globalData.server + "api/get_table?session=" + app.globalData.session,
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



})
