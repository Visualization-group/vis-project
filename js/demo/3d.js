function draw3d(filename, index) {
    d3.csv(filename).then(
        function (csvdata) {
            var mx=1;
            var data = [];
            for (var i in csvdata) {
                if(csvdata[i]['city']==="全国") continue;
                data.push([csvdata[i]['city'], csvdata[i]['year'], csvdata[i][index]])
                if(Number(csvdata[i][index])>mx)
                    mx=Number(csvdata[i][index]);
            }
            console.log(data)
            var chartDom = document.getElementById('3d');
            var myChart = echarts.init(chartDom);
            var option;
            var region = [
                '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省',
                '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省',
                '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省',
                '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
            ]
            // prettier-ignore
            var days = ['2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
            // prettier-ignore
            option = {
                tooltip: {},
                visualMap: {
                    max: mx,
                    inRange: {
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                xAxis3D: {
                    type: 'category',
                    data: region,
                    axisLabel: {
                        interval: 0
                    }
                },
                yAxis3D: {
                    type: 'category',
                    data: days
                },
                zAxis3D: {
                    type: 'value'
                },
                grid3D: {
                    boxWidth: 300,
                    boxDepth: 150,
                    viewControl: {
                        // projection: 'orthographic'
                    },
                    light: {
                        main: {
                            intensity: 1.3,
                            shadow: true
                        },
                        ambient: {
                            intensity: 0.3
                        }
                    }
                },
                series: [{
                    type: 'bar3D',
                    data: data.map(function (item) {
                        return {
                            value: [item[0], item[1], item[2]]
                        };
                    }),
                    shading: 'color',
                    label: {
                        show: false,
                        fontSize: 16,
                        borderWidth: 1
                    },
                    itemStyle: {
                        opacity: 0.4
                    },
                    emphasis: {
                        label: {
                            fontSize: 20,
                            color: '#900'
                        },
                        itemStyle: {
                            color: '#900'
                        }
                    }
                }]
            };

            option && myChart.setOption(option);

        });
}
