define(function(require){
  var
    utils = require('utils')
  , config = require('config')
  ;

  return utils.View.extend({
    className: 'page'

  , setPageManager: function(manager){
      this.pageManager = manager;
      return this;
    }

  , render: function(){
      this.$el.html(this.template());
      return this;
    }

  , show: function(options){
      if (options != null && options.transitionIn != null) {
        if (!utils.isArray(options.transitionIn)) options.transitionIn = [options.transitionIn];
        this.$el.transition.apply(this.$el, options.transitionIn);
      } else
        this.$el.fadeIn();

      if (this.onShow) this.onShow(options);
      return this;
    }

  , hide: function(options){
      if (options != null && options.transitionOut != null) {
        if (!utils.isArray(options.transitionOut)) options.transitionOut = [options.transitionOut];
        this.$el.transition.apply(this.$el, options.transitionOut);
      } else
        this.$el.fadeOut();

      if (this.onHide) this.onHide(options);
      return this;
    }

  , provideData: function(data){
      this.data = data;
      return this;
    }

  , doSuccessThing: function($el, newText){
      newText = newText || config.changeMessages[
        parseInt(Math.random() * config.changeMessages.length)
      ];

      if ($el.hasClass('btn')){
        var oldText = $el.text();
        $el.text(newText).addClass('btn-success');
        setTimeout(function(){
          $el.text(oldText).removeClass('btn-success');
        }, 3000);
      }
    }

  , clearErrors: function(){
      this.$el.find('.error').removeClass('error');
    }
  });
});
