import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

const today = handleDate()

Page({
  /* Init data of page */
  data: {
    pageNum: 1,
    totalPages: 20,
    saleList: [],
    rejectId: null,
    showBack: false,
    backNums: '',
    loading: true,
    loadMore: false,
    dates: [today, today]
  },
  bdSaleTap(e) {
    this.setData({
      rejectId: e.currentTarget.dataset.sale
    })
  },
  bdRejectTap(e) {
    const that = this
    const { num } = e.currentTarget.dataset
    if (num == '1') {
      wx.showModal({
        content: '确认退货？',
        success(res) {
          if (res.confirm) {
            that.rejectApi(num)
          }
        }
      })
    } else {
      this.setData({
        showBack: true
      })
    }    
  },
  bdBackModBtn(e) {
    const { backNums} = this.data
    if (e.detail.index == 1 && (!backNums || backNums == '')) {
      wx.showToast({
        title: '退货数量不能为空',
        icon: 'none',
        duration: 1500
      })
      return
    } else if (e.detail.index == 1) {
      this.rejectApi(backNums)
    }
    this.setData({
      showBack: false,
      backNums: ''
    })
  },
  bdInputChange(e) {
    this.setData({
      backNums: e.detail.value
    })
  },
  rejectApi(num) {
    let that = this
    const { rejectId } = this.data
    Request({
      url: `${URL.returnProd}${rejectId}/${num}`,
      method: 'post',
      success(result) {
        const data = SuccRequest(result)
        if (data) {
          wx.showToast({
            title: '退货成功',
            duration: 1500,
            complete() {
              that.pageLoad({
                load: { loading: false }
              })
            }
          })
        }
      }
    })
  },
  pageLoad: function ({ load={}, type } = {}) {
    let that = this,
        { dates, pageNum:num } = this.data
    const url = `${URL.saleList}?pageNum=${num}&pageSize=10`
        + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          let saleList = data.content
          if (type == 'add') {
            saleList = that.data.saleList.concat(data.content)
          }
          that.setData({
            saleList,
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
    this.pageLoad({
      load: {loading: false}
    })
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