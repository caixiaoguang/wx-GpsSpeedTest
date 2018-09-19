//index.js
//获取应用实例
const app = getApp()
import echarts from '../../ec-canvas/echarts.js'

let chart = null
var option = {
  backgroundColor: '#282e39',
  color: ["#37A2DA", "#32C5E9", "#67E0E3"],
  series: [{
    name: '速度',
    type: 'gauge',
    center: ['50%', '55%'],
    min: 0,
    max: 330,
    splitNumber: 11,
    radius: '95%',
    axisLine: { // 坐标轴线
      lineStyle: { // 属性lineStyle控制线条样式
        color: [
          [0.09, 'lime'],
          [0.82, '#1e90ff'],
          [1, '#ff4500']
        ],
        width: 3,
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    axisLabel: { // 坐标轴小标记
      textStyle: { // 属性lineStyle控制线条样式
        fontWeight: 'bolder',
        color: '#fff',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    axisTick: { // 坐标轴小标记
      length: 15, // 属性length控制线长
      lineStyle: { // 属性lineStyle控制线条样式
        color: 'auto',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    splitLine: { // 分隔线
      length: 25, // 属性length控制线长
      lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
        width: 3,
        color: '#fff',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    pointer: { // 分隔线
      shadowColor: '#fff', //默认透明
      shadowBlur: 5
    },
    title: {
      textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        fontSize: 20,
        fontStyle: 'italic',
        color: '#fff',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    detail: {
      backgroundColor: 'rgba(30,144,255,0.8)',
      borderWidth: 1,
      borderColor: '#fff',
      shadowColor: '#fff', //默认透明
      shadowBlur: 5,
      offsetCenter: ['-5%', '60%'], // x, y，单位px
      textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        color: '#fff',
        fontSize: '20'
      }
    },
    data: [{
      value: 0,
      name: 'km/h'
    }]
  }, ],
};


function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart.setOption(option, true);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    lng: 113.324520,
    lat: 23.099994,
    scale: 17,
    speed: 0,
    markers: [],
    //轨迹
    polyline: [{
      points: [],
      color: "#1f9ae4",
      width: 8,
    }],
    ec: {
      onInit: initChart
    }
  },

  //获取位置失败
  getLocFail: () => {
    wx.showModal({
      title: '无定位权限',
      content: '使用该功能需要允许小程序获取定位权限，点击确定开启定位权限',
      showCancel: false,
      success: (confirm) => {
        if (confirm) {
          wx.openSetting({})
        }

      }
    })
  },

  //地图中心移动到当前定位点
  move2CurrentPos() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          lat: res.latitude,
          lng: res.longitude,
          scale: 17
        })
      },
      //定位失败
      fail: this.getLocFail
    })
  },

  //获取当前定位点并添加到polyline
  addPoint2Polyline() {
    clearInterval(timeId)
    let timeId = setInterval(res => {
      let that = this
      wx.getLocation({
        type: 'gcj02',
        //定位成功
        success: res => {
          let pos = {
            latitude: res.latitude,
            longitude: res.longitude,
          }
          let speed = res.speed < 0 ? 0 : (res.speed / 5 * 18).toFixed(1)

          let pointLen = this.data.polyline[0].points.length

          //还没有记录过点
          if (!pointLen) {
            this.data.polyline[0].points.push(pos)
          }

          let lastPos = this.data.polyline[0].points[pointLen - 1] || {} //线的最后一个点

          // this.data.polyline[0].points.push(pos)
          //定位点发生变化才加入线的点列表
          if (!(lastPos.latitude === pos.latitude && lastPos.longitude === pos.longitude)) {
            this.data.polyline[0].points.push(pos)
          }
          this.setData({
            lng: res.longitude,
            lat: res.latitude,
            polyline: that.data.polyline,
            speed
          })
          option.series[0].data[0].value = speed
          chart.setOption(option)
        },
        //定位失败
        fail: res => {
          this.getLocFail()
          clearInterval(timeId)
        }
      })
    }, 1000)

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.move2CurrentPos();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.addPoint2Polyline()
  },

  onShareAppMessage: () => {
    return {
      title: "GPS测速仪，测测车速有多快",
      fail: (e) => {
        let errMsg = e.errMsg || '';
        //对不是用户取消转发导致的失败进行提示
        let msg = '分享失败，请重新分享'
        if (errMsg.indexOf('cancel') !== -1) {
          msg = '取消分享'
        }
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
    }
  }

})