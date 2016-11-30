var MessagesAside = React.createClass({
	getInitialState : function(){
		return {renderAside : 0,noData : false};
	},
	renderSocialInfo : function(renderData){
		this.props.renderSocialInfo();
		//this.setState({renderAside : this.state.renderAside + 1});
	},
	renderSocialBtn : function(socialInfo){
		this.props.renderSocialBtn(socialInfo);
	},
	noDataPop : function(){
		this.setState({noData : true});
	},
	render : function(){
		return (
			<div className="aside-inner">
				<AsideTop url="/phoenix/admin/social/msg/userInfo" />
				<AsideBottom socialInfo={this.props.socialInfo} noDataPop={this.noDataPop} url="/phoenix/admin/social/msg/socialInfo" />
				<ManageSocialBtn noDataPop={this.state.noData} renderSocialInfo={this.renderSocialInfo} />
			</div>
		);
	}
});

//用户信息组件
var AsideTop = React.createClass({
	getInitialState : function(){
		return {userInfo : {}};
	},
	componentDidMount : function(){
		$.ajax({
			url : this.props.url,
			type : "get",
			dataType : "json",
			success : function(xhr){
				xhr = (typeof xhr == "string") ? JSON.parse(xhr) : xhr;
				this.setState({userInfo : xhr});
			}.bind(this)
		});
	},
	render : function(){
		return (
			<div className="aside-top">
				<img className="avatar" src={this.state.userInfo.usrPhotoUrl || ""} alt="" />
				<p className="user-name">{this.state.userInfo.userName || ""}</p>
				<p className="user-role">{this.state.userInfo.userRole || ""}</p>
				<ul className="count">
					<li>
						<p className="num">{this.state.userInfo.msgCount || 0}</p>
						<p className="desc">已发送信息</p>
					</li>
					<li>
						<p className="num">{this.state.userInfo.scheduleMsgCount || 0}</p>
						<p className="desc">待发布消息</p>
					</li>
				</ul>
			</div>
		);
	}
})

//社交媒体信息组件
var AsideBottom = React.createClass({
	getInitialState : function(){
		return {socialInfo : {}};
	},
	componentDidMount : function(){
		$.ajax({
			url : this.props.url,
			type : "get",
			dataType : "json",
			success : function(xhr){
				xhr = (typeof xhr == "string") ? JSON.parse(xhr) : xhr;
				if (xhr == "-1") {
					this.props.noDataPop();
				}
				this.setState({socialInfo : xhr});
			}.bind(this)
		});
	},
	componentWillReceiveProps : function(param){
		if (!!param.socialInfo) {
			this.setState({socialInfo: param.socialInfo});
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
	connectEvent : function(ev){
		var parentLi = $(ev.target).parents("li");
		var providerId = parentLi.hasClass("facebook") ? "facebook" : (parentLi.hasClass("twitter") ? "twitter" : "linkedin");
		window.open('/phoenix/admin/social/connect/' + providerId);
	},
	render : function(){
		// console.log(this.state.socialInfo);
		if (this.state.socialInfo == "-1") {
			return (<ul></ul>);
		}
		var list = this.state.socialInfo.socialList || [],
			linkedin = [],linkedinExp = [],facebook = [],facebookExp = [],twitter = [],twitterExp = [],reorderedList = [];
		if (!!list && typeof list == "object") {
			//分六种情况重排序数据并生成虚拟DOM
			list.map(function(elem){
				if (elem.provider == "linkedin") {
					if (!elem.isExpire && elem.isWritable) {	//未过期的linkedin
						elem.klass = "linkedin";
						elem.personDesc = "CONTACTS";
						elem.iconClass = "fa fa-linkedin";
						elem.hr = false;
						linkedin.push(elem);
					} else {									//已过期的linkedin
						elem.klass = "linkedin linkedinExp";
						elem.personDesc = "CONTACTS";
						elem.iconClass = "fa fa-linkedin";
						elem.hr = false;
						linkedinExp.push(elem);
					}
				} else if (elem.provider == "facebook") {
					if (!elem.isExpire && elem.isWritable) {	//未过期的facebook
						elem.klass = "facebook";
						elem.personDesc = "FOLLOWERS";
						elem.iconClass = "fa fa-facebook-official";
						elem.hr = false;
						facebook.push(elem);
					} else {									//已过期的facebook
						elem.klass = "facebook facebookExp";
						elem.personDesc = "FOLLOWERS";
						elem.iconClass = "fa fa-facebook-official";
						elem.hr = false;
						facebookExp.push(elem);
					}
				} else if (elem.provider == "twitter") {
					if (!elem.isExpire && elem.isWritable) {	//未过期的twitter
						elem.klass = "twitter";
						elem.personDesc = "FRIENDS";
						elem.iconClass = "fa fa-twitter";
						elem.hr = false;
						twitter.push(elem);
					} else {									//已过期的twitter
						elem.klass = "twitter twitterExp";
						elem.hr = false;
						elem.personDesc = "FRIENDS";
						elem.iconClass = "fa fa-twitter";
						twitterExp.push(elem);
					}
				}
				reorderedList = linkedin.concat(linkedinExp,facebook,facebookExp,twitter,twitterExp);
			});
		}

		return (
			<ul className="social-list">
				{
					reorderedList.map(function(elem,index){
						if (!!elem.hr) {
							// return (<li className="hr" key={index}></li>);
						} else {
							return (
								<li className={elem.klass} data-tokenId={elem.tokenId} key={index}>
									<div className="provider-url">
										<span className="icon"><i className={elem.iconClass} aria-hidden="true"></i></span>
										<a className="name" href={elem.providerUrl} title={elem.showName}>{elem.showName}</a>
										<p className="out-of-date">已过期</p>
										<a className="bind-again" onClick={this.connectEvent} href="javascript:;">请重新授权</a>
									</div>
									<p className="persons"><span className="num">{elem.persons}</span><span className="desc">{elem.personDesc}</span></p>
									<p className="msg-count"><span className="num">{elem.msgCount}</span><span className="desc">已发送信息</span></p>
								</li>
							);
						}
					}.bind(this))
				}
			</ul>
		);
	}
});

//管理社交媒体账号组件
var ManageSocialBtn = React.createClass({
	getInitialState : function(){
		return {
			popShow : false,
			checkId : "twitter",
			bindAccountList : null,
			popShowed : false
		}
	},
	getDefaultProps : function(){
		return {platform : ["twitter","facebook","linkedin"]};
	},
	componentDidMount : function(){
		var requestData = null;
		requestData = setInterval(function(){
			if ($("#responseData").children().length == 0) {
				return;
			}
			var childList = $("#responseData").children();
			var stateCache = this.state.bindAccountList || {};
			$("#responseData").children().remove();
			//去除“添加账号”生成的loading蒙层
			$(".pop-cont .msgTips.sendding").fadeOut(100,function(){
        		$(this).remove();
        	});
			childList.each(function(index,elem){
				var role = $(elem).find(".pop-connect").attr("role");
				var tokenId = $(elem).find("input[type=hidden]").val();
				var imageUrl = $(elem).find(".tip").find("img").attr("src");
				var displayName = $(elem).find("h2").text();
				var rebind = false;
				//判断该项是否是social-list下的元素，是则为“重新绑定”，social-list下列表刷新
				$(".social-list").children().each(function(index,elem){
					if ($(elem).attr("data-tokenId") == tokenId) {
						rebind = true;
						this.props.renderSocialInfo();
						return false;	//等同于break
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
					"tokenId":tokenId,
					"profileUrl":"",
					"imageUrl":imageUrl,
					"displayName":displayName
				});
				this.setState({bindAccountList : stateCache});
			}.bind(this));
		}.bind(this),3000);
	},
	componentWillReceiveProps : function(){
		setTimeout(function(){
			if (this.state.popShowed == false) {
				if (!!this.props.noDataPop) {
					this.showManagePop();
				}
				this.setState({popShowed : true});
			}
		}.bind(this),300);
	},
	showManagePop : function(){
		this.refs.pop.style.display = "block";
		this.setState({
			popShow : true,
			tipBoxShow : true
		});
		$.ajax({
			"url" : "/phoenix/admin/social/manage/pop",
			"type" : "POST",
			"data" : "resultType=1",
			beforeSend : function(){
				$(".pop-cont").append('<li class="msgTips sendding"><p><i class="fa fa-spinner"></i></p></li>');
			},
			"success" : function(xhr){
				$(".pop-cont .msgTips.sendding").fadeOut(100,function(){
            		$(this).remove();
            	});
				xhr = (typeof xhr == "string") ? JSON.parse(xhr) : xhr;
				this.setState({bindAccountList : xhr});
			}.bind(this)
		});

	},
	hideManagePop : function(){
		this.setState({
			popShow : false
		},function(){
			setTimeout(function(){
				this.refs.pop.style.display = "none";
			}.bind(this),500);
		});
		this.props.renderSocialInfo(this.state.bindAccountList);
	},
	tabCheck : function(ev){
		this.setState({checkId : ev.target.dataset.checkid});
	},
	connectEvent : function(ev){
		var providerId = ev.target.getAttribute("role");
		$(".pop-cont").append('<li class="msgTips sendding"><p><i class="fa fa-spinner"></i></p></li>');
		window.open('/phoenix/admin/social/connect/' + providerId);
	},
	removeEvent : function(ev){
		if (confirm("确定移除？")) {
			var tokenId = $(ev.target).parents(".socialItem").find('input[name="token"]').val();
			$.get('/phoenix/admin/social/delete/' + tokenId,function(xhr){
				$.ajax({
					"url" : "/phoenix/admin/social/manage/pop",
					"type" : "POST",
					"data" : "resultType=1",
					"success" : function(xhr){
						xhr = (typeof xhr == "string") ? JSON.parse(xhr) : xhr;
						this.setState({bindAccountList : xhr});
					}.bind(this)
				});
			}.bind(this));
		}
	},
	closeTipbox : function(){
		this.setState({tipBoxShow: false});
	},
	render : function(){
		if (this.state.bindAccountList !== null) {
			var liList = [];
			this.props.platform.map(function(elem){	//elem: "twitter"/"facebook"/"linkedin"
				var name = (elem == "twitter") ? "Twitter" : ( (elem =="facebook") ? "Facebook" : "LinkedIn" );
				if (!!this.state.bindAccountList[elem] && this.state.bindAccountList[elem].length > 0) {
					var currentPlat = this.state.bindAccountList[elem];	//currentPlat: twitter、facebook、linkedin对象
					liList.push(
						<li key={liList.length} className={"cont-" + elem + (this.state.checkId == elem ? " active" : "")}>
							{
								currentPlat.map(function(bindList,index){	//bindList: twitter、facebook、linkedin中的循环对象
									return (
										<div className="socialItem" key={index}>
											<input name="token" value={bindList.tokenId} type="hidden" />
											<p className="tip"><img src={bindList.imageUrl} /></p>
											<div className="name">
												<h2 title={bindList.displayName}>{bindList.displayName}</h2>
												<h3>{name}</h3>
											</div>
											<a href="javascript:;" title="从领动移除" className="pop-connect func_delete" onClick={this.removeEvent} role={elem}>
												<i className="fa fa-times" aria-hidden="true"></i>
											</a>
										</div>
									)
								}.bind(this))
							}
							<div className="addMore">
								<a href="javascript:;" role={elem} className="func_connect" onClick={this.connectEvent}><i className="fa fa-plus" aria-hidden="true"></i>继续添加账号</a>
							</div>
						</li>
					)
				} else {
					liList.push(
						<li key={liList.length} className={"noData cont-" + elem + (this.state.checkId == elem ? " active" : "")}>
							<div>
								<p className={(elem=="linkedin" ? "visitTip" : "visitTip") + (this.state.tipBoxShow ? "" : " hide")}>{"请确保您的网站能正常访问"+ name + ","}
									<a className="visitTry" target="_blank" href={elem=="facebook" ? "www.facebook.com" : "https://twitter.com/"}>点此测试</a>
									<i onClick={this.closeTipbox} className="fa fa-times close" aria-hidden="true"></i>
								</p>
								<h2>{"添加"+ name +"账号"}</h2>
								<p className="tip">{"请先授权给领动，允许领动获取以下信息："}</p>
								<p className="tip-list"><span><i className={"fa fa-" + elem} aria-hidden="true"></i></span>{name + "个人档案"}</p>
								<p className="tip-list"><span><i className={"fa fa-" + elem} aria-hidden="true"></i></span>{name + "页面"}</p>
								<p className="tip-list"><span><i className={"fa fa-" + elem} aria-hidden="true"></i></span>{name + "群组"}</p>
								<a href="javascript:;" className="pop-connect func_connect" onClick={this.connectEvent} role={elem}>{"连接" + name}</a>
							</div>
						</li>
					)	
				}
			}.bind(this));
		}
		return (
		 	<div>
		 		<a className="manage-social-btn" onClick={this.showManagePop} href="javascript:;">管理社交媒体账号</a>
		 		<div id="pop-manage" className={this.state.popShow ? "pop-manage-show" : "pop-manage-hide"} ref="pop">
		 			<div className="pop-box">
						<div className="pop-title">
							管理社交媒体帐号
							<a href="javascript:;" className="pop-close" onClick={this.hideManagePop}></a>
						</div>
						<div className="pop-main">
							<ul className="pop-nav" ref="navList">
								{
									this.props.platform.map(function(elem,index){	//elem: "twitter"/"facebook"/"linkedin"
										var name = (elem == "twitter") ? "Twitter" : ( (elem =="facebook") ? "Facebook" : "LinkedIn" );
										return (
											<li key={index} className={elem + (this.state.checkId == elem ? " active" : "")} onClick={this.tabCheck} data-checkid={elem}>
												<span data-checkid={elem}>
													<i data-checkid={elem} className={"fa fa-" + elem + " fa-2x"} aria-hidden="true"></i>
												</span>
												{name}
											</li>
										);
									}.bind(this))
								}
							</ul>
							<ul className="pop-cont" ref="contList">
								{liList}
							</ul>
						</div>
					</div>
		 		</div>
		 	</div>
		);
	}
});

// ReactDOM.render(<MessagesAside />,document.getElementById('aside'));
