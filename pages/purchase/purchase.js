import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

const today = handleDate()
const globalData = getApp().globalData

Page({
  data: {
    admin: globalData.admin,
    pageNum: 1,
    totalPages: null,
    purcList: [],
    dates: [today, today],
    loading: true,
    loadMore: false
  },
  pageLoad: function ({load={}, type} = {}) {
    let that = this,
        { dates, pageNum:num } = that.data
    const url = `${URL.purcList}?pageNum=${num}&pageSize=10` 
            + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          let purcList = data.content
          if (type == 'add') {
            purcList = that.data.purcList.concat(data.content)
          }
          that.setData({
            purcList,
            totalPages: data.totalPages,
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
      dates,
      pageNum: 1
    })
    this.pageLoad({
      load: {loading: false}
    })
  },
  /* LifeCycle--监听页面加载 */
  onShow: function () {
    this.setData({
      admin: globalData.admin
    })
    this.pageLoad({
      load: {loading: false}
    })
  },
  /* Pull-down Fresh */
  onPullDownRefresh: function() {
    const { loading } = this.data
    if (loading) return
    this.setData({
      pageNum: 1
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
