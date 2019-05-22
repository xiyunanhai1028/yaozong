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
    stepInfoList: '',
    keduiStep: 0,
    shibai: false,
    ischeckStep: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee22222222222222222")
          wx.authorize({
            scope: 'scope.werun',
            success() {

            },
            fail() {
              console.log("dddddddddddddddd")
              that.setData({
                shibai: true
              })
            }
          })
        } else {
          wx.login({
            success(res) {
              if (res.code) {
                wx.getWeRunData({
                  success(res1) {
                    // 拿 encryptedData 到开发者后台解密开放数据
                    const encryptedData = res1.encryptedData
                    // 或拿 cloudID 通过云调用直接获取开放数据
                    const cloudID = res1.cloudID
                    http.getRequest('wx/getResult', {
                      js_code: res.code,
                      data: res1.encryptedData,
                      iv: res1.iv
                    }, function (res) {
                      console.log("000000000000000000000000", JSON.parse(res.data));
                      var _item = JSON.parse(res.data).stepInfoList;
                      that.setData({
                        stepInfoList: _item[_item.length-1].step,
                        keduiStep: Math.floor(_item[_item.length - 1].step / 1000)
                      })
                    })
                  }
                })                // 发起网络请求

              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      }
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
    this.ifCanDuihuan();
  },
  ifCanDuihuan(){
    var that = this;
    http.getRequest('wx/checkStep', {
      userId: 1
    }, function (res) {
      console.log("000000000000000000000000", JSON.parse(res.data));
      if (res.code === '200') {
        that.setData({
          ischeckStep: res.data
        })
      }
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
  duihuan() {
    var that = this;
    if (!that.data.ischeckStep) {
      wx.showToast({
        title: '你今天已经兑换过来,不能重复兑换',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: 'https://yz.juren5280.com/stock/record/save',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "GET",
      data: {
        addAmount: 0,
        addType: 0,
        goldNumber: that.data.keduiStep,
        userId: wx.getStorageSync('userID')
      },
      success(res) {
        console.log(res)
        if (res.data.code === "200") {
          that.ifCanDuihuan()
          wx.switchTab({
            url: '../../pages/PersonalCenter/PersonalCenter'
          })
          wx.showToast({
            title: '兑换成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})