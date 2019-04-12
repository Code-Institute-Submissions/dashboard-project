queue()
    .defer(d3.csv, "data/dragonballz.csv")
    .await(makeGraphs);
    
function makeGraphs(error, dragonballzData) {
    var ndx = crossfilter(dragonballzData);
    
    show_gender_balance(ndx);
    
    dc.renderAll();
}

function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();
    
    dc.barChart("#gender-graph")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(20);
}