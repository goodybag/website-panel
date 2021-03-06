define(function(require){
  var
    utils       = require('utils')
  , troller     = require('troller')
  , user        = require('user')
  , config      = require('config')
  , Components  = require('components')
  , template    = require('hbt!./edit-collection-tmpl')
  ;

  return Components.Modal.Main.extend({
    className: 'modal hide fade modal-span5 edit-collection-modal'

  , tagName: 'section'

  , events: {
      'submit #edit-collection-form':         'onEditCollectionSubmit'
    , 'click .btn-delete':                    'onDeleteClick'
    , 'click .btn-cancel':                    'onCancelClick'
    }

  , initialize: function(options){
      Components.Modal.Main.prototype.initialize.apply(this, arguments);
      // Not much going on in this modal, so render right away
      this.render();
      return this;
    }

  , onOpen: function(options){
      this.collection = options.collection;
      this.render();
    }

  , render: function(){
      this.$el.html( template({ collection: this.collection }) );
      return this;
    }

  , onEditCollectionSubmit: function(e){
      e.preventDefault();

      var this_ = this;

      troller.spinner.spin();
      user.editCollection(this.collection.id, { name: this.$el.find('#edit-collection-name').val() }, function(error){
        troller.spinner.stop();

        if (error) return troller.error(error);

        this_.$el.find('#edit-collection-name').val("");
        this_.close();
      });
    }

  , onCancelClick: function(e){
      e.preventDefault();
      this.close();
    }

  , onDeleteClick: function(e){
      e.preventDefault();

      if (!troller.confirm("Are you sure you want to delete this collection? You will not be able to undo this action.")) return;

      troller.spinner.spin();
      this.close();

      user.removeCollection(this.collection.id, function(error){
        troller.spinner.stop();

        if (error) return troller.error(error);

        utils.history.navigate('/collections', { trigger: true });
      });
    }
  });
});
