const { URL, Request, SuccRequest } = require('../../utils/request.js')

Page({
  /* Init data of Page */
  data: {
    list: [],
    skuList: [],
    currentPage: 0,
    totalPages: 0,
    showNum: null,
    loading: true,
    loadSku: false,
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
              loadSku: false
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
          console.log(data)
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
  /* LifeCycle-监听页面加载 */
  onLoad: function (options) {
    let that = this
    Request({
      url: URL.despList,
      success: function (res) {
        var data = SuccRequest(res)
        if (data) {
          that.setData({
            list: data.content,
            currentPage: data.pageNum,
            totalPages: data.totalPages,
            loading: false
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

  /**
   * 生命周期函数--监听页面显示
   */
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

// {
//   "productId": 8,
//   "userId": 1,
//   "categoryId": 1,
//   "productNo": "test00001",
//   "productName": "测试01",
//   "productPic": null,
//   "productDesc": null,
//   "skuList": [
//     {
//       "skuId": 11,
//       "productId": 8,
//       "skuInPrice": 100.00,
//       "skuOutPrice": 220.00,
//       "skuStock": 6,
//       "skuDesc": null,
//       "valueList": [
//         {
//           "valueId": 1,
//           "attributeId": 1,
//           "attributeName": "颜色",
//           "valueName": "黑色"
//         },
//         {
//           "valueId": 3,
//           "attributeId": 2,
//           "attributeName": "尺码",
//           "valueName": "X"
//         }
//       ]
//     },
//     {
//       "skuId": 12,
//       "productId": 8,
//       "skuInPrice": 110.00,
//       "skuOutPrice": 220.00,
//       "skuStock": 5,
//       "skuDesc": null,
//       "valueList": [
//         {
//           "valueId": 2,
//           "attributeId": 1,
//           "attributeName": "颜色",
//           "valueName": "红色"
//         },
//         {
//           "valueId": 3,
//           "attributeId": 2,
//           "attributeName": "尺码",
//           "valueName": "X"
//         }
//       ]
//     },
//     {
//       "skuId": 14,
//       "productId": 8,
//       "skuInPrice": 120.00,
//       "skuOutPrice": 220.00,
//       "skuStock": 6,
//       "skuDesc": null,
//       "valueList": [
//         {
//           "valueId": 1,
//           "attributeId": 1,
//           "attributeName": "颜色",
//         }
//       ]
//     }
//   ]
// }