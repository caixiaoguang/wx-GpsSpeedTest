//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lng: 113.324520,
    lat: 23.099994,
    scale: 17,
    markers: [],
    //轨迹
    polyline: [],

  },

  //地图中心移动到当前定位点
  move2CurrentPos() {
    this.addPoint2Polyline()
    this.setData({
      scale: 17
    })
  },

  //获取当前定位点并添加到polyline
  addPoint2Polyline() {
    let timeId = setInterval(res => {
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          if (!this.data.polyline[0]) {
            this.data.polyline[0] = {
              points: []
            }
          }
          this.data.polyline[0].points.push({
            longitude: res.longitude,
            latitude: res.latitude
            
          })
          this.data.polyline[0].color = "#FF0000DD"
          this.data.polyline[0].width = 4
          this.setData({
            lng: res.longitude,
            lat: res.latitude,
          })
        },
      })
    }, 3000)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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