// set the dimensions and margins of the graph
//var filename="../data/medical_and_health_organization.csv";
// var filename="./data/data.csv";


var drawHeat={};
drawHeat.draw=function(index,appendSvg=false){

    var minYear=2010,maxYear=2019;
    var margin = {top: 100, right: 25, bottom: 30, left: 50}
        // var width = 1500 - margin.left - margin.right,
        // var height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg=d3.select("#heat-map-svg")
        .attr("width", width )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    console.log("width = ",width)

//Read the data
    d3.csv(filename).then(function (data) {

        var sampleData=[];
        for(var i=0;i<data.length;i++){
            if(data[i]['city']==="全国") continue;

            if(Number(data[i]["year"])<=maxYear && Number(data[i]["year"])>=minYear)
                sampleData.push(data[i]);
        }

        d3.selectAll('rect').remove();
        d3.selectAll('text').remove();

        // scales and axis----------------------------------------------------------
        var myGroups = d3.map(sampleData, function(d){
            return d.city;
        }).keys()
        var myVars = d3.map(sampleData, function(d){
            return d.year;
        }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([ 0, width -150])
            .domain(myGroups)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisTop(x).tickSize(0))
            .selectAll("text")
            .attr("transform","rotate(-45)")
            .style("text-anchor","start");
        svg.select(".domain").remove();


        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // color-----------------------------------------------------------------------
        var Color_domain=[];
        var maxData=0.0;
        var minData=1000000000.0;
        for(var i=0;i<sampleData.length;i++){
            maxData=Math.max(maxData,sampleData[i][index]);
            minData=Math.min(minData,sampleData[i][index]);
        }
        var step=(maxData-minData)/10;
        for(var i=0;i<11;i++){
            Color_domain.push(minData+step*i);
        }

        var myColor = d3.scaleLinear()
            .range(["#313695",
                "#4575b4",
                "#74add1",
                "#abd9e9",
                "#e0f3f8",
                "#ffffbf",
                "#fee090",
                "#fdae61",
                "#f46d43",
                "#d73027",
                "#a50026"])
            .domain(Color_domain)


        // tooltip--------------------------------------------------------------------------------
        var tooltip = d3.select("#heat-map")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function(d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d[index])
                .style("left", (d3.mouse(this)[0]+150) + "px")
                .style("top", (d3.mouse(this)[1]+110) + "px")
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.4)
        }




        // draw------------------------------------------------------------------------------
        svg.selectAll()
            .data(sampleData, function(d) {return d.city+':'+d.year;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.city) })
            .attr("y", function(d) { return y(d.year) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d[index])} )
            .style("stroke-width", 2)
            .style("stroke", "none")
            .style("opacity", 0.5)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

}


