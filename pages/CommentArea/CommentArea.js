// pages/CommentArea/CommentArea.js
const app = getApp()
const http = require('../../utils/net.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    textareaAValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  tijiaoBtn(){
    var that = this;
    if(that.data.textareaAValue === ''){
      wx.showToast({
        title: '评论区没有内容',
        icon: 'none',
        duration: 2000
      })     
      return false;
      // wx.navigateBack()
    }
    var that = this;
    http.getRequest('comment/add', {
      userId: 1,
      comments: that.data.textareaAValue
    }, function (res) {
      if (res.code === '200') {
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '评论失败',
          icon: 'none',
          duration: 2000
        })
      }
    })  
  }
})