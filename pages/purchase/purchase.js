import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'


Page({
  data: {
    pageNum: 1,
    pageSize: 20,
    purcList: [],
    date: handleDate(),
    loading: true
  },
  pageLoad: function ({num=1, size=20} = {}) {
    let that = this,
        { date } = that.data
    that.setData({
      loading: true
    })
    const dates = date.split(' ~ '),
      url = `${URL.purcList}?pageNum=${num}&pageSize=${size}` 
            + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            purcList: data.content,
            loading: false
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { date } = e.detail
    this.setData({ date })
    this.pageLoad()
  },
  /* LifeCycle--监听页面加载 */
  onShow: function () {
    this.pageLoad()
  },
  /* 下拉刷新 */
  onPullDownRefresh: function() {
    const { loading } = this.data
    if (loading) return
    this.pageLoad()
  }
})
