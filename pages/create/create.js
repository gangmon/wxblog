var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    content:null,
    access_token:"",
  },



  GetAccessToken: function () {
    var that = this;
    console.log(that.access_token);
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/appid/access-token',
      data: {},
      success: res => {
        console.log(res);
        // that.data.access_token = res.data

        that.setData({
          access_token: res.data,
        })
      }
    })

  },
  //   选择图片
  bindimgshow: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        console.log(res);
        var tempFilePaths = res.tempFilePaths[0];
        console.log(res.tempFilePaths[0]);
        // that.setData({
        //       imgs:tempFilePaths,
        // })
        that.uploadPhoto(tempFilePaths);


      },
    })
  },

  //上传图片到微信的服务器然后在微信的服务器中获取url中然后再把url返回给服务器，上传到服务器；

  uploadPhoto: function (path) {
    var that = this
    var imgPath = path
    that.GetAccessToken();
    wx.showLoading({
      title: '照片上传中',
    })
    console.log(that.data.access_token);
    wx.uploadFile({

      url: 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + that.data.access_token + '&type=image',
      filePath: path,
      name: 'media',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        var obj = JSON.parse(res.data.trim());
        console.log('上传到微信临时服务器 = ' + res.data)
        if (obj.errcode && obj.errcode > 42000) {
          // 说明token超时,需再次获取
          that.getAccessToken(function () {
            that.uploadPhoto(imgPath)
          });
        } else {
          // 后台再根据access_token和media_id获取临时文件
          that.getTempFile(obj.media_id);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({ title: '微信临时服务器连接失败', image: '../../images/icon_err.png', })
        console.log(err)
      }
    })
  },

  getTempFile: function (media_id) {
    var that = this;
    console.log('media_id = ' + media_id)
    wx.showLoading({
      title: '照片加载中',
    })
    wx.request({
      url: IP_Node + 'api/common/uploadFile',
      method: 'POST',
      data: {
        url: 'https://api.weixin.qq.com/cgi-bin/media/get?access_token=' + that.data.access_token + '&media_id=' + media_id,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.success) {
          console.log('获取oss图片的url = ' + res.data.data);
          that.setData({
            iv_url: res.data.data,//显示图片
          })
          wx.showToast({ title: '照片上传成功', icon: 'success', })
        } else {
          wx.showToast({ title: '照片上传失败', image: '../../images/icon_err.png', })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        console.log(err)
        wx.showToast({ title: '失败:' + err, image: '../../images/icon_err.png', })
      }
    })
  },



  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    
    app.globalData.userInfo = e.detail.userInfo
  },

  bindSave: function (e) {
    console.log(e);
    var that = this;
    
    if (app.globalData.userInfo){
      
      that.saveToDb(e);
    }else{
      that.userlogin();
      that.saveToDb(e);
    }
    

  },

  saveToDb: function (e) {
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    var flag = 1;

    if (title == "") {
      flag = 0;
      wx.showModal({
        title: '提示',
        content: '请填写标题',
        showCancel: false,
      })
    }

    if (content == "") {
      flag = 0;
      wx.showModal({
        title: '提示',
        content: '请填写内容',
        showCancel: false,
      })
    }
    if (flag == 1) {
      wx.request({
        url: app.globalData.domain + 'api/web/index.php/posts',
        method: "POST",
        header: { "Content-Type": "application/json" },
        data: {
          title: title,
          content: content,
          appid: app.globalData.open,
          nikename: app.globalData.userInfo.nickName,
          times:0,
        },
        success: res => {

          console.log(res);
          console.log(title);
          wx.reLaunch({
            url: '../blog/blog?create=1'//传入create=1数据，保存之后会刷新博客页面
          })
        }

      })

    }
  },

/**
 * user login
 */
userlogin: function (){

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

//上传图片
  chooseImg: function () {
    // console.log(tempFilePaths[0]);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.domain + 'api/web/index.php/uploadfile/uploadimg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            console.log(res);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // console.log(app.globalData.userInfo)
    // if (app.globalData.userInfo){
    //   that.userlogin();
    // }else{
    //   that.onGotUserInfo();
    // }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
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
    
  }
})