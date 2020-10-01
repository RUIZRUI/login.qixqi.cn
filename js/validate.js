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
    
    // 关闭错误提示信息
    $('#error_message button:first').click(() => {
        $('#error_message').css('display', 'none');
    });

    // ajax 提交表单信息
    $('#validate').submit((event) => {
        if (!checkProperties()){
            alert('网络延迟，配置文件尚未加载成功，请稍后重试！');
        } else if (checkEmail()){
            // 发送验证请求


        } else{
            $('#error_message').css('display', 'block');
        }
        event.preventDefault();
    });

});