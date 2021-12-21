function draw_paralle(filename){
    d3.csv(filename).then(
        function (csvdata){
            console.log(csvdata.length)
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
            data=[];
           
            var lineStyle = {
              width: 1,
              opacity: 0.5
            };
            for (i=0 ;i<csvdata.length;i+=10) {
                ele={};
                ele['type']='parallel';
                ele['linStyle']=lineStyle
                ele['name']=csvdata[i]['city'];
                ele['data']=[];
                for(j=i;j<i+10;++j){
                  a=[]
                  cnt=0;
                  for(var key in csvdata[j]){
                    // console.log(key)
                    if(key[0]!=='1'&&key[0]!=='2'&&key[0]!=='3'&&key[0]!=='4')continue;
                    a.push(Number(csvdata[j][key]))
                    }
                  ele['data'].push(a);
                }
                data.push(ele)
             }
            console.log(data[0]['data'])

            mx=[2019,1600,400,700,4000,800,10000,40,30,40,1100,120,70]
            var schema = [
              { name: '10', index: 0, text: '年份' },
              { name: '11', index: 0, text: '综合医院' },
              { name: '12', index: 1, text: '中医医院' },
              { name: '13', index: 2, text: '专科医院' },
              { name: '21', index: 3, text: '城镇在岗职工' },
              { name: '22', index: 4, text: '城镇退休人员' },
              { name: '23', index: 5, text: '城镇居民' },
              { name: '31', index: 6, text: '执业助理医师' },
              { name: '32', index: 7, text: '执业医师' },
              { name: '33', index: 8, text: '注册护士' },
              { name: '41', index: 9, text: '0-49张床位' },
              { name: '42', index: 10, text: '50-99张床位' },
              { name: '43', index: 11, text: '100张床位及以上' },
            ];
            option = {
              backgroundColor: '#333',
              legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: -10,
                itemGap: 30,
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                },
                itemStyle:{
                    color:'rgb(255,154,0)'
                }
              },
              tooltip: {
                padding: 10,
                backgroundColor: '#222',
                borderColor: '#777',
                borderWidth: 1
              },
              parallelAxis: [
                  {
                      dim: 0, name: schema[0].text, min: 2010, max: mx[0],
                      interval:1
                      // type:'category'
                      // type: 'time',
                      // axisLabel: {
                      //     formatter: '{yyyy}'
                      // }
                },
                { dim: 1, name: schema[1].text,max:mx[1]},
                { dim: 2, name: schema[2].text ,max:mx[2]},
                { dim: 3, name: schema[3].text ,max:mx[3]},
                { dim: 4, name: schema[4].text ,max:mx[4]},
                { dim: 5, name: schema[5].text ,max:mx[5]},
                { dim: 6, name: schema[6].text ,max:mx[6]},
                { dim: 7, name: schema[7].text ,max:mx[7]},
                { dim: 8, name: schema[8].text ,max:mx[8]},
                { dim: 9, name: schema[9].text ,max:mx[9]},
                { dim: 10, name: schema[10].text ,max:mx[10]},
                { dim: 11, name: schema[11].text ,max:mx[11]},
                { dim: 12, name: schema[12].text ,max:mx[12]},
              ],
              visualMap: {
                type: 'continuous',
                show: true,
                // min: 0,
                max: 300,
                dimension: 2,
                inRange: {
                  // color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
                  color:["#313695",
                  "#4575b4",
                  "#74add1",
                  "#abd9e9",
                  "#e0f3f8",
                  "#ffffbf",
                  "#fee090",
                  "#fdae61",
                  "#f46d43",
                  "#d73027",
                  "#a50026"]
                  // colorAlpha: [0, 1]
                }
              },
              parallel: {
                left: '5%',
                right: '18%',
                top: 100,
                bottom: 20,
                parallelAxisDefault: {
                  type: 'value',
                 nameLocation: 'end',
                  nameGap: 20,
                  nameTextStyle: {
                    color: '#fff',
                    fontSize: 12
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#aaa'
                    }
                  },
                  axisTick: {
                    lineStyle: {
                      color: '#777'
                    }
                  },
                  splitLine: {
                    show: false
                  },
                  axisLabel: {
                    color: '#fff'
                  }
                }
              },
              series: data
            };
            
            option && myChart.setOption(option);
            
        }
    )
}