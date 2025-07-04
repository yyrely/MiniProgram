// components/datepicker/datepicker.js
import { handleDate } from '../../utils/util'

// 辅助函数：将Date对象转换为日期字符串
function dateToString(date) {
  return handleDate({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  })
}

let today = handleDate()

Component({
  /* Properties */
  properties: {

  },
  /* Init data */
  data: {
    start: today,
    end: today,
    todayDate: today,
    showCustomModal: false,
    tempStart: today,
    tempEnd: today,
    quickOptions: ['今天', '昨天', '本周', '本月', '自定义'],
    selectedQuickIndex: 0,
    lastValidQuickIndex: 0 // 记录上次有效的快捷选择索引
  },
  /* Function List */
  methods: {
    // 格式化日期范围显示
    formatDateRange(start, end) {
      if (start === end) {
        return start
      }
      return `${start} 至 ${end}`
    },
    
    // 快捷选择变化
    onQuickChange(e) {
      const index = e.detail.value
      const quickTypes = ['today', 'yesterday', 'week', 'month', 'custom']
      const type = quickTypes[index]
      
      console.log('选择:', this.data.quickOptions[index], type)
      
      // 如果选择的是自定义，显示弹窗
      if (type === 'custom') {
        this.showCustomPicker()
        return
      }
      
      // 记录非自定义的有效选择
      this.setData({
        lastValidQuickIndex: index
      })
      
      const nowDate = new Date()
      let start, end
      
      switch (type) {
        case 'today':
          start = end = dateToString(nowDate)
          break
        case 'yesterday':
          const yesterdayDate = new Date(nowDate)
          yesterdayDate.setDate(nowDate.getDate() - 1)
          start = end = dateToString(yesterdayDate)
          break
        case 'week':
          // 计算本周一到今天
          const weekStartDate = new Date(nowDate)
          const dayOfWeek = nowDate.getDay()
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
          weekStartDate.setDate(nowDate.getDate() - daysToMonday)
          start = dateToString(weekStartDate)
          end = dateToString(nowDate)
          break
        case 'month':
          // 计算本月1号到今天
          const monthStartDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)
          start = dateToString(monthStartDate)
          end = dateToString(nowDate)
          break
      }
      
      console.log('计算出的日期范围:', start, '至', end)
      
      // 强制更新数据
      this.setData({
        start: start,
        end: end,
        selectedQuickIndex: index
      })
      

      
      // 触发事件
      this.triggerEvent('datefresh', {
        dates: [start, end]
      })
      
      console.log('已触发datefresh事件，日期:', [start, end])
    },
    
    // 显示自定义日期选择弹窗
    showCustomPicker() {
      this.setData({
        showCustomModal: true,
        tempStart: this.data.start,
        tempEnd: this.data.end,
        selectedQuickIndex: 4 // 设置为自定义选项
      })
    },
    
    // 隐藏自定义日期选择弹窗
    hideCustomPicker() {
      this.setData({
        showCustomModal: false,
        selectedQuickIndex: this.data.lastValidQuickIndex // 恢复到上次有效的快捷选择
      })
    },
    
    // 阻止事件冒泡
    stopPropagation() {
      // 阻止点击弹窗内容区域时关闭弹窗
    },
    
    // 临时开始日期变化
    onTempStartChange(e) {
      const tempStart = e.detail.value
      let tempEnd = this.data.tempEnd
      
      // 如果开始日期大于结束日期，则将结束日期设置为开始日期
      if (new Date(tempStart) > new Date(tempEnd)) {
        tempEnd = tempStart
      }
      
      this.setData({
        tempStart,
        tempEnd
      })
    },
    
    // 临时结束日期变化
    onTempEndChange(e) {
      const tempEnd = e.detail.value
      const tempStart = this.data.tempStart
      
      // 验证日期范围
      if (new Date(tempEnd) < new Date(tempStart)) {
        wx.showToast({
          title: '结束日期不能早于开始日期',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      this.setData({
        tempEnd
      })
    },
    
    // 确认自定义日期
    confirmCustomDate() {
      const { tempStart, tempEnd } = this.data
      
      this.setData({
        start: tempStart,
        end: tempEnd,
        selectedQuickIndex: 4, // 保持自定义选项选中状态
        lastValidQuickIndex: 4, // 更新最后有效选择为自定义
        showCustomModal: false
      })
      
      // 触发事件
      this.triggerEvent('datefresh', {
        dates: [tempStart, tempEnd]
      })
      
      console.log('自定义日期确认:', tempStart, tempEnd)
    }
  },
  
  /* 生命周期 */
  ready() {
    console.log('日期选择器组件准备完成，初始日期:', this.data.start, this.data.end)
    
    // 触发初始事件
    this.triggerEvent('datefresh', {
      dates: [this.data.start, this.data.end]
    })
  }
})
