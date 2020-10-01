/*jshint esversion: 6 */
$(document).ready(function() {
    // 读取配置文件
    var servletUrl;
    $.getJSON('properties.json', (data) => {
        servletUrl = data.servletUrl;
    });


    // 检测密码
    function checkPassword(){
        var regNumber = /\d+/;          // 验证 0-9 的任意数字最少出现一次
        var regString = /[a-zA-Z]+/;    // 验证大小写字母任意字母最少出现一次

        if($('#password').val().length >= 8 && regNumber.test($('#password').val()) && regString.test($('#password').val())){
            return true;
        }
        return false;
    }

    // 检测确认密码
    function confirmPassword(){
        if ($('#password').val() === $('#confirm_password').val()) {
            return true; 
        }
        return false;
    }

    // 检测验证码
    function checkCode(){
        var regAllNum = /^[0-9]+$/;         // 验证是否全是数字

        if ($('#code').val().trim().length === 6 && regAllNum.test($('#code').val().trim())){
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

    // 解析url 获得 email
    function getEmail(){
        var url = window.location.href;
        var index = url.indexOf('?email=');
        if(index == -1){
            return false;
        }
        var real_email = url.substring(index + 7);
        real_email = real_email.substring(0, real_email.indexOf('?'));
        if(real_email.trim() == ''){
            return false;
        }else{
            $('#email').val(real_email);
            return true;
        }
    }

    // ajax 发送表单请求
    $('#reset').submit((event) => {
        if(!checkProperties()){
            alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
        } else if (checkCode() && checkPassword() && confirmPassword() && getEmail()){
            // 发送修改密码请求



            
        } else {
            $('#error_message').css('display', 'block');
        }
        event.preventDefault();
    });


});