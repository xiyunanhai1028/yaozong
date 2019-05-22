// pages/selectAddress/selectAddress.js
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
    addressList: [],
    shangpinID: '',
    shangpinName: '',
    shangpinp: '',
    addressId: '',
    userData: ''
  },
  bindchange(e) {
    console.log("dddddddddddddddddddddddddddd------------------", e.detail.value)
    this.setData({
      addressId: e.detail.value
    })
  },
  exchargeProduct() {
    http.getRequest('product/exchargeProduct', {
      userId: 1,
      productId: '',
      productName: '',
      productNum: ''
    }, function (res) {
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      shangpinID: options.id,
      shangpinName: options.name,
      shangpinp: options.price,
    })
    var that = this;
    http.getRequest('address/getAddressList', {
      userId: 1
    }, function (res) {
      that.setData({
        addressList: res.data
      })
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].current === "0") {
          that.setData({
            addressId: res.data[i].id
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
    var that = this;
    http.getRequest('address/getAddressList', {
      userId: 1
    }, function (res) {
      that.setData({
        addressList: res.data
      })
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].current === "0") {
          that.setData({
            addressId: res.data[i].id
          })
        }
      }
    })
    var that = this;
    http.getRequest('user/getUserDetailById', {
      userId: 1
    }, function (res) {
      that.setData({
        userData: res.data
      })
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
  goPage(e) {
    console.log('urlurlurl', e)
    let _id = ''
    if (e.currentTarget.dataset.data) {
      _id = e.currentTarget.dataset.data
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?addressData=' + JSON.stringify(_id)
    })
  },
  delGoods(e) {
    console.log("ddddd", e.currentTarget.dataset.data.id)
    var that = this;
    wx.showModal({
      title: '',
      content: '确定要删除这个地址吗？',
      cancelText: '删除',
      confirmText: '取消',
      success: res => {
        if (!res.confirm) {
          http.getRequest('address/delete', {
            id: e.currentTarget.dataset.data.id
          }, function (res) {
            if (res.code === "200") {
              that.getList();
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  getList() {
    var that = this;
    http.getRequest('address/getAddressList', {
      userId: 1
    }, function (res) {
      that.setData({
        addressList: res.data
      })
    })
  },
  duihuan() {
    var that = this;
    if (that.data.addressId === '' || that.data.addressId == undefined) {
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.userData.goldNum < that.data.shangpinp) {
      wx.showToast({
        title: '你的微金币数量少于改商品需要的微金币数',
        icon: 'none',
        duration: 2000
      })
      return;
    }    
    wx.showModal({
      title: '',
      content: '确定要兑换该商品吗？',
      cancelText: '确定',
      confirmText: '取消',
      success: res => {
        console.log(res.confirm)
        if (!res.confirm) {
          wx.request({
            url: 'https://yz.juren5280.com/stock/product/exchargeProduct',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: "GET",
            data: {
              userId: wx.getStorageSync('userID'),
              productId: that.data.shangpinID,
              productName: that.data.shangpinName,
              productNum: that.data.shangpinp,
              addressId: that.data.addressId
            },
            success(res) {
              console.log(res)
              if (res.data.code === "200") {
                wx.switchTab({
                  url: '../../pages/commodity/commodity'
                })
                wx.showToast({
                  title: '兑换成功',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
          // http.getRequest('product/exchargeProduct', {
          //   userId: 1,
          //   productId: that.data.shangpinID,
          //   productName: that.data.shangpinName,
          //   productNum:  that.data.shangpinp,
          //   addressId: that.data.addressId
          // }, function (res) {
          //   if (res.code === "200") {
          //     // that.getList();
          //     wx.showToast({
          //       title: '兑换成功',
          //       icon: 'none',
          //       duration: 2000
          //     })
          //   }
          // })
        }
      }
    })
  }
})