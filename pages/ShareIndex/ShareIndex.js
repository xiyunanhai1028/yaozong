// pages/ShareIndex/ShareIndex.js
const http = require('../../utils/net.js');
const app = getApp()
let chart = null;
import * as echarts from '../../ec-canvas/echarts';
var datas = splitData([
]);
// 获取对应的数据格式
function splitData(rawData) {
  var categoryData = [],
    values = [],
    nows = [];
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]); //日期
    console.log(rawData)
    nows.push(rawData[i][3] - 0.23); //日期
    values.push(rawData[i]) //开，收，低，高
  }
  console.log({
    categoryData: categoryData,
    now: nows,
    values: values
  })
  return {
    categoryData: categoryData,
    now: nows,
    values: values
  };
}
// 平均值
function calculateMA(dayCount) {
  var result = [];
  for (var i = 0, len = datas.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += datas.values[i - j][1];
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}
// 下面折线图的数据
function calculateSA(datas) {
  var result = [];
  result.push(0);
  for (var i = 0, len = datas.values.length; i < len; i++) {
    if (i > 0) {
      var k = Math.abs(datas.values[i][3] - datas.values[i][2]) / datas.values[i - 1][1] * 100;
      result.push(k.toFixed(2));
    }
  }
  return result;
}
// 下面柱状图的数据
function calculateUD(datas) {
  var result = [];
  result.push(0);
  for (var i = 0, len = datas.values.length; i < len; i++) {
    if (i > 0) {
      var k = (datas.values[i][1] - datas.values[i - 1][1]) / datas.values[i - 1][1] * 100;
      result.push(k.toFixed(2));
    }
  }
  return result;
}
var config = {
  // barWidth: 10,//指定柱宽度
  col: {
    up: 'rgb(153, 14, 14)',
    down: '#19b34c',
    m5: '#f00',
    m10: 'yellow',
    m30: '#dd1ce0',
    // y: '#ffefef'
  },
  // bg: '#000',
  st: 10,
  ed: 40
}
function formatterDateTime(time) {
  var date = new Date()
  var month = date.getMonth() + 1
  var datetime = date.getFullYear()
    + ""// "年"
    + (month >= 10 ? month : "0" + month)
    + ""// "月"
    + (date.getDate() < 10 ? "0" + date.getDate() : date
      .getDate())
    + ""
    + (date.getHours() < 10 ? "0" + date.getHours() : date
      .getHours())
    + ""
    + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
      .getMinutes())
    + ""
    + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
      .getSeconds());
  return datetime;
}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });

  var option = {
    backgroundColor: "#fff",
    // color: '#fff',

    // 提示框浮层的位置
    tooltip: {
      trigger: 'axis',
      formatter: '{a0}:{c0}\n{a1}:{c1}\n{a2}:{c2}',
      // formatter:function(params){
      //     return params.data
      // },
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        width: '20%',
        align: 'left'
      },
      // 坐标轴指示器配置项
      axisPointer: {
        type: 'cross',
        label: {
          show: true,
          color: '#ff0',
          rich: {
            a: {
              // 没有设置 `lineHeight`，则 `lineHeight` 为 56
            }
          }
          // formatter: function(params) {
          //     // 假设此轴的 type 为 'time'。
          //     return 'some text' + params.value;
          // },
        },
        crossStyle: {
          type: 'solid'
        },

      }
    },
    grid: [{
      top: '10%',
      // show:true,
      left: '1%', //grid 组件离容器左侧的距离。
      right: '1%',
      height: '60%',
      // borderColor:'#ccc',
    }, {
      top: '75%',
      left: '1%',
      right: '1%',
      height: '18%',
    }],
    axisPointer: {

      link: {
        xAxisIndex: 'all'
      },
      label: {
        backgroundColor: '#777'
      },
      // triggerOn:'click'
    },
    // 上下两个图表的x轴数据
    xAxis: [{
      type: 'category',
      // scale: true,
      // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      // boundaryGap: false,
      axisLine: {
        // show: false,
        onZero: false
      },
      axisLabel: {
        show: true
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      data: datas.categoryData
    }, {
      type: 'category',
      //boundaryGap: false,
      gridIndex: 1,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      data: datas.categoryData
    }],
    // 
    yAxis: [{
      axisLabel: {
        show: false
      },
      scale: true,
      position: 'right',
      // splitArea: {
      //     show: false
      // },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#888'],
          type: 'dotted'
        }
      },

      // splitNumber: 10
    }, {
      gridIndex: 1,
      position: 'right',
      xAxisIndex: 1,
      //splitNumber: 3,
      splitArea: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#888'],
          type: 'dotted'
        }
      },
      axisLabel: {
        show: false,
        // color: config.col.y
      }
    }],

    // dataZoom: [{
    //   type: 'inside',
    //   xAxisIndex: [0, 1],
    //   start: config.st,
    //   end: config.ed
    // }, {
    //   show: false,
    //   type: 'slider',
    //   xAxisIndex: [0, 1],
    //   y: '94%',
    //   start: config.st,
    //   end: config.ed
    // }],
    series: [{
      type: 'line',
      name: '分时',
      data: datas.now,
      itemStyle: {
        normal: {
          areaStyle: {
            type: 'default'
          },
          color: 'rgba(73,171,242,0.5)'
        }
      }
    }, {
      type: 'bar',
      name: '增加', //下面的柱状图
      // barWidth: config.barWidth,
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: calculateUD(datas),
      itemStyle: {
        normal: {
          color: function (params) {
            var col;
            if (params.data >= 0) {
              col = config.col.up;
            } else {
              col = config.col.down;
            }
            return col;
          }
        }
      }
    },
    {
      type: 'k', //Candlestick 
      name: '日K',
      // barWidth: config.barWidth, //指定柱宽度
      itemStyle: {
        normal: {
          color: config.col.up, //阳线填充色
          color0: config.col.down,
          borderColor: config.col.up, //阳线边框色
          borderColor0: config.col.down
        }
      },
      // markPoint: {
      //     symbol: 'arrow',
      //     symbolSize: 4,
      //     label: {
      //         normal: {
      //             show: true,
      //             formatter: function(param) {
      //                 return param.value
      //             },
      //             color: '#2b8fa6',
      //             fontWeight: 'bold'
      //         }
      //     },
      //     itemStyle: {
      //         normal: {
      //             color: '#f221d6'
      //         }
      //     },
      //     data: [{
      //         name: '最高',
      //         type: 'max',
      //         valueDim: 'highest'
      //     }, {
      //         name: '最低',
      //         type: 'min',
      //         valueDim: 'lowest'
      //     }, {
      //         name: '平均',
      //         type: 'average',
      //         valueDim: 'close'
      //     }],
      // }, 
      data: datas.values
    }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {},
    codeIndex: '',
    code: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    tabList: ["5分", "30分", "60分", "日k", "周k", "月k"],
    gupiaoData: {
      close: "2955.71",
      max: "2955.94",
      min: "2954.79",
      minute: "201905161500",
      open: "2955.11",
      time: "201905161500",
      volumn: "4894349.00"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("optionsoptionsoptionsoptions", options.index)
    this.setData({
      codeIndex: options.index
    })
    if (options.index === "1") {
      this.setData({
        code: "000001"
      })
    } else {
      this.setData({
        code: "000002"
      })
    }
    var that = this;
    var time = getNowFormatDate();
    this.setData({
      ec: {
        onInit: initChart
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.getgupiaoData("day", this.data.code);
    setInterval(function (){
      that.getgupiaoData1("day", that.data.code);
    }, 3000)

  },
  getgupiaoData1(time, code) {
    var that = this;
    var _num = 0;
    if (time === "month") {
      _num = 30 * 12 * 3;
    }
    if (time === "week") {
      _num = 30 * 12 * 1;
    }
    if (time === "day") {
      _num = 30 * 6;
    }

    var beginDay = getNowFormatDate(_num);
    wx.request({
      url: 'https://route.showapi.com/131-45',
      data: {
        "showapi_timestamp": formatterDateTime(),
        "showapi_appid": '89622', //这里需要改成自己的appid
        "showapi_sign": '504fd165f29746938c7554878d240f25',  //这里需要改成自己的应用的密钥secret

      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.showapi_res_body.dataList)
        var dataList = res.data.showapi_res_body.dataList;
        if (res.data.showapi_res_body.indexList) {
          // var _linshi = res.data.showapi_res_body.dataList[0];
          // _linshi.zhenfu = (_linshi.close - _linshi.max).toFixed(2);
          // _linshi.baifenbi = (((_linshi.close - _linshi.max) / _linshi.max).toFixed(4)) * 100;
          that.setData({
            gupiaoData: res.data.showapi_res_body.indexList[0]
          })
        }
      },

      fail: function (error) {
        console.log("333333")
        wx.hideLoading()
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
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
  getgupiaoData(time, code) {
    var that = this;
    var _num = 0;
    if (time === "month") {
      _num = 30 * 12 * 3;
    }
    if (time === "week") {
      _num = 30 * 12 * 1;
    }
    if (time === "day") {
      _num = 30 * 6;
    }

    var beginDay = getNowFormatDate(_num);
    wx.request({
      url: 'https://route.showapi.com/131-52',
      data: {
        "showapi_timestamp": formatterDateTime(),
        "showapi_appid": '89622', //这里需要改成自己的appid
        "showapi_sign": '504fd165f29746938c7554878d240f25',  //这里需要改成自己的应用的密钥secret
        "code": code,
        "time": time,
        "beginDay": beginDay
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.showapi_res_body.dataList)
        var dataList = res.data.showapi_res_body.dataList;
        if (res.data.showapi_res_body.dataList) {
          that.getgupiaoData1();
          var _arr = [];
          var _length = res.data.showapi_res_body.dataList.length;
          for (var i = 0; i < _length; i++) {
            var _item = res.data.showapi_res_body.dataList[i];
            var arr = [_item.time, _item.open, _item.close, _item.min, _item.max];
            _arr.push(arr);
          }
          var datas = splitData(_arr);
          var option = {
            backgroundColor: "#fff",
            // color: '#fff',

            // 提示框浮层的位置
            tooltip: {
              trigger: 'axis',
              formatter: '{a0}:{c0}\n{a1}:{c1}\n{a2}:{c2}',
              // formatter:function(params){
              //     return params.data
              // },
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderWidth: 1,
              textStyle: {
                color: '#fff',
                width: '20%',
                align: 'left'
              },
              // 坐标轴指示器配置项
              axisPointer: {
                type: 'cross',
                label: {
                  show: true,
                  color: '#ff0',
                  rich: {
                    a: {
                      // 没有设置 `lineHeight`，则 `lineHeight` 为 56
                    }
                  }
                  // formatter: function(params) {
                  //     // 假设此轴的 type 为 'time'。
                  //     return 'some text' + params.value;
                  // },
                },
                crossStyle: {
                  type: 'solid'
                },

              }
            },
            grid: [{
              top: '10%',
              // show:true,
              left: '0%', //grid 组件离容器左侧的距离。
              right: '0%',
              height: '60%',
              // borderColor:'#ccc',
            }, {
              top: '75%',
              left: '0%',
              right: '0%',
              height: '18%',
            }],
            axisPointer: {

              link: {
                xAxisIndex: 'all'
              },
              label: {
                backgroundColor: '#777'
              },
              // triggerOn:'click'
            },
            // 上下两个图表的x轴数据
            xAxis: [{
              type: 'category',
              // scale: true,
              // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
              // boundaryGap: false,
              axisLine: {
                // show: false,
                onZero: false
              },
              axisLabel: {
                show: true
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              data: datas.categoryData
            }, {
              type: 'category',
              //boundaryGap: false,
              gridIndex: 1,
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: datas.categoryData
            }],
            // 
            yAxis: [{
              axisLabel: {
                show: false
              },
              scale: true,
              position: 'right',
              // splitArea: {
              //     show: false
              // },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#888'],
                  type: 'dotted'
                }
              },

              // splitNumber: 10
            }, {
              gridIndex: 1,
              position: 'right',
              xAxisIndex: 1,
              //splitNumber: 3,
              splitArea: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#888'],
                  type: 'dotted'
                }
              },
              axisLabel: {
                show: false,
                // color: config.col.y
              }
            }],

            // dataZoom: [{
            //   type: 'inside',
            //   xAxisIndex: [0, 1],
            //   start: config.st,
            //   end: config.ed
            // }, {
            //   show: false,
            //   type: 'slider',
            //   xAxisIndex: [0, 1],
            //   y: '94%',
            //   start: config.st,
            //   end: config.ed
            // }],
            series: [{
              type: 'line',
              name: '分时',
              data: datas.now,
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default'
                  },
                  color: 'rgba(73,171,242,0.5)'
                }
              }
            }, {
              type: 'bar',
              name: '增加', //下面的柱状图
              // barWidth: config.barWidth,
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: calculateUD(datas),
              itemStyle: {
                normal: {
                  color: function (params) {
                    var col;
                    if (params.data >= 0) {
                      col = config.col.up;
                    } else {
                      col = config.col.down;
                    }
                    return col;
                  }
                }
              }
            },
            {
              type: 'k', //Candlestick 
              name: '日K',
              // barWidth: config.barWidth, //指定柱宽度
              itemStyle: {
                normal: {
                  color: config.col.up, //阳线填充色
                  color0: config.col.down,
                  borderColor: config.col.up, //阳线边框色
                  borderColor0: config.col.down
                }
              },
              // markPoint: {
              //     symbol: 'arrow',
              //     symbolSize: 4,
              //     label: {
              //         normal: {
              //             show: true,
              //             formatter: function(param) {
              //                 return param.value
              //             },
              //             color: '#2b8fa6',
              //             fontWeight: 'bold'
              //         }
              //     },
              //     itemStyle: {
              //         normal: {
              //             color: '#f221d6'
              //         }
              //     },
              //     data: [{
              //         name: '最高',
              //         type: 'max',
              //         valueDim: 'highest'
              //     }, {
              //         name: '最低',
              //         type: 'min',
              //         valueDim: 'lowest'
              //     }, {
              //         name: '平均',
              //         type: 'average',
              //         valueDim: 'close'
              //     }],
              // }, 
              data: datas.values
            }
            ]
          };
          chart.setOption(option);
        }
      },

      fail: function (error) {
        console.log("333333")
        wx.hideLoading()
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  tabSelect(e) {
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(e.currentTarget.dataset.id)
    var time = ["5", "30", "60", "day", "week", "month"];
    this.getgupiaoData(time[e.currentTarget.dataset.id], this.data.code);

  }
})

1//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate(time) {
  var getTime = new Date().getTime() - 10 * 24 * 60 * 60 * 1000 - time * 24 * 60 * 60 * 1000;
  var date = new Date(getTime);
  var seperator1 = "";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;

  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;

  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}