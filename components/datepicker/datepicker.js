// components/datepicker/datepicker.js
import { getSelectedDay } from '../calendar/main.js'
import { judgeDate } from '../../utils/util'

let today = handleDate()
let date = handleDate() + ' ~ ' + handleDate()
function handleDate ({...date}) {
  if (!date.year) {
    var date = new Date()
    date = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }
  if (typeof date.month == 'number' && date.month < 10) {
    date.month = `0${date.month}`
  }
  if (typeof date.day == 'number' && date.day < 10) {
    (date.day = `0${date.day}`)
  }
  return `${date.year}-${date.month}-${date.day}`
}

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
    chooseDate: date,
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
        if (type == 'start') {
          judge = judgeDate({
            start: getSelectedDay()[0],
            end: this.data.end
          })
        } else if (type == 'end') {
          judge = judgeDate({
            start: this.data.start,
            end: getSelectedDay()[0]
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
          [type]: handleDate(getSelectedDay()[0])
        })
        this.triggerEvent('datefresh', {
          dates: [this.data.start, this.data.end]
        })
      }
    }
  }
})
