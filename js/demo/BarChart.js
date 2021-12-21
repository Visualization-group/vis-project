// 对于函数的预处理,应该至少做到如下设定
// 将条状图中分属同一组的数据,添加字段Class,方便进行绘图设置
// 当没有点击任何一个省份时,首先显示的应当是全国的数据
// 当点击某个省份,将数据更改为那个省份的数据

var classCnt=[3,5,6,4];
function BarDataPro(data,province,minYear,maxYear)
{
    let temp=data.filter(d=>d.id===province);

    let yearNum=maxYear-minYear+1;
    let ret=[];
    for(let i=1;i<5;i++){
        let t=[];
        for(let j=1;j<=classCnt[i-1];j++){
            let tempName=i+"-"+j;
            var avg=0;
            for(let k=0;k<temp.length;k++){
                if(temp[k]["year"]<=maxYear && temp[k]["year"]>=minYear){
                    avg=avg+temp[k][tempName]/yearNum;
                }
            }
            t.push(
                {
                    value:avg,
                    id:tempName
                }
            );
        }
        ret.push(t);
    }
    return ret;
}

var Bari=[];
var BarData;
var AllData;
var widthShift;
var inpadding;
var rectWidth;
var barOrder;

// 调用时需要给定数据/或自己读入?
// 必须给定省份信息
function DrawBar(d,barName,province,minYear,maxYear)
{
    AllData=d;
    const n=4;
    const names=[
        [   "综合医院",
            "中医医院",
            "专科医院",
        ],
        [
            "执业助理医师",
            "执业医师",
            "注册护士",
            "其他技术人员",
            "管理人员",
        ],
        [
            "0张",
            "1-9张",
            "10-29张",
            "30-49张",
            "50-99张",
            "100张及以上",
        ],
        [
            "城镇职工",
            "城镇在岗职工",
            "城镇退休人员",
            "城镇居民"
        ]
    ]

    const headers=[
        "医院数目(个)",
        "基本医疗保险年末参保人数(万人)",
        "医疗卫生相关人员数(万人)",
        "n张床位数社区卫生服务中心数(个)"
    ]

    const [width,height]=[288,160];
    const padding={left:20,right:10,top:0,bottom:5};
    inpadding={left:30,right:5,top:20,bottom:0};
    let rectheight=height/n-padding.top;
    rectwidth=width-padding.left-padding.right;

    const BarColor=["#5470C6","#36B9CC","#F9C23E","#1CC88A"];
    const Text={color:"#ffffff",weight:"normal",size:"12px"};
    const Head={color:"#4b4b4b",weight:"normal",size:"12px"};
    const Stroke={color:"#000000",width:"0"};
    const textShadow="2px 2px 2px #c7c7c7"
    let margin=10;

    // 对数据先进行预处理,将结果存在TrueData中
    BarData=BarDataPro(d,province,minYear,maxYear);

    // 因为大概分成了4个条形图,因此分循环将数据获取出来
    // 这里的范围可以根据具体情况进行更改
    let pre=0;
    barOrder=[0,3,1,2]
    for(let j=0;j<n;j++)
    {
        let i=barOrder[j];

        let BarSVG=d3
            .select(barName+(j+1));

        // 获取画布
        BarSVG.selectAll('rect').remove()
        BarSVG
            .attr("width","100%")
            .attr("hegiht",height)
            .attr("viewbox",[0,0,width,height]);

        // 找出Class等于当前的i的数据 去绘制条形图
        rectheight=height-padding.top;
        let perData=BarData[i];
        let barHeight=0;
        let [px,py]=[0,pre];

        // console.log(py);

        const Bars=BarSVG.append('g')
            .attr("transform",`translate(${px+padding.left},${py+padding.top})`)
            .classed("Bar"+i,true);
        widthShift=d3
            .scaleLinear()
            .domain([0,d3.max(perData.map(d=>d.value))])
            .range([inpadding.left,rectwidth-inpadding.right]);
        let rg=[];
        for(let i=0;i<perData.length;i++) rg.push(i);
        let y=d3
            .scaleBand()
            .domain(rg)
            .range([inpadding.top,rectheight-inpadding.bottom]);

        barHeight=y.bandwidth()-margin;
        var tempBar
            =Bars.selectAll('rect')
            .data(perData)
            .enter()
            .append('rect')
            .attr("x",px)
            .attr("y",function (d,i) {
                return y(i)-5;
            })
            .attr("width",d=>widthShift(d.value))
            .attr("height",barHeight)
            .attr("fill",BarColor[i])
            .on("click",function (d,i) {
                Allindex=d.id;
                drawMap.draw(Allindex,minYear,maxYear);
                document.getElementById('Map-index').innerHTML=names[parseInt(Allindex[0])-1][parseInt(Allindex[2])-1];
            });

        Bari.push(tempBar);

        BarSVG.append('g')
            .attr("transform",`translate(${px+padding.left},${py+padding.top})`)
            .classed("BarText",true)
            .selectAll('text')
            .data(names[i])
            .enter()
            .append('text')
            .attr('x',px)
            .attr('y',function (d,i) {
                return y(i)+(barHeight/2)+1;
            })
            .style("font-size",Text.size)
            .style("font-weight",Text.weight)
            .style("user-select","none")
            .style("text-shadow",textShadow)
            .text(d=>d)
            .attr("fill",Text.color)
            .attr("stroke",Stroke.color)
            .attr("stroke-width",Stroke.width)
            .on("click",function (d,j) {
                Allindex=(i+1)+'-'+(j+1);
                drawMap.draw(Allindex,minYear,maxYear);
                document.getElementById('Map-index').innerHTML=names[parseInt(Allindex[0])-1][parseInt(Allindex[2])-1];
            });
    }
}