/*jshint esversion: 6 */
$(document).ready(function(){
	// 读取配置文件
	var servletUrl;
	$.getJSON('properties.json', (data) => {
		servletUrl = data.servletUrl;
	});

	// QQ登录按钮
	QC.Login({
		btnId: 'qqLoginBtn'
	});
	
	// 获取当前登录用户基本信息
	var paras = {
	    oauth_consumer_key: 101886875
	};
	
	QC.api('get_user_info', paras)
		.success(function(s){
			// 成功回调
			alert('调用get_user_info 接口成功! 当前用户昵称：' + s.data.nickname);
		})
		.error(function(f){
			// 失败回调
			alert('调用get_user_info 接口失败！');
		})
		.complete(function(c){
			// 完成请求回调
			alert('调用get_user_info 接口完成！');
		});
	
	// 获取openid 和 accessToken
	if (QC.Login.check()){
		// 如果已经登录
		QC.Login.getMe(function(openId, accessToken){
			alert('openId: ' + openId + ', accessToken: ' + accessToken);
		});
	}
	

	// 检测用户名或邮箱不能为空
	function checkIdentity(){       
	    if($('#login_field').val().trim() == ''){
	        return false;
	    }
	    return true;
	}

	// 检测密码
	function checkPassword(){
	    var regNumber = /\d+/;          // 验证 0-9 的任意数字最少出现一次
	    var regString = /[a-zA-Z]+/;    // 验证大小写字母任意字母最少出现一次

	    if($('#password').val().length >= 8 && regNumber.test($('#password').val()) && regString.test($('#password').val())){
	        return true;
	    }
	    return false;
	}

	// 检测配置文件是否读取完成（异步）
	function checkProperties(){
		if (servletUrl === undefined){
			return false;
		}
		return true;
	}

	// 关闭错误提示信息
	$('#error_message button:first').click(() => {
		$('#error_message').css('display', 'none');
	});

	// ajax 提交表单信息
	$('#login').submit((event) => {
		if (!checkProperties()){
			alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
		} else if (checkIdentity() && checkPassword()){
			// 发送登录请求
			var data = {
				id: $('#login_field').val(),
				password: $('#password').val()
			};
			$.ajax({
				url: servletUrl + 'login.do',
				type: 'POST',
				dataType: 'json',
				data: data,
				async: true,
				success: function(data){
					alert(JSON.stringify(data));
					var result = data.result;
					if (result === 'success'){
						alert('登录成功，即将跳转');
						// alert(data.user);
						console.log(data.user);
						$(location).attr('href', 'index.html');
					} else{
						alert('登录失败');
					}
				},
				error: function(err){
					alert('登录失败');
					console.error(err.responseText);
				}
			});
		} else{
			$('#error_message').css('display', 'block');
		}
		event.preventDefault();
	});
});