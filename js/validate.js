/*jshint esversion: 6 */
$(document).ready(function(){
    // 读取配置文件
    var servletUrl;
    $.getJSON('properties.json', (data) => {
        servletUrl = data.servletUrl;
    });

    // 验证邮箱不能为空
    function checkEmail(){
        if ($('#email').val().trim() == ''){
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

    // 解析url 获得 email
    function getEmail(){
        var url = window.location.href;
        var index = url.indexOf('?email=');     // 第一个元素
        if(index == -1){
            index = url.indexOf('&email=');     // 非第一个元素
            if (index == -1){
                return '';
            }
        }
        var real_email = url.substring(index + 7);
        if (real_email.indexOf('&') != -1){
            real_email = real_email.substring(0, real_email.indexOf('&'));
        }
        if(real_email.trim() == ''){
            return '';
        }else{
            return real_email.trim();
        }
    }
    // 填充email
    $('#email').val(getEmail());
    
    // 关闭错误提示信息
    $('#error_message button:first').click(() => {
        $('#error_message').css('display', 'none');
    });

    // ajax 提交表单信息
    $('#validate').submit((event) => {
        if (!checkProperties()){
            alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
        } else if (checkEmail()){
            // 发送接收重设密码邮件的请求
            var data = {
                email: $('#email').val().trim()
            };
            $.ajax({
                url: servletUrl + 'validate.do',
                type: 'POST',
                dataType: 'json',
                data: data,
                async: true,
                success: function(data){
                    var status = data.status;
                    if (status === 100){
                        alert('发送邮件成功，10分钟内有效');
                        $(location).attr('href', 'reset.html?email=' + $('#email').val());
                    } else if (status === 202){
                        alert('邮箱尚未注册');
                        $('#email').select();
                    } else {
                        alert('发送邮件失败，请查看日志');
                        console.error(err.responseText);
                    }
                },
                error: function(err){
                    alert('发送邮件失败，请查看日志');
                    console.error(err.responseText);
                }
            });


        } else{
            $('#error_message').css('display', 'block');
        }
        event.preventDefault();
    });

});