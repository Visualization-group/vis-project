// https://observablehq.com/@zechasault/rotary-dial-date-picker@1724
export default function define(runtime, observer) {
  const main = runtime.module();

  var dimension = [];
  main.variable(observer("viewof datePicker")).define("viewof datePicker", ["fields", "d3", "DOM", "width", "height", "substractAngle", "closest", "daysInMonth", "addAngle", "dotRadius"], function (fields, d3, DOM, width, height, substractAngle, closest, daysInMonth, addAngle, dotRadius) {
        let animationDelay = false;
        let monthSelected = "1-1";
        let daySelected = "北京";
        let yearSelected = "2010";
        let data = fields.map(f => ({ ...f, pie: f.pie.map(p => ({ ...p })) }));
        let angleStart = 0;

        const svg = d3
            .select(DOM.svg(width, height))
            // disable text selection
            .attr(
                "style",
                `-webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none;`
            )
            .attr("text-anchor", "middle")
            .style("display", "block")
            .style("font", "700 18px 'Helvetica Neue'")
            .style("width", "100%")
            .style("max-width", `${window.screen.height}px`)
            .style("height", "auto")
            .style("margin", "auto");

        const container = svg
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        d3.csv("./data/rank.csv", d3.autoType).then(function (data) {
          let tmp = data.filter(d => d.city === daySelected);
          let tmp1 = tmp.filter(d => d.year == Number(yearSelected));
          container
              .select("[id=centralText]").remove();
          svg
              .select("[id=centerImg]").remove();

          var URL = './img/' + Math.floor(tmp1[0][monthSelected] / 6 + 1) + '.png';
          let widthImage = 240, heightImage = 240
          svg
              .append('g')
              .attr('id', 'centerImg')
              .attr("transform", `translate(${(width - widthImage) / 2},${(height - heightImage) / 2})`)
              .append('svg:image')
              .attr('href', URL)
              .attr('x', '0')
              .attr('y', '0')
              .attr('width', '250px')
              .attr('height', '250px')
              .on("click", valideDate);
        });


        const fieldsG = container
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("cursor", "move")
            .call(
                d3
                    .drag()
                    .on("start", function (d) {
                      // Save the starting angle
                      angleStart = Math.atan2(d3.event.y, d3.event.x);
                    })
                    .on("drag", function (d, i) {
                      // Compute the new angle (start - current)
                      var newAngle = angleStart - Math.atan2(d3.event.y, d3.event.x);

                      d3.select(this)
                          .selectAll(".textDate")
                          .attr("transform", d2 => {
                            return `translate(${[
                              d2.radius * Math.cos(d2.startAngle - newAngle - Math.PI),
                              d2.radius * Math.sin(d2.startAngle - newAngle - Math.PI)
                            ]})`;
                          });
                    })
                    .on("end", function (d) {
                      var endAngle = angleStart - Math.atan2(d3.event.y, d3.event.x);

                      let newAngles = d.pie.map(d2 => {
                        return {
                          ...d2,
                          startAngle: substractAngle(d2.startAngle, endAngle)
                        };
                      });

                      let closestAngle = closest(
                          newAngles.filter(
                              (tick, i) =>
                                  i < daysInMonth(yearSelected, monthSelected) || d.type !== "day"
                          ),
                          d.angleSelect,
                          "startAngle"
                      );

                      d.selected = newAngles[closestAngle].time;
                      if (d.type === "month") {
                        monthSelected = d.selected;
                      }
                      else if (d.type === "year") {
                        yearSelected = d.selected;
                      }
                      else {
                        daySelected = d.selected;
                      }
                      console.log(monthSelected);
                      d3.csv("./data/rank.csv", d3.autoType).then(function (data) {
                        let tmp = data.filter(d => d.city === daySelected);
                        let tmp1 = tmp.filter(d => d.year == Number(yearSelected));
                        container
                            .select("[id=centralText]").remove();
                        svg
                            .select("[id=centerImg]").remove();

                        var URL = './img/' + Math.floor(tmp1[0][monthSelected] / 6 + 1) + '.png';
                        let widthImage = 240, heightImage = 240
                        svg
                            .append('g')
                            .attr('id', 'centerImg')
                            .attr("transform", `translate(${(width - widthImage) / 2},${(height - heightImage) / 2})`)
                            .append('svg:image')
                            .attr('href', URL)
                            .attr('x', '0')
                            .attr('y', '0')
                            .attr('width', '250px')
                            .attr('height', '250px')
                            .on("click", valideDate);
                      });




                      let angleToAdd = newAngles[closestAngle].startAngle - d.angleSelect;

                      let clockwise = false;
                      if (angleToAdd > 2 * Math.PI - angleToAdd) {
                        angleToAdd = 2 * Math.PI - angleToAdd;
                        clockwise = true;
                      }

                      d3.select(this)
                          .selectAll(".textDate")
                          .transition()
                          .duration(200)
                          .on("end", () => {
                            d.pie.forEach((d2, i) => {
                              d2.startAngle = clockwise
                                  ? addAngle(newAngles[i].startAngle, angleToAdd)
                                  : substractAngle(newAngles[i].startAngle, angleToAdd);
                            });

                            if (d.type !== "day") {
                              updateDay();
                            }
                          })
                          .attrTween("transform", (data, i) => j =>
                              rotateCircle(
                                  newAngles[i].startAngle,
                                  angleToAdd,
                                  data.radius,
                                  j,
                                  clockwise
                              )
                          );

                      // svg
                      //   .select(`#tspan-${d.type}`)
                      //   .text(`${d.format(d.pie[closestAngle].time)} `);
                    })
            );

        fieldsG
            .append("circle")
            .attr("r", d => d.radius)
            .attr("stroke", "black")//圆圈之间连接线的颜色和不透明度
            .attr("stroke-opacity",0.5)
            .attr("fill", "none");

        const tickG = fieldsG.selectAll(".textDate").data(d => d.pie);

        const tickGEnter = tickG
            .enter()
            .append("g")
            .attr("class", "textDate")
            .attr("fill","#ffffff")//字体颜色和不透明度
            .attr("fill-opacity",1)
            .attr(
                "transform",
                d =>
                    `translate(${[
                      d.radius * Math.cos(d.startAngle - Math.PI),
                      d.radius * Math.sin(d.startAngle - Math.PI)
                    ]})`
            );

        tickGEnter
            .append("circle")
            .attr("class", d => `${d.type}-tick`)
            .attr("r", dotRadius)
            .attr("fill", "#aaaaaa")//圆圈颜色和不透明度
            .attr("fill-opacity", 0.2)
            .attr("stroke", "black")//圆圈边缘的颜色和不透明度
            .attr("stroke-opacity", 0.5);

        tickGEnter
            .append("text")
            .attr("dy", "0.35em")
            .text(d => d.time);

        fieldsG
            .append("g")
            .attr("id", d => `handle-${d.type}`)
            .attr(
                "transform",
                d =>
                    `translate(${[
                      d.radius * Math.cos(d.angleSelect - Math.PI),
                      d.radius * Math.sin(d.angleSelect - Math.PI)
                    ]})`
            )
            .call(
                d3
                    .drag()
                    .on("drag", function (d, i) {
                      var newAngle = Math.atan2(d3.event.y, d3.event.x) + Math.PI;
                      d.angleSelect = newAngle;
                      d3.select(this).attr(
                          "transform",
                          `translate(${[
                            d.radius * Math.cos(newAngle - Math.PI),
                            d.radius * Math.sin(newAngle - Math.PI)
                          ]})`
                      );
                    })
                    .on("end", function (d) {

                      let closestAngle = closest(
                          d.pie.filter(
                              (tick, i) =>
                                  i < daysInMonth(yearSelected, monthSelected) || d.type !== "day"
                          ),
                          d.angleSelect,
                          "startAngle"
                      );

                      let angleToAdd = substractAngle(
                          d.angleSelect,
                          d.pie[closestAngle].startAngle
                      );

                      d.selected = d.pie[closestAngle].time;
                      console.log(d.selected);


                      if (d.type === "month") {
                        monthSelected = d.selected;
                      }
                      else if (d.type === "year") {
                        yearSelected = d.selected;
                      }
                      else {
                        daySelected = d.selected;
                      }
                      console.log(monthSelected);
                      d3.csv("./data/rank.csv", d3.autoType).then(function (data) {
                        let tmp = data.filter(d => d.city === daySelected);
                        let tmp1 = tmp.filter(d => d.year == Number(yearSelected));
                        container
                            .select("[id=centralText]").remove();
                        svg
                            .select("[id=centerImg]").remove();
                        // container
                        //   .append("text").attr("id", "centralText")
                        //   .text(tmp1[0][monthSelected])
                        //   .style("font", "700 40px 'Helvetica Neue'")
                        //   .attr("cursor", "pointer")
                        //   .attr("dy", "0.35em")
                        //   .on("click", valideDate);

                        var URL = './img/' + Math.floor(tmp1[0][monthSelected] / 6 + 1) + '.png';
                        console.log(URL);
                        let widthImage = 240, heightImage = 240
                        svg
                            .append('g')
                            .attr('id', 'centerImg')
                            .attr("transform", `translate(${(width - widthImage) / 2},${(height - heightImage) / 2})`)
                            .append('svg:image')
                            .attr('href', URL)
                            .attr('x', '0')
                            .attr('y', '0')
                            .attr('width', '250px')
                            .attr('height', '250px')
                            .on("click", valideDate);
                      });


                      let clockwise = false;
                      if (angleToAdd > 2 * Math.PI - angleToAdd) {
                        angleToAdd = 2 * Math.PI - angleToAdd;
                        clockwise = true;
                      }

                      svg
                          .select(`#tspan-${d.type}`)
                          .text(`${d.format(d.pie[closestAngle].time)} `);

                      d3.select(this)
                          .transition()
                          .duration(200)
                          .on("end", () => {
                            d.angleSelect = clockwise
                                ? addAngle(d.angleSelect, angleToAdd)
                                : substractAngle(d.angleSelect, angleToAdd);

                            if (d.type !== "day") {
                              updateDay();
                            }
                          })
                          .attrTween("transform", data => i =>
                              rotateCircle(d.angleSelect, angleToAdd, d.radius, i, clockwise)
                          );
                    })
            )
            .append("circle")
            .attr("r", dotRadius)
            .attr("class", "handle")
            .attr("fill", "red")//选中的圆圈的颜色和不透明度
            .attr("fill-opacity", 0.2)
            .attr("stroke", "red")//选中的圆圈边缘的颜色和不透明度
            .attr("stroke-width", 2)
            .attr("cursor", "move");

        function valideDate() {
          let date = { year: 2000, month: 1, day: 1, hour: 0, minute: 0, seconde: 0 };
          fieldsG.each(function (d, n) {
            let clockwise = false;
            let newAngle = d.angleSelect;
            if (d.angleSelect > 2 * Math.PI - d.angleSelect) {
              newAngle = 2 * Math.PI - d.angleSelect;
              clockwise = true;
            }

            date[d.type] = d.selected;

            d3.select(this)
                .selectAll(".textDate")
                .transition()
                .duration(1000)
                .ease(d3.easeQuadInOut)
                .delay(n * (animationDelay ? 900 : 0))
                .on("end", function (data) {
                  data.startAngle = clockwise
                      ? addAngle(data.startAngle, newAngle)
                      : substractAngle(data.startAngle, newAngle);
                })
                .attrTween("transform", data => i =>
                    rotateCircle(data.startAngle, newAngle, d.radius, i, clockwise)
                );

            d3.select(this)
                .select(`#handle-${d.type}`)
                .transition()
                .on("end", function () {
                  d.angleSelect = 0;
                })
                .duration(1000)
                .ease(d3.easeQuadInOut)
                .delay(n * (animationDelay ? 900 : 0))
                .attrTween("transform", data => i =>
                    rotateCircle(d.angleSelect, newAngle, d.radius, i, clockwise)
                );
          });

          svg.node().value = `${date.year}-${date.month}-${date.day}T${date.hour}:${date.minute
          }:${date.seconde}`;
          svg.node().dispatchEvent(new CustomEvent("input"));
        }

        function rotateCircle(startAngle, endAngle, radius, i, clockwise) {
          let currentAngle = endAngle * i;
          return `translate(${[
            radius *
            Math.cos(
                substractAngle(
                    clockwise ? startAngle + currentAngle : startAngle - currentAngle,
                    Math.PI
                )
            ),
            radius *
            Math.sin(
                substractAngle(
                    clockwise ? startAngle + currentAngle : startAngle - currentAngle,
                    Math.PI
                )
            )
          ]})`;
        }

        updateDay();

        function updateDay() {
          d3.selectAll(".day-tick")
              .filter((day, i) => i >= daysInMonth(yearSelected, monthSelected))
              .transition()
              .attr("fill", "#aaaaaa");

          d3.selectAll(".day-tick")
              .filter((day, i) => i < daysInMonth(yearSelected, monthSelected))
              .transition()
              .duration(200);
          // .attr("fill", "white");

          fieldsG
              .filter(d => d.type === "day")
              .each(d => {
                if (parseInt(d.selected) > daysInMonth(yearSelected, monthSelected)) {
                  let closestAngle = closest(
                      d.pie.filter(
                          (tick, i) =>
                              i < daysInMonth(yearSelected, monthSelected) || d.type !== "day"
                      ),
                      d.angleSelect,
                      "startAngle"
                  );

                  let angleToAdd = substractAngle(
                      d.angleSelect,
                      d.pie[closestAngle].startAngle
                  );

                  d.selected = d.pie[closestAngle].time;


                  let clockwise = false;
                  if (angleToAdd > 2 * Math.PI - angleToAdd) {
                    angleToAdd = 2 * Math.PI - angleToAdd;
                    clockwise = true;
                  }

                  svg
                      .select(`#handle-day`)
                      .transition()
                      .duration(200)
                      .on("end", () => {
                        d.angleSelect = clockwise
                            ? addAngle(d.angleSelect, angleToAdd)
                            : substractAngle(d.angleSelect, angleToAdd);

                        if (d.type !== "day") {
                          updateDay();
                        }
                      })
                      .attrTween("transform", data => i =>
                          rotateCircle(d.angleSelect, angleToAdd, d.radius, i, clockwise)
                      );
                }
              });
        }

        return svg.node();
      }
  );
  main.variable(observer("datePicker")).define("datePicker", ["Generators", "viewof datePicker"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`Date picked :`
    )
  });
  main.variable(observer("date")).define("date", ["format", "datePicker"], function (format, datePicker) {
    return (
        format(datePicker)
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`Check the box below to add hours, minutes and seconds`
    )
  });
  main.variable(observer("viewof hmsCheck")).define("viewof hmsCheck", ["html"], function (html) {
    return (
        // html`<input type="checkbox">`
        html `<input hidden>`
    )
  });
  main.variable(observer("hmsCheck")).define("hmsCheck", ["Generators", "viewof hmsCheck"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`### Utils`
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`#### Variables`
    )
  });
  main.variable(observer("width")).define("width", function () {
    return (
        964
    )
  });
  main.variable(observer("height")).define("height", ["width"], function (width) {
    return (
        width
    )
  });
  main.variable(observer("radius")).define("radius", ["width"], function (width) {
    return (
        width / 1.7
    )
  });
  main.variable(observer("dotRadius")).define("dotRadius", ["armRadius"], function (armRadius) {
    return (
        //调整圆圈的大小
        armRadius + 4
    )
  });
  main.variable(observer("armRadius")).define("armRadius", ["radius"], function (radius) {
    return (
        radius / 25
    )
  });
  main.variable(observer("pie")).define("pie", ["d3"], function (d3) {
    return (
        d3
            .pie()
            .sort(null)
            .value(d => 1)
    )
  });
  main.variable(observer("format")).define("format", ["d3"], function (d3) {
    return (
        d3.timeParse("%Y-%b-%dT%H:%M:%S")
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`#### Functions`
    )
  });
  main.variable(observer("substractAngle")).define("substractAngle", function () {
    return (
        function substractAngle(a1, a2) {
          return (2 * Math.PI + (a1 - a2)) % (2 * Math.PI)
        }
    )
  });
  main.variable(observer("addAngle")).define("addAngle", function () {
    return (
        function addAngle(a1, a2) {
          return (2 * Math.PI + (a1 + a2)) % (2 * Math.PI)
        }
    )
  });
  main.variable(observer("daysInMonth")).define("daysInMonth", ["d3"], function (d3) {
    return (
        function daysInMonth(year, month) {
          let formatMonth = d3.timeParse("%b");
          return new Date(year, formatMonth("Jan").getMonth() + 1, 0).getDate();
        }
    )
  });
  main.variable(observer("closest")).define("closest", function () {
    return (
        function closest(array, num, key) {
          var i = 0;
          var minDiff = 10000;
          var ans;
          for (i in array) {
            var m = Math.min(
                Math.abs(num - array[i][key]),
                2 * Math.PI - Math.abs(num - array[i][key])
            );
            if (m < minDiff) {
              minDiff = m;
              ans = i;
            }
          }

          return ans;
        }
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`### Data`
    )
  });
  main.variable(observer("fields")).define("fields", ["radius", "d3", "hmsCheck", "pie"], function (radius, d3, hmsCheck, pie) {
        console.log(d3.timeYear);
        console.log(d3.timeMonth);
        console.log(d3.timeDay);
        let dmy = [
          {
            type: "day",
            radius: 0.63 * radius,
            interval: d3.timeMonth,
            subinterval: d3.timeDay,
            format: d3.timeFormat("%d")
          },
          {
            type: "month",
            radius: 0.47 * radius,
            interval: d3.timeYear,
            subinterval: d3.timeMonth,
            format: d3.timeFormat("%b")
          },
          {
            type: "year",
            radius: 0.30 * radius,
            interval: d3.timeYear,
            subinterval: d3.timeYear,
            format: d3.timeFormat("%Y")
          }
        ];

        let data = [];
        let dimension = [['city', 'id', 'year', 'index'],
          ['北京', 'BEJ', '2010', '1-1'],
          ['天津', 'TAJ', '2011', '1-2'],
          ['河北', 'HEB', '2012', '1-3'],
          ['山西', 'SHX', '2013', '1-4'],
          ['内蒙古', 'NMG', '2014', '2-1'],
          ['辽宁', 'LIA', '2015', '2-2'],
          ['吉林', 'JIL', '2016', '2-3'],
          ['黑龙江', 'HLJ', '2017', '2-4'],
          ['上海', 'SHH', '2018', '2-5'],
          ['江苏', 'JSU', '2019', '3-1'],
          ['浙江', 'ZHJ', '', '3-2'],
          ['安徽', 'ANH', '', '3-3'],
          ['福建', 'FUJ', '', '3-4'],
          ['江西', 'JXI', '', '3-5'],
          ['山东', 'SHD', '', '3-6'],
          ['河南', 'HEN', '', '4-1'],
          ['湖北', 'HUB', '', '4-2'],
          ['湖南', 'HUN', '', '4-3'],
          ['广东', 'GUD', '', '4-4'],
          ['广西', 'GXI', '', ''],
          ['海南', 'HAI', '', ''],
          ['重庆', 'CHQ', '', ''],
          ['四川', 'SCH', '', ''],
          ['贵州', 'GUI', '', ''],
          ['云南', 'YUN', '', ''],
          ['西藏', 'TIB', '', ''],
          ['陕西', 'SHA', '', ''],
          ['甘肃', 'GAN', '', ''],
          ['青海', 'QIH', '', ''],
          ['宁夏', 'NXA', '', ''],
          ['新疆', 'XIN', '', ''],
        ];

        dmy.map((d, i) => {
          const date = d.interval(new Date(new Date().getFullYear() - 5, 0, 1));
          let name = [];


          // console.log(dimension);
          if (d.type === "year") {
            var i = 0;
            d.range = d3.range(10).map((i) => {
              i++;
              return dimension[i][2];
              // return i;
            });
          }
          else if (d.type === "month") {
            var i = 0;
            d.range = d3.range(19).map((i) => {
              i++;
              return dimension[i][3];
            });
          }
          else {
            var i = 0;
            d.range = d3.range(31).map((i) => {
              i++;
              return dimension[i][0];
            });
          }

          console.log(d);
          let tmp1 = d.range;
          console.log(tmp1[0]);

          data.push({
            type: d.type,
            radius: d.radius,
            angleSelect: 0,
            selected: d.format(d.range[0]),
            format: d.format,
            subinterval: d.subinterval,
            interval: d.interval,
            pie: pie(tmp1.map((t) => ({ time: t, field: d }))).map((d2) => ({
              startAngle: d2.startAngle,
              time: d2.data.time,
              radius: d.radius,
              type: d.type
            }))
          });
        });


        console.log(data);

        return data;
      }
  );
  main.variable(observer()).define(["md"], function (md) {
    return (
        md`### Import`
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
        require("d3@5")
    )
  });
  return main;
}
