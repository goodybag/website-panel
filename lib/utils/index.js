define(function(require){
  var
    $         = require('jquery') || jQuery
  , Modal     = require('bootstrap-modal')
  , Spinner   = require('spin-js').Spinner
  , _         = require('underscore') || window._
  , geo       = require('geo')
  , async     = require('async')

  , config    = require('config')
  , backbone  = require('lib/utils/backbone/index') // backbone customizations
  , network   = require('lib/utils/network')
  , api       = require('lib/utils/api')
  , utils     = _.extend({}, _, backbone, network, {api: api})
  ;

  require('jquery-cookie');
  utils.cookie = $.cookie;

  require('backbone');

  utils.dom = jQuery;
  utils.getScript = jQuery.getScript;
  utils.domready = jQuery;
  utils.support = jQuery.support;
  utils.browser = jQuery.browser;

  utils.Modal = Modal;

  utils.Spinner = Spinner;

  utils.async      = async;
  utils.parallel   = async.parallel;

  utils.geo = geo;

  // Fix map
  utils.map = _.map;
  utils.asyncMap = async.map

  /**
   * Indexes an array of objects by a field onto an object
   * @param  {Array} set    The set of objects to be indexed
   * @param  {Object} obj   The object you want to do the indexing
   * @param  {String} field The field to be indexed on
   * @return {Object}       Returns the passed in object for convenience
   */
  utils.index = function(set, obj, field){
    if (typeof obj == 'string'){
      field = obj;
      obj = {};
    }

    for (var i = 0, l = set.length; i < l; ++i)
      obj[ set[i][field] ] = set[i];

    return obj;
  };

  utils.capitalize = function(str){
    return str[0].toUpperCase() + str.substring(1);
  };

  utils.joinIf = function(arr, sep) {
    return Array.prototype.join.call(utils.compact(arr), sep);
  }

  utils.domready(function(){
    utils.support.transform = (function(){
      var div = document.createElement('div');
      var props = [
        'webkitTransform'
      , 'mozTransform'
      , 'msTransform'
      , 'oTransform'
      , 'transform'
      ];

      for (var i = props.length - 1; i >= 0; i--)
        if (props[i] in div.style) return true;

      return false;
    })();
  });

  // Add CSS3 transition - This breaks our modals for some reason. Dammit, @fat
  // utils.domready(function(){
  //   $.support.transition = (function () {

  //     var transitionEnd = (function () {

  //       var el = document.createElement('bootstrap')
  //         , transEndEventNames = {
  //              'WebkitTransition' : 'webkitTransitionEnd'
  //           ,  'MozTransition'    : 'transitionend'
  //           ,  'OTransition'      : 'oTransitionEnd otransitionend'
  //           ,  'transition'       : 'transitionend'
  //           }
  //         , name

  //       for (name in transEndEventNames){
  //         if (el.style[name] !== undefined) {
  //           return transEndEventNames[name]
  //         }
  //       }

  //     }())

  //     return transitionEnd && {
  //       end: transitionEnd
  //     }

  //   })()
  // });

  utils.escapeRegExp = function(str){
    if (str == null) return '';
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  };

  utils.defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + utils.escapeRegExp(characters) + ']';
  };

  utils.trim = function(str, characters){
    if (str == null) return '';
    if (!characters && String.prototype.trim) return String.prototype.trim.call(str);
    characters = utils.defaultToWhiteSpace(characters);
    return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
  }

  utils.pickFile = function(options, callback){
    if (typeof options == 'function'){
      callback = options;
      options = null;
    }

    options = options || { mimetypes:['image/*'] };

    filepicker.pick(
      options
    , function(file){  if (callback) callback(null, file); }
    , function(error){ if (callback) callback(error); }
    );
  };

  utils.base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = utils.base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            utils.base64._keyStr.charAt(enc1) + utils.base64._keyStr.charAt(enc2) +
            utils.base64._keyStr.charAt(enc3) + utils.base64._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = utils.base64._keyStr.indexOf(input.charAt(i++));
            enc2 = utils.base64._keyStr.indexOf(input.charAt(i++));
            enc3 = utils.base64._keyStr.indexOf(input.charAt(i++));
            enc4 = utils.base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = utils.base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
  };

  // Native base64
  if (window.btoa) utils.base64.encode = function(input){ return btoa(input) };
  if (window.atob) utils.base64.decode = function(input){ return atob(input) };

  if (!utils.geo.isSupported()){
    // Override for browsers that do not support and give
    // default location
    utils.geo.getLocation = function(callback){
      if (callback) return callback(null, config.defaults.location);
    };
  }


  utils.startHistory = function(){
    utils.history = Backbone.history;
    utils.history.start();
    utils.navigate = function(){ utils.history.navigate.apply(utils.history, arguments); };
  }

  utils.noop = function(){};

  utils.invokeIf = function(obj, method) {
    var filteredObj = !utils.isFunction(method) ? utils.filter(obj, function(e) { return utils.isFunction(e[method]); }) : obj;
    return utils.invoke(filteredObj, method);
  };

  return utils;
});
