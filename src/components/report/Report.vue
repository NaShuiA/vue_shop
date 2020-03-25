<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片视图 -->
    <el-card>
      <!-- 2.放置区域 -->
      <div id="main" style="width: 750px;height:600px"></div>
    </el-card>
  </div>
</template>

<script>
// 导入 echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  // 页面元素渲染完毕
  async mounted () {
    // 基于准备好的dom 初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$messgae.error('获取折线图数据失败')
    // 使用lodash合并对象
    // 4.准备数据和配置项
    const result = _.merge(res.data, this.options)
    // 5.展示数据
    myChart.setOption(result)
    console.log(result)
  }
}
</script>
