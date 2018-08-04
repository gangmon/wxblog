
var app = getApp();
// var time = require('../../utils/util.js');
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:app.globalData.open,
    blogs:[],
  },

  

  upper:function() {
      console.log("使用了upper ");
      this.updateBlog();
  },
  bindViewTap: function (e) {
    console.log(e);
    var post_id = e.currentTarget.dataset.post_id;
    console.log(post_id);

    wx.request({
      url: app.globalData.domain + 'api/web/index.php/posts/addread',
      method:"POST",
      data:{
        id:post_id,
      },
      success: res => {
        console.log(res);
        console.log("成功");
      }
    })
    var current = this.findBlog(post_id, this.data.blogs);
    console.log(current);
    try {
      wx.setStorageSync('current_blog', current)
    } catch (e) {
    }
    wx.navigateTo({
      url: '../blog/blog-detail?post_id='+post_id,
    })
  },
  //查找文章，进入文章详情时使用
  findBlog: function (post_id,posts){
    
      for (var x in posts) {
        // console.log(posts);
        // console.log(post_id);
        // console.log(x);
        // console.log(posts[x]['post_id']);
        // console.log(posts[x]);
        if (posts[x]['post_id'] == post_id) {
          return posts[x];
        }
      }
      return null;
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    if (options.create == 1){ this.updateBlog();}

    var that = this;
    console.log(that.blogs);
    console.log(app.globalData.userInfo)
    // that.blogs = wx.getStorageSync('blog_store');
    var blogs = wx.getStorageSync('blog_store');
    that.setData({blogs:blogs})
    if (blogs){

    }else{
      this.updateBlog();
    }
    console.log(that.blogs);
    
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
    this.updateBlog();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.updateBlog();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  updateSearchBlog: function (searchData) {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/posts/searchsomething',
      data: {data:searchData},
      method:'POST',
      header: { 'Content-Type': 'application/json' },

      success: res => {
        console.log(res);
        var blogs = that.feedBlog(res.data);
        that.setData({
          blogs: blogs
        })
        console.log(blogs);
        wx.setStorage({
          key: 'blog_store',
          data: blogs,
        })

      }
    })
  },

  updateBlog: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'api/web/index.php/posts/search',
      data:{},
      header:{'Content-Type':'application/json'},

      success: res => {
        console.log(res);
        var blogs = that.feedBlog(res.data);
        that.setData({
          blogs:blogs
        })
        console.log(blogs);
        wx.setStorage({
          key: 'blog_store',
          data: blogs,
        })

      }
    })
  },
  feedBlog: function (jsonStr) {
    var feeds = new Array();
    console.log(jsonStr);
    for (var x in jsonStr){
      
      var item = jsonStr[x];
      var feed = {
        "id":item.post_id,
        "nickname":item.nickname,
        "post_id":item.post_id,
        "title":item.title,
        "content":item.content,
        "times":item.times,
        "create_time":this.timeChange(item.create_time),
        "avatar":item.avatar,
        "commentNum":item.commentNum
      }
      feeds.push(feed);
    }
    console.log(feeds);
    return feeds;
  },
  //时间戳转化为日期
  timeChange : function (time) {
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


  //顶栏目的搜索功能
  search: function (e) {
    console.log(e.detail.value);
    var that = this;

    var title = e.detail.value;

    wx.request({
      url: app.globalData.domain + 'api/web/index.php/posts/searchsomething',
      method: "POST",
      data: {
        data: title,
      },
      success: res => {
        console.log(res);
        var blogs = that.feedBlog(res.data);
        that.setData({
          blogs: blogs
        })
        console.log(blogs);
        wx.setStorage({
          key: 'blog_store',
          data: blogs,
        })

      }
    })

  },
  

})