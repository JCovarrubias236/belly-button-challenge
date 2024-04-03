const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the data from the URL
d3.json(url).then(data => {
    const samples = data.samples;
    const nameIds = samples.map(sample => parseInt(sample.id));
    const metaData = data.metadata;
    
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
    }

    // Event listener for dropdown change
    d3.select("#selDataset").on("change", function() {
        let selectedNameId = d3.select(this).property("value");
        optionChanged(parseInt(selectedNameId));
    });
    // Initial call to update the chart with the default name_id
    optionChanged(nameIds[0]);
});