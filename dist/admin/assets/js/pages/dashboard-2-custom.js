// Dashboard 2 Custom JavaScript for React Integration

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Ensure ins function is available
if (typeof window.ins === 'undefined') {
  window.ins = function(color, opacity = 1) {
    const colors = {
      'primary': '#3b7ddd',
      'secondary': '#6c757d',
      'success': '#28a745',
      'danger': '#dc3545',
      'warning': '#ffc107',
      'info': '#17a2b8',
      'light': '#f8f9fa',
      'dark': '#343a40',
      'secondary-bg': '#f8f9fa',
      'border-color': '#dee2e6',
      'light-text-emphasis': '#6c757d',
      'secondary-color': '#6c757d'
    };
    return colors[color] || color;
  };
}

function generateRandomData() {
  var data = ["A", "B", "C"].map(name => ({
    name: name,
    value: Math.floor(Math.random() * 100) + 1
  }));
  
  let total = data.reduce((sum, item) => sum + item.value, 0);
  data.forEach(item => {
    item.value = (item.value / total) * 100;
  });
  
  return data;
}

// Global function to initialize donut charts
window.initDonutChart = function(selector) {
  if (typeof echarts === 'undefined') {
    console.warn('ECharts not available for donut chart');
    return;
  }
  
  let data = generateRandomData();
  let chartElement = document.querySelector(selector);
  
  if (!chartElement) {
    console.warn('Donut chart element not found:', selector);
    return;
  }
  
  let chart = echarts.init(chartElement);
  
  let option = {
    tooltip: {
      show: false
    },
    series: [{
      type: 'pie',
      radius: ['65%', '100%'],
      hoverAnimation: false,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: data.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: index === 0 ? window.ins('primary') : index === 1 ? window.ins('secondary') : '#bbcae14d'
        }
      }))
    }]
  };
  
  chart.setOption(option);
};

// Global function to initialize orders chart
window.initOrdersChart = function() {
  if (typeof echarts === 'undefined') {
    console.warn('ECharts not available for orders chart');
    return;
  }
  
  let chartElement = document.getElementById('orders-chart');
  if (!chartElement) {
    console.warn('Orders chart element not found');
    return;
  }
  
  let chart = echarts.init(chartElement);
  
  let category = [];
  let today = new Date();
  let completedOrders = [];
  let processingOrders = [];
  let cancelledOrders = [];

  for (let i = -14; i <= 0; i++) {
    let date = new Date();
    date.setDate(today.getDate() + i);
    let dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    
    category.push(dateStr);
    completedOrders.push(Math.floor(Math.random() * 200));
    processingOrders.push(Math.floor(Math.random() * 150));
    cancelledOrders.push(Math.floor(Math.random() * 50));
  }

  let option = {
    textStyle: {
      fontFamily: getComputedStyle(document.body).fontFamily
    },
    tooltip: {
      trigger: 'axis',
      padding: [8, 15],
      backgroundColor: window.ins('secondary-bg'),
      borderColor: window.ins('border-color'),
      textStyle: {
        color: window.ins('light-text-emphasis')
      },
      borderWidth: 1,
      transitionDuration: 0.125,
      axisPointer: {
        type: 'none'
      },
      shadowBlur: 2,
      shadowColor: 'rgba(76, 76, 92, 0.15)',
      shadowOffsetX: 0,
      shadowOffsetY: 1,
      formatter: function(params) {
        var date = new Date();
        date.setDate(today.getDate() - 14 + params[0].dataIndex);
        let dateStr = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        return '<div class="mb-1 text-body">' + dateStr + '</div>' +
          params.map(param => param.marker + ' ' + param.seriesName + ': <span class="fw-bold">' + param.value + '</span> Orders').join('<br/>');
      }
    },
    legend: {
      data: ['Completed', 'Processing', 'Cancelled'],
      top: 15,
      textStyle: {
        color: window.ins('body-color')
      }
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: window.ins('border-color')
        }
      },
      axisLabel: {
        show: true,
        color: window.ins('secondary-color')
      },
      splitLine: {
        lineStyle: {
          color: window.ins('border-color'),
          type: 'dashed'
        }
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: window.ins('border-color')
        }
      },
      axisLabel: {
        show: true,
        color: window.ins('secondary-color')
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: window.ins('border-color'),
          type: 'dashed'
        }
      }
    },
    grid: {
      left: 25,
      right: 25,
      bottom: 25,
      top: 60,
      containLabel: true
    },
    series: [{
      name: 'Completed',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: window.ins('success')
      },
      showAllSymbol: true,
      symbol: 'emptyCircle',
      symbolSize: 5,
      data: completedOrders
    }, {
      name: 'Processing',
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
        color: window.ins('secondary')
      },
      data: processingOrders
    }, {
      name: 'Cancelled',
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        borderRadius: [5, 5, 0, 0],
        color: '#bbcae14d'
      },
      data: cancelledOrders
    }]
  };
  
  chart.setOption(option);
};

// Global function to initialize world map
window.initWorldMap = function() {
  // Check if map is already initialized
  const mapElement = document.getElementById('map_1');
  if (!mapElement || mapElement.hasAttribute('data-initialized')) {
    return;
  }
  
  // Check if jsVectorMap is available
  if (typeof jsVectorMap === 'undefined') {
    console.warn('jsVectorMap not available');
    return;
  }
  
  try {
    let map = new jsVectorMap({
      map: 'world',
      selector: '#map_1',
      zoomOnScroll: true,
      zoomButtons: false,
      selectedMarkers: [1, 1],
      markersSelectable: true,
      selectedRegions: ['CA', 'US', 'AU'],
      regionStyle: {
        initial: {
          stroke: '#a2abbd',
          strokeWidth: 0.5,
          fillOpacity: 0.1
        },
        selected: {
          fill: window.ins('primary')
        }
      },
      markers: [
        {
          name: 'Russia',
          coords: [61.524, 105.3188]
        },
        {
          name: 'Canada',
          coords: [56.1304, -106.3468],
          style: {
            initial: {
              image: '/assets/images/location-pin.png'
            }
          }
        },
        {
          name: 'Australia',
          coords: [-25.2744, 133.7751]
        },
        {
          name: 'Greenland',
          coords: [71.7069, -42.6043]
        }
      ],
      lines: [
        {
          from: 'Russia',
          to: 'Canada'
        },
        {
          from: 'Australia',
          to: 'Canada'
        },
        {
          from: 'Greenland',
          to: 'Canada'
        },
        {
          from: 'Brazil',
          to: 'Canada'
        }
      ],
      markerStyle: {
        initial: {
          fill: window.ins('primary'),
          stroke: window.ins('primary'),
          fillOpacity: 0.3,
          strokeWidth: 2,
          r: 2
        },
        selected: {
          fill: window.ins('primary'),
          stroke: window.ins('primary'),
          strokeWidth: 1
        }
      },
      labels: {
        markers: {
          render: function(marker) {
            return marker.name;
          }
        }
      },
      lineStyle: {
        animation: true,
        strokeDasharray: '6 3 6'
      }
    });
    
    // Mark as initialized
    mapElement.setAttribute('data-initialized', 'true');
    console.log('World map initialized successfully');
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
      if (typeof map !== 'undefined' && map) {
        map.updateSize();
      }
    }, 200));
    
  } catch (error) {
    console.error('Error initializing world map:', error);
  }
};

// Show welcome toast (without bootstrap dependency)
function showToast() {
  console.log('Welcome to Tedara - E-commerce Platform Dashboard!');
}

// Auto-show toast after 2 seconds
setTimeout(showToast, 2000);
