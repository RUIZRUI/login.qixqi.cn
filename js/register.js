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
	
	// 检测用户名
	function checkUserName(){
	    if($('#username').val().trim() == ''){       // 用户民不能为空
	        return false;
	    }
	    return true;
	}

	// 检测邮箱
	function checkEmail(){
	    if($('#email').val().trim() == ''){           // 邮箱不能为空
	        return false;
	    }
	    return true;
	}

	// 检测手机号
	function checkPhone(){
		if($('#phone').val().trim() == ''){
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

	// 确认密码
	function confirmPassword(){
	    if($('#password').val() != $('#confirm_password').val()){

	        return false;
	    }
	    return true;
	}

	// 检测配置文件是否读取完成（异步）
	function checkProperties(){
		if (servletUrl === undefined){
			return false;
		}
		return true;
	}

	// 关闭错误验证信息
	$('#error_message button:first').click(() => {
		$('#error_message').css('display', 'none');
	});
	
	// 手机号输入框只能输入数字
	$('#phone').keyup(() => {
		$('#phone').val( $('#phone').val().replace(/\D/g, '') );
	});

	// 表单提交事件
	$('#register').submit((event) => {
		if (!checkProperties()){
			alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
		} else if(checkUserName() && checkEmail() && checkPhone() && checkPassword() && confirmPassword()){
	    	// 发送注册请求
	    	var data = {
	    		username: $('#username').val(),
	    		email: $('#email').val(),
	    		phone_num: $('#phone').val(),
				password: $('#password').val(),
				sex: 'u'	// 默认性别
	    	};
	    	$.ajax({
	    		url: servletUrl + 'Register',
	    		type: 'POST',
	    		dataType: 'json',
	    		data: data,
	    		async: true,
	    		success: function(data){
					alert(data);
	    			var result = data.result;
	    			if (result === 'success'){
	    				alert('注册成功，即将跳转到登录页面');
	    				$(location).attr('href', 'login.html');
	    			} else{
	    				alert('注册失败：' + result);
	    			}
	    		},
	    		error: function(err){
	    			alert('注册失败');
	    			console.error(err.responseText);
	    		}
	    	});
	    } else{
	    	$('#error_message').css('display', 'block');
	    }
	    event.preventDefault();
	});


});
