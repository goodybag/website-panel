define(function(require) {
  require('backbone');
  var _ = require('underscore') || window._;

  var Collection = Backbone.Collection.extend({
    fetchedLastPage: false,

    page: 0,

    pageSize: 30,

    nextPage: function(options) {
      if (this.fetchedLastPage) return;
      if (this.page == null || this.pageSize == null) return;
      options = options || {};
      var coll = this;

      var success = options.success || function() {};
      options = _.extend(options, {
        add: true,
        merge: false,
        remove: false,
        success: function(data) {
          coll.fetchedLastPage = data.length < coll.pageSize;
          coll.page++;
          if (!options.silent) {
            coll.trigger('paginate', coll, options);
            if (coll.fetchedLastPage) coll.trigger('last-page', coll, options);
          }
          success.apply(this, arguments);
        },
        queryParams: _.extend(options.queryParams || {}, {
          offset: coll.pageSize * coll.page,
          limit:  coll.pageSize
        })
      });

      this.fetch(options);
    },

    resetPage: function(options) {
      options = options || {};
      this.page = 0;
      this.fetchedLastPage = false;
      if (!options.silent) this.trigger('page-reset', this, options);
    },

    reset: function(options) {
      this.resetPage(options);
      Backbone.Collection.prototype.reset.apply(this, arguments);
    },

    set: function(models, options) {
      var old = _.clone(this.models)
      Backbone.Collection.prototype.set.apply(this, arguments);
      if (options.reset) return;
      var added = [];
      var any = false;
      for (var i=0, l=models.length; i < l; i++) {
        if (this.models.indexOf(models[i]) !== -1 && old.indexOf(models[i]) === -1) {
          added.push(models[i]);
          any = true;
        }
      }
      if (any) this.trigger('coll-add', added, this, options);
    }
  });

  return Collection;
});