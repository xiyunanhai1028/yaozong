// pages/stepNumber/stepNumber.js
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
    textareaAValue: ''
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
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
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
  duihuan(jine) {
    var that = this;
    wx.request({
      url: 'https://yz.juren5280.com/stock/record/save',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "GET",
      data: {
        addAmount: jine,
        addType: 1,
        goldNumbe: jine*1000,
        userId: wx.getStorageSync('userID')
      },
      success(res) {
        console.log(res)
        if (res.data.code === "200") {
          // that.getList();
          // wx.showToast({
          //   title: '兑换成功',
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      }
    })
  },
  pay(e){
    console.log(e)
    if (this.data.textareaAValue === ""){
      wx.showToast({
        title: '充值金额不能为空',
        icon: 'none',
        duration: 2000
      })  
      return false;  
    }
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          // http.getRequest('order/orderPay', { code: res.code, amount: 10}, function (res) {
          //   console.log(res)
          // })   
          wx.request({
            url: 'https://yz.juren5280.com/stock/order/orderPay',
            method: "POST",
            data: {
              code: res.code,
              amount: that.data.textareaAValue
            },
            success(res2) {
              console.log(res2.data.body)
              var _item = res2.data.body;
              wx.requestPayment({
                timeStamp: _item.timeStamp,
                nonceStr: _item.nonceStr,
                package: _item.pkg,
                signType: 'MD5',
                paySign: _item.paySign,
                success(res) {
                  that.duihuan(that.data.textareaAValue)
                  wx.showToast({
                    title: '充值金额成功',
                    icon: 'none',
                    duration: 2000
                  })                    
                },
                fail(res) {
                  wx.showToast({
                    title: '充值金额失败',
                    icon: 'none',
                    duration: 2000
                  })  
                }
              })
            }
          })              
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})