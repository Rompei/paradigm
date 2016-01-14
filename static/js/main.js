$(function(){
  var width = 3084;
  var height = 2048;

  var langName = $.queryParameter("lang");
  if(langName == null){
    returnRoot();
  }

  var rompei = new Gh3.User("Rompei")
    , pdmcrawler = new Gh3.Repository("paradigm-crawler", rompei);

  pdmcrawler.fetch(function(err, res){
    if(err){
      console.log(err);
      returnRoot();
    }
    pdmcrawler.fetchBranches(function(err, res){
      if(err){
        console.log(err);
        returnRoot();
      }
      var master = pdmcrawler.getBranchByName("master");
      if(!master)
        returnRoot();
      master.fetchContents(function(err, res){
        if(err){
          console.log(err);
          returnRoot();
        }

        var dataDir = master.getDirByName("data");
        if(!dataDir)
          returnRoot();
        dataDir.fetchContents(function(err, res){
          if(err){
            console.log(err);
            returnRoot();
          }
          var file = dataDir.getFileByName(langName + ".json");
          if(!file)
            returnRoot();
          file.fetchContent(function(err, res){
            if(err){
              console.log(err);
              returnRoot();
            }
            var json = $.evalJSON(file.getRawContent());
            setupTree(json.languageTree);
            addTitle(json.languageTree.name);
            addUpdated(json.time);
          });
        });
      });
    });
  });

  function returnRoot(){
    $(location).attr("href", "/");
    return;
  }

  function addTitle(title){
    $('.langName').text(title);
  }

  function addUpdated(updated){
    var date = new Date(updated);
    $('.updated').text('Captured at ' + date);
  }

  function setupTree(data){
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
      .attr("stroke", "blue")
      .attr("d",diagonal);

  }
});

