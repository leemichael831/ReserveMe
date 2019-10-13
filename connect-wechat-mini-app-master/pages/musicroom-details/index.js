// pages/goods-details/index.js
Page({

  data: {
    autoplay:true,
    interval:3000,
    duration:1000,
    goodsDetails:{},
    swiperCurrent:0,
  },
  swiperchange:function(e)
  {
  },
  onLoad: function (options) {
  },
  addWechat:function()
  {
    var that=this
    if( that.data.goodsDetails.user.qrcode.length===0)
    {
      var auth_check=wx.getStorageSync('auth')
      if(that.data.goodsDetails.user._id===auth_check)
      {
        wx.showModal({
          title:'Info',
          content:'Please bind your wechat qrcode',
          showCancel:true,
          cancelText:'Nope',
          cancelColor:'green',
          confirmText:'Ok',
          success:function(res)
          {
            if(res.confirm)
            {
              wx.navigateTo({
                url:'/pages/qrcode/index'
              })
            }
          }
        })
      }
      else{
wx.showModal({
        title:'Info',
        content:'The owner of this post has not yet set the wechat qrcode,Please try again later',
        showCancel:false,
        confirmText:'Ok',
        success:function(res)
        {
          if(res.confirm)
          {
            wx.navigateBack()
          }
        }
      })
      }
      
    }
    else{
      var qrcodeUrl=that.data.goodsDetails.user.qrcode[0].path
     var wechat_id=that.data.goodsDetails.user.qrcode[0].wechat_id
      wx.redirectTo({
        url:'/pages/qrcode-image/index?qrcodeUrl='+qrcodeUrl+'&wechat_id='+wechat_id
      })
    }
    
  },

  onReady: function () {
  
  },
  toHome:function(e)
  {
    wx.naviageTo({
      url:'/pages/index/index'
    })
  },

  goToSelectTime: function (e) {
    wx.navigateTo({
      url: "/pages/selecttime/index"
    })
  },

  goToMusicCalendar: function (e) {
    wx.navigateTo({
      url: "/pages/calendar/index"
    })
  },

  goToRetrieve: function (e) {
    wx.navigateTo({
      url: "/pages/calendarretrieve/index"
    })
  },

  goToDelete: function (e) {
    wx.navigateTo({
      url: "/pages/calendardelete/index"
    })
  },

  
})