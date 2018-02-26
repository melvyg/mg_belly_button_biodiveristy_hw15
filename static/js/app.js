var $selDataset = document.getElementById("selDataset");
var $metadatalist = document.getElementById("metadatalist");
var $bubble = document.getElementById("bubble");

function build_dropdown(response) {

    for (i=0; i<response.length; i++) {
        var $option = document.createElement("option");
        $option.setAttribute("value", response[i]);
        $option.innerHTML = response[i];

        $selDataset.appendChild($option);
    };
};

Plotly.d3.json("/names", function(error, response){
    if (error) return console.warn(error);

    for (i=0; i<response.length; i++) {
        var $option = document.createElement("option");
        $option.setAttribute("value", response[i]);
        $option.innerHTML = response[i];

        $selDataset.appendChild($option);
    };
});

function init() {

    Plotly.d3.json("/metadata/BB_940", function(error, response) {
        if (error) return console.log(error);

        metadata = response[0];
        var keys = Object.keys(metadata);
        console.log(keys);

        for (var i = 0; i < keys.length; i++) {
            var $p = document.createElement("p");
            $p.innerHTML = `${keys[i]}: ${metadata[keys[i]]}`;
            $metadatalist.appendChild($p);
        };
    });

    Plotly.d3.json("/samples/BB_940", function(error, samp_response) {
        if (error) return console.log(error);

        console.log(samp_response[0]['otu_id']);
    
        // Data slices
        var idSlice = samp_response[0]['otu_id'].slice(0,10);
        var valueSlice = samp_response[0]['sample_values'].slice(0,10);

        // Pie data
        var pieIds = [];
        var pieValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i] != 0) {
                pieIds.push(idSlice[i]);
                pieValues.push(valueSlice[i]);
            };
        };

        var bubbleIds = [];
        var bubbleValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i]  != 0) {
                bubbleIds.push(idSlice[i]);
                bubbleValues.push(valueSlice[i]);
            };
        };

        console.log(bubbleIds);
        console.log(bubbleValues);

        Plotly.d3.json("/otu", function(error, otu_response) {
            if (error) console.log(error);
        
            var pieLabels = [];
            for (var i = 0; i < pieIds.length; i++) {
                    pieLabels.push(pieIds[i]);
            };
        
            var bubbleLabels = [];
            for (var i = 0; i < bubbleIds.length; i++) {
                bubbleLabels.push(bubbleIds[i]);
            };
        
            var pieData = [{
                values: pieValues,
                labels: pieIds,
                type: "pie",
                hovertext: pieLabels
            }];

            Plotly.newPlot("pie", pieData);

        
            var bubbleData = [{
                x: bubbleIds,
                y: bubbleValues,
                mode: "markers",
                text: bubbleLabels,
                marker: {
                    size: bubbleValues,
                    color: bubbleIds.map(row=>row),
                    colorscale: "Rainbow"
                }
            }];
            var bubbleLayout = {
                xaxis: {
                    title: "OTU ID"
                }
            };
            Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        });
    });
};

function updatePlots(newPie, newBubble) {
    
    var pieUpdate = {
        values: [newPie.values],
        labels: [newPie.lables],
        hovertext: [newPie.hovertext]
    };
    Plotly.restyle("pie", pieUpdate);

    Plotly.restyle("bubble", "x", [newBubble.x]);
    Plotly.restyle("bubble", "y", [newBubble.y]);
    Plotly.restyle("bubble", "text", [newBubble.text]);
    Plotly.restyle("bubble", "marker.size", [newBubble.y]);
    Plotly.restyle("bubble", "marker.color", [newBubble.x.map(row=>row)]);
};

// Get new data and update new data
function optionChanged(dataset) {

    var dataURL = `/metadata/${dataset}`;
    Plotly.d3.json(dataURL, function(error, response) {
        if (error) return console.log(error);

        $metadatalist.innerHTML = "";

        metadata = response[0];
        var keys = Object.keys(metadata);

        for (var i = 0; i < keys.length; i++) {
            var $p = document.createElement("p");
            $p.innerHTML = `${keys[i]}: ${metadata[keys[i]]}`;
            $metadatalist.appendChild($p);
        };
    });

    var plotURL = `/samples/${dataset}`;
    Plotly.d3.json(plotURL, function(error, samp_response) {
        if (error) return console.log(error);

        var newPie = {};
        var newBubble = {};

        // Top 10 data
        var idSlice = samp_response[0]['otu_id'].slice(0,10);
        var valueSlice = samp_response[0]['sample_values'].slice(0,10);

        // Pie data
        var pieIds = [];
        var pieValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i] != 0) {
                pieIds.push(idSlice[i]);
                pieValues.push(valueSlice[i]);
            };
        };
        newPie["values"] = pieValues;
        newPie["labels"] = pieIds;

        // Bubble data
        var bubbleIds = [];
        var bubbleValues = [];
        for (var i = 0; i < valueSlice.length; i++) {
            if (valueSlice[i]  != 0) {
                bubbleIds.push(idSlice[i]);
                bubbleValues.push(valueSlice[i]);
            };
        };
        newBubble["x"] = bubbleIds;
        newBubble["y"] = bubbleValues;

        d3.json("/otu", function(error, otu_response) {
            if (error) console.log(error);

            var pieLabels = [];
            for (var i = 0; i < pieIds.length; i++) {
                pieLabels.push(otu_response[pieIds[i]]);
            };
            newPie["hovertext"] = pieLabels;

            var bubbleLables = [];
            for (var i = 0; i < bubbleIds.length; i++) {
                bubbleLables.push(otu_response[bubbleIds[i]]);
            };
            newBubble["text"] = bubbleLables;

            updatePlots(newPie, newBubble);
        });
    })
};

init();