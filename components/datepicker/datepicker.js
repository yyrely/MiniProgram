// components/datepicker/datepicker.js
import { getSelectedDay } from '../calendar/main.js'

Component({
  /* Properties */
  properties: {

  },
  /* Init data */
  data: {
    chooseDate: '2020-01-15',
    hide: true,
    calendarConfig: {
      theme: 'default', // 设置主题
      chooseAreaMode: true, // 开启日期范围选择
      highlightToday: true, // 高亮显示当天
      disableLaterDay: true // 禁选当天之后的日期
    }
  },
  /* Function List */
  methods: {
    toggleCalendar: function (e) {
      let {hide} = this.data
      this.setData({
        hide: !hide
      })
      if (!hide) {
        getSelectedDay();  
      }
      
    }
  }
})
