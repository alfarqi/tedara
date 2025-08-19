// Chart initialization functions for the dashboard
(function() {
  'use strict';
  
  // Check if ins function already exists to avoid redeclaration
  if (typeof window.ins === 'undefined') {
    window.ins = function(e, t = 1) {
      var a = getComputedStyle(document.documentElement).getPropertyValue("--ins-" + e).trim();
      return e.includes("-rgb") ? `rgba(${a}, ${t})` : a;
    };
  }
  
  let xLabels = Array.from({length: 15}, (e, o) => "Day " + (o + 1));

  function generateRandomData() {
    var e = ["Charity A", "Charity B", "Charity C"].map(e => ({
      name: e,
      value: Math.floor(100 * Math.random()) + 1
    }));
    let o = e.reduce((e, o) => e + o.value, 0);
    e.forEach(e => {
      e.value = e.value / o * 100
    });
    return e;
  }

  // Initialize donut charts
  window.initDonutChart = function(selector) {
    if (typeof CustomEChart === 'undefined') {
      console.warn('CustomEChart not available');
      return;
    }
    
    let o = generateRandomData();
    new CustomEChart({
      selector: selector,
      options: () => ({
        tooltip: {
          show: false
        },
        series: [{
          type: "pie",
          radius: ["60%", "100%"],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: o.map((e, o) => ({
            value: e.value,
            itemStyle: {
              color: o === 0 ? window.ins("primary") : o === 1 ? window.ins("secondary") : "#bbcae14d"
            }
          }))
        }]
      })
    });
  };

  // Initialize orders chart
  window.initOrdersChart = function() {
    if (typeof CustomEChart === 'undefined') {
      console.warn('CustomEChart not available');
      return;
    }
    
    new CustomEChart({
      selector: "#orders-chart",
      options: () => ({
        textStyle: {
          fontFamily: getComputedStyle(document.body).fontFamily
        },
        tooltip: {
          trigger: "axis",
          padding: [5, 0],
          backgroundColor: window.ins("secondary-bg"),
          borderColor: window.ins("border-color"),
          textStyle: {
            color: window.ins("light-text-emphasis")
          },
          borderWidth: 1,
          transitionDuration: 0.125,
          axisPointer: {
            type: "none"
          },
          shadowBlur: 2,
          shadowColor: "rgba(76, 76, 92, 0.15)",
          shadowOffsetX: 0,
          shadowOffsetY: 1,
          formatter: function(e) {
            var o = e[0].name;
            let t = `<div style="font-size: 14px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid ${window.ins("border-color")}; margin-bottom: 8px; padding: 3px 10px 8px;">${o}</div>`;
            e.forEach(e => {
              var o = e.seriesName === "Total Revenue" ? "$" + e.value : e.value + " sales";
              t += `<div style="margin-top: 4px; padding: 3px 15px;">
                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${e.color};"></span>
                ${e.seriesName} : <strong>${o}</strong>
              </div>`
            });
            return t;
          }
        },
        xAxis: {
          type: "category",
          data: xLabels,
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: window.ins("secondary-color"),
            margin: 15
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#676b891f",
              type: "dashed"
            }
          },
          boundaryGap: false,
          axisLabel: {
            show: true,
            color: window.ins("secondary-color"),
            margin: 15,
            formatter: function(e) {
              return "$" + e;
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [{
          name: "Total Revenue",
          type: "line",
          smooth: true,
          symbolSize: 2,
          itemStyle: {
            color: window.ins("primary"),
            borderColor: window.ins("primary"),
            borderWidth: 2
          },
          areaStyle: {
            opacity: 0.2,
            color: window.ins("primary")
          },
          lineStyle: {
            color: window.ins("primary")
          },
          symbol: "circle",
          stack: "data",
          data: [45, 88, 120, 160, 210, 240, 350, 420, 380, 500, 640, 710, 890, 1150, 1200]
        }, {
          name: "Orders",
          type: "line",
          smooth: true,
          symbolSize: 2,
          itemStyle: {
            color: window.ins("secondary"),
            borderColor: window.ins("secondary"),
            borderWidth: 2
          },
          areaStyle: {
            opacity: 0.2,
            color: window.ins("secondary")
          },
          lineStyle: {
            color: window.ins("secondary")
          },
          symbol: "circle",
          stack: "data",
          data: [15, 30, 35, 50, 55, 75, 95, 120, 135, 160, 180, 210, 250, 390, 450]
        }],
        grid: {
          right: 20,
          left: 5,
          bottom: 5,
          top: 8,
          containLabel: true
        }
      })
    });
  };

  // Initialize world map (placeholder)
  window.initWorldMap = function() {
    // This is a placeholder - implement if needed
    console.log('World map initialization called');
  };
})();
