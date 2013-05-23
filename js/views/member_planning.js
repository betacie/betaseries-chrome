// Generated by CoffeeScript 1.6.2
var View_MemberPlanning,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

View_MemberPlanning = (function() {
  function View_MemberPlanning() {
    this.init = __bind(this.init, this);
  }

  View_MemberPlanning.prototype.init = function(login) {
    var _ref;

    if (login == null) {
      login = (_ref = DB.get('session')) != null ? _ref.login : void 0;
    }
    this.id = 'MemberPlanning.' + login;
    this.url = '/planning/member/' + login;
    this.login = login;
    this.name = 'MemberPlanning';
    this.params = "&view=unseen";
    return this.root = 'planning';
  };

  View_MemberPlanning.prototype.update = function(data) {
    return DB.set('member.' + this.login + '.planning', data);
  };

  View_MemberPlanning.prototype.content = function() {
    var actualWeek, data, diffWeek, e, hidden, nbrEpisodes, output, plot, titleIcon, today, todayWeek, visibleIcon, w, week;

    output = '';
    week = 100;
    nbrEpisodes = 0;
    data = DB.get('member.' + this.login + '.planning', null);
    if (!data) {
      return Fx.needUpdate();
    }
    for (e in data) {
      today = Math.floor(new Date().getTime() / 1000);
      todayWeek = parseFloat(date('W', today));
      actualWeek = parseFloat(date('W', data[e].date));
      diffWeek = actualWeek - todayWeek;
      plot = data[e].date < today ? "tick" : "empty";
      if (diffWeek < -2 || diffWeek > 2) {
        continue;
      }
      if (actualWeek !== week) {
        week = actualWeek;
        if (diffWeek < -1) {
          w = __('weeks_ago', [Math.abs(diffWeek)]);
          hidden = true;
        } else if (diffWeek === -1) {
          w = __('last_week');
          hidden = true;
        } else if (diffWeek === 0) {
          w = __('this_week');
          hidden = false;
        } else if (diffWeek === 1) {
          w = __('next_week');
        } else if (diffWeek > 1) {
          w = __('next_weeks', [diffWeek]);
          hidden = false;
        }
        if (nbrEpisodes > 0) {
          output += '</div>';
        }
        visibleIcon = hidden ? '../img/arrow_right.gif' : '../img/arrow_down.gif';
        titleIcon = hidden ? __('maximise') : __('minimise');
        hidden = hidden ? ' hidden' : '';
        output += '<div class="week' + hidden + '">';
        output += '<div class="title"> ';
        output += '<img src="' + visibleIcon + '" class="toggleWeek" title="' + titleIcon + '" />';
        output += w + '</div>';
      }
      output += '<div class="episode ' + date('D', data[e].date).toLowerCase() + hidden + '">';
      output += '<div class="td wrapper-seen">';
      output += '<img src="../img/' + plot + '.png" width="11" />';
      output += '</div>';
      output += '<div class="td wrapper-title" style="width: 186px;">';
      output += '<span class="num">' + Fx.displayNumber(data[e].number) + '</span> ';
      output += '<a href="" url="' + data[e].url + '" season="' + data[e].season + '" episode="' + data[e].episode + '" global="' + data[e].global + '" title="' + data[e].show + '" class="epLink display_episode">';
      output += data[e].show + '</a>';
      output += '</div>';
      output += '<div class="td wrapper-date-2">';
      output += '<span class="date">' + date('D d F', data[e].date) + '</span>';
      output += '</div>';
      output += '</div>';
      nbrEpisodes++;
    }
    return output;
  };

  View_MemberPlanning.prototype.listen = function() {
    return $('.MemberPlanning').on('click', '.toggleWeek', function() {
      var hidden, week;

      week = $(this).closest('.week');
      hidden = $(week).hasClass('hidden');
      $(week).toggleClass('hidden');
      $(week).find('.episode').slideToggle();
      if (hidden) {
        $(this).attr('src', '../img/arrow_down.gif');
      } else {
        $(this).attr('src', '../img/arrow_right.gif');
      }
      return Fx.updateHeight();
    });
  };

  return View_MemberPlanning;

})();
