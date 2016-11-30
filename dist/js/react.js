webpackJsonp([2,3],[
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var MessagesAside = React.createClass({
		displayName: "MessagesAside",

		getInitialState: function getInitialState() {
			return { renderAside: 0, noData: false };
		},
		renderSocialInfo: function renderSocialInfo(renderData) {
			this.props.renderSocialInfo();
			//this.setState({renderAside : this.state.renderAside + 1});
		},
		renderSocialBtn: function renderSocialBtn(socialInfo) {
			this.props.renderSocialBtn(socialInfo);
		},
		noDataPop: function noDataPop() {
			this.setState({ noData: true });
		},
		render: function render() {
			return React.createElement(
				"div",
				{ className: "aside-inner" },
				React.createElement(AsideTop, { url: "/phoenix/admin/social/msg/userInfo" }),
				React.createElement(AsideBottom, { socialInfo: this.props.socialInfo, noDataPop: this.noDataPop, url: "/phoenix/admin/social/msg/socialInfo" }),
				React.createElement(ManageSocialBtn, { noDataPop: this.state.noData, renderSocialInfo: this.renderSocialInfo })
			);
		}
	});

	//用户信息组件
	var AsideTop = React.createClass({
		displayName: "AsideTop",

		getInitialState: function getInitialState() {
			return { userInfo: {} };
		},
		componentDidMount: function componentDidMount() {
			$.ajax({
				url: this.props.url,
				type: "get",
				dataType: "json",
				success: function (xhr) {
					xhr = typeof xhr == "string" ? JSON.parse(xhr) : xhr;
					this.setState({ userInfo: xhr });
				}.bind(this)
			});
		},
		render: function render() {
			return React.createElement(
				"div",
				{ className: "aside-top" },
				React.createElement("img", { className: "avatar", src: this.state.userInfo.usrPhotoUrl || "", alt: "" }),
				React.createElement(
					"p",
					{ className: "user-name" },
					this.state.userInfo.userName || ""
				),
				React.createElement(
					"p",
					{ className: "user-role" },
					this.state.userInfo.userRole || ""
				),
				React.createElement(
					"ul",
					{ className: "count" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"p",
							{ className: "num" },
							this.state.userInfo.msgCount || 0
						),
						React.createElement(
							"p",
							{ className: "desc" },
							"\u5DF2\u53D1\u9001\u4FE1\u606F"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"p",
							{ className: "num" },
							this.state.userInfo.scheduleMsgCount || 0
						),
						React.createElement(
							"p",
							{ className: "desc" },
							"\u5F85\u53D1\u5E03\u6D88\u606F"
						)
					)
				)
			);
		}
	});

	//社交媒体信息组件
	var AsideBottom = React.createClass({
		displayName: "AsideBottom",

		getInitialState: function getInitialState() {
			return { socialInfo: {} };
		},
		componentDidMount: function componentDidMount() {
			$.ajax({
				url: this.props.url,
				type: "get",
				dataType: "json",
				success: function (xhr) {
					xhr = typeof xhr == "string" ? JSON.parse(xhr) : xhr;
					if (xhr == "-1") {
						this.props.noDataPop();
					}
					this.setState({ socialInfo: xhr });
				}.bind(this)
			});
		},
		componentWillReceiveProps: function componentWillReceiveProps(param) {
			if (!!param.socialInfo) {
				this.setState({ socialInfo: param.socialInfo });
			}
			// $.ajax({
			// 	url : this.props.url,
			// 	type : "get",
			// 	dataType : "json",
			// 	success : (xhr) => {
			// 		xhr = (typeof xhr == "string") ? JSON.parse(xhr) : xhr;
			// 		this.setState({socialInfo : xhr});
			// 	}
			// });
		},
		connectEvent: function connectEvent(ev) {
			var parentLi = $(ev.target).parents("li");
			var providerId = parentLi.hasClass("facebook") ? "facebook" : parentLi.hasClass("twitter") ? "twitter" : "linkedin";
			window.open('/phoenix/admin/social/connect/' + providerId);
		},
		render: function render() {
			// console.log(this.state.socialInfo);
			if (this.state.socialInfo == "-1") {
				return React.createElement("ul", null);
			}
			var list = this.state.socialInfo.socialList || [],
			    linkedin = [],
			    linkedinExp = [],
			    facebook = [],
			    facebookExp = [],
			    twitter = [],
			    twitterExp = [],
			    reorderedList = [];
			if (!!list && (typeof list === "undefined" ? "undefined" : _typeof(list)) == "object") {
				//分六种情况重排序数据并生成虚拟DOM
				list.map(function (elem) {
					if (elem.provider == "linkedin") {
						if (!elem.isExpire && elem.isWritable) {
							//未过期的linkedin
							elem.klass = "linkedin";
							elem.personDesc = "CONTACTS";
							elem.iconClass = "fa fa-linkedin";
							elem.hr = false;
							linkedin.push(elem);
						} else {
							//已过期的linkedin
							elem.klass = "linkedin linkedinExp";
							elem.personDesc = "CONTACTS";
							elem.iconClass = "fa fa-linkedin";
							elem.hr = false;
							linkedinExp.push(elem);
						}
					} else if (elem.provider == "facebook") {
						if (!elem.isExpire && elem.isWritable) {
							//未过期的facebook
							elem.klass = "facebook";
							elem.personDesc = "FOLLOWERS";
							elem.iconClass = "fa fa-facebook-official";
							elem.hr = false;
							facebook.push(elem);
						} else {
							//已过期的facebook
							elem.klass = "facebook facebookExp";
							elem.personDesc = "FOLLOWERS";
							elem.iconClass = "fa fa-facebook-official";
							elem.hr = false;
							facebookExp.push(elem);
						}
					} else if (elem.provider == "twitter") {
						if (!elem.isExpire && elem.isWritable) {
							//未过期的twitter
							elem.klass = "twitter";
							elem.personDesc = "FRIENDS";
							elem.iconClass = "fa fa-twitter";
							elem.hr = false;
							twitter.push(elem);
						} else {
							//已过期的twitter
							elem.klass = "twitter twitterExp";
							elem.hr = false;
							elem.personDesc = "FRIENDS";
							elem.iconClass = "fa fa-twitter";
							twitterExp.push(elem);
						}
					}
					reorderedList = linkedin.concat(linkedinExp, facebook, facebookExp, twitter, twitterExp);
				});
			}

			return React.createElement(
				"ul",
				{ className: "social-list" },
				reorderedList.map(function (elem, index) {
					if (!!elem.hr) {
						// return (<li className="hr" key={index}></li>);
					} else {
						return React.createElement(
							"li",
							{ className: elem.klass, "data-tokenId": elem.tokenId, key: index },
							React.createElement(
								"div",
								{ className: "provider-url" },
								React.createElement(
									"span",
									{ className: "icon" },
									React.createElement("i", { className: elem.iconClass, "aria-hidden": "true" })
								),
								React.createElement(
									"a",
									{ className: "name", href: elem.providerUrl, title: elem.showName },
									elem.showName
								),
								React.createElement(
									"p",
									{ className: "out-of-date" },
									"\u5DF2\u8FC7\u671F"
								),
								React.createElement(
									"a",
									{ className: "bind-again", onClick: this.connectEvent, href: "javascript:;" },
									"\u8BF7\u91CD\u65B0\u6388\u6743"
								)
							),
							React.createElement(
								"p",
								{ className: "persons" },
								React.createElement(
									"span",
									{ className: "num" },
									elem.persons
								),
								React.createElement(
									"span",
									{ className: "desc" },
									elem.personDesc
								)
							),
							React.createElement(
								"p",
								{ className: "msg-count" },
								React.createElement(
									"span",
									{ className: "num" },
									elem.msgCount
								),
								React.createElement(
									"span",
									{ className: "desc" },
									"\u5DF2\u53D1\u9001\u4FE1\u606F"
								)
							)
						);
					}
				}.bind(this))
			);
		}
	});

	//管理社交媒体账号组件
	var ManageSocialBtn = React.createClass({
		displayName: "ManageSocialBtn",

		getInitialState: function getInitialState() {
			return {
				popShow: false,
				checkId: "twitter",
				bindAccountList: null,
				popShowed: false
			};
		},
		getDefaultProps: function getDefaultProps() {
			return { platform: ["twitter", "facebook", "linkedin"] };
		},
		componentDidMount: function componentDidMount() {
			var requestData = null;
			requestData = setInterval(function () {
				if ($("#responseData").children().length == 0) {
					return;
				}
				var childList = $("#responseData").children();
				var stateCache = this.state.bindAccountList || {};
				$("#responseData").children().remove();
				//去除“添加账号”生成的loading蒙层
				$(".pop-cont .msgTips.sendding").fadeOut(100, function () {
					$(this).remove();
				});
				childList.each(function (index, elem) {
					var role = $(elem).find(".pop-connect").attr("role");
					var tokenId = $(elem).find("input[type=hidden]").val();
					var imageUrl = $(elem).find(".tip").find("img").attr("src");
					var displayName = $(elem).find("h2").text();
					var rebind = false;
					//判断该项是否是social-list下的元素，是则为“重新绑定”，social-list下列表刷新
					$(".social-list").children().each(function (index, elem) {
						if ($(elem).attr("data-tokenId") == tokenId) {
							rebind = true;
							this.props.renderSocialInfo();
							return false; //等同于break
						}
					}.bind(this));
					//rebind==true,则为“重新绑定”，弹窗中数据无需处理，跳过该childList项
					if (rebind == true) {
						return true;
					}
					if (!stateCache[role]) {
						stateCache[role] = [];
					}
					stateCache[role].push({
						"tokenId": tokenId,
						"profileUrl": "",
						"imageUrl": imageUrl,
						"displayName": displayName
					});
					this.setState({ bindAccountList: stateCache });
				}.bind(this));
			}.bind(this), 3000);
		},
		componentWillReceiveProps: function componentWillReceiveProps() {
			setTimeout(function () {
				if (this.state.popShowed == false) {
					if (!!this.props.noDataPop) {
						this.showManagePop();
					}
					this.setState({ popShowed: true });
				}
			}.bind(this), 300);
		},
		showManagePop: function showManagePop() {
			this.refs.pop.style.display = "block";
			this.setState({
				popShow: true,
				tipBoxShow: true
			});
			$.ajax({
				"url": "/phoenix/admin/social/manage/pop",
				"type": "POST",
				"data": "resultType=1",
				beforeSend: function beforeSend() {
					$(".pop-cont").append('<li class="msgTips sendding"><p><i class="fa fa-spinner"></i></p></li>');
				},
				"success": function (xhr) {
					$(".pop-cont .msgTips.sendding").fadeOut(100, function () {
						$(this).remove();
					});
					xhr = typeof xhr == "string" ? JSON.parse(xhr) : xhr;
					this.setState({ bindAccountList: xhr });
				}.bind(this)
			});
		},
		hideManagePop: function hideManagePop() {
			this.setState({
				popShow: false
			}, function () {
				setTimeout(function () {
					this.refs.pop.style.display = "none";
				}.bind(this), 500);
			});
			this.props.renderSocialInfo(this.state.bindAccountList);
		},
		tabCheck: function tabCheck(ev) {
			this.setState({ checkId: ev.target.dataset.checkid });
		},
		connectEvent: function connectEvent(ev) {
			var providerId = ev.target.getAttribute("role");
			$(".pop-cont").append('<li class="msgTips sendding"><p><i class="fa fa-spinner"></i></p></li>');
			window.open('/phoenix/admin/social/connect/' + providerId);
		},
		removeEvent: function removeEvent(ev) {
			if (confirm("确定移除？")) {
				var tokenId = $(ev.target).parents(".socialItem").find('input[name="token"]').val();
				$.get('/phoenix/admin/social/delete/' + tokenId, function (xhr) {
					$.ajax({
						"url": "/phoenix/admin/social/manage/pop",
						"type": "POST",
						"data": "resultType=1",
						"success": function (xhr) {
							xhr = typeof xhr == "string" ? JSON.parse(xhr) : xhr;
							this.setState({ bindAccountList: xhr });
						}.bind(this)
					});
				}.bind(this));
			}
		},
		closeTipbox: function closeTipbox() {
			this.setState({ tipBoxShow: false });
		},
		render: function render() {
			if (this.state.bindAccountList !== null) {
				var liList = [];
				this.props.platform.map(function (elem) {
					//elem: "twitter"/"facebook"/"linkedin"
					var name = elem == "twitter" ? "Twitter" : elem == "facebook" ? "Facebook" : "LinkedIn";
					if (!!this.state.bindAccountList[elem] && this.state.bindAccountList[elem].length > 0) {
						var currentPlat = this.state.bindAccountList[elem]; //currentPlat: twitter、facebook、linkedin对象
						liList.push(React.createElement(
							"li",
							{ key: liList.length, className: "cont-" + elem + (this.state.checkId == elem ? " active" : "") },
							currentPlat.map(function (bindList, index) {
								//bindList: twitter、facebook、linkedin中的循环对象
								return React.createElement(
									"div",
									{ className: "socialItem", key: index },
									React.createElement("input", { name: "token", value: bindList.tokenId, type: "hidden" }),
									React.createElement(
										"p",
										{ className: "tip" },
										React.createElement("img", { src: bindList.imageUrl })
									),
									React.createElement(
										"div",
										{ className: "name" },
										React.createElement(
											"h2",
											{ title: bindList.displayName },
											bindList.displayName
										),
										React.createElement(
											"h3",
											null,
											name
										)
									),
									React.createElement(
										"a",
										{ href: "javascript:;", title: "\u4ECE\u9886\u52A8\u79FB\u9664", className: "pop-connect func_delete", onClick: this.removeEvent, role: elem },
										React.createElement("i", { className: "fa fa-times", "aria-hidden": "true" })
									)
								);
							}.bind(this)),
							React.createElement(
								"div",
								{ className: "addMore" },
								React.createElement(
									"a",
									{ href: "javascript:;", role: elem, className: "func_connect", onClick: this.connectEvent },
									React.createElement("i", { className: "fa fa-plus", "aria-hidden": "true" }),
									"\u7EE7\u7EED\u6DFB\u52A0\u8D26\u53F7"
								)
							)
						));
					} else {
						liList.push(React.createElement(
							"li",
							{ key: liList.length, className: "noData cont-" + elem + (this.state.checkId == elem ? " active" : "") },
							React.createElement(
								"div",
								null,
								React.createElement(
									"p",
									{ className: (elem == "linkedin" ? "visitTip" : "visitTip") + (this.state.tipBoxShow ? "" : " hide") },
									"请确保您的网站能正常访问" + name + ",",
									React.createElement(
										"a",
										{ className: "visitTry", target: "_blank", href: elem == "facebook" ? "www.facebook.com" : "https://twitter.com/" },
										"\u70B9\u6B64\u6D4B\u8BD5"
									),
									React.createElement("i", { onClick: this.closeTipbox, className: "fa fa-times close", "aria-hidden": "true" })
								),
								React.createElement(
									"h2",
									null,
									"添加" + name + "账号"
								),
								React.createElement(
									"p",
									{ className: "tip" },
									"请先授权给领动，允许领动获取以下信息："
								),
								React.createElement(
									"p",
									{ className: "tip-list" },
									React.createElement(
										"span",
										null,
										React.createElement("i", { className: "fa fa-" + elem, "aria-hidden": "true" })
									),
									name + "个人档案"
								),
								React.createElement(
									"p",
									{ className: "tip-list" },
									React.createElement(
										"span",
										null,
										React.createElement("i", { className: "fa fa-" + elem, "aria-hidden": "true" })
									),
									name + "页面"
								),
								React.createElement(
									"p",
									{ className: "tip-list" },
									React.createElement(
										"span",
										null,
										React.createElement("i", { className: "fa fa-" + elem, "aria-hidden": "true" })
									),
									name + "群组"
								),
								React.createElement(
									"a",
									{ href: "javascript:;", className: "pop-connect func_connect", onClick: this.connectEvent, role: elem },
									"连接" + name
								)
							)
						));
					}
				}.bind(this));
			}
			return React.createElement(
				"div",
				null,
				React.createElement(
					"a",
					{ className: "manage-social-btn", onClick: this.showManagePop, href: "javascript:;" },
					"\u7BA1\u7406\u793E\u4EA4\u5A92\u4F53\u8D26\u53F7"
				),
				React.createElement(
					"div",
					{ id: "pop-manage", className: this.state.popShow ? "pop-manage-show" : "pop-manage-hide", ref: "pop" },
					React.createElement(
						"div",
						{ className: "pop-box" },
						React.createElement(
							"div",
							{ className: "pop-title" },
							"\u7BA1\u7406\u793E\u4EA4\u5A92\u4F53\u5E10\u53F7",
							React.createElement("a", { href: "javascript:;", className: "pop-close", onClick: this.hideManagePop })
						),
						React.createElement(
							"div",
							{ className: "pop-main" },
							React.createElement(
								"ul",
								{ className: "pop-nav", ref: "navList" },
								this.props.platform.map(function (elem, index) {
									//elem: "twitter"/"facebook"/"linkedin"
									var name = elem == "twitter" ? "Twitter" : elem == "facebook" ? "Facebook" : "LinkedIn";
									return React.createElement(
										"li",
										{ key: index, className: elem + (this.state.checkId == elem ? " active" : ""), onClick: this.tabCheck, "data-checkid": elem },
										React.createElement(
											"span",
											{ "data-checkid": elem },
											React.createElement("i", { "data-checkid": elem, className: "fa fa-" + elem + " fa-2x", "aria-hidden": "true" })
										),
										name
									);
								}.bind(this))
							),
							React.createElement(
								"ul",
								{ className: "pop-cont", ref: "contList" },
								liList
							)
						)
					)
				)
			);
		}
	});

	// ReactDOM.render(<MessagesAside />,document.getElementById('aside'));

/***/ }
]);