angular.module('fledit')
  .factory('Progress', function() {

    function Progress() {
      this.body = angular.element('body');
      this.body.addClass('body-wrapper');
      this.body.append('<div class="progress-container"><div class="progress-container__spinner"><div></div>');
      this.progress = angular.element('.progress-container');
      return this;
    }

    Progress.prototype.toggle = function(toggle) {
      that.state = toggle;
      that.progress.toggleClass('progress-container--active', toggle);
      return that.body.toggleClass('body--progress-active', toggle);
    };

    Progress.prototype.start = function() {
      return that.toggle(true);
    };

    Progress.prototype.complete = function() {
      return that.toggle(false);
    };

    var that = new Progress();
    return that;
});
