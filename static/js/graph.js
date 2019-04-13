queue()
    .defer(d3.csv, "data/dragonballz.csv")
    .await(makeGraphs);
    
function makeGraphs(error, dragonballzData) {
    var ndx = crossfilter(dragonballzData);
    
    dragonballzData.forEach(function(d){
        d.age = parseInt(d.age);
    })
    
   
    
    show_graph_selector(ndx);
    show_gender_graph(ndx);
    show_average_age(ndx);
    show_show_distribution(ndx)
    
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
        .xAxisLabel("Gender")
        .yAxis().ticks(20);
}



function show_average_age(ndx) {
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
        .xAxisLabel("Gender")
        .yAxis().ticks(4);   
}
















