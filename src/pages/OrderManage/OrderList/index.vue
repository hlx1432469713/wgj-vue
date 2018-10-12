<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters" >
				<el-form-item>
					<el-input v-model="filters.driverName" placeholder="司机姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.passengerPhoneNumber" placeholder="乘客手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOrder">查询</el-button>
				</el-form-item>

			</el-form>
		</el-col>
		<!--列表-->
			<el-table :data="orderList"  v-loading="listLoading"
					  style="width: 100% ;margin: 10px 0 10px 0"
					  stripe
					  border>
				<el-table-column type="index">
				</el-table-column>
				<el-table-column prop="orderInfo.orderId" label="订单Id" align="center" sortable >
				</el-table-column>
                <el-table-column prop="orderInfo.startTime" label="订单创建时间"  align="center" :formatter="formatTime" sortable width="200px">
                </el-table-column>
                <el-table-column prop="orderInfo.endTime" label="订单结束时间"   align="center"  :formatter="formatTime1" width="200px" sortable>
                </el-table-column>
				<el-table-column label="乘客信息" align="center">
					<!--<el-table-column prop="passenger.passengerWxId" label="微信号" align="center" >-->
					<!--</el-table-column>-->
					<el-table-column prop="passenger.passengerPhoneNumber" label="手机号" align="center" >
					</el-table-column>
				</el-table-column>
				<el-table-column  label="司机信息"  align="center">
					<el-table-column prop="driverInfo.driverName" label="姓名" align="center" >
					</el-table-column>
					<el-table-column prop="driverInfo.driverPhoneNumber" label="手机号" align="center">
					</el-table-column>
				</el-table-column>
				<el-table-column prop="carInfo.driverName" label="车辆信息" align="center" >
					<el-table-column prop="carInfo.carNumber" label="车牌号码"  align="center"   >
					</el-table-column>
					<el-table-column prop="carInfo.carType" label="车辆类型"  align="center"   >
					</el-table-column>
					<el-table-column prop="carInfo.carSeat" label="车座位数"  align="center"   >
					</el-table-column>
				</el-table-column>
			</el-table>


<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageParam.limit" :total="this.total" style="float:right;">
</el-pagination>
</el-col>

</section>
</template>

<script>
	import util from '../../../common/util'
	import NProgress from 'nprogress'
	import { findOrderInfoByMultiCondition} from '../../../api/api';
    import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					driverName: '',
                    passengerPhoneNumber: ''
				},
                orderList: [],
				total: 0,
				page: 1,
				listLoading: false,
				editLoading: false,
				pageParam: {
					sort: "order_id",
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
            formatTime: function(row, column) {
                var d = new Date(row.orderInfo.startTime);
                var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return times;

            },
            formatTime1: function(row, column) {
                var d = new Date(row.orderInfo.endTime);
                var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return times;

            },
			//获取用户列表
			getOrder : function ()  {
				let param = {
					sort: this.pageParam.sort,
					order: this.pageParam.order,
					limit: this.pageParam.limit,
					offset: (this.page-1)*10,
					    driverInfo:{
					        driverName: this.filters.driverName,
						},
                        passenger:{
                            passengerPhoneNumber: this.filters.passengerPhoneNumber
						}

				}
				this.listLoading = true;
				NProgress.start();
                findOrderInfoByMultiCondition(param).then((res) => {
					if(res.status === 1){
						this.total = res.result.count;
						this.orderList = res.result.orderList;
                        //console.log(this.orderList);
						this.listLoading = false;
						NProgress.done();
					}
				});
			},
        },
		mounted() {
			 this.getOrder();
		}

	}
</script>

<style scoped>
</style>