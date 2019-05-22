// pages/FortuneKing/FortuneKing.js
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
    yucePaiLIst: [],
    TabCur: 0,
    scrollLeft: 0,
    tabList: ["预测王者排行榜","财富排行榜"],
    codeIndex: 0,
    gupiaoIndex: 0,
    yucePaiLIst1: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.index === "1"){
      this.setData({
        gupiaoIndex: 0
      })
    }else{
      this.setData({
        gupiaoIndex: 1
      })
    }
    let that = this;
    http.getRequest('user/getGoldRank', {
      type: that.data.gupiaoIndex
    }, function (res) {
      that.setData({
        yucePaiLIst1: res.data
      })
    }) 
    http.getRequest('predictRank/getPredictRank', {
      type: that.data.gupiaoIndex
    }, function (res) {
      that.setData({
        yucePaiLIst: res.data
      })
    })   
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.setData({
      codeIndex: e.currentTarget.dataset.id
    })
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