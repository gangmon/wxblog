// pages/blog/blog-detail.js
var app = getApp(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:[],
    post_id:null,
    comments:null,
    title_clear:""
  },


/**
 * 接受评论提醒
 */
  recieveComment: function (e) {
    var bool = this.data.boolr;

    // console.log(boolr);
    console.log(e);
    console.log(app.globalData.open);
    var form_id = e.detail.formId;
    console.log(form_id);
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/appid/sendmsg',
      method: "POST",
      data: {

        "touser": app.globalData.open,
        "template_id": "hX6Sy9fOgTsH7KthZA3NNa6GnFIkfSJj3kHlzmeAYtU",
        // "page": "index",
        "form_id": e.detail.formId,
        // "form_id": form_id,
        "data": {
          "keyword1": {
            // "value": app.globalData.userInfo.nickName
            "value": "你有一个未读消息"
          },
          "keyword2": {
            "value": "请尽快查看"
          },
          "keyword3": {
            "value": "哈咯"
          },
          "keyword4": {
            "value": "方克米"
          },
          "keyword5": {
            "value": "一分钟前"
          },
          "keyword6": {
            "value": "nothing"
          }
        },
        "emphasis_keyword": "keyword1.DATA"
      },
      success: res => {
        console.log(res);

      }
    })

  },


  /**
   * 保存用户评论到数据库
   */
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    app.globalData.userInfo = e.detail.userInfo
  },

  bindSaveComment: function (e) {
    console.log(e);
    var that = this;

    if (app.globalData.userInfo) {
      
      that.saveToDb(e);
    }else{
      that.userlogin();
      that.saveToDb(e);
    }
  },
  saveToDb:function (e) {
    console.log(e);
    var that = this;
    var title = e.detail.value.content;
    var post_id = e.detail.target.dataset.post_id;

    var flag = 1;

    if (title == "") {
      flag = 0;
      wx.showModal({
        title: '提示',
        content: '请填写内容',
        showCancel: false,
      })
    }
    if (flag == 1) {
      wx.request({
        url: app.globalData.domain + 'api/web/index.php/comments',
        method: "POST",
        header: { "Content-Type": "application/json" },
        data: {
          title: title,//评论内容
          post_id:post_id,//文章ID

          user_id: app.globalData.open,//uesr_id使用openId存储，减少代码量
          // nikename: app.globalData.userInfo.nickName,
          status: "已审核",

        },
        success: res => {

          console.log(res);
          console.log(title);
          // wx.reLaunch({
          //   url: '../blog/blog?create=1'
          // })
          //评论提交成功 ，刷新当前页面
          var that = this;
          that.getUserComments();
          that.setData({
            title_clear:""
          })
        }

      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

      var that = this;

      var current_blog = wx.getStorageSync('current_blog');

      that.setData({
        item: current_blog,
        post_id: options.post_id,
      })
      // if (current_blog){
      //   wx.request({
      //     url: app.globalData.domain + 'api/web/index.php/posts/' + current_blog["id"],
      //     header: {
      //       'Content-Type': 'application/json'
      //     },
      //     success:res => {
      //       console.log(res);
      //     }
      //   })
      // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
        that.getUserComments();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },



  userlogin: function () {

    var that = this;

    wx.request({
      url: app.globalData.domain + 'api/web/index.php/userapi/findexit',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: {
        avatar: app.globalData.userInfo.avatarUrl,
        nickname: app.globalData.userInfo['nickName'],
        openid: app.globalData.open,
        status: 10
      },
      fail: function (res) { console.log(res); },
      success: function (res) {
        // page.setData({ motto: res.data.content })
        console.log(res);
        console.log(res.data);
        if (res.data == '') {
          wx.request({
            url: app.globalData.domain + 'api/web/index.php/userapi',
            header: {
              'Content-type': 'application/json'
            },
            method: 'POST',
            data: {
              avatar: app.globalData.userInfo['avatarUrl'],
              nickname: app.globalData.userInfo['nickName'],
              openid: app.globalData.open,
              status: 10
            },
            success: function (res) {
              console.log(res);
            }
          })
          console.log("用户第一次登陆");

        } else {
          console.log("用户已经登陆过了");
        }
      }
    })
  },

  getUserComments: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/comments/getusercomment',
      data: {
        post_id:that.data.post_id,
      },
      method: "POST",
      header: { 'Content-Type': 'application/json' },

      success: res => {
        console.log(res);
        var comments = that.feedComment(res.data);
        that.setData({
          comments: comments
        })

        console.log(comments);
        // console.log(blogs);
        // wx.setStorage({
        //   key: 'blog_store',
        //   data: blogs,
        // })

      }
    })
  },
  feedComment: function (jsonStr) {
    var feeds = new Array();
    console.log(jsonStr);
    for (var x in jsonStr) {

      var item = jsonStr[x];
      var feed = {
        "title":item.title,
        "id": item.post_id,
        "nickname": item.nickname,
        "post_id": item.post_id,
        "title": item.title,
        "content": item.content,
        "times": item.times,
        "create_time": this.timeChange(item.created_at),
        "avatar": item.avatar
      }
      feeds.push(feed);
    }
    console.log(feeds);
    return feeds;
  },
  //时间戳转化为日期
  timeChange: function (time) {
    return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');


    //  　　　var date = new Date(time * 1000);

    //        var Y = date.getFullYear() + '-';
    //  　　　var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    // 　　　var 　D = date.getDate() + ' ';
    // 　　　var　h = date.getHours() + ':';
    // 　　　var　m = date.getMinutes() + ':';
    // 　　　　var s = date.getSeconds();

    // 　　　　return Y + M + D + h + m + s;

  },

})