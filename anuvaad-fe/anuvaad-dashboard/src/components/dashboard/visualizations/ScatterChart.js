import React from 'react';
import { Scatter } from 'react-chartjs-2';
import _ from 'lodash';
let scatterPalette = window.palette;

/**
  * ScatterChart component
  */

const options = {
	responsive: true,
	options: {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	},
	legend: {
		display: true,
		position: 'bottom',
		labels: {
			boxWidth: 10
		}
	},
	tooltips: {
		callbacks: {
			label: function (tooltipItem, data) {
				var scatterDataset = data.datasets[tooltipItem.datasetIndex];
				var currentValue = scatterDataset.data[tooltipItem.index];
				return JSON.stringify(currentValue);
			},
			title: function (tooltipItem, data) {
				return data.labels[tooltipItem[0].index];
			}
		}
	}
};

class ScatterChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	}
	getData(chartData) {
		var scatterTempData = {
			labels: [],
			datasets: []
		};
		var scatterTempDataSet = {
			label: "",
            data: [],
            dataSymbol: []

		};

		_.map(chartData, function (k, v) {
			var plots = k['plots'];

			for (var i = 0; i < plots.length; i++) {
				scatterTempData.labels.push(plots[i]['name']);
        scatterTempDataSet.data.push({'x':plots[i]['value'], y:plots[i]['value']+10});
        scatterTempDataSet.dataSymbol.push([plots[i]['symbol'], "Unit"]);
			}
				});
        scatterTempDataSet.backgroundColor= scatterPalette('cb-Custom1', scatterTempDataSet.data.length).map(function(hex) {
            return '#' + hex;
          })
				scatterTempDataSet.borderColor= scatterPalette('cb-Custom1', scatterTempDataSet.data.length).map(function(hex) {
							return '#' + hex;
						})
		scatterTempData.datasets.push(scatterTempDataSet);
		return scatterTempData;
	}

	render() {
		let { chartData } = this.props;
    let _data = this.getData(chartData)

		if (_data) {
			return (
                <Scatter
									  height={this.props.dimensions.height}
                    data={_data}
										options={options}
                />
			)
		}
		return <div>Loading...</div>
	}
}

export default ScatterChart;
