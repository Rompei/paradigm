$(function(){
  var width = 3084;
  var height = 2048;

  var langName = $.queryParameter("lang");
  if(langName == null){
    $(location).attr("href", "/");
  }

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform","translate(50,50)");//ここがツリーの左上になる。

  var tree = d3.layout.tree()
    .size([2048,2840]) // .size()でツリー全体のサイズを決める。
    .children(children); // children()で入れ子のための名前を指定する。

  function children(d) {
    return d["descendents"];
  }

  d3.json("../data/" + langName + ".json", function(data) {
    if(data == null){
      $(location).attr("href", "/");
    }

    var nodes = tree.nodes(data);

    var links = tree.links(nodes);

    var node = svg.selectAll(".node")
      .data(nodes) 
      .enter()
      .append("g")
      .attr("class","node")
      .attr("transform", function(d){ return "translate("+ d.y + "," + d.x + ")";});

    node.append("circle")
      .attr("r", 4)
      .attr("fill","steelblue");

    node.append("text")
      .text(function(d) { return d.name})
      .attr("y",-5);

    var diagonal = d3.svg.diagonal()
      .projection(function(d){ return [d.y,d.x];}); 

    svg.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class","link")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d",diagonal);

  });
});

