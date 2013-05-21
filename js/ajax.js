// Generated by CoffeeScript 1.6.2
var ajax, rule;

ajax = {
  url_api: "https://api.betaseries.com",
  site_url: "https://www.betaseries.com",
  key: "6db16a6ffab9",
  post: function(category, params, successCallback, errorCallback) {
    var member, token;

    if (params == null) {
      params = '';
    }
    member = DB.get('session', {});
    token = member.token === null ? '' : "&token=" + member.token;
    $('#sync img').attr('src', '../img/sync.gif');
    return $.ajax({
      type: "POST",
      url: this.url_api + category + ".json",
      data: "key=" + this.key + params + token,
      dataType: "json",
      success: function(data) {
        $('#sync img').attr('src', '../img/sync.png');
        if (successCallback != null) {
          return successCallback(data);
        }
      },
      error: function() {
        $('#sync img').attr('src', '../img/sync.png');
        if (errorCallback != null) {
          return errorCallback();
        }
      }
    });
  }
};

if (chrome.declarativeWebRequest != null) {
  rule = {
    conditions: [
      new chrome.declarativeWebRequest.RequestMatcher({
        url: {
          hostSuffix: 'api.betaseries.com'
        }
      })
    ],
    actions: [
      new chrome.declarativeWebRequest.SetRequestHeader({
        name: 'User-Agent',
        value: Fx.getNewUserAgent()
      })
    ]
  };
  chrome.declarativeWebRequest.onRequest.addRules([rule]);
}
