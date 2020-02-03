import { URL, Request, SuccRequest } from '../../utils/request.js'

Page({
  /* Init data of Page */
  data: {
    pageNum: 1,
    list: [],
    skuList: [],
    currentPage: 0,
    totalPages: 0,
    showNum: null,
    loading: true,
    loadSku: false,
    loadMore: false,
    skuId: null,
    showModal: false,
    sale: {
      price: '',
      number: ''
    }
  },
  // Toggle Goods Click Event
  toggleGoods: function (e) {
    let productId = e.currentTarget.dataset.id,
        that = this
    if (productId === this.data.showNum) {
      productId = null
    }
    that.setData({
      skuList: [],
      showNum: productId,
      loadSku: productId ? true : false
    })
    productId != null &&
      Request({
        url: URL.skuList + String(productId),
        success: function (res) {
          var data = SuccRequest(res)
          if (data) {
            that.setData({
              skuList: data.skuList,
              loadSku: !that.data.loadSku
            })
          }
        }
      })
  },
  longPressSku: function (e) {
    this.setData({
      skuId: e.currentTarget.dataset.skuid,
      showModal: true,
      sale: {
        price: '',
        number: ''
      }
    })
  },
  // Input value listener
  changePrice: function (e) {
    this.setData({
      ["sale.price"]: e.detail.value
    })
  },
  changeNumber: function (e) {
    this.setData({
      ["sale.number"]: e.detail.value
    })
  },
  // Modal button
  tapDialogButton: function (e) {
    let that = this,
      { showNum, skuId, sale: {price, number}} = that.data
    if (e.detail.index == 1) {
      Request({
        url: URL.saleSku,
        method: "post",
        data: {
          productId: showNum,
          skuId,
          sellNums: number,
          sellPrice: price
        },
        success: function (res) {
          var data = SuccRequest(res)
          if (data) {
            wx.showToast({
              title: '出售成功',
              duration: 1000
            })
          } 
        }
      })
    }
    that.setData({
      skuId: null,
      showModal: false,
      ["sale.price"]: '',
      ["sale.number"]: ''
    })
  },
  // Load Stock
  loadStock: function ({load={}, number} = {}) {
    let that = this,
      num = that.data.pageNum,
      url = `${URL.despList}?pageNum=${num}&pageSize=20`
    if (number && number != '') {
      url += '&productNo=' + number
      num = 1
    }
    Request({
      url,
      success: function (res) {
        var data = SuccRequest(res)
        if (data) {
          let list = that.data.list.concat(data.content)
          that.setData({
            list,
            currentPage: data.pageNum,
            totalPages: data.totalPages,
            ...load
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /* LifeCycle-监听页面加载 */
  onLoad: function (options) {
    this.loadStock({
      load: { loading: false }
    })
  },
  bdSearchConfirm: function(e) {
    this.setData({
      loading: true,
      list: []
    })
    this.loadStock({
      load: { loading: false },
      number: e.detail.value
    })
  },
  /* 下拉刷新 */
  onPullDownRefresh: function () {
    const { loading } = this.data
    if (loading) return
    this.loadStock({
      load: { loading: false }
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
    this.loadStock({
      load: { loadMore: false }
    })
  }
})
