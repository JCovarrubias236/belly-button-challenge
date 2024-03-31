const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the data from the URL
fetch(url)
  .then(response => response.json())
  .then(data => {
    const sampleValues = data.sample_values;
    let otuIds = data.otu_ids.slice();
    const otuLabels = data.otu_labels;

    // Sorting the otuIds in descending order
    otuIds.sort(function compareFunction(firstNum, secondNum){
        // resulting order is descending
        return secondNum - firstNum;
    });
    //Slice the first 10 OTUs
    const top10 = otuIds.slice(0,10);
    // Create horizontal bar chat
    let trace1 = {
        x: sampleValues,
        y: top10.map(id => `OTU ${id}`), // Use otu_ids as labels with 'OTU' prefix
        text: otuLabels,  // Use otuLabels for hover text
        type: 'bar',
        orientation: 'h'  // Make the chart horizontal
    };
    // Create a data array from top10 otu ids
    let data = [trace1]
    // Define the layout for the chart
    let layout =  {
        title: 'OTU Data',
        xaxis: {title: 'Sample Values'},
        yaxis: {title: 'OTU IDs'}
    };

    // Plot chart using plotly
    Plotly.newPlot('plot', data, layout)
});