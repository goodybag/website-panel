define(function(require) {
  var utils = require('utils');
  var models = require('models');

  var exports = {};

  exports.Products = utils.Collection.extend({
    model: models.Product,
    url: '/products',
    queryParams: {
      include: ['collections'],
      hasPhoto: true
    },
    initialize: function(models, options) {
      options = options || {};
      if (options.pageSize) this.pageSize = options.pageSize;
      this.queryParams = utils.extend(utils.clone(this.queryParams), options.queryParams || {});
    }
  });

  exports.Nearby = exports.Products.extend({
    sync: function() {
      var self = this;
      var args = arguments;
      utils.geo.getPosition(function(error, pos) {
        if (error) pos = config.defaults.position;
        utils.extend(self.queryParams, utils.pick(pos, ['lat', 'lon']));
        utils.Collection.prototype.sync.apply(self, args);
      });
    },
    initialize: function(model, options) {
      exports.Products.prototype.initialize.apply(this, arguments);
    }
  })

  return exports;
});