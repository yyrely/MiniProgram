import { URL, Request, SuccRequest } from '../../utils/request.js'

const globalData = getApp().globalData

Page({
  /* Init data of Page */
  data: {
    admin: globalData.admin,
    pageNum: 1,
    list: [],
    skuList: [],
    currentPage: 0,
    totalPages: null,
    showNum: null,
    loading: true,
    loadSku: false,
    loadMore: false,
    skuId: null,
    back: {
      skuId: null,
      sellNums: ''
    },
    showModal: false,
    showBack: false,
    sale: {
      price: '',
      number: ''
    }
  },
  // Toggle Goods Click Event
  toggleGoods: function (e) {
    let productId = e.currentTarget.dataset.id
    if (productId === this.data.showNum) {
      productId = null
    }
    this.setData({
      skuList: [],
      showNum: productId,
      loadSku: productId ? true : false
    })
    productId != null
      && this.loadProd(productId)
  },
  bdSellTap: function (e) {
    this.setData({
      skuId: e.currentTarget.dataset.skuid,
      showModal: true,
      sale: {
        price: '',
        number: ''
      }
    })
  },
  bdBackTap(e) {
    this.setData({
      ["back.skuId"]: e.currentTarget.dataset.skuid,
      ["back.productId"]: e.currentTarget.dataset.prodid,
      showBack: true
    })
  },
  // Input value listener
  bdInputChange(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [type]: e.detail.value
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
              title: '操作成功',
              duration: 1500,
              complete() {
                that.loadProd(showNum)
              }
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
  bdBackModBtn(e) {
    const that = this
    const { showNum, back } = that.data
    if (e.detail.index == 1) {
      if (!back.sellNums || back.sellNums=='') {
        wx.showModal({
          title: '退货数量不能为空',
          duration: 1500
        })
        return
      }
      Request({
        url: URL.returnFact,
        method: "post",
        data: {
          productId: showNum,
          ...back
        },
        success: function (res) {
          var data = SuccRequest(res)
          if (data) {
            wx.showToast({
              title: '操作成功',
              duration: 1500,
              complete() {
                that.loadProd(showNum)
              }
            })
          }
        }
      })
    }
    that.setData({
      showBack: false,
      back: {
        skuId: null,
        sellNums: ''
      }
    })
  },
  loadProd(productId) {
    const that = this
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
  // Load Stock
  loadStock: function ({load={}, number, type} = {}) {
    let that = this,
      num = that.data.pageNum,
      url = `${URL.despList}?pageNum=${num}&pageSize=10`
    if (number && number != '') {
      url += '&productNo=' + number
      num = 1
    }
    Request({
      url,
      success: function (res) {
        var data = SuccRequest(res)
        if (data) {
          let list
          if (type == 'add') {
            list = that.data.list.concat(data.content)
          } else {
            list = data.content
          }
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
  onShow: function (options) {
    this.setData({
      admin: globalData.admin
    })
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
  /* Pull-down Fresh */
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
      load: { loadMore: false },
      type: 'add'
    })
  }
})
