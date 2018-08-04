// pages/qrcode/qrcode.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeimgPath:null,
    boolr:false
  },

  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    app.globalData.userInfo = e.detail.userInfo
  },


//发送模板消息
  formSubmit: function (e){
    var bool = this.data.boolr;
    
    // console.log(boolr);


    console.log(e);
    console.log(app.globalData.open);
    var form_id = e.detail.formId;
    console.log(form_id);
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/appid/sendmsg',
      method:"POST",
      data:{
      
        "touser": app.globalData.open,
        "template_id": "hX6Sy9fOgTsH7KthZA3NNa6GnFIkfSJj3kHlzmeAYtU",
        // "page": "index",
        "form_id": e.detail.formId,
        // "form_id": form_id,
        "data": {
          "keyword1": {
            // "value": app.globalData.userInfo.nickName
            "value":"hello"
          },
          "keyword2": {
            "value": "nice to meet you!!!"
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene);


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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '哈喽',
      // path: '/page/qrcode/qrcode' 
    }
  },
  sendmessage:function (e){
    var that = this;

    wx.request({
      url: app.globalData.domain + 'api/web/index.php/appid/template',
      method:"POST",
      data: {
        "offset": 0,
        "count": 5
        },
      header: {
        'content-type': 'application/json'
      },
      success :res => {
        console.log(res);
      }

    })
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
        avatar: app.globalData.userInfo['avatarUrl'],
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


//生成二维码
  primary: function (e) {
    var that = this;
    
    // var _url = '后台地址';
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/appid/qrcode',
      //请求报文体
      data: {
        // id: agentCode
        "path":"pages/blog/blog",

      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          boolr: true
        }),
        that.setData({qrcodeimgPath:app.globalData.domain+res.data.msg});
        // console.log(res);
        //为00时表示成功，得到二维码的地址
        // if (res.data) {
          // console.log("成功")
          //下载二维码
      //     wx.downloadFile({
      //       url: res.data.body[0].URL,
      //       success: function (res) {
      //         //如果二维码中的id为固定值可以将图片保存到本地，否则不用保存
      //         wx.saveFile({
      //           tempFilePath: res.tempFilePath,
      //           success: function (res) {
      //             console.log("保存成功")
      //             _that.setData({
      //               filePath: res.savedFilePath
      //             })
      //             console.log(res.savedFilePath)
      //             try {
      //               //id为定值，则将保存的地址存入缓存，非定值则只需要setData就行
      //               wx.setStorageSync('filePath', res.savedFilePath)
      //             } catch (e) {
      //               console.log(e)
      //             }
      //           },
      //           fail: function (res) {
      //             console.log("保存失败")
      //             console.log(res)
      //           }
      //         })
      //       }, fail: function (res) {
      //         util.msg("错误", "通讯失败")
      //         console.log(res)
      //       }
      //     })
      //   } else {
      //     console.log("错误")
      //     util.msg("错误", res.data.msg)
      //   }
      },
      fail: function (res) {
        // util.msg("错误", "通讯失败")
        console.log(res)
      }
    })
  }
})