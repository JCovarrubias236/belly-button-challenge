const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the data from the URL
d3.json(url).then(data => {
    const samples = data.samples;
    const nameIds = samples.map(sample => parseInt(sample.id));
    console.log(data);
    // Create dropdown menu and update horizontal chart
    var dropdown = d3.select("#selDataset")
        .selectAll("option")
        .data(nameIds)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Function to update the chart based on the selected name_id
    function optionChanged(name_id) {
        // Filter the data for the selected name_id
        let filteredData = samples.filter(sample => parseInt(sample.id) === parseInt(name_id))[0];
        console.log(filteredData)
        // Sort the filtered data by sample_values in descending order and slice the top 10 records
        let top10_otu_ids = filteredData.otu_ids.slice(0, 10).reverse();
        let top10_sample_values = filteredData.sample_values.slice(0, 10).reverse();
        let top10_otu_labels = filteredData.otu_labels.slice(0, 10).reverse();
        
        // Create the trace for the horizontal bar chart
        let trace1 = {
            x: top10_sample_values,
            y: top10_otu_ids.map(id => `OTU ${id}`),
            text: top10_otu_labels,
            type: 'bar',
            orientation: 'h'
        };

        let data = [trace1];

        // Define the layout for the chart
        let layout = {
            title: 'OTU Data',
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
        };

        // Update the data and layout of the Plotly chart
        Plotly.newPlot('bar', data, layout);

        // Creating the Bubble chart
        let trace2 = {
            x: filteredData.otu_ids,
            y: filteredData.sample_values,
            text: filteredData.otu_labels,
            mode: 'markers',
            marker: {
                size: filteredData.sample_values,
                color: filteredData.otu_ids
            }
        };

        let data2 = [trace2];

        let layout2 = {
            title: '# of Sample Values per OTU ID',
            xaxis: { title: 'OTU ID'},
            yaxis: { title: 'Number of Instances'}
        };

        Plotly.newPlot('bubble', data2, layout2);

        // Populate the Demographic Info
        d3.json("samples.json").then((data) => {
            //let filteredData = samples.filter(sample => parseInt(sample.id) === parseInt(name_id))[0];
            const metadatas = data.metadata;
            console.log(metadatas);
            let sampleFilterMetadata = metadatas.filter(metadata => parseInt(metadata.id) === parseInt(name_id))[0];
            console.log(sampleFilterMetadata);
            // Select the sample-metadata element
            let sampleMetadataElement = d3.select("#sample-metadata");

            // Clear any existing content in the card body
            sampleMetadataElement.html("");

            // Iterate through the key-value pairs in the sample metadata
            Object.entries(sampleFilterMetadata).forEach(([key, value]) => {
                // Append each key-value pair as a paragraph to the card body
                sampleMetadataElement.append("p").text(`${key}: ${value}`);
            });

            // Create Gauge Chart
            const washfreq = sampleFilterMetadata.wfreq;
            console.log(washfreq);

            let data3 = [
                {
                    mode: "gauge",
                    type: "indicator",
                    value: washfreq,
                    title: {text: "Belly Button Washing Frequency<br>Scrubs per Week",
                            align: "center",
                            font: {size: 25}},
                    gauge: {
                        shape: "angular",
                        axis: {
                            range:[0,9],
                            visible: false
                        },
                        steps: [
                            { range: [0, 1], color: "red", text: "0-1" },
                            { range: [1, 2], color: "orange", text: "1-2" },
                            { range: [2, 3], color: "yellow", text: "2-3" },
                            { range: [3, 4], color: "lightgreen", text: "3-4" },
                            { range: [4, 5], color: "lime", text: "4-5" },
                            { range: [5, 6], color: "green", text: "5-6" },
                            { range: [6, 7], color: "darkgreen", text: "6-7" },
                            { range: [7, 8], color: "seagreen", text: "7-8" },
                            { range: [8, 9], color: "forestgreen", text: "8-9" }
                        ],
                    }
                }
            ]

            // Calculate needle position
            var angle = 180 - (washfreq / 9) * 180; // Calculate angle based on washfreq value
            var r = 0.7; // Distance from the center (adjust as needed)
            var x_head = r * Math.cos(Math.PI / 180 * angle);
            var y_head = r * Math.sin(Math.PI / 180 * angle);

            let layout3 = {
                xaxis: { range: [0, 1], showgrid: false, zeroline: false, visible: false },
                yaxis: { range: [0, 1], showgrid: false, zeroline: false, visible: false },
                showlegend: false,
                annotations: [
                    {
                        ax: 0.5,
                        ay: 0,
                        axref: "x",
                        ayref: "y",
                        x: 0.5 + x_head,
                        y: y_head,
                        xref: "x",
                        yref: "y",
                        showarrow: true,
                        arrowhead: 9,
                    }
                ]
            };

            Plotly.newPlot("gauge", data3, layout3);
        });
    };

    // Event listener for dropdown change
    d3.select("#selDataset").on("change", function() {
        let selectedNameId = d3.select(this).property("value");
        optionChanged(parseInt(selectedNameId));
    });
    // Initial call to update the chart with the default name_id
    optionChanged(nameIds[0]);
});
