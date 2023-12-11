// index.js
var words_list_url = "https://gitee.com/joeyjiaojg/english-words/raw/master/words_alpha.txt"

Page({
  data: {
    inputValue: '',
    displayText: "Not filtered yet"
  },
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  onSubmit(e){
    var regexp = this.data.inputValue;
    var that = this;
    wx.getStorage({
      key: "words_list",
      success(res) {
        const words = filter_words(res.data, regexp);
        that.setData({
          displayText: words.join('\n')
        })
      },
      fail() {
        wx.request({
          url: words_list_url,
          method: 'GET',
          success: function(res) {
            wx.setStorage({
              key: "words_list",
              data: res.data
            });
            const words = filter_words(res.data, regexp);
            that.setData({
              displayText: words.join('\n')
            })
          },
          fail: function() {
            wx.showToast({
              title: 'Network Error',
            });
          }
        })
      }
    })
  }
})

function filter_words(data, regStr) {
  var result = [];
  const re = new RegExp("^" + regStr + "$");
  for (var line of data.split("\n")) {
    line = line.replace(/\r/, "");
    const match = line.match(re);
    if (match != null) {
      result.push(match.input);
    }
  }
  return result;
}
