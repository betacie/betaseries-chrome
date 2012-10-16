// Generated by CoffeeScript 1.3.3
var Badge, logged,
  __hasProp = {}.hasOwnProperty;

Badge = {
  init: function() {
    chrome.browserAction.setBadgeText({
      text: "?"
    });
    return chrome.browserAction.setBadgeBackgroundColor({
      color: [200, 200, 200, 255]
    });
  },
  autoUpdate: function() {
    if (logged()) {
      this.update();
      return setTimeout(this.update, 1000 * 3600);
    }
  },
  update: function() {
    this.searchNotifs();
    return this.searchEpisodes();
  },
  searchNotifs: function() {
    return ajax.post('/members/notifications', '&summary=yes', function(data) {
      return Badge.set('notifs', data.root.notifications.total);
    }, function() {
      return Badge.cache();
    });
  },
  searchEpisodes: function() {
    console.log('hete');
    return ajax.post('/members/episodes/all', '', function(data) {
      var badgeNotificationType, episodes, i, j, time;
      episodes = data.root.episodes;
      time = Math.floor(new Date().getTime() / 1000);
      j = 0;
      for (i in episodes) {
        if (!__hasProp.call(episodes, i)) continue;
        if (time - episodes[i].date < 24 * 3600) {
          continue;
        }
        badgeNotificationType = DB.get('options').badge_notification_type;
        if (badgeNotificationType === 'watched') {
          j++;
        }
        if (badgeNotificationType === 'downloaded' && episodes[i].downloaded !== "1") {
          j++;
        }
      }
      return Badge.set('episodes', j);
    }, function() {
      return Badge.cache();
    });
  },
  set: function(type, value) {
    var b;
    b = DB.get('badge');
    b[type] = value;
    DB.set('badge', b);
    return this.cache();
  },
  cache: function() {
    var b;
    b = DB.get('badge');
    if (b.episodes != null) {
      this.display(b.episodes, 'episodes');
    }
    if ((b.notifs != null) && b.notifs > 0) {
      return this.display(b.notifs, 'notifs');
    }
  },
  display: function(value, type) {
    var colors;
    value = parseInt(value);
    if (value === 0) {
      return chrome.browserAction.setBadgeText({
        text: ''
      });
    } else {
      colors = {
        notifs: [200, 50, 50, 255],
        episodes: [50, 50, 200, 255]
      };
      chrome.browserAction.setBadgeBackgroundColor({
        color: colors[type]
      });
      return chrome.browserAction.setBadgeText({
        text: value.toString()
      });
    }
  }
};

logged = function() {
  return DB.get('session', null) != null;
};

DB.init();

Badge.init();

Badge.autoUpdate();
