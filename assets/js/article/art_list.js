$(function () {

    var layer = layui.layer
    var form = layui.form


    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    var q = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()


    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })


    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if ($('.btn-del').length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })



    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)

            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: 'pageBox',
                count: total, //数据总数，从服务端得到
                limit: q.pagesize,
                curr: q.pagenum, //默认选中的页码
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [1, 2, 5, 8],
                jump: function (obj, first) {
                    q.pagesize = obj.limit
                    q.pagenum = obj.curr
                    if (!first) {
                        initTable()
                    }
                }
            });
        });
    }

})