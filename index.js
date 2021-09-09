const marginLeft = ( 0.1 * window.innerWidth );
const marginRight = ( 0.2 * window.innerWidth );
const marginTop = 0;
const marginBottom = 0; //( 0.05 * window.innerHeight)
const width = ( 0.8 * window.innerWidth )- marginLeft - marginRight;
const height = (window.innerHeight * 0.8) - marginTop - marginBottom;

const marginLeft2 = (0.05 * window.innerWidth );
const marginRight2 = (0.1 * window.innerWidth );
const marginTop2 = 0;
const marginBottom2 = 0; //( 0.4 * window.innerHeight );
const width2 = ( window.innerWidth * 1.6 )- marginLeft2 - marginRight2;
const height2 = (window.innerHeight * 0.8) - marginTop2 - marginBottom2;
const axisHeight = height2 / 2;

const svg = d3.select("#svg1")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom)
    .attr("class", "bar-chart");

const svg2 = d3.select("#svg2")
  .attr("width", width2 + marginLeft2 + marginRight2)
  .attr("height", height2 + marginTop2 + marginBottom2)
  .attr("class", "bar-chart");

var parseDate = d3.timeParse("%d.%m.%y");
var formatMonths = d3.timeFormat("%d.%m.%y");
var formatYears = d3.timeFormat("'%y");
var formatFullYears = d3.timeFormat("%Y");

var toolTip = d3.select("body")
  .append("div")
  .attr("class", "toolTip");

var toolTip1 = d3.select("body")
  .append("div")
  .attr("class", "toolTip1");

var list = d3.select("#list");


d3.csv("https://raw.githubusercontent.com/idaflik/data/master/dates_attacks_new_1.csv",function(data){

  data.forEach(function(d){
    d.date = parseDate(d.date);
    d.tote = +d.tote;
    });

    console.log(data);

    const xScale = d3.scaleTime()
        .range([0, width])
        .domain([new Date(1990, 0), new Date(2020, 1)])
        ;

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.tote })])
        ;

    const chart = svg.append('g')
        .attr('transform', `translate(${marginLeft}, ${marginTop})`)
        ;

    var tickNumber = window.innerWidth / 40;

    chart.append('g')
        .attr("class", "white")
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(formatYears).ticks(tickNumber))

    var barWidth = 1;

    chart.selectAll(".bar")
           .data(data)
           .enter().append("rect")
           .attr("class","bar")
           .attr("opacity", "0.5")
           .attr("fill", "#e4e3ea")
           .attr("stroke", "none")
           .attr("x", function(d) { return xScale(d.date) - (barWidth / 2) } )
           .attr("y", function(d) { return yScale(d.tote); })
           .attr("width", function(d) { return (d.tote) * barWidth})
           .attr("height", function(d) { return height - yScale(d.tote); })
           .attr("y_bottom", function(d) { return yScale(1)})
           .on("mousemove", function(d){
                     toolTip1
                       .style("left", d3.event.pageX + "px")
                       .style("bottom", (window.innerHeight - d3.select(this).attr("y_bottom")) + "px")
                       .style("display", "inline-block")
                       .html((d.opfer));
                 })
         // .on("mouseenter", function(d){
         //           list
         //             .insert("li",":first-child")
         //             .html((d.opfer));
         //       })
           // .on("mouseout", function(d){ toolTip1.style("display", "none")})
           ;





     const xScale2 = d3.scaleTime()
         .range([0, width2])
         .domain([new Date(1990, 0), new Date(2020, 1)])
         ;

     const yScale2 = d3.scaleLinear()
         .range([0,height2])
         .domain([0, 500])
         ;

     const chart2 = svg2.append('g')
         .attr('transform', `translate(${marginLeft2}, ${marginTop2})`)
         ;

     var tickNumber2 = 50;

     var barWidth2 = 2;

     chart2.selectAll(".circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("fill", "#e4e3ea")
            .attr("z-index", function(d) { return 10 - (d.tote)})
            .attr("cx", function(d) { return xScale2(d.date) - (barWidth / 2) } )
            .attr("cy", axisHeight)
            .attr("r", function(d) { return yScale2(d.tote + 2)})
            .on("mouseenter", function(d){
                      toolTip
                        .style("left", d3.event.pageX + 10 + "px")
                        .style("top", d3.event.pageY - 40 + "px")
                        .style("display", "inline-block")
                        .html("Datum: " + formatMonths(d.date) + "<br>Ort: " + (d.ort) + "<br>Todesopfer:<br>" + (d.opfer) + "<br>Quelle:<br>" + (d.quelle) );
                  })
            .on("mouseout", function(d){ toolTip.style("display", "none")})
            ;

          chart2.on("mouseout", function(d){ toolTip.style("display", "none")});

          chart2.append('g')
              .attr("class", "dark")
              .attr('transform', `translate(0, ${axisHeight})`)
              .call(d3.axisBottom(xScale2).tickFormat(formatFullYears).ticks(tickNumber2))

     });
