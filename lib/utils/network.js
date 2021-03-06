define(function(require) {
  var $ = require('jquery') || jQuery;


  var pkg;
  try {
    pkg = JSON.parse(require('text!package.json'));
  } catch(e){}


  var network = {};

  if (!$.support.cors){
    network.rpc = new easyXDM.Rpc({ remote: config.proxyUrl }, {
      remote: { request: {} }
    });
  }

  network._ajax = $.ajax;

  network.ajax = function(method, url, data, callback){
    switch (method){
      case "get":     method = "GET";     break;
      case "post":    method = "POST";    break;
      case "del":     method = "DELETE";  break;
      case "put":     method = "PUT";     break;
      case "patch":   method = "PUT";     break;
    }

    if (typeof data === "function"){
      callback = data;
      data = null;
    }

    if (method === "GET" || method === "get"){
      url += network.queryParams(data);
      data = null;
    }

    var ajax = {
      type: method
    , method: method
    , url: url
    , headers: { application: 'allanon ' + pkg.version }
    , xhrFields: { withCredentials: true }
    , crossDomain: true
    , success: function(results){
        if (typeof results == 'string' && results) results = JSON.parse(results);
        results = results || {};
        callback && callback(results.error, results.data, results.meta);
      }
    , error: function(error, results, res, r){
        var message;
        if (typeof error.responseText === 'string')
          try {
            message = JSON.parse(error.responseText).error;
          } catch(e) {
            message = error;
          }
        else
          message = error;
        callback && callback(message);
      }
    };

    if (data) ajax.data = data;

    if (!$.support.cors){
      ajax.cache = false;
      delete ajax.xhrFields;
      delete ajax.crossDomain;
    }

    if (!$.support.cors) return network.rpc.request(ajax, ajax.success, ajax.error);

    return $.ajax(ajax);
  };

  network.get = function(url, params, callback){
    return network.ajax('get', url, params, callback);
  };

  network.post = function(url, data, callback){
    return network.ajax('post', url, data, callback);
  };

  network.put = function(url, data, callback){
    return network.ajax('put', url, data, callback);
  };

  network.patch = function(url, data, callback){
    return network.ajax('patch', url, data, callback);
  };

  network.del = function(url, data, callback){
    return network.ajax('delete', url, data, callback);
  };

  network.queryParams = function(data){
    if (typeof data !== "object") return "";
    var params = "?";
    for (var key in data){
      if (_.isArray(data[key])){
        for (var i = 0, l = data[key].length; i < l; ++i){
          params += key + "[]=" + data[key][i] + "&";
        }
      } else {
        params += key + "=" + data[key] + "&";
      }
    }
    return params.substring(0, params.length - 1);
  };

  network.parseQueryParams = function() {
    var params = {};
    var match = /^\?(\S*)$/.exec(window.location.search);
    if (match == null || match.length !== 2) return params;
    var pairs = match[1].split(/[&;]/);
    for (var i=0, len=pairs.length; i < len; i++) {
      var pair = pairs[i].split('=');
      if (pair.length === 2)
        params[pair[0]] = pair[1];
      if (pair.length === 1)
        params[pair[0]] = null;
    };
    return params;
  };

  return network;
});
