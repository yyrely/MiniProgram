import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

Page({
  /* Init data of page */
  data: {
    pageNum: 1,
    pageSize: 20,
    saleList: [],
    loading: false,
    date: handleDate()
  },
  pageLoad: function ({ num=1, size=20 } = {}) {
    let that = this,
        { date } = this.data
    that.setData({
      loading: true
    })
    const dates = date.split(' ~ '),
      url = `${URL.saleList}?pageNum=${num}&pageSize=${size}`
        + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            saleList: data.content,
            loading: false
          })
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
  /* LifeCycle--监听页面显示 */
  onShow: function () {
    this.pageLoad()
  },
  /* 下拉刷新 */
  onPullDownRefresh: function() {
    const { loading } = this.data
    if (loading) return
    this.pageLoad()
  },
  /* 上拉加载 */
  onReachBottom: function () {

  }
})