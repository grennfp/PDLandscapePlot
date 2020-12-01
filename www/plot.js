
        
        
var svg = d3.select("#my_dataviz")
   .append("svg")
   .attr("id", "svg")
   .attr("width",canvas_width)
   .attr("height",canvas_height)
   .style("font-size","20px")
   .style("font-family","sans-serif");
   
   svg.append("rect");
   

   
   svg.append("g")
   .attr("class","nodes");
   
   
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    
//the text of whatever we searched for before
var searched_value;

var x_to_use;
var y_to_use;
var xScale = d3.scaleLinear()
               .range([padding, canvas_width - padding *2])
var yScale = d3.scaleLinear()
               .range([canvas_height - padding, padding]);
               

var xAxis = svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (canvas_height - padding) +")")
      
var yAxis = svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(" + padding +",0)")
      
      
        
var yLabel = svg.append("text")
       .attr("class","ylabel")
       .attr("text-anchor","end")
       .attr("y",padding*0.33)
       .attr("x",-(canvas_height - padding)/2)
       .attr("transform","rotate(-90)")
       .text("");
       
var xLabel = svg.append("text")
       .attr("class","xlabel")
       .attr("text-anchor","end")
       .attr("x",(canvas_width + padding)/2)
       .attr("y", canvas_height-padding*0.25)
       .text("");




//main function that gets called when inputs change. Takes in a json object as input containing variant data and other plot variables
function update(data){


  //store the previous width and height for use in transitions
  var prev_canvas_height = canvas_height;
  canvas_height = data.canvas_height;
  var prev_canvas_width = canvas_width;
  canvas_width = data.canvas_width;
  
  //update width and height. Only update width/height if the new width/height is larger than the last. that way we won't cut it off as the plot transitions
  if(canvas_width > prev_canvas_width)
  {
    svg.attr("width",canvas_width);
  }
  if(canvas_height > prev_canvas_height)
  {
    svg.attr("height",canvas_height);
  }

    
  //store the previous x and y axis variables for use in transitions
  if(y_to_use===null || y_to_use===undefined)
  {
    prev_y_to_use = data.y_to_use;
  }
  else
  {
    prev_y_to_use = y_to_use;
  }
  y_to_use = data.y_to_use;

  if(x_to_use===null || x_to_use===undefined)
  {
    prev_x_to_use = data.x_to_use;
  }
  else
  {
    prev_x_to_use = x_to_use;
  }
  x_to_use = data.x_to_use;

  
  var points = data.points;

  //remove points with no y value
  points = points.filter(function( obj ) {
    return !isNaN(obj[y_to_use]);
  });
  
  //remove points with no x value
  points = points.filter(function( obj ) {
    return !isNaN(obj[x_to_use]);
  });

  //store the previous xScale for use in transitions
  var prev_xScale = xScale.copy();
  //update the xScale
  xScale.domain(
      [
                 d3.min(points, function(d) {
                   return d[x_to_use];
                 }),
                 d3.max(points, function(d) {
                  return d[x_to_use];
                 })
               ]
   )
   .range([padding, canvas_width - padding *2]);
   
   //if no points were present on the plot then prev_xScale would have an NaN domain. So set to the current xScale if that is the case
   if(isNaN(prev_xScale.domain()[0]))
   {
     prev_xScale = xScale.copy();
   }
   
   //store the previous yScale for use in transitions
   var prev_yScale = yScale.copy();
   
   //update the yScale. Use a logarithmic scale if log_y is true
   if(data.log_y==true)
   {
     yScale = d3.scaleSymlog().domain(
      [
                 d3.min(points, function(d) {
                   return d[y_to_use];
                 }),
                 d3.max(points, function(d) {
                  return d[y_to_use];
                 })
               ]
    ).range([canvas_height - padding, padding]);
   }
   else
   {
     yScale = d3.scaleLinear().domain(
      [
                 d3.min(points, function(d) {
                   return d[y_to_use];
                 }),
                 d3.max(points, function(d) {
                  return d[y_to_use];
                 })
               ]
    ).range([canvas_height - padding, padding]);
   }
  
  //if no points were present on the plot then prev_yScale would have an NaN domain. So set to the current yScale if that is the case
   if(isNaN(prev_yScale.domain()[0]))
   {
     prev_yScale = yScale.copy();
   }
   
  
  //assign functionality to the searchbar
  document.getElementById("searchInputBar_search").onclick = function() {searchBarClick();};
  document.getElementById("searchInputBar_reset").onclick = function() {searchBarClick();};
    
  
  var nodesarray=[];
  var labelsarray=[];
  var labels;
  var links;

  //create an array of nodes and labels from the points data
  for(var i=0; i<points.length; i++)
  {
    nodesarray.push({name:points[i][variantIdField],r:5,x:xScale(points[i][x_to_use]),y:yScale(points[i][y_to_use]),pxv:prev_xScale(points[i][prev_x_to_use]),pyv:prev_yScale(points[i][prev_y_to_use])});
    
    labelsarray.push({x: xScale(points[i][x_to_use]), y: yScale(points[i][y_to_use]),pxv:prev_xScale(points[i][prev_x_to_use]),pyv:prev_yScale(points[i][prev_y_to_use]),xv:xScale(points[i][x_to_use]),yv:yScale(points[i][y_to_use]), name: points[i][variantIdField], width: 0.0, height: 0.0});
    

  }


  //update annotations and transition
  updateAnnotations();
  //update nodes and transition
  updateNodes();

  
  //updates axes and transition
  transitionData();
  //update the download button
  document.getElementById("download_button").onclick = downloadPNG;
  
  //draw the labels on top of nodes after animations
  svg.selectAll(".label").raise();
  
  updateLegend();
  
  
function updateAnnotations()
{
  var labels = svg.selectAll(".label").data(labelsarray, d=>d.name);
  
  labels.exit().remove();

  var entering_labels = labels.enter()
  .append("text")
  .attr("class","label");
  
  entering_labels.attr("text-anchor","start")
  .attr("x",function(d) {return (d.x);})
  .attr("y", function(d) {return (d.y);})
  .attr("fill","black")      
  .on("mouseover",function(d,i) {
        div.transition()
          .duration(200)
          .style("opacity", 1.0);
                div.html(getTooltipHTML(i.name, points))
          .style("left", (d.pageX) + "px")
          .style("top", (d.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity",0);
      });
  
  labels = labels.merge(entering_labels);
  
  labels.text(function(d) {
    if(data.annotation == "none")
    {
      return "";
    }
    else
    {
      return search(d.name, points)[data.annotation];
    }
  })
  .style("font-size",label_font_size+"px");

  
  
    
  var index = 0;
  labels.each(function(){
    labelsarray[index].width = this.getBBox().width+(0.5*label_font_size);
    labelsarray[index].height = this.getBBox().height+(0.5*label_font_size);
    index +=1;
  });


  var links = svg.selectAll(".link")
    .data(labelsarray, d=>d.name);
    
  links.exit().remove();
  if(data.annotation !="none")
  {
    var entering_links = links.enter().append("line").attr("class","link");
  
  entering_links.attr("class", "link")
    .attr("x1", function(d) { return (d.x); })
    .attr("y1", function(d) { return (d.y); })
    .attr("x2", function(d) { return (d.x); })
    .attr("y2", function(d) { return (d.y); })
    .attr("stroke-width", 0.6)
    .attr("stroke", "gray");
    
  links = links.merge(entering_links);
   
    
  }
     
  
    var sim_ann = d3.labeler()
  .label(labelsarray)
  .anchor(nodesarray)
  .width(canvas_width)
  .height(canvas_height)
  .bounds(x1=padding,x2=canvas_width - padding *2, y1 = padding, y2 = canvas_height - padding );

  sim_ann.start(1000);
      
    labels
    .transition()
      .duration(500)
      .attrTween("x", function(d){
        return function(t){
          //set previous x position to 0 if no value
          if(d.pxv==null)
          {
            return d3.interpolateNumber(0, d.x)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pxv, d.x)(t);
          }
        }
      })
      .attrTween("y", function(d){
        return function(t){
          //some points don't have a beta/odds ratio in certain datasets, so set previous y position to 0 if no value
          if(d.pyv==null)
          {
            return d3.interpolateNumber(0, d.y)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pyv, d.y)(t);
          }
        }
      });
      
  if(data.annotation !="none")
  {
      links
      .transition()
      .duration(500)
      .attrTween("x1", function(d){
        return function(t){
          //set previous x position to 0 if no value
          if(d.pxv==null)
          {
            return d3.interpolateNumber(0, d.xv)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pxv, d.xv)(t);
          }
        }
      })
      .attrTween("y1", function(d){
        return function(t){
          
          //some points don't have a beta/odds ratio in certain datasets, so set previous y position to 0 if no value
          if(d.pyv==null)
          {
            return d3.interpolateNumber(0, d.yv)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pyv, d.yv)(t);
          }
        }
      })
      .attrTween("x2", function(d){
        return function(t){
          //set previous x position to 0 if no value
          if(d.pxv==null)
          {
            return d3.interpolateNumber(0, d.x)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pxv, d.x)(t);
          }
        }
      })
      .attrTween("y2", function(d){
        return function(t){
          //some points don't have a beta/odds ratio in certain datasets, so set previous y position to 0 if no value
          if(d.pyv==null)
          {
            return d3.interpolateNumber(0, d.y)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pyv, d.y)(t);
          }
        }
      });
  }
  else
  {
    links.remove();
  }
  
}

  function updateNodes() {

    var node = svg.selectAll("circle.nodes").data(nodesarray,d=>d.name);
    
    //node.exit().remove();
    node.exit().transition().duration(500).attr("r",0).remove();
    
    var entering_nodes = node.enter().append("circle").attr("class","nodes");
    
    entering_nodes.attr('cx', function(d) {
          return d.x
      })
      .attr('cy', function(d) {
          return d.y
      })
      .attr('r',function(d){
        return d.r
      })
      .attr("fill", function(d,i){ 
        var color;
        for(var i =0 ;i<data.studies.length;i++)
        {
          if(data.studies[i][studies_gwas_id_for_color] === search(d.name,points)[data_gwas_id_for_color])
          {
            color = data.studies[i][color_gwas_field];
          }
        }
        return  color;
        
      })
      .on("mouseover",function(d,i) {
        div.transition()
          .duration(200)
          .style("opacity", 1.0);
        div.html(getTooltipHTML(i.name, points))
          .style("left", (d.pageX) + "px")
          .style("top", (d.pageY - 28) + "px"
          
          );
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity",0);
      });
      
    node = node.merge(entering_nodes);
    
    node.transition()
      .duration(500)
      .attrTween("cx", function(d){
        return function(t){
          //set previous x position to 0 if no value
          if(d.pxv==null)
          {
            return d3.interpolateNumber(0, d.x)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pxv, d.x)(t);
          }

        }
      })
      .attrTween("cy", function(d){
        return function(t){
          //some points don't have a beta/odds ratio in certain datasets, so set previous y position to 0 if no value
          if(d.pyv==null)
          {
            return d3.interpolateNumber(0, d.y)(t);
          }
          else
          {
            return d3.interpolateNumber(d.pyv, d.y)(t);
          }
        }
      });
      

  }
  
  function updateLegend(){
    //clear previous legend
    svg.selectAll(".legend").remove();
    

    var text_height;
    
    //if we even want to add the legend
    if(data.legend)
    {
      var max_text_width = 0;
      //add legend 
      for(var i =0; i < data.studies.length; i++)
      {
        //draw circle
        svg.append("circle").attr("class","legend").attr("cx",legendX).attr("cy",legendY + (i*30)).attr("r", 6).style("fill", data.studies[i]['color']);
        //draw text
        var legendText = svg.append("text").attr("class","legend").attr("x",legendX + 8).attr("y",legendY + (i*30)).text(data.studies[i]['ref']).style("font-size",legendFontSize).attr("alignment-baseline","middle");


        if(legendText.node().getBBox().width > max_text_width)
        {
          max_text_width = legendText.node().getBBox().width;
        }
        text_height = legendText.node().getBBox().height;
        
      }
      //make the bounding rectangle
    svg.append("rect").attr("class","legend").attr("fill-opacity",0).attr("stroke","black").attr("x", legendX - legend_padding).attr("y", legendY - legend_padding).attr("width", 14 + legend_padding + max_text_width).attr("height", legend_padding + (data.studies.length-1 )* 30 + text_height);
    }
    

  }

  
  function transitionData(){
    //update and transition xAxis. Also update the canvas width after transition
    xAxis.transition()
    .duration(500)
    .attr("transform", "translate(0," + (canvas_height - padding) +")")
    .call(d3.axisBottom(xScale))
    .on("end",function() { svg.attr("width",canvas_width) }); 
    
    //update and transition xAxis. Also update the canvas height after transition
    yAxis.transition()
    .duration(500)
    .attr("transform", "translate(" + padding +",0)")
    .call(d3.axisLeft(yScale))
    .on("end",function() {  svg.attr("height",canvas_height)});
  
  
    yLabel.transition()
     .duration(500)
     .attr("text-anchor","end")
     .attr("y",padding*0.33)
     .attr("x",0)
    .attrTween("x", function(d){
        return function(t) {
              return d3.interpolateNumber(-(prev_canvas_height - padding)/2, -(canvas_height - padding)/2)(t);
           };      
        })
     .attr("transform","rotate(-90)")
     .text(function(){
       return yLabelMap[y_to_use];
     });
         
     xLabel.transition()
     .duration(500)
     .attr("text-anchor","end")
     .attr("x",0)
     .attr("y",0)
     .attrTween("x", function(d){
        return function(t) {
              return d3.interpolateNumber((prev_canvas_width + padding)/2, (canvas_width + padding)/2)(t);
           };      
     })
     .attrTween("y", function(d){
        return function(t) {
              return d3.interpolateNumber(prev_canvas_height-padding*0.25, canvas_height-padding*0.25)(t);
           };      
     })
     .text(function(){
       return xLabelMap[x_to_use];
     });
  }
  
  function downloadPNG(){
    var svg = document.querySelector("svg");
    var rect = document.querySelector("rect")
    rect.setAttribute("width", canvas_width+"px")
    rect.setAttribute("height", canvas_height+"px")
    rect.setAttribute("fill", "#fff")
  
    var svgData = new XMLSerializer().serializeToString(svg);
    var canvas = document.createElement("canvas");
    var svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width * 3;
    canvas.height = svgSize.height * 3;
    canvas.style.width = svgSize.width;
    canvas.style.height = svgSize.height;
    var ctx = canvas.getContext("2d");
    ctx.scale(3, 3);
    var img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    rect.setAttribute("fill", "#ecf0f5")
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      var canvasdata = canvas.toDataURL("image/png", 1);
  
      var pngimg = '<img src="' + canvasdata + '">';
      d3.select("#pngdataurl").html(pngimg);
  
      var a = document.createElement("a");
      a.download = "pd_gwas_plot" + ".png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }
  
  function searchBarClick() {
    console.log("searchiing");
      var search_input = document.getElementById("searchInputBar_text").value;
console.log(search_input);
      //reset the format of the previously searched node
      svg.selectAll("circle.nodes").filter(function(d) {
        
        //get the data of the nodes
        var data = search(d.name, points);
        
        var filter_id;
        for(var i =0;i< searchFields.length;i++)
        {
          if(data[searchFields[i]] === searched_value)
          {
            filter_id = data[variantIdField];
            console.log("found!!")
          }
        }
        return d.name===filter_id; 
      }).transition().duration(500).style("stroke", "none").attr("r",5).style("opacity", 1);
      
      //look for a node matching the search input and change format
      svg.selectAll("circle.nodes").filter(function(d) {
        
        var filter_id;
        //get the data of the nodes
        var data = search(d.name, points);
        
        for(var i =0;i< searchFields.length;i++)
        {
          if(data[searchFields[i]] === search_input)
          {
            searched_value = data[searchFields[i]];
            filter_id = data[variantIdField];
          }
        }
        return d.name===filter_id; 
        
      }).transition().duration(500).style("stroke", "black").attr("r",10).style("opacity", .75);
      
  }
          

    

}

//generate an html string for tooltip. Iterates through the tooltipMap that maps names to be displayed in the tooltip to the actual data name.
function getTooltipHTML(nameKey, dataArray){
  var htmlstring="";
  for(var key in tooltipMap){
    htmlstring = htmlstring + key + ": " + search(nameKey,dataArray)[tooltipMap[key]] + "<br/> "
  }
  return htmlstring;
}


function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][variantIdField] === nameKey) {
            return myArray[i];
        }
    }
}



    