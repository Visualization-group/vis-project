// import * as echarts from 'echarts';
minYear = 2010, maxYear = 2019

drawpie(Allcity,minYear,maxYear);
function drawpie(cid,minYear, maxYear) {
  datacsv = d3.csv("./data/allpeople.csv", d3.autoType).then(function (data) {
    // console.log(data)
    var num_city = 0, num_town = 0;
    for (i = 0; i < data.length; i++) {
      // console.log(data[i]['cityId']);
      // console.log(cid);
      if (data[i]["cityId"] == cid && data[i]['year'] >= minYear && data[i]['year'] <= maxYear) {
        // console.log('dd');
        num_city += data[i]['city_value'], num_town += data[i]['town_value']
        // console.log(num_city,num_town);

      }
    }
    draw(num_city, num_town);
  })

}
function draw(num_city, num_town) {
  // console.log(num_town);
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;
  city = 'City'
  town = 'Town'
  option = {
    color:['#5470c6','#91cc75'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: num_city, name: city },
          { value: num_town, name: town },
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}
