queue()
    .defer(d3.csv, "data/dragonballz.csv")
    .await(makeGraphs);
    
function makeGraphs(error, dragonballzData) {
    var ndx = crossfilter(dragonballzData);
    
    dragonballzData.forEach(function(d){
        d.age = parseInt(d.age);
        d.fav_show = parseInt(d["favourite.show"])
        d.yrs_watching = parseInt(d["yrs.watching"])
        
    })
    
   
    
    show_graph_selector(ndx);
    show_gender_graph(ndx);
    show_average_age(ndx);
    
    show_yrs_watching_to_favourite_show_correlation(ndx);
    
    show_pie_chart_of_series(ndx);
    
    
    dc.renderAll();
}


function show_graph_selector(ndx) {
    dim = ndx.dimension(dc.pluck('favourite.show'))
    group = dim.group()
    
    dc.selectMenu("#graph-selector")
        .dimension(dim)
        .group(group);
    
}

function show_gender_graph(ndx) {
    
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
        .yAxisLabel("Number Of People")
        .xAxisLabel("Gender")
        .yAxis().ticks(20);
}



function show_average_age(ndx) {
    
    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["orange", "blue"])
        
    var dim = ndx.dimension(dc.pluck('sex'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.age;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
            p.total -= v.age;
            p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }

    var averageageByGender = dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-age")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(averageageByGender)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Age Per Show")
        .xAxisLabel("Gender")
        .yAxis().ticks(4);   
        
}        

function show_yrs_watching_to_favourite_show_correlation(ndx) {
    
    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["orange", "blue"])
        
        
    var yrsDim = ndx.dimension(dc.pluck("yrs_watching"));
    var experienceDim = ndx.dimension(function(d) {
        return [d.yrs_watching, d.age, d.sex];
    });
    var watchingshowGroup = experienceDim.group();

    var minEx = yrsDim.bottom(1)[0].yrs_watching;
    var maxEx = yrsDim.top(1)[0].yrs_watching;
    var dim = ndx.dimension(dc.pluck('sex'));

    dc.scatterPlot("#yrs-watching-favourite-show")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minEx, maxEx]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("Age of Person")
        .xAxisLabel("Years Of Watching The Franchise")
        .title(function(d) {
            return d.key[1] + " Years old, " +  d.key[0] + " Years Watching ";
        })
        .colorAccessor(function(d) {
            return d.key[2]
        })
        .colors(genderColors)
        .dimension(experienceDim)
        .group(watchingshowGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
}





function show_pie_chart_of_series(ndx) {

    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["blue", "orange"])
        
    var pdim = ndx.dimension(dc.pluck('sex'));
    var pgroup = pdim.group();
    
    
    dc.pieChart("#pie-chart-of-series")
        .height(330)
        .radius(90)
        .transitionDuration(500)
        .colorAccessor(function(d) {
            return d.key[2]
        })
        .colors(genderColors)
        .dimension(pdim)
        .group(pgroup);
    
}


















