/**
 * Created by 54721 on 2018/11/29.
 */


$(function() {

  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条
  // 1. 渲染页面
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template("secondTpl", info);
        $('tbody').html( htmlStr );

        // 初始化分页插件
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 添加页码点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }



  // 2. 点击添加分类按钮, 显示添加模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送请求, 获取一级分类的全部数据
    // 通过写死 page 和 pageSize 模拟获取全部一级分类的接口
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100,
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });



  // 3. 给下拉列表的 a 添加点击事件(通过事件委托实现)
  $('.dropdown-menu').on("click", 'a', function() {
    // 获取文本值
    var txt = $(this).text();
    // 设置给按钮
    $('#dropdownText').text( txt );
  });


  // 4. 配置文件上传插件, 让插件发送异步文件上传请求
  $('#fileupload').fileupload({
    dataType: "json",
    // done 表示文件上传完成的回调函数
    done: function( e, data ) {
      //console.log( data );
      //console.log( data.result ); // 后台返回的对象

      var picObj = data.result; // 后台返回的数据
      // 获取图片地址, 设置给 img src
      var picUrl = picObj.picAddr;
      $('#imgBox img').attr("src", picUrl);
    }
  })


})