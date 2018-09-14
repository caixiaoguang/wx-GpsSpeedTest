//index.js
//获取应用实例
const app = getApp()
import echarts from '../../ec-canvas/echarts.js'

let chart=null
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
    radius: '90%',
    axisLine: {            // 坐标轴线
      lineStyle: {       // 属性lineStyle控制线条样式
        color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
        width: 3,
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    axisLabel: {            // 坐标轴小标记
      textStyle: {       // 属性lineStyle控制线条样式
        fontWeight: 'bolder',
        color: '#fff',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    axisTick: {            // 坐标轴小标记
      length: 15,        // 属性length控制线长
      lineStyle: {       // 属性lineStyle控制线条样式
        color: 'auto',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    splitLine: {           // 分隔线
      length: 25,         // 属性length控制线长
      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        width: 3,
        color: '#fff',
        shadowColor: '#fff', //默认透明
        shadowBlur: 10
      }
    },
    pointer: {           // 分隔线
      shadowColor: '#fff', //默认透明
      shadowBlur: 5
    },
    title: {
      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
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
      offsetCenter: ['-5%', '60%'],       // x, y，单位px
      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        color: '#fff',
        fontSize: '20'
      }
    },
    data: [{ value: 0, name: 'km/h' }]
  },],
  grid: {
    x: 0,
    y: 0
  }
};


function initChart(canvas, width, height) {
   chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option1= option
  chart.setOption(option1, true);
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
      }
    })
  },

  //获取当前定位点并添加到polyline
  addPoint2Polyline() {
    clearInterval(timeId)
    let timeId = setInterval(res => {
      let that = this
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          let pos = {
            latitude: res.latitude,
            longitude: res.longitude,
          }
          let speed = res.speed < 0 ? 0 : (res.speed/5*18).toFixed(1)

          let pointLen = this.data.polyline[0].points.length

          console.log(pointLen)
          //还没有记录过点
          if (!pointLen) {
            this.data.polyline[0].points.push(pos)
          }
          
          let lastPos = this.data.polyline[0].points[pointLen - 1] ||{} //线的最后一个点

          console.log(lastPos)


          // this.data.polyline[0].points.push(pos)
          //定位点发生变化才加入线的点列表
          if (!(lastPos.latitude===pos.latitude&&lastPos.longitude===pos.longitude)) {
            this.data.polyline[0].points.push(pos)
          }
          this.setData({
            lng: res.longitude,
            lat: res.latitude,
            polyline: that.data.polyline,
            speed
          })
          option.series[0].data[0].value=speed
          chart.setOption(option)
        },
      })
    }, 1000)

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //页面载入后获取当前定位并设为地图中心点
    // this.move2CurrentPos();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.addPoint2Polyline()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})