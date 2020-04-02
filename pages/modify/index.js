// pages/modify/index.js
import { URL, Request, SuccRequest } from '../../utils/request.js'

Page({
  /* Init data of page */
  data: {
    isModify: false,
    isSubmit: false,
    prodId: null,
    value: '',
    category: [],
    categoryIndex: null,
    categoryObj: {},
    attrs: [],
    orders: [ 0 ],
    valueKeys: [{}],
    products: [{}], // 商品列表
    goods: {
      categoryId: null,
      productNo: '',
      productName: ''
    },
    showModal: false,
    mdAttrId: null,
    mdAttrName: '',
    addValue: ''
  },
  /* Event Listener */
  bdGoodsInput: function(e) {
    let { type } = e.currentTarget.dataset
    type = 'goods.' + type
    this.setData({
      [type]: e.detail.value
    })
  },
  bdTypeChange: function (e) {
    let that = this
    const {categoryObj} = that.data,
      index = e.detail.value
    that.setData({
      categoryIndex: index
    })
    categoryObj.forEach((item) => {
      if (item.categoryName == that.data.category[index]) {
        that.setData({
          ['goods.categoryId']: item.categoryId
        })
        return false
      }
    })
    that.getAttr(that.data.goods.categoryId)
  },
  bdClose: function(e) {
    const that = this
    wx.showModal({
      content: '确认删除？',
      success(res) {
        if (res.cancel) return
        let { order } = e.currentTarget.dataset
        let { orders, valueKeys, products } = that.data
        orders.splice(order, 1)
        for (let i=order; i<orders.length; i++) {
          orders[i] -= 1;
        }
        valueKeys.splice(order, 1)
        products.splice(order, 1)
        that.setData({
          orders,
          valueKeys,
          products
        })
      }
    })
  },
  bdValueChange: function(e) {
    let { attrs, products, valueKeys } = this.data,
        { attrid, order } = e.currentTarget.dataset
    attrs.forEach((attr) => {
      if (attr.attributeId == attrid) {
        valueKeys[order][attrid] = e.detail.value
        let has = false
        if (products[order].valueList) {
          has = products[order].valueList
                .some((value) => value.attributeId == attrid)
        }
        if (has) {
          products[order].valueList.forEach((value) => {
            if (value.attributeId == attrid) {
              value.valueId = attr.valueIds[e.detail.value]
            }
          })
        } else {
          if (!products[order].valueList) {
            products[order].valueList = []
          }
          products[order].valueList.push({
            attributeId: attrid,
            valueId: attr.valueIds[e.detail.value],
            valueName: attr.valueNames[e.detail.value]
          })
        }
      }
    })
    this.setData({ attrs, products, valueKeys })
  },
  bdValueInput: function(e) {
    const { order, type } = e.currentTarget.dataset
    let { products } = this.data
    products[order][type] = e.detail.value
    this.setData({ products })
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
    const { value } = e.detail
    this.setData({
      addValue: value
    })    
  },
  bdAddProduct: function() {
    let { orders, valueKeys, products } = this.data,
      len = orders.length
    products.push({})
    orders.push(len)
    valueKeys.push({})
    this.setData({ orders, valueKeys, products })
  },
  bdSubmit: function() {
    const that = this
    if (that.data.isSubmit) return
    if (!that.formValidate()) return
    const { data } = that
    let text = '添加成功',
        url = URL.addProduct,
        info = {
          ...data.goods,
          skuList: data.products
        }
    if (data.isModify) {
      text = '修改成功'
      url = URL.modProduct
      info.productId = data.prodId
    }
    that.setData({
      isSubmit: true
    })
    Request({
      url,
      method: 'post',
      data: {
        ...info
      },
      success: function(res) {
        const resData = SuccRequest(res)
        that.setData({
          isSubmit: false
        })
        if (resData) {
          wx.showToast({
            title: text,
            duration: 2000,
            complete: function() {
              wx.navigateBack()
            }
          })
        }
      }
    })    
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
      mdAttrId: null,
      value: ''
    })
  },
  formValidate: function () {
    let { goods, products, attrs } = this.data
    if (!goods.productNo || goods.productNo == '') {
      modal('货品编号不能为空')
      return false
    } if (!goods.productName) {
      modal('货品名称不能为空')
      return false
    } if (!goods.categoryId) {
      modal('请选择货品类别')
      return false
    }
    let vali = true
    for (var product of products) {
      if (!product.valueList || product.valueList.length !== attrs.length) {
        modal('请选择商品属性')
        vali = false
        break
      } else if (!product.skuInPrice || product.skuInPrice == '') {
        modal('商品进价不能为空')
        vali = false
        break
      } else if (!product.skuOutPrice || product.skuOutPrice == '') {
        modal('商品售价不能为空')
        vali = false
        break
      } else if (product.skuStock == null || product.skuOutStock == '') {
        modal('商品库存不能为空')
        vali = false
        break
      }
    }
    return vali
    function modal (title) {
      wx.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
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
          if (that.data.isModify) {
            let { products, orders, valueKeys } = that.data
            products.forEach((prod, index) => {
              orders[index] = index
              prod.valueList.forEach((value) => {
                attrs.forEach((attr) => {
                  if (attr.attributeId == value.attributeId) {
                    attr.valueIds.forEach((id, i) => {
                      if (id == value.valueId) {
                        if (!valueKeys[index]) valueKeys.push({})
                        valueKeys[index][attr.attributeId] = i
                      }
                    })
                  }
                })
              })
            })
            that.setData({
              orders,
              valueKeys
            })
          }
        }
      }
    })
  },
  /* LifeCycle--监听页面显示 */
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
          if (!options.prodid) {
            that.getAttr(data[0].categoryId)
          } else {
            Request({
              url: URL.getProduct + options.prodid,
              success: function(res) {
                let prodInfo = SuccRequest(res)
                if (prodInfo) {
                  let categoryIndex = 0
                  category.forEach((cate, index) => {
                    cate == prodInfo.categoryName
                      && (categoryIndex = index)
                  })
                  that.setData({
                    isModify: true,
                    prodId: options.prodid,
                    categoryIndex,
                    products: prodInfo.skuList,
                    goods: {
                      productNo: prodInfo.productNo,
                      productName: prodInfo.productName,
                      categoryId: prodInfo.categoryId
                    }
                  })
                  that.getAttr(prodInfo.categoryId)
                }
              }
            })
          }
        }
      }
    })
  },
  /* LifeCycle--监听页面隐藏 */
  onHide: function () {
    // Data init
    this.setData({
      isModify: false,
      prodId: null,
      category: [],
      categoryIndex: null,
      categoryObj: {},
      attrs: [],
      orders: [ 0 ],
      products: [{}],
      goods: {
        categoryId: null,
        productNo: '',
        productName: ''
      },
      showModal: false,
      mdAttrId: null,
      mdAttrName: '',
      addValue: ''
    })
  }
})