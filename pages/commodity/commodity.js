const app = getApp()
const http = require('../../utils/net.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    listData: [],
    goodsList:[]
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });  
    var that = this;
    http.getRequest('product/getProductTypeList', {}, function (res) {
      console.log(res)
      that.setData({
        listData: res.data
      })
      let list = [{}];
      for (let i = 0; i < that.data.listData.length; i++) {
        list[i] = {};
        list[i].name = that.data.listData[i].typeName;
        list[i].id = i;
        that.getGoods(that.data.listData[i].id, i)  
      }
      that.setData({
        list: list,
        listCur: list[0]
      })       
    })
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
    // console.log(e)
    // this.getGoods(e.currentTarget.dataset.id, e.currentTarget.dataset.id) 
    // that.getGoods(that.data.listData[0].id, 0) 
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        // console.log("fffffffffff", i)
        return false
      }
    }
  },
  getGoods(id,index){
    var that = this;
    http.getRequest('product/getProductDetailList', {
      id: id
    }, function (res) {
      if (index === 0){
        that.setData({
          goodsList:[res.data]
        })
      }else{
        let array = [...that.data.goodsList]
        array[index] = res.data
        that.setData({
          goodsList: array
        })
      }
      // that.setData({
      //   list: that.data.list
      // })  
    })      
  },
  goPage(e){
    console.log("dddddddddddddddddddddddddddddddddd", e.currentTarget.dataset)
    wx.navigateTo({
      url: '../../pages/selectAddress/selectAddress' + "?id=" + e.currentTarget.dataset.id + "&price=" + e.currentTarget.dataset.price + "&name=" + e.currentTarget.dataset.name
    })
  }
})