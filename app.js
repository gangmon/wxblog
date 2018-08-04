//app.js
App({

  globalData: {
    userInfo: null,
    open: null,
    avatarUrl: null,
    // domain:"http://fg:8888/newapi/",
    domain:"https://fangkemi.xyz/newapi/",
    // domain: "https://fangkemi.xyz/newapi/",
    // domain:"https://fangkemi.xyz/careapi/"
    // domain: "http://fg/careapi/"

  },


  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.login();
    var access = wx.getStorageSync('access_token');
    console.log(access);
    if (!access){
      this.token();
    }
    
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

            console.log(this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  login: function (){
    wx.login({
      success: res => {
        console.log(res.code);
        var that = this;
        //发送code到后台换取appid
        if (res.code){
          wx.request({
            url: this.globalData.domain + 'api/web/index.php/appid',
            data:{
              code:res.code
            },
            success:res => {
              //将res.code发送到后台解码出openId
              that.globalData.open = res.data.openid;
              console.log(res.data.openid);
              wx.request({
                url: this.globalData.domain + 'api/web/index.php/userapi',
                method: "POST",
                data:{
                  openid:res.data.openid,
                  nickname:this.globalData.userInfo.nickName,
                  avatar:this.globalData.avatarUrl
                },
                success: res => {
                  console.log(res)
                }
              })
            }
            
          })
        }

      }
    })
  },
  token:function (){
    
    wx.request({
      url: this.globalData.domain + 'api/web/index.php/appid/gettoken',
      data:{
        code:1
      },
      success:res => {
        //得到access_token
        console.log(res);
        console.log(res.data.access_token);
        wx.setStorage({
          key: 'access_token',
          data: res.data.access_token,
        })
      }
    })
  },

  

})