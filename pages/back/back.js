import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

const today = handleDate()

Page({
  /* Init data of page */
  data: {
    pageNum: 1,
    totalPages: 20,
    backList: [],
    rejectId: null,
    loading: true,
    loadMore: false,
    dates: [today, today]
  },
  pageLoad: function ({ load={}, type } = {}) {
    let that = this,
        { dates, pageNum:num } = this.data
    const url = `${URL.backList}?pageNum=${num}&pageSize=10`
        + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          let backList = data.content
          if (type == 'add') {
            backList = that.data.backList.concat(data.content)
          }
          that.setData({
            backList,
            ...load
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { dates } = e.detail
    this.setData({
      pageNum:1,
      loading: true,
      dates
    })
    this.pageLoad({
      load: {loading: false}
    })
  },
  /* LifeCycle--监听页面显示 */
  onShow: function () {
    if (this.data.pageNum === 1) {
      this.pageLoad({
        load: {loading: false}
      })
    }
  },
  /* Pull-down Fresh */
  onPullDownRefresh: function() {
    const { loading } = this.data
    if (loading) return
    this.setData({
      pageNum: 1,
      loading: true
    })
    this.pageLoad({
      load: {loading: false}
    })
  },
  /* Pull-up Loading */
  onReachBottom: function () {
    let {pageNum, totalPages, loadMore} = this.data
    if (pageNum >= totalPages) {
      this.setData({ loadMore: false })    
      return
    }
    if (loadMore) return
    this.setData({
      loadMore: true,
      pageNum: this.data.pageNum + 1
    })
    this.pageLoad({
      load: { loadMore: false },
      type: 'add'
    })
  }
})