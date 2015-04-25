angular.module('fledit')
  .service('Paginator', function() {
    function Paginator(objects) {
      // Alway start a 0
      this.offset = 0;
      // Paginate according the orignal set size
      this.limit = Math.max(1, objects.length);
      // Every object
      this.objects = objects;
      // If no object is given, the set must be empty
      this.busy = objects.length === 0;
    }

    // Load more object!
    Paginator.prototype.next = function() {
      var that = this;
      // We are busy to load some object here...
      that.busy = true;
      // Increment offset
      that.offset = that.offset + that.limit
      // Copy existing parameters
      params = that.objects.reqParams || {}
      // And extend them with the current bounds
      params = angular.extend(params, { limit: that.limit, offset: that.offset });
      // Use the existing object instance
      that.objects.getList(params).then( function(objects) {
        // Just add the new object
        _.each(objects, function(o) { that.objects.push(o) });
        // We're not buzy anymore (if there is object left)
        that.busy = objects.length < that.limit;
      });
    };

    return Paginator;
  });
