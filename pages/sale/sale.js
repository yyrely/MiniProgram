// pages/sale/sale.js
const { URL, Request, SuccRequest } = require('../../utils/request.js')

Page({
  /* Init data of page */
  data: {
    pageNum: 1,
    pageSize: 20,
    saleList: []
  },
  /* LifeCycle--监听页面加载 */
  onLoad: function (options) {
    const that = this,
      {pageNum, pageSize} = that.data
    Request({
      url: `${URL.saleList}?pageNum=${pageNum}&pageSize=${pageSize}`,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            saleList: data.content
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
  /* LifeCycle--监听页面显示 */
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

  }
})