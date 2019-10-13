var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();

Page({
  data: {
    countOfNegatives:0,
    DATE_DAY : new Date().getDate(),
    wholeString:"",
    checkInTime: null,
    reservations:[],
    allreservations:[],
    allreserveddatetime:[],
    maxMonth: 2, //最多渲染月数
    dateList: [],
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkInDate: null,
    markcheckInDate: false, //标记开始时间是否已经选择
    sFtv: [
      
    ]
  },
  onLoad: function (options) {
    // 页面渲染完成
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData();
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数

    var checkInDate = options.checkInDate
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({ systemInfo: res, checkInDate: checkInDate });
      }
    })

    var that = this;
    var arr = [];
    var tempString;
    var wholeString;
    var length;
    var name, wechatid, peoplenumber, datetime;
    var allreservationslocal = [];
    var allreserveddatetimelocal = [];
    wx.request({
      url: 'https://reservemepls.sizebook.cn/php/retrieve.php',
      method: 'POST',
      data: {
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      success: function (res) {
        var wholeString = res.data + "";
        //console.log(wholeString);
        length = wholeString.length;
        console.log(wholeString);
        while (length > 0) {
          var position = wholeString.indexOf(">");
          tempString = wholeString.substring(0, position);

          var position2 = tempString.indexOf("\"\"");
          name = tempString.substring(1, position2);
          tempString = tempString.substring(position2 + 2, tempString.length);

          position2 = tempString.indexOf("\"\"");
          wechatid = tempString.substring(0, position2);
          tempString = tempString.substring(position2 + 2, tempString.length);

          position2 = tempString.indexOf("\"\"");
          peoplenumber = tempString.substring(0, position2);
          tempString = tempString.substring(position2 + 2, tempString.length);

          position2 = tempString.indexOf("\"");
          datetime = tempString.substring(0, position2);
          tempString = tempString.substring(position2 + 2, tempString.length);

          wholeString = wholeString.substring(position + 1, length);
          length = wholeString.length;

          allreservationslocal.push({ name: name, wechatid: wechatid, peoplenumber: peoplenumber, datetime: datetime });
          allreserveddatetimelocal.push(datetime);
        }
        console.log(allreservationslocal);
        console.log(allreserveddatetimelocal);

        for (var p = 1; p < DATE_LIST[0].days.length; p++) {
          for (var o = 0; o < allreserveddatetimelocal.length; o++) {
            if (allreserveddatetimelocal[o].includes(DATE_LIST[0].days[p].timeslots[0])) {
              DATE_LIST[0].days[p].timeslots[0] = "RESERVED by" + " " +allreservationslocal[o].name;
             
            }
            if (allreserveddatetimelocal[o].includes(DATE_LIST[0].days[p].timeslots[1])) {
              DATE_LIST[0].days[p].timeslots[1] = "RESERVED by" + " " + allreservationslocal[o].name;
            }
          }
        }
        that.setData({
          allreserveddatetime: allreserveddatetimelocal,
          allreservations: allreservationslocal,
          dateList: DATE_LIST,
        })
      },
      fail: function () {
        wx.showToast({
          title: 'Error in connection',
          icon: 'loading',
          duration: 1500
        })
      }
    })

/*
    console.log(allreserveddatetimelocal);
    console.log(DATE_LIST[0].days[0].timeslots[0]);
    console.log(allreserveddatetimelocal.length);
    console.log(DATE_LIST[0].days.length);
    
    */

  },
  onReady: function () {
    
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


  bindPickerChange: function (e) {
    console.log(DATE_LIST);
    var count = 0;
    for (i = 0; i < DATE_LIST[0].days.length; i++) {
      if (DATE_LIST[0].days[i].day < 0) {
        count++;
      }
    }
    console.log(count);
    var checkInTime = e.detail.value
    var click = this.data.checkInDate
    console.log(click);
    var countclick = count +click;
    var time = DATE_MONTH + "/" +DATE_LIST[0].days[click+count].timeslots[checkInTime];

    var reservedtime = click + " " + time;
    var reservationslocal = this.data.reservations
    if(this.data.checkInDate == null){
      return
    }
    for(var i=0;i<reservationslocal.length;i++){
      if(reservationslocal[i].includes(time))
      {
        return
      }
    }
    if(time.includes("RESERVED")){
      return
    }
    reservationslocal.push(time)
    //store the current index
    this.setData({
      reservations : reservationslocal
    })
  },

  bindButtonChange: function (event) {
    this.setData({
      checkInDate:null
    })
    var checkInDate = event.target.dataset.pick;
    if(checkInDate <DATE_DAY){
      return
    }
    this.setData({
      checkInDate:checkInDate
    })
   

    //store the current index
 
  },

  //选择的入住与离店时间段
  

  createDateListData: function () {
    
    var dateList = [];
    var now = new Date();
    /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
    now = new Date(now.getFullYear(), now.getMonth(), 1);
    for (var i = 0; i < this.data.maxMonth; i++) {
      var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
      var year = momentDate.getFullYear();
      var month = momentDate.getMonth() + 1;
      
      var timeslot1 = "After Lunch (12:30-1:00)";
      var timeslot2 = "After School (3:35-4:30)";
      var remainderOfSat = i%7;
      var days = [];
      var totalDay = this.getTotalDayByMonth(year, month);
      var week = this.getWeek(year, month, 1);
      //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
      //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
      for (var j = -week +1; j <= totalDay; j++) {
        var timeslots = [];
        var tempWeek = -1;
        if (j > 0)
          tempWeek = this.getWeek(year, month, j);
        var clazz = '';
        if (tempWeek == 0 || tempWeek == 6)
          clazz = 'weekend'
        if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH || remainderOfSat ==5 || remainderOfSat == 4)
          //当天之前的日期不可用
          clazz = 'unavailable ' + clazz;
        else
          clazz = 'active'
          for(var i = 0; i<2; i++){
            if( i ==0){
                          timeslots[i] = j + " " + timeslot1
            }
            if (i == 1) {
              timeslots[i] = j + " " + timeslot2
            }
          }
        days.push({ day: j, class: clazz, timeslots: timeslots})
      }

      var dateItem = {
        id: year + '-' + month,
        year: year,
        month: month,
        days: days,
      }


      dateList.push(dateItem);
      console.log(dateItem);
    }
    var sFtv = this.data.sFtv;
    for (let i = 0; i < dateList.length; i++){//加入公历节日
       for(let k = 0; k < sFtv.length; k++){
         if (dateList[i].month == sFtv[k].month){
           let days = dateList[i].days;
           for (let j = 0; j < days.length; j++){
             if (days[j].day == sFtv[k].day){
               days[j].daytext = sFtv[k].name
             }
           }
         }
       }
    }
    this.setData({
      dateList: dateList
    });
    DATE_LIST = dateList;

  },

  /*
	 * 获取月的总天数
	 */
  getTotalDayByMonth: function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
	/*
	 * 获取月的第一天是星期几
	 */
  getWeek: function (year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  /**
   * 点击日期事件
   */
  onPressDate: function (e) {
    var { year, month, day } = e.currentTarget.dataset;
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

    var tempMonth = month;
    var tempDay = day;

    if (month < 10) tempMonth = '0' + month
    if (day < 10) tempDay = '0' + day

//    var date = year + '-' + tempMonth + '-' + tempDay;

    //如果点击选择的日期A小于入住时间，则重新渲染入住时间为A

    if (!this.data.markcheckInDate) {
      this.setData({
       // checkInDate: date,
        markcheckInDate: true,
        dateList: DATE_LIST.concat()
      });
      //设缓存，返回页面时，可在onShow时获取缓存起来的日期
  


    }

    this.renderPressStyle(year, month, day);
  },
  renderPressStyle: function (year, month, day) {
    var dateList = this.data.dateList;
    //渲染点击样式
    for (var i = 0; i < dateList.length; i++) {
      var dateItem = dateList[i];
      var id = dateItem.id;
      if (id === year + '-' + month) {
        var days = dateItem.days;
        for (var j = 0; j < days.length; j++) {
          var tempDay = days[j].day;
          if (day<10){
            day = '0'+day;
          }
          if (tempDay == day) {
            days[j].class = days[j].class + ' active';
            days[j].inday = true;
            break;
          }

        }
        break;
      }
    }
    this.setData({
      dateList: dateList,
    });
  },
  submitF: function (e) {
    var reservations = this.data.reservations;
    console.log(reservations);
    console.log(e.detail.value.inputWeChat);
    for(var i=0;i<reservations.length;i++){
      var reservationItem = reservations[i];
    wx.request({
      url: 'https://reservemepls.sizebook.cn/php/insert.php',
      method: 'POST',
      data: {
        name: e.detail.value.inputName,
        wechatid: e.detail.value.inputWeChat,
        peoplenumber: e.detail.value.inputPeopleNumber,
        datetime:reservationItem
        
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      success: function (res) {
        wx.showToast({
          title: 'Inserted!',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function () {
        wx.showToast({
          title: 'Error in connection',
          icon: 'loading',
          duration: 1500
        })
      }
    })

  }
  }

})