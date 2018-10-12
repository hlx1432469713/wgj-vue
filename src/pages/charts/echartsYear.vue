<!--<template>-->
    <!--<section class="chart">-->
        <!--<el-row>-->
            <!--<el-col :span="12">-->
                <!--<div id="chartColumn" style="width:100%; height:400px;"></div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
                <!--<div id="chartBar" style="width:100%; height:400px;"></div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
                <!--<div id="chartLine" style="width:100%; height:400px;"></div>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
                <!--<div id="chartPie" style="width:100%; height:400px;"></div>-->
            <!--</el-col>-->
            <!--<el-col :span="24">-->
                <!--<a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>-->
            <!--</el-col>-->
        <!--</el-row>-->
    <!--</section>-->
<!--</template>-->

<!--<script>-->
    <!--import echarts from 'echarts'-->

    <!--import getOrderByYear from '../../api/api';-->
    <!--import axios from 'axios';-->

    <!--export default{-->
        <!--data (){-->
            <!--param_num:[]-->
            <!--year_num:[]/**这应该是接收返回值的数组 */-->
            <!--//初始化给后台传递的参数数组-->
            <!--return {-->
                <!--chartColumn:null,-->
                <!--chartBar:null,-->

            <!--}-->
        <!--},-->
        <!--mounted:function(){-->
            <!--/**-->
             <!--* 传递年份-->
             <!--*/-->
            <!--let param ={-->
                <!--param_num:[2016,2017,2018,2019,2020]-->
            <!--}-->
            <!--axios.post(`/admin/count/getOrderByYear`, param).then((res)=>{-->
                <!--this.year_num=res.data.result;-->
                <!--var _this=this;-->
                <!--//基于准备好的dom，初始化echarts实例-->
                <!--this.chartColumn = echarts.init(document.getElementById('chartColumn'));-->


                <!--this.chartColumn.setOption({-->
                    <!--title: { text: '年份统计图' },-->
                    <!--tooltip: {},-->
                    <!--xAxis: {-->
                        <!--data: ["2016","2017","2018","2019","2020"],-->
                        <!--axisLine:{-->

                            <!--symbol:['none','arrow'],-->
                            <!--symbolSize: [5, 5],//箭头-->
                            <!--symbolOffset: [0, 15],-->

                        <!--}-->
                    <!--},-->

                    <!--yAxis: { axisLine:{-->

                            <!--symbol:['none','arrow'],-->
                            <!--symbolSize: [5, 5],//箭头-->
                            <!--symbolOffset: [0, 15],-->

                        <!--}},-->
                    <!--series: [{-->
                        <!--name: '服务次数',-->
                        <!--type: 'bar',-->
                        <!--data: this.year_num,//5, 20, 36, 10, 10, 20-->
                        <!--barWidth : 50-->
                    <!--}]-->
                <!--});-->



            <!--});-->

        <!--}-->

    <!--}-->
<!--</script>-->

<!--<style scoped>-->
    <!--.chart {-->
        <!--width: 100%;-->
        <!--float: left;-->
    <!--}-->


    <!--.el-col {-->
        <!--padding: 30px 20px;-->
    <!--}-->
<!--</style>-->