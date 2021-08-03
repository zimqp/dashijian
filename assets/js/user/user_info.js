$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '长度在1~6个字符之间'
            }
        }
    })

    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                window.parent.getUserInfo()
            }
        })
    })
})