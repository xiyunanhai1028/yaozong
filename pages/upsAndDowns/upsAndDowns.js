// pages/upsAndDowns/upsAndDowns.js
const app = getApp()
const http = require('../../utils/net.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: getNowFormatDate(),
    loading: true,
    currentGolds: [],
    currentGolds1: [],
    commentsData: [],
    shangzhengData:'',
    shangzhengUp: '',
    shangzhengDown: '',
    daoqongsiData: '',
    daoqongsiUp: '',
    daoqongsiDown: '',
    fuliData: '',
    fuliUp: '',
    fuliDown: '',
    jindouIndex: 1,
    isUp: '' ,
    gupiaoType: '',
    yucePaiLIst: [],
    jindou: 10,
    ischeckBet: false,
    topDistance:0,
    timer:"",


    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    yucePaiLIst: [],
    TabCur: 0,
    scrollLeft: 0,
    tabList: ["预测王者排行榜", "财富排行榜"],
    codeIndex: 0,
    gupiaoIndex: 0,
    yucePaiLIst1: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    setTimeout(function () {
      // console.log('333333333333')
      that.setData({
        loading: true
      })
    }, 500)
    http.getRequest('predictRank/getPredictRank',{
    },function(res){
      that.setData({
        yucePaiLIst: res.data
      })
    })     
    http.getRequest('bet/checkBet', {
      userId: 1
    }, function (res) {
      // console.log("datadatadatadatadatadatadatadatadatadatadatadata",res.data)
      that.setData({
        ischeckBet: res.data
      })
    })  


   
    http.getRequest('user/getGoldRank', {
      type: 0
    }, function (res) {
      that.setData({
        yucePaiLIst1: res.data
      })
    }) 
    http.getRequest('predictRank/getPredictRank', {
      type: 0
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
  // jiequHanshu(array){
  //   if(){

  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {  
    this.initList();   
    var that=this;
    var timer=setInterval(function(){
      if (that.data.topDistance <= -236){
        that.setData({
          topDistance: 0
        })
      }else{
        that.setData({
          topDistance: that.data.topDistance - 10
        })
      }
     
    },400)
    that.setData(
      {
        timer:timer
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.data.timer)
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
    console.log(11110)
    wx.navigateTo({
      url: e.currentTarget.dataset.url + "?index=" + e.currentTarget.dataset.index
    })
  },
  yanORno(e) {
    var that = this;
    var isUp = this.data.isUp;
    var gupiaoType = this.data.gupiaoType;
    if (that.data.ischeckBet){
      wx.showToast({
        title: '你已经押过了,不能重复押了',
        icon: 'none',
        duration: 2000
      })
      return false;      
    }
    if (isUp === ""){
      wx.showToast({
        title: '还没有选择押注的金豆数啊',
        icon: 'none',
        duration: 2000
      })   
      return false;
    }
    if (gupiaoType === "") {
      wx.showToast({
        title: '还没有选择押注的金豆数啊',
        icon: 'none',
        duration: 2000
      })       
      return false;
    }
    http.getRequest('bet/addBet', {
      userId: 1,
      type: Number(gupiaoType),
      goldNum: that.data.jindou,
      upDown: Number(isUp)
    }, function (res) {
      console.log(res)
      that.initList();
      that.hideModal();
    })   
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      isUp: e.currentTarget.dataset.isup,
      gupiaoType: e.currentTarget.dataset.gupiaotype
    })
    console.log(this.data.isUp)
  },
  hideModal() {
    this.setData({
      modalName: null,
      isUp: '',
      gupiaoType: ''
    })
  },
  clickjindou(e){
    console.log(e)
    var num = e.currentTarget.dataset.num;
    var jiner = e.currentTarget.dataset.jiner;
    this.setData({
      jindouIndex: Number(num),
      jindou: Number(jiner)
    })
  },
  initList(){
    var that = this;
    http.getRequest('bet/checkBet', {
      userId: 1
    }, function (res) {
      that.setData({
        ischeckBet: res.data
      })
    })     
    http.getRequest('bet/getCurrentGolds', {type: 0}, function (res) {
      console.log(res)
      that.setData({
        currentGolds: String(res.data).split('')
      })
    })
    http.getRequest('bet/getCurrentGolds', { type: 1 }, function (res) {
      console.log(res)
      that.setData({
        currentGolds1: String(res.data).split('')
      })
    })

    http.getRequest('comment/getLastComment', {}, function (res) {
      console.log(res)
      that.setData({
        commentsData: res.data
      })
    })    
    http.getRequest('comment/getLastComment', {}, function (res) {
      console.log(res)
      that.setData({
        commentsData: res.data
      })
    })
    http.getRequest('bet/getPercentByType', {
      type: "0"
    }, function (res) {
      console.log(res)
      that.setData({
        shangzhengData: res.data,
        shangzhengUp: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.up / (res.data.up + res.data.down)),
        shangzhengDown: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.down / (res.data.up + res.data.down)),
      })
    })
    http.getRequest('bet/getPercentByType', {
      type: "1"
    }, function (res) {
      console.log(res)
      that.setData({
        daoqongsiData: res.data,
        daoqongsiUp: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.up / (res.data.up + res.data.down)),
        daoqongsiDown: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.down / (res.data.up + res.data.down)),
      })
      console.log(res.data.up + res.data.down)
    })
    http.getRequest('bet/getPercentByType', {
      type: "2"
    }, function (res) {
      console.log(res)
      that.setData({
        fuliData: res.data,
        fuliUp: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.up / (res.data.up + res.data.down)),
        fuliDown: res.data.up + res.data.down === 0 ? 0 : toPercent(res.data.down / (res.data.up + res.data.down)),
      })
      // console.log(res.data.up/(res.data.up + res.data.down))
    })  
  }
})
function toPercent(point) {
  if (point == 0) {
    return 0;
  }
  var str = Number(point * 100).toFixed();
  str += "%";
  return str;
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + '年' + month + '月' + strDate + '日';
  return currentdate;
}