<template>
    <section class="chart">
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item label="选择年份">
                        <el-date-picker v-model="yearOne" type="year" placeholder="选择年份" style="width: 100%;"
                                        format="yyyy 年 "
                                        value-format="yyyy">
                        </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMonthOrderInfoByOne()">查询</el-button>
                </el-form-item><br>
                <el-form-item label="选择年份区间">
                        <el-date-picker
                                v-model="yearTwo"
                                type="year"
                                placeholder="选择年份"
                                style="width: 100%;"
                                format="yyyy 年 "
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    <el-col class="line" >&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
                </el-form-item>
                <el-form-item label="">
                        <el-date-picker
                                v-model="yearThree"
                                type="year"
                                placeholder="选择年份"
                                style="width: 100%;"
                                format="yyyy 年 "
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMonthOrderInfoByTwo()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12">
            <div id="chartBar" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
        </el-col>

    </section>
</template>

<script>
    import echarts from 'echarts'
    import {getMonthOrderInfoByYear} from '../../api/api';
    import axios from 'axios';
    var moment = require('moment');
    export default{
        data (){
            //初始化给后台传递的参数数组
            return {
                yearOne:'',
                yearTwo:'',
                yearThree:'',
                param_num:[],
                year_num:[]/**这应该是接收返回值的数组 */,
                chartColumn:null,
                chartBar:null,
                filters: {

                },

            }
        },
        methods: {
            formatDate(date) {
                if (date != null) {
                    var date = new Date(date);
                    //格式化年月日
                    let y = date.getFullYear();
                    return `${y}`
                }
                return null;
            },
            getMonthOrderInfoByOne() {
                var start = '';
                if (this.yearOne != null && this.yearOne != '') {
                    start = this.formatDate(this.yearOne)
                    if (start == 'null') {
                        start = null
                    }
                }
                else
                    start = ''
                let param = {
                    paramNum: [start]
                }
                getMonthOrderInfoByYear(param).then((res) => {
                   // console.log(res.result)
                    for (var i = 0; i < res.result.length; i++) {
                        this.year_num[i] = res.result[i];
                    }
                    if (this.year_num[0] != null) {
                        this.chartBar = echarts.init(document.getElementById('chartBar'));
                        this.chartBar.setOption({
                            title: {
                                text: start + '年度月份统计报表',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: [start]
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                            },
                            yAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            series: [
                                {
                                    name: start,
                                    type: 'bar',
                                    data: this.year_num[0]
                                }

                            ]
                        });

                    }
                    else
                        this.$notify.error({
                            title: '查询失败！',
                            message: "您未选择年份或者该年份没有数据存在，请选择新的年份！",
                            type: 'error'
                        });
                });
            },
            getMonthOrderInfoByTwo() {
                var start = '';
                var end = '';
                if (this.yearTwo != null && this.yearTwo != '' && this.yearThree != null && this.yearThree != '') {
                    start = this.formatDate(this.yearTwo)
                    end = this.formatDate(this.yearThree)
                    if (start == 'null') {
                        start = null
                    }
                    if (end == 'null') {
                        end = null
                    }
                }
                else {
                    start = ''
                    end = ''
                }
                let param = {
                    paramNum: [start,end]
                }
                console.log(param)
                getMonthOrderInfoByYear(param).then((res) => {
                    // console.log(param)
                    // console.log(res.result)

                    for (var i = 0; i < res.result.length; i++) {
                        this.year_num[i] = res.result[i];
                    }
                    if (this.year_num[0] != null&&this.year_num[1]!=null) {
                        this.chartBar = echarts.init(document.getElementById('chartColumn'));
                        this.chartBar.setOption({
                            title: {
                                text: start + '-' + end + '年度月份统计报表',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: [start, end]
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                            },
                            yAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            series: [
                                {
                                    name: start,
                                    type: 'bar',
                                    data: this.year_num[0]
                                },
                                {
                                    name: end,
                                    type: 'bar',
                                    data: this.year_num[1]
                                },

                            ]
                        });

                    }
                    else
                        this.$notify.error({
                            title: '查询失败！',
                            message: "您未选择年份或者该年份没有数据存在，请选择新的年份！",
                            type: 'error'
                        });
                });

            },
        },

        mounted:function(){

        }

    }
</script>

<style scoped>
    .chart {
        width: 100%;
        float: left;
    }


    .el-col {
        padding: 30px 20px;
    }
</style>