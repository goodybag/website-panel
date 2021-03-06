define(function(require){
  var utils = require('utils');
  var config = require('config');

  var acceptable = [
    'id',
    'businessId',
    'name',
    'description',
    'price',
    'photoUrl',
    'likes',
    'wants',
    'tries',
    'isVerified',
    'isArchived',
    'isEnabled',
    'businessName',
    'businessIsGB',
    'userLikes',
    'userWants',
    'userTried',
    'popular',
    'tags',
    'categories',
  ]

  return utils.Model.extend({
    validate: function(attrs, options) {
      for (key in attrs)
        if (acceptable.indexOf(key) === -1) return key + ' is not an acceptable attribute';

      if (attrs.name == null)
        return 'name is required';
    },

    defaults: {
      price:       0,
      tags:        [],
      categories:  [],
      collections: [],
      likes:       0,
      wants:       0,
      tries:       0,
      userLikes:   false,
      userWants:   false,
      userTried:   false,
      photoUrl:    config.defaults.photoUrl
    },

    urlRoot: '/products',

    initialize: function() {
      this.on({'change:userWants': this.onChangeUserWants,
               'change:userLikes': this.onChangeUserLikes,
               'change:userTried': this.onChangeUserTried
              });
    },

    onChangeUserWants: function(e) {
      if (this.changed.userWants != null && this.previousAttributes().userWants != null)
        this.set('wants', this.get('wants') + (this.changed.userWants ? 1 : -1));
    },

    onChangeUserLikes: function(e) {
      if (this.changed.userLikes != null && this.previousAttributes().userLikes != null)
        this.set('likes', this.get('likes') + (this.changed.userLikes ? 1 : -1));
    },

    onChangeUserTried: function(e) {
      if (this.changed.userTried != null && this.previousAttributes().userTried != null)
        this.set('tries', this.get('tries') + (this.changed.userTried ? 1 : -1));
    }
  });
});
