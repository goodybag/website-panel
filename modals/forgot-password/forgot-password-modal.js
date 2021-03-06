define(function(require) {
  var template = require('hbt!./forgot-password-tmpl');
  var Components  = require('components');
  var user = require('user');
  var utils = require('utils');
  var troller = require('troller');

  return Components.Modal.Main.extend({
    className: 'modal hide fade modal-span4 forgot-password-modal',

    events: {
      'submit .forgot-password-form': 'submitPasswordReset'
    },

    initialize: function(options) {
      Components.Modal.Main.prototype.initialize.apply(this, arguments);
      this.render();

      this.$email = this.$el.find('.field-email');

      return this;
    },

    onOpen: function() {
      this.$email.focus();
    },

    onClose: function() {

    },

    render: function() {
      this.$el.html(template());
    },

    submitPasswordReset: function(e) {
      e.preventDefault();
      var email = this.$email.val();
      var self = this;
      // TODO: client side validation
      troller.spinner.spin();
      user.forgotPassword(email, function(err) {
        troller.spinner.stop();
        if (err) return troller.error(err);
        self.close();
      });
    }
  });
});
