// components/datepicker/datepicker.js
import { getSelectedDay } from '../calendar/main.js'
import { judgeDate, handleDate } from '../../utils/util'

let today = handleDate()

Component({
  /* Properties */
  properties: {

  },
  /* Init data */
  data: {
    start: today,
    end: today,
    starthide: true,
    endhide: true,
    hide: true,
    calendarConfig: {
      theme: 'default', // 设置主题
      defaultDay: true, // 默认选中当天
      highlightToday: true, // 高亮显示当天
      disableLaterDay: true // 禁选当天之后的日期
    }
  },
  /* Function List */
  methods: {
    // EventListener => click 'date button'
    bdDateTap(e) {
      const { type } = e.currentTarget.dataset
      if (type == 'start') {
        this.setData({
          endhide: true
        })
      } else if (type == 'end') {
        this.setData({
          starthide: true
        })
      }
      const hide = type + 'hide'
      this.setData({
        [hide]: !this.data[hide]
      })
    },
    // Choose Day.
    bdDayPick(e) {
      const { type } = e.currentTarget.dataset
      const hide = type + 'hide'
      if (getSelectedDay().length > 0) {
        let judge = true
        let newDay = handleDate(getSelectedDay()[0])
        if (type == 'start') {
          judge = judgeDate({
            start: newDay,
            end: this.data.end
          })
        } else if (type == 'end') {
          judge = judgeDate({
            start: this.data.start,
            end: newDay
          })
        }
        if (!judge) {
          wx.showToast({
            title: '开始日期不可大于结束日期',
            icon: 'none',
            duration: 1500
          })
          return
        }
        this.setData({
          [hide]: true,
          [type]: newDay
        })
        this.triggerEvent('datefresh', {
          dates: [this.data.start, this.data.end]
        })
      }
    }
  }
})
