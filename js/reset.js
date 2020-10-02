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
        var index = url.indexOf('?email=');     // 第一个元素
        if(index == -1){
            index = url.indexOf('&email=');     // 非第一个元素
            if (index == -1){
                return false;
            }
        }
        var real_email = url.substring(index + 7);
        if (real_email.indexOf('&') != -1){
            real_email = real_email.substring(0, real_email.indexOf('&'));
        }
        if(real_email.trim() == ''){
            return false;
        }else{
            $('#email').val(real_email);
            return true;
        }
    }

    getEmail();
    // ajax 发送表单请求
    $('#reset').submit((event) => {
        if(!checkProperties()){
            alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
        } else if (checkCode() && checkPassword() && confirmPassword()){
            // 判断邮箱是否缺失，并填写
            if ($('#email').val() == ''){
                var email = prompt('邮箱缺失，请输入后重新提交');
                if (email.trim() == ''){
                    return false;
                }
                $('#email').val(email);
            }
            // 发送重设密码请求
            var data = {
                code: $('#code').val().trim(),
                email: $('#email').val().trim(),
                password: $('#password').val().trim()
            };
            $.ajax({
                url: servletUrl + 'reset.do',
                type: 'POST',
                dataType: 'json',
                data: data,
                async: true,
                success: function(data){
                    var status = data.status;
                    if (status == 101){
                        // 登录用户重设密码成功
                        alert('重设密码成功');
                    } else if (status === 100){
                        // 游客重设密码成功
                        alert('重设密码成功，即将跳转到登录页面');
                        $(location).attr('href', 'login.html');
                    } else if (status === 203){
                        // 尚未发送验证码
                        var choice = confirm('尚未向邮箱发送验证码，重新发送？');
                        if (choice === true){
                            $(location).attr('href', 'validate.html?email=' + $('#email').val().trim());
                        }   
                    } else if (status === 204){
                        // 验证码不匹配
                        alert('验证码不匹配');
                        $('#code').select();
                    } else if(status === 205){
                        // 验证码失效
                        var choice2 = confirm('验证码已过期，重新发送？');
                        if (choice2 === true){
                            $(location).attr('href', 'validate.html?email=' + $('#email').val().trim());
                        }
                    } else{
                        alert('重设密码失败，请查看日志');
                        console.error(status);
                    }
                },
                error: function(err){
                    alert('重设密码失败，请查看日志');
                    console.error(err.responseText);
                }
            });
        } else {
            $('#error_message').css('display', 'block');
        }
        event.preventDefault();
    });


});