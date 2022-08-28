const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function(locals) {
    const $ = cheerio.load(locals)
    const post = $('#posts-chart')
    const tag = $('#tags-chart')
    const category = $('#categories-chart')
    const htmlEncode = false

    if (post.length > 0 || tag.length > 0 || category.length > 0) {
        if (post.length > 0 && $('#postsChart').length === 0) {
            if (post.attr('data-encode') === 'true') htmlEncode = true
            post.after(postsChart(post.attr('data-start')))
        }
        if (tag.length > 0 && $('#tagsChart').length === 0) {
            if (tag.attr('data-encode') === 'true') htmlEncode = true
            tag.after(tagsChart(tag.attr('data-length')))
        }
        if (category.length > 0 && $('#categoriesChart').length === 0) {
            if (category.attr('data-encode') === 'true') htmlEncode = true
            category.after(categoriesChart())
        }

        if (htmlEncode) {
            return $.root().html().replace(/&amp;#/g, '&#')
        } else {
            return $.root().html()
        }
    } else {
        return locals
    }
}, 15)

function postsChart(startMonth) {
    const startDate = moment(startMonth || '2020-01')
    const endDate = moment()

    const monthMap = new Map()
    const dayTime = 3600 * 24 * 1000
    for (let time = startDate; time <= endDate; time += dayTime) {
        const month = moment(time).format('YYYY-MM')
        if (!monthMap.has(month)) {
            monthMap.set(month, 0)
        }
    }
    hexo.locals.get('posts').forEach(function(post) {
        const month = post.date.format('YYYY-MM')
        if (monthMap.has(month)) {
            monthMap.set(month, monthMap.get(month) + 1)
        }
    })
    const monthArr = JSON.stringify([...monthMap.keys()])
    const monthValueArr = JSON.stringify([...monthMap.values()])

    return `
  <script id="postsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var postsChart = echarts.init(document.getElementById('posts-chart'), 'light');
    var postsOption = {
      title: {
        text: '文章发布统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${monthArr}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        nameTextStyle: {
          color: color
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'line',
        smooth: true,
        lineStyle: {
            width: 0
        },
        showSymbol: false,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          }, {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        data: ${monthValueArr},
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              position: 'end',
              color: color
            }
          }]
        }
      }]
    };
    postsChart.setOption(postsOption);
    postsChart.on('click', 'series', (event) => {
      window.location.href = '/archives';
    });
    window.addEventListener('resize', () => { 
      postsChart.resize();
    });
  </script>`
}

function tagsChart(len) {
    const tagArr = []
    hexo.locals.get('tags').map(function(tag) {
        tagArr.push({ name: tag.name, value: tag.length })
    })
    tagArr.sort((a, b) => { return b.value - a.value })

    const dataLength = Math.min(tagArr.length, len) || tagArr.length
    const tagNameArr = []
    const tagCountArr = []
    for (let i = 0; i < dataLength; i++) {
        tagNameArr.push(tagArr[i].name)
        tagCountArr.push(tagArr[i].value)
    }
    const tagNameArrJson = JSON.stringify(tagNameArr)
    const tagCountArrJson = JSON.stringify(tagCountArr)

    return `
  <script id="tagsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var tagsChart = echarts.init(document.getElementById('tags-chart'), 'light');
    var tagsOption = {
      title: {
        text: 'Top ${dataLength} 标签统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLabel: {
          interval:0,
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${tagNameArrJson}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'bar',
        data: ${tagCountArrJson},
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(128, 255, 195)'
            },
            {
              offset: 1,
              color: 'rgba(1, 211, 255)'
            }])
          }
        },
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              position: 'end',
              color: color
            }
          }]
        }
      }]
    };
    setRotate();
    window.addEventListener('resize', () => { 
      setRotate();
      tagsChart.resize();
    });
    function setRotate() {
      if (document.body.clientWidth<=768) {
        tagsOption.xAxis.axisLabel.rotate = -90
      }else{
        tagsOption.xAxis.axisLabel.rotate = 0
      }
      tagsChart.setOption(tagsOption)
    }
    tagsChart.on('click', 'series', (event) => {
      let href = ''
      if (event.name == '平均值') href = '/tags';
      else href = '/tags/' + event.name;
      window.location.href = href;
    });
  </script>`
}

function categoriesChart() {
    const categoryArr = []
    hexo.locals.get('categories').map(function(category) {
        categoryArr.push({ name: category.name, value: category.length })
    })
    categoryArr.sort((a, b) => { return b.value - a.value });
    const categoryArrJson = JSON.stringify(categoryArr)

    return `
  <script id="categoriesChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var categoriesChart = echarts.init(document.getElementById('categories-chart'), 'light');
    var categoriesOption = {
      title: {
        text: '文章分类统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      legend: {
        type: 'scroll',
        top: 'bottom',
        textStyle: {
          color: color
        },
        pageIconColor: "#49b1f5",
        pageTextStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [{
        name: '文章篇数',
        type: 'pie',
        radius: [30, 80],
        center: ['50%', '50%'],
        label: {
          color: color,
          formatter: '{b}'
        },    
        labelLine: {
          show: true,
          length: 10,
          length2: 5
        },
        data: ${categoryArrJson},
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }]
    };
    function setLine() {
      if (document.body.clientWidth<=768) {
        categoriesOption.series[0].labelLine.length = 10
        categoriesOption.series[0].labelLine.length2 = 5
      }else{
        categoriesOption.series[0].labelLine.length = 20
        categoriesOption.series[0].labelLine.length2 = 30
      }
      categoriesChart.setOption(categoriesOption);
    }
    setLine();
    window.addEventListener('resize', () => { 
      setLine();
      categoriesChart.resize();
    });
    categoriesChart.on('click', 'series', (event) => {
      let href = '/categories/' + event.name + '/';
      window.location.href = href;
    });
  </script>`
}
