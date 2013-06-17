define(function(require) {
  var template    = require('hbt!./login-tmpl');
  var Components  = require('../../components/index');
  var utils       = require('utils');
  var user        = require('user');
  var api         = require('api');
  var config      = require('config');
  var troller     = require('troller');

  return Components.Modal.Main.extend({
    className: 'modal hide fade modal-span4 login-modal',

    events: {
      'click .facebook-login-button': 'oauth',
      'submit .login-form':           'auth',
      'click .forgot-password':       'forgotPassword'
    },

    initialize: function(options) {
      Components.Modal.Main.prototype.initialize.apply(this, arguments);
      this.render();
      return this;
    },

    onOpen: function() {
      this.$el.find('.field-email').focus();
    },

    render: function() {
      this.$el.html(template());
    },

    onClose: function(e) {

    },

    completedLogin: function(err) {
      troller.spinner.stop();
      if (err) return troller.error(err);
      this.close();
    },

    auth: function(e) {
      // log in
      e.preventDefault();
      troller.spinner.spin();
      var email = this.$el.find('.field-email').val();
      var password = this.$el.find('.field-password').val();
      var remember = this.$el.find('.remember-checkbox').is('checked');
      this.$el.find('.field-password').val("");
      // validation goes here
      user.auth(email, password, remember, utils.bind(this.completedLogin, this));
    },

    oauth: function(e) {
      // login with facebook
      troller.spinner.spin();
      api.session.getOauthUrl(config.oauth.redirectUrl, 'facebook', function(error, result) {
        troller.spinner.stop();
        if (error) return troller.error(error);
        if (result == null || typeof result.url !== 'string') return troller.error('no redirect url'); // TODO: better error
        window.location.href = result.url;
      });
    },

    forgotPassword: function(e) {
      // Dismiss this modal and call up the forgot password modal
      this.close();
      troller.modals.open('forgot-password');
    }
  });
});
