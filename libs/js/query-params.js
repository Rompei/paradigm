(function($){
  var queries = (function(){
    var s = location.search.replace("?", ""),
    query = {},
    queries = s.split("&"),
    i = 0;

    if(!s) return null;

    for(i; i < queries.length; i ++) {
      var t = queries[i].split("=");
      query[t[0]] = t[1];
    }
    return query;
  })();

  $.queryParameter = function(key) {
    return (queries == null ? null : queries[key] ? queries[key] : null);
  };
})(jQuery);
