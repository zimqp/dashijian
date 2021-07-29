$(function () {
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link_log').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}/, '密码必须6~12位，且不能出现空格'],
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })

    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('success');
            $('#link_log').click()
        })
    })
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/login', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('success');
            localStorage.setItem('token', res.token)
            location.href = 'index.html'
        })
    })

})