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
    .defer(d3.json, "/js/us-10m.json")
    //.defer(d3.json, "/js/ne_10m_us_states_lakes.json")
    //.defer(d3.json, "http://rocky-plateau-7183.herokuapp.com/1/demand?group_by=state&geo=US&products=1%2C2%2C3%2C4")
    .defer(d3.json, "http://0.0.0.0:5000/1/demand?group_by=county&geo=US&products=1%2C2%2C3%2C4")
    .await(ready);

function ready(error, us, demand) {
  
  domain = [];
  results = d3.map();
  for (_i = 0, _len = demand.results.length; _i < _len; _i++) {
    DEMAND = 4;
    ABBREV = 3;
    domain.push( demand.results[_i][DEMAND] );
    results.set(demand.results[_i][ABBREV],demand.results[_i][DEMAND]);
  }

  console.log(results);

  var quantize = d3.scale.quantize()
    .domain([domain[0],domain[domain.length-1]])
    .range(d3.range(9).map(function(i) { return "state q" + i + "-9"; }));

  var quantile = d3.scale.quantile()
    .domain(domain)
    .range(d3.range(9).map(function(i) { return "state q" + i + "-9"; }));

  svg.append("g")
      .attr("class", "county")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) { fips = d.id+""; while (fips.length < 5) {fips = '0' + fips}; return quantile(results.get(fips)); })
      .attr("id", function(d) { fips = d.id+""; while (fips.length < 5) {fips = '0' + fips}; return "county-"+fips; } )
      .attr("d", path);

  /*svg.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("id", function(d) { fips = d.id+""; return "state-"+fips; } )
      .attr("class", function(d) { return quantile(results.get(d.id)); });*/

  /*svg.append("path")
      .datum(topojson.feature(us, us.objects.counties, function(a, b) { return a === b; }))
      .attr("d", path )
      .attr("class", "county-border");*/

  svg.append("path")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path )
      .attr("class", "state-border");

}