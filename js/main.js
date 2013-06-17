var width = 960,
    height = 500;

var rateById = d3.map();

/*var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));*/

var path = d3.geo.path();

var svg = d3.select("#home").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "/js/ne_10m_us_states_lakes.json")
    //.defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
    .await(ready);

function ready(error, states) {
  /*svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) { return quantize(rateById.get(d.id)); })
      .attr("d", path);*/

  svg.append("path")
      .datum(topojson.mesh(states, states.objects.states ))
      .attr("class", "state")
      .attr("d", path);

  /*svg.append("path")
      .datum(topojson.feature(states, states.objects.states))
      .attr("d", d3.geo.path().projection(d3.geo.mercator()));*/

}