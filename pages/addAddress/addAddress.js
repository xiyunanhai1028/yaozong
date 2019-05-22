const app = getApp();
const http = require('../../utils/net.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    region: ['广东省', '广州市', '海珠区'],
    modalName: null,
    name: '',
    phone: '',
    address: '',
    switchBool: false
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  bindKeyInput(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneInput(e){
    this.setData({
      phone: e.detail.value
    })  
  },
  bindAddressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  switch1Change(e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      switchBool: e.detail.value
    })
  },
  baoDizhi(){
    if(this.data.name === ''){
      wx.showToast({
        title: '情输入姓名',
        icon: 'none',
        duration: 2000
      })     
      return false;
    }
    if (this.data.phone === '') {
      wx.showToast({
        title: '情输入电话号码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.address === '') {
      wx.showToast({
        title: '情输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }   
    var that = this;
    http.getRequest('address/save', {
      userId: 1,
      name: that.data.name,
      phone: that.data.phone,
      address: that.data.region[0] + "^" + that.data.region[1] + "^" + that.data.region[2] + "^" + that.data.address,
      current: that.data.switchBool? 0 : 1
    }, function (res) {
      if(res.code === '200'){
        wx.showToast({
          title: '增加成功',
          icon: 'none',
          duration: 2000
        })
        // wx.redirectTo({
        //   url: '../../pages/selectAddress/selectAddress'
        // })
        // wx.navigateTo({
        //   url: '../../pages/selectAddress/selectAddress'
        // })
        wx.navigateBack()
      }else{
        wx.showToast({
          title: '新增失败',
          icon: 'none',
          duration: 2000
        })      
      }
    })    
  } 
})
