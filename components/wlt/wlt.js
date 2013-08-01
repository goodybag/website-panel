define(function(require) {
  var
    utils     = require('utils')
  , troller   = require('troller')
  , user      = require('user')
  , template  = require('hbt!./wlt-tmpl')
  , models    = require('models')
  ;

  return utils.View.extend({
    className: 'btn-group wlt-btn-group'

  , events: {
      'click .btn-like':      'onLikeClick'
    , 'click .btn-try':       'onTriedClick'
    , 'click .btn-want':      'onWantClick'
    }

  , initialize: function(options){
      options = options || {};

      if (options.large) this.$el.addClass('btn-group-large')

      return this;
    }

  , provideModel: function(model){
      if (this.model) this.stopListening(this.model);
      this.model = model;

      if (!(this.model instanceof models.Product)) throw new Error('WLT model must be Product');

      this.listenTo(this.model, {
        'change:userWants':  this.onUserFeelingsChange
      , 'change:userLikes':  this.onUserFeelingsChange
      , 'change:userTried':  this.onUserFeelingsChange
      });

      return this;
    }

  , render: function(){
      this.$el.html(template(this.model.toJSON()));
      var self = this;
      setTimeout(function() {
        self.$wantBtn = self.$el.find('.btn-want');
        self.$likeBtn = self.$el.find('.btn-like');
        self.$triedBtn = self.$el.find('.btn-try');
      }, 10);
      return this;
    }

  , onUserFeelingsChange: function(model, collection, options) {
      var buttons = {userWants: this.$wantBtn, userLikes: this.$likeBtn, userTried: this.$triedBtn};
      for (var prop in this.model.changed)
        if (buttons[prop] != null) buttons[prop].toggleClass('active', this.model.get(prop));
    }

  , onFeelingsClick: function(e, prop, message) {
      e.preventDefault();

      troller.analytics.track(message, this.model.toJSON());

      if (!user.loggedIn) return troller.promptUserLogin();

      // changing the property triggers an event which switches the button state
      this.model.save(prop, !this.model.get(prop), {patch: true});
    }

  , onWantClick: function(e){
      this.onFeelingsClick(e, 'userWants', 'Click Want');
    }

  , onTriedClick: function(e){
      this.onFeelingsClick(e, 'userTried', 'Click Tried');
    }

  , onLikeClick: function(e){
      this.onFeelingsClick(e, 'userLikes', 'Click Like');
    }
  });
});
