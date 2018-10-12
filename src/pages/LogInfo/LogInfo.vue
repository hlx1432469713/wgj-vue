<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="起始时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="trackDate.startYmd" style="width: 100%;" ></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="trackDate.startHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期"  v-model="trackDate.endYmd" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间"  v-model="trackDate.endHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item><br>
				<el-form-item>
					<el-input v-model="formData.logInfo.logId" type="number" placeholder="日志编号(数字)"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.logInfo.action" placeholder="用户行为"></el-input>
				</el-form-item>
				<el-select v-model="formData.logInfo.roleId" placeholder="用户角色" clearable>
					<el-option
					v-for="item in roleData"
					:key="item.roleId"
					:label="item.roleName"
					:value="item.roleId">
					</el-option>
				</el-select>
				<el-form-item>
					<el-input v-model="formData.logInfo.orderId" type="number" placeholder="订单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="findLogInfo">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="infolist" highlight-current-row v-loading="listLoading" style="width: 100%;" stripe
					  border>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="logId" label="日志编号" sortable  align="center">
				</el-table-column>
				<el-table-column prop="action" label="用户行为" sortable  align="center">
				</el-table-column>
				<el-table-column prop="roleId" label="用户角色" :formatter="formatRole" sortable  align="center">
				</el-table-column>
				<el-table-column prop="logTime" label="行为时间" :formatter="formatTime" sortable  align="center">
				</el-table-column>
				<el-table-column prop="orderId" label="订单编号"  sortable  align="center">
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作"  align="center">
					<span>
						<el-button size="small" @click="handleEdit(row)">查看详情</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>

<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.limit" :total="total" style="float:right;">
</el-pagination>
</el-col>

<!--编辑界面-->
<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
	<el-form :model="editForm" label-width="80px" ref="editForm">
		<el-form-item label="日志编号">
			<el-input v-model="editForm.logId" auto-complete="off" disabled ></el-input>
		</el-form-item>
		<el-form-item label="订单编号">
			<el-input v-model="editForm.orderId" auto-complete="off" disabled></el-input>
		</el-form-item>
		<el-form-item label="用户行为">
			<el-input v-model="editForm.action" auto-complete="off" disabled></el-input>
		</el-form-item>
		<el-form-item label="用户角色">
			<el-input v-model="editForm.roleId" auto-complete="off" disabled></el-input>
		</el-form-item>
		<el-form-item label="行为时间">
			<el-input v-model="editForm.logTime" auto-complete="off" disabled></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click.native="editFormVisible = false">关 闭</el-button>
	</div>
</el-dialog>
</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { findLogInfoMultiCondition, getLogInfoByLogId} from '../../api/api';
	import { formatDate } from '../../common/util'

	export default {
		data() {
			return {
				roleData: [{
					roleId: 1,
          			roleName: '司机'
				},{
					roleId: 2,
          			roleName: '乘客'
				}],
				formData: {
					logInfo: {
						logId: '',
						action: '',
						roleId: '',
						logTime: '',
						orderId: '',
					},
				},
				filters: {
					offset: 0,
					sort: 'log_id',
					order: 'desc',
					limit:  10,
					startTime: '',
					endTime: '',
					logInfo: {
						logId: '',
						action: '',
						roleId: '',
						logTime: '',
						orderId: '',
					},
				},
				trackDate: {
					startYmd: null,
					startHms: null,
					endYmd: null,
					endHms: null
            	},
				infolist: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//查看详情界面显是否显示
				editFormTtile: '查看详情',//查看详情界面标题
				//查看详情界面数据
				editForm: {
					logId: '',
					action: '',
					roleId: '',
					logTime: '',
					orderId: '',
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				}

			}
		},
		methods: {
			//角色显示转换
			formatRole: function (row, column) {
				return row.roleId == 1 ? '司机' : row.roleId == 2 ? '乘客' : '未知';
			},


			formatTime: function(row, column) {
				var d = new Date(row.logTime);
				var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
				return times;
				
			},

			formatDate (date, flag) {
				if (date != null){
                    var date = new Date(date);
					if(flag===0){//格式化年月日
						let y = date.getFullYear();
						let m = date.getMonth() + 1;
						let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
						return `${y}-${m}-${d}`
					}else{//格式化时分秒
                        var date = new Date(date);
						let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
						let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
						let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
						return `${h}:${m}:${s}`
					}
				}
				return null;
			},

			handleCurrentChange(val) {
				console.log("page", val)
				this.page = val;
				console.log("page", this.page)
				this.getLogInfoList();
			},
			//获取用户日志列表
			getLogInfoList() {
				let para = {
					offset: (this.page - 1) * 10,
					sort: this.filters.sort,
					order: this.filters.order,
					limit: this.filters.limit,
					// startTime: start,
					// endTime: end,
					logInfo: {
						logId: this.filters.logInfo.logId,
						action: this.filters.logInfo.action,
						roleId: this.filters.logInfo.roleId,
						logTime: this.filters.logInfo.logTime,
						orderId: this.filters.logInfo.orderId,
					},
				};
				this.listLoading = true;
				NProgress.start();
				findLogInfoMultiCondition(para).then((res) => {
					this.total = res.result.count;
					this.infolist = res.result.logInfoList;
					this.listLoading = false;
					NProgress.done();
				});
			},
			//查询
			findLogInfo() {
                var start='';
                var end = '';
                if(this.trackDate.startYmd!=null&&this.trackDate.startYmd!='') {
                     start = this.formatDate(this.trackDate.startYmd, 0) + " " + this.formatDate(this.trackDate.startHms, 1)
                    if (start == 'null null') {
                        start = ''
                    }
                     end = this.formatDate(this.trackDate.endYmd, 0) + " " + this.formatDate(this.trackDate.endHms, 1)
                    if (end == 'null null') {
                        end = ''
                    }
                }  else{
                    start = '';
                    end = this.formatDate(this.trackDate.endYmd, 0) + " " + this.formatDate(this.trackDate.endHms, 1)
                    if (end == 'null null') {
                        end = ''
                    }
                }
				let para = {
					offset: (this.page - 1) * 10,
					sort: this.filters.sort,
					order: this.filters.order,
					limit: this.filters.limit,
					startTime: start,
					endTime: end,
					logInfo: {
						logId: this.formData.logInfo.logId,
						action: this.formData.logInfo.action,
						roleId: this.formData.logInfo.roleId,
						logTime: this.formData.logInfo.logTime,
						orderId: this.formData.logInfo.orderId,
					},
				};
				this.listLoading = true;
				NProgress.start();
				findLogInfoMultiCondition(para).then((res) => {
					this.total = res.result.count;
					this.infolist = res.result.logInfoList;
					this.listLoading = false;
					NProgress.done();
				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				
				console.log("row",row.logId)
				var param = new FormData()
				param.append('logInfoId', row.logId)
				getLogInfoByLogId(param).then((res) => {
					if(res.status === 1){
                    console.log(res.result)
					this.editFormVisible = true;
					this.editFormTtile = '查看详情';
					this.editForm.logId = row.logId;
					this.editForm.action = row.action;
					if(row.roleId==1){
						this.editForm.roleId = '司机';
					} else {
						this.editForm.roleId = '乘客';
					}
					var d = new Date(row.logTime);
					var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
					this.editForm.logTime = times;
					this.editForm.orderId = row.orderId;
					}
				});	
			},
			//编辑 or 新增
			editSubmit: function (row) {
				let param = {
                carNumber: this.carNumber
            	}
				getLogInfoByLogId(para).then((res) => {
					if(res.status === 1){
                    console.log(res.result)
					}
				});
			},
		},
		mounted() {
			this.getLogInfoList();
		}
	}
</script>

<style scoped>
</style>