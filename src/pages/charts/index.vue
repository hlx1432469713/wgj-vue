<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.carNumber" placeholder="车牌号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.driverId" placeholder="司机id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getOrder">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
        <el-row>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
        </template>


        列表
        <template>
            <el-table :data="orders" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="orderid" label="订单号" width="150" sortable>
                </el-table-column>
                <el-table-column prop="passengerId" label="乘客id" width="150" sortable>
                </el-table-column>
                <el-table-column prop="driverId" label="司机id" width="150" sortable>
                </el-table-column>

                <el-table-column prop="startTime" label="开始时间" width="150" sortable>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="150" sortable>
                </el-table-column>

            </el-table>
            <p> 当前一共服务了{{allnum}}次</p>
        </template>

        <!--分页-->
        <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageParam.limit" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import { getOrderByDriverId,getAllOrderNum, getOrderByCarNumber } from '../../api/api';

    export default {
        data() {

            return {
                allnum:0,
                filters: {
                    driverId: '',/**用来数据绑定 */
                    carNumber: ''
                },
                orders: [],
                total: 0,
                page: 1,
                listLoading: false,

                pageParam: {
                    sort: "car_id",
                    order: "desc",
                    limit: 10,
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getOrder();
            },
            //获取用户列表
            getOrder() {
                let param= {
                    sort: this.pageParam.sort,
                    order: this.pageParam.order,
                    limit: this.pageParam.limit,
                    offset: (this.page-1)*10,
                    orderinfo: {
                        driverId: this.filters.driverId,
                        carNumber: this.filters.carNumber
                    }
                }
                this.listLoading = true;
                NProgress.start();
                //getAllOrderNum().then(console.log(res));
                getAllOrderNum().then((res)=>{
                    console.log(res);
                    this.allnum=res.result.length;
                    //console.log(res.result.length);一共多少条统计出来了
                    if(res.status === 1){

                        this.orders = res.result;
                        this.listLoading = false;
                        NProgress.done();
                    }

                });
                // findorderinfoByMultiCondition(param).then((res) => {
                // 	if(res.status === 1){
                // 		this.total = res.result.count;
                // 		this.orders = res.result.orderinfos;
                // 		this.listLoading = false;
                // 		NProgress.done();
                // 	}
                // });
            },

        },
        mounted() {
            this.getOrder();
        }
    }
</script>

<style scoped>
</style>