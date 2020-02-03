// pages/modify/index.js
const { URL, Request, SuccRequest } = require('../../utils/request.js')
Page({
  /* Init data of page */
  data: {
    type: '',
    category: [],
    categoryIndex: 0,
    categoryObj: {},
    categoryId: null,
    attrs: [],
    products: [{}],
    showModal: false,
    mdAttrId: null,
    mdAttrName: '',
    addValue: ''
  },
  /* Event Listener */
  bdTypeChange: function (e) {
    let that = this
    const {categoryObj} = that.data,
      index = e.detail.value
    that.setData({
      categoryIndex: index
    })
    categoryObj.some((item) => {
      if (item.categoryName == that.data.category[index]) {
        that.setData({
          categoryId: item.categoryId
        })
        return true
      }
    })
    that.getAttr(that.categoryId)
  },
  bdValueChange: function(e) {
    let { attrs } = this.data
    attrs = attrs.map((attr) => {
      if (attr.attributeId == e.currentTarget.dataset.attrid) {
        attr.valueIndex = e.detail.value
      }
      return attr
    })
    this.setData({ attrs })
  },
  bdOpenModal: function (e) {
    const { attrid, attrname } = e.currentTarget.dataset
    this.setData({
      showModal: true,
      mdAttrId: attrid,
      mdAttrName: attrname
    })
  },
  bdInputAttr: function (e) {
    const { value }
     = e.detail
    this.setData({
      addValue: value
    })    
  },
  bdAddProduct: function() {
    let { products } = this.data
    products.push({})
    this.setData({ products })
  },
  bdModalBtn: function (e) {
    if (e.detail.index == 1) {
      let that = this
      const { mdAttrId, addValue } = that.data
      Request({
        url: URL.addValue,
        method: 'post',
        data: {
          attributeId: mdAttrId,
          valueName: addValue
        },
        success: function (res) {
          const data = SuccRequest(res)
          if (data) {
            let attrs = that.data.attrs.map((item) => {
              if (item.attributeId == mdAttrId) {
                item.valuePos[item.valuePos.length - 1] = data
                item.valuePos.push({ valueName: '+' })
              }
              return item
            })
            that.setData({ attrs })
            wx.showToast({
              title: '添加成功',
              duration: 1000
            })
          }
        }
      })
    }
    this.setData({
      showModal: false,
      mdAttrName: '',
      mdAttrId: null
    })
  },
  getAttr: function (categoryId) {
    if (!categoryId) return false
    let that = this
    Request({
      url: `${URL.attrValue}/${categoryId}`,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          let attrs = data.map((item) => {
            item.valuePos.push({valueName: '+'})
            return item
          })
          that.setData({
            attrs
          })
          console.log(data)
        }
      }
    })
  },
  /* LifeCycle--监听页面加载 */
  onLoad: function (options) {
    let that = this
    Request({
      url: URL.category,
      success: function (res) {
        let data = SuccRequest(res)
        if (data) {
          let category = []
          data.forEach((item) => {
            category.push(item.categoryName)
          })
          that.setData({
            category,
            categoryObj: data
          })
          if (!options.categoryId) that.getAttr(that.data.categoryObj[0].categoryId)
        }
      }
    })
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