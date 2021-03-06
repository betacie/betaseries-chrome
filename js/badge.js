/**
 * Badge class
 * @class Badge
 */
var Badge = {

	init: function() {
		this.display();
	},

	search_notifications: function() {
		return ajax.post('/members/notifications', '', function(data) {
			var login, n, nbr, new_notifs, old_notifs;
			login = DB.get('session').login;
			old_notifs = DB.get('member.' + login + '.notifs', []);
			new_notifs = Fx.formatNotifications(data.root.notifications);
			n = Fx.concatNotifications(old_notifs, new_notifs);
			n = Fx.sortNotifications(n);
			DB.set('member.' + login + '.notifs', n);
			nbr = Fx.checkNotifications();
			Badge.set('new_notifications', nbr);
		}, function() {
			Badge.display();
		});
	},

	search_episodes: function() {
		return ajax.post('/members/episodes/all', '', function(data) {
			var downloaded_episodes, episodes, i, last_checked, new_episodes, time, total_episodes;
			episodes = data.root.episodes;
			time = Math.floor(new Date().getTime() / 1000);
			last_checked = DB.get('new_episodes_checked', null);
			DB.set('new_episodes_checked', date('Y.m.d'));
			total_episodes = 0;
			downloaded_episodes = 0;
			new_episodes = 0;
			for (i in episodes) {
				if (!{}.hasOwnProperty.call(episodes, i)) continue;
				if ((time - episodes[i].date < 2 * 24 * 3600) && (!last_checked || last_checked < date('Y.m.d'))) {
					new_episodes++;
				}
				if (episodes[i].downloaded !== "1") {
					downloaded_episodes++;
				}
				total_episodes++;
			}
			Badge.set('total_episodes', total_episodes);
			Badge.set('downloaded_episodes', downloaded_episodes);
			if (!last_checked || last_checked < date('Y.m.d')) {
				Badge.set('new_episodes', new_episodes);
			}
		}, function() {
			Badge.display();
		});
	},

	set: function(type, value) {
		var b;
		b = DB.get('badge');
		b[type] = value;
		DB.set('badge', b);
		this.display();
	},

	display: function() {
		var b, badgeNotificationType, nbr, options;
		options = DB.get('options');
		badgeNotificationType = options.badge_notification_type;
		b = DB.get('badge');
		if (!Fx.logged()) {
			this.render('not_logged', '?');
			return;
		}
		nbr = 0;
		if (b.total_episodes && (parseInt(b.total_episodes, 10) > 0) && badgeNotificationType === 'watched') {
			nbr += parseInt(b.total_episodes, 10);
			this.render('total_episodes', b.total_episodes);
		}
		if (b.downloaded_episodes && parseInt(b.downloaded_episodes, 10) > 0 && badgeNotificationType === 'downloaded') {
			nbr += parseInt(b.downloaded_episodes, 10);
			this.render('downloaded_episodes', b.downloaded_episodes);
		}
		if (b.new_notifications && parseInt(b.new_notifications, 10) > 0) {
			nbr += parseInt(b.new_notifications, 10);
			this.render('new_notifications', b.new_notifications);
		}
		if (b.new_episodes && parseInt(b.new_episodes, 10) > 0) {
			nbr += parseInt(b.new_episodes, 10);
			this.render('new_episodes', b.new_episodes);
		}
		if (nbr === 0) {
			this.render('empty', '');
		}
	},

	render: function(type, value) {
		var bgColor;
		switch (type) {
			case 'not_logged':
				bgColor = [200, 200, 200, 255];
				break;
			case 'total_episodes':
				bgColor = [50, 50, 200, 255];
				break;
			case 'downloaded_episodes':
				bgColor = [50, 200, 50, 255];
				break;
			case 'new_episodes':
				bgColor = [200, 50, 50, 255];
				break;
			case 'new_notifications':
				bgColor = [50, 200, 50, 255];
				break;
			case 'empty':
				bgColor = [200, 200, 200, 255];
		}
		chrome.browserAction.setBadgeBackgroundColor({
			color: bgColor
		});
		chrome.browserAction.setBadgeText({
			text: value.toString()
		});
	}
};