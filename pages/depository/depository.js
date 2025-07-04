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
    const rawProductId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const productId = parseInt(rawProductId) || rawProductId
    const currentShowNum = this.data.showNum
    
    // 查找当前点击的商品在列表中的信息
    const clickedItem = this.data.list.find(item => item.productId == productId)
    const itemByIndex = this.data.list[index]
    
    console.log('toggleGoods clicked - 原始数据:', {
      rawProductId,
      rawProductIdType: typeof rawProductId,
      productId,
      productIdType: typeof productId,
      index,
      currentShowNum,
      currentShowNumType: typeof currentShowNum,
      isCurrentShowNumNull: currentShowNum === null,
      listLength: this.data.list.length,
      clickedItem: clickedItem ? {
        productId: clickedItem.productId,
        productName: clickedItem.productName,
        categoryName: clickedItem.categoryName
      } : 'NOT_FOUND',
      itemByIndex: itemByIndex ? {
        productId: itemByIndex.productId,
        productName: itemByIndex.productName,
        categoryName: itemByIndex.categoryName
      } : 'INDEX_OUT_OF_RANGE',
      dataConsistent: clickedItem && itemByIndex && clickedItem.productId === itemByIndex.productId
    })
    
    // 验证数据一致性
    if (!clickedItem) {
      console.error('商品不在列表中，productId:', productId)
      return
    }
    
    if (itemByIndex && clickedItem.productId !== itemByIndex.productId) {
      console.error('索引和ID不匹配，使用索引对应的商品ID')
      // 使用索引对应的商品ID
      const correctProductId = itemByIndex.productId
      
      // 如果点击的是已展开的商品，则收起
      if (currentShowNum !== null && correctProductId == currentShowNum) {
        console.log('Collapsing product (corrected):', correctProductId)
        this.setData({
          showNum: null,
          skuList: [],
          loadSku: false
        })
        return
      }
      
      // 展开新的商品
      console.log('Expanding product - 准备展开 (corrected):', correctProductId)
      const that = this
      this.setData({
        showNum: correctProductId,
        skuList: [],
        loadSku: true
      }, function() {
        console.log('Expanding product - setData完成，当前showNum (corrected):', that.data.showNum)
        that.loadProd(correctProductId)
      })
      return
    }
    
    // 如果点击的是已展开的商品，则收起
    if (currentShowNum !== null && productId == currentShowNum) {
      console.log('Collapsing product:', productId)
      this.setData({
        showNum: null,
        skuList: [],
        loadSku: false
      })
      return
    }
    
    // 展开新的商品
    console.log('Expanding product - 准备展开:', productId)
    const that = this
    this.setData({
      showNum: productId,
      skuList: [],
      loadSku: true
    }, function() {
      // 在setData完成后的回调中执行后续操作
      console.log('Expanding product - setData完成，当前showNum:', that.data.showNum)
      // 加载SKU数据
      that.loadProd(productId)
    })
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
    if (!productId) {
      console.warn('loadProd: productId is required')
      return
    }
    
    const that = this
    
    // 添加加载延迟，让用户看到加载动画
    setTimeout(() => {
      Request({
        url: URL.skuList + String(productId),
        success: function (res) {
          const data = SuccRequest(res)
          if (data && data.skuList && Array.isArray(data.skuList)) {
            // 添加延迟显示动画效果
            setTimeout(() => {
              that.setData({
                skuList: data.skuList,
                loadSku: false
              })
            }, 200)
          } else {
            console.warn('loadProd: Invalid SKU data received')
            that.setData({
              skuList: [],
              loadSku: false
            })
          }
        },
        fail: function (err) {
          console.error('loadProd: Request failed', err)
          wx.showToast({
            title: '加载失败，请重试',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            skuList: [],
            loadSku: false
          })
        }
      })
    }, 100)
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
          let resetState = {}
          
          if (type == 'add') {
            // 分页加载时，保持当前展开状态
            list = that.data.list.concat(data.content)
            console.log('分页加载完成，新增商品数量:', data.content.length, '总商品数量:', list.length)
            console.log('新增的商品数据:', data.content.map(item => ({
              productId: item.productId,
              productName: item.productName
            })))
          } else {
            // 刷新或搜索时，重置展开状态
            list = data.content
            resetState = {
              showNum: null,
              skuList: [],
              loadSku: false
            }
            console.log('列表刷新完成，商品数量:', list.length)
          }
          
          that.setData({
            list,
            currentPage: data.pageNum,
            totalPages: data.totalPages,
            ...resetState,
            ...load
          })
          wx.stopPullDownRefresh()
        }
      },
      fail: function (err) {
        console.error('loadStock: Request failed', err)
        that.setData({
          ...load
        })
      }
    })
  },
  /* LifeCycle-监听页面加载 */
  onShow: function (options) {
    if (this.data.pageNum === 1) {
      this.setData({
        admin: globalData.admin
      })
      this.loadStock({
        load: { loading: false }
      })
    }
  },
  bdSearchConfirm: function(e) {
    this.setData({
      loading: true,
      list: [],
      pageNum: 1,
      showNum: null,
      skuList: [],
      loadSku: false
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
    
    // 重置所有状态
    this.setData({
      pageNum: 1,
      showNum: null,
      skuList: [],
      loadSku: false,
      list: []
    })
    
    this.loadStock({
      load: { loading: false }
    })
  },
  /* Pull-up Loading */
  onReachBottom: function () {
    let {pageNum, totalPages, loadMore, list} = this.data
    
    // 检查DOM节点限制，如果商品数量过多，停止加载
    if (list.length >= 100) {
      console.warn('商品数量已达到限制(100)，停止加载更多')
      wx.showToast({
        title: '商品数量过多，请使用搜索功能',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    if (pageNum >= totalPages) {
      this.setData({ loadMore: false })    
      return
    }
    if (loadMore) return
    
    console.log('onReachBottom: 准备加载下一页', {
      currentPageNum: pageNum,
      totalPages,
      currentListLength: list.length
    })
    
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
