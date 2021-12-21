var year=[2010,2019];
var yearPre=[2010,2019],yearidPre=0;

function drawBarChartAgain(){
    BarData = BarDataPro(AllData, Allcity, minYear,maxYear);

    for (let i = 0; i < 4; i++) {
        widthShift = d3
            .scaleLinear()
            .domain([0, d3.max(BarData[barOrder[i]].map(d => d.value))])
            .range([inpadding.left, rectwidth - inpadding.right]);

        Bari[i].data(BarData[barOrder[i]])
            .transition()
            .delay(0)
            .duration(1000)
            .attr("width", d => widthShift(d.value));
    }
}

(function() {

    var cnt=0;
    year=$("#double_number_range").rangepicker({
        type: "double",
        startValue: 2010,
        endValue: 2019,
        translateSelectLabel: function(currentPosition, totalPosition) {
            var res=parseInt( 10 * (currentPosition / totalPosition) + 2010);
            if(res>2019)res=2019;
            if(res<2010)res=2010;
            yearPre[yearidPre]=res;
            yearidPre=yearidPre^1;
            if(year[0]!==yearPre[0] || year[1]!==yearPre[1]){
                year[0]=yearPre[0];
                year[1]=yearPre[1];
                if(year[0]>=2010 && year[0]<=2019 && year[1]>=2010 && year[1]<=2019 ){
                    minYear=Math.min(year[1],year[0]);
                    maxYear=Math.max(year[1],year[0]);
                    // maxYear=year[0];
                    // minYear=year[1];
                    // console.log(year[1]+" "+year[0]);
                    cnt++;
                    if(cnt===6){
                        year[1]=2010;
                        year[2]=2019;
                        drawMap.draw(Allindex,minYear,maxYear);
                        drawpie(Allcity,minYear,maxYear);
                        drawBarChartAgain();
                    }
                    else if(cnt>6){
                        cnt=6;
                        drawMap.draw(Allindex,minYear,maxYear);
                        drawpie(Allcity,minYear,maxYear);
                        drawBarChartAgain();
                    }
                }
            }

            return res;
        }
    });
    // console.log(year.getSelectValue());
})();