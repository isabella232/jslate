var kairos_url = 'http://m0043725.lab.ppops.net:8080';
var kairos_query_url = kairos_url+'/api/v1/datapoints/query';


function showChartForQuery(title, subtitle, chartType, yAxisTitle, queries, renderTo) {
	var results = queries[0].results;

	if (results.length == 0) {
		document.write("No Data");
		return;
	}

	var data = [];
	queries.forEach(function (resultSet) {

		var metricCount = 0;
		resultSet.results.forEach(function (queryResult) {

			var groupByMessage = "";
			var groupBy = queryResult.group_by;
			if (groupBy) {
				$.each(groupBy, function (index, group) {
					groupByMessage += '<br>(' + group.name + ': ';

					var first = true;
					$.each(group.group, function (key, value) {
						if (!first)
							groupByMessage += ", ";
						groupByMessage += key + '=' + value;
						first = false;
					});

					groupByMessage += ')';

				});
			}

			var result = {};
			result.name = queryResult.name + groupByMessage;
			result.label = queryResult.name + groupByMessage;
			result.data = queryResult.values;

			data.push(result);
		});
	});
	drawChart(title, subtitle, yAxisTitle, chartType, data, renderTo);
}

function drawChart(title, subTitle, yAxisTitle, chartType, data, renderTo) {
	chart = new Highcharts.Chart({
		chart: {
			renderTo: renderTo,
			type: chartType,
			marginRight: 130,
			marginBottom: 50,
			zoomType: 'x'
		},
		title: {
			text: title,
			startOnTick: true,
			endOnTick: true,
			showLastLabel: true,
			x: -20 //center
		},
		subtitle: {
			text: subTitle,
			x: -20
		},
		xAxis: {
			type: 'datetime',
			labels: {
				rotation: -45
			},
			dateTimeLabelFormats: {
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%b %e',
				week: '%e %b',
				month: '%b \'%y',
				year: '%Y'
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			plotLines: [
				{
					value: 0,
					width: 1,
					color: '#808080'
				}
			]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					new Date(this.x) + '<br>' + this.y;
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: -10,
			y: 100,
			borderWidth: 0
		},
		series: data
	});
}
