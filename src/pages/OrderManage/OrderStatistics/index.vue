<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.driverName" placeholder="司机"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.passengerPhone" placeholder="乘客手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCars">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="cars" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="carInfo.carNumber" label="车牌号" width="250" sortable>
				</el-table-column>
				<el-table-column prop="carInfo.carType" label="车辆类型" width="250" sortable>
				</el-table-column>
				<el-table-column prop="carInfo.carSeat" label="座位数" width="250" sortable>
				</el-table-column>
				<el-table-column prop="carInfo.driverName" label="司机姓名" width="250" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" width="200">
					<span>	
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>

<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageParam.limit" :total="total" style="float:right;">
</el-pagination>
</el-col>

<!--编辑界面-->
<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
	<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
		<el-form-item label="车牌号" prop="carNumber">
			<el-input v-model="editForm.carNumber" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="车辆类型">
			<el-input v-model="editForm.carType" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="座位数">
			<el-input-number v-model="editForm.carSeat" :min="0" :max="5"></el-input-number>
		</el-form-item>
		<el-form-item label="司机姓名">
			<el-input v-model="editForm.driverName" auto-complete="off"></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click.native="editFormVisible = false">取 消</el-button>
		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
	</div>
</el-dialog>
</section>
</template>

<script>
	import util from '../../../common/util'
	import NProgress from 'nprogress'
	import { findCarInfoByMultiCondition,deleteCarInfoByCarId, updateCarInfoByCarId, addCarInfo } from '../../../api/api';

	export default {
		data() {
			return {
				filters: {
					driverName: '',
					passengerPhone: ''
				},
				cars: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面显是否显示
				editFormTtile: '编辑',//编辑界面标题
				//编辑界面数据
				editForm: {
					id: 0,
					carNumber: '',
					carType: '',
					driverName: ''
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
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
				this.getCars();
			},
			//获取用户列表
			getCars() {
				let param = {
					sort: this.pageParam.sort,  
					order: this.pageParam.order,  
					limit: this.pageParam.limit,  
					offset: (this.page-1)*10,
					carInfo: {
						carType: this.filters.carType,
						carNumber: this.filters.carNumber
					}
				}
				this.listLoading = true;
				NProgress.start();
				findCarInfoByMultiCondition(param).then((res) => {
					if(res.status === 1){
						this.total = res.result.count;
						this.cars = res.result.carInfos;
						
						this.listLoading = false;
						NProgress.done();
					}
				});
			},
			//删除
			handleDel: function (row) {
				//console.log(row);
				var _this = this;
				this.$confirm('确认删除该记录吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading = true;
					NProgress.start();
					let param = new FormData();
					param.append("carId", row.carInfo.carId);
					deleteCarInfoByCarId(param).then((res) => {
						if(res.status === 1){
							_this.listLoading = false;
							NProgress.done();
							_this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							_this.getCars();
						}
					});

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				console.log("row,",row)
				this.editFormVisible = true;
				this.editFormTtile = '编辑';
				this.editForm.id = row.id;
				this.editForm.carId = row.carInfo.carId;
				this.editForm.carNumber = row.carInfo.carNumber;
				this.editForm.carType = row.carInfo.carType;
				this.editForm.carSeat = row.carInfo.carSeat;
			},
			//编辑 or 新增
			editSubmit: function () {
				var _this = this;

				_this.$refs.editForm.validate((valid) => {
					if (valid) {

						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';

							if (_this.editForm.id == 0) {
								//新增
								let param = {
									carNumber: _this.editForm.carNumber,
									carType: _this.editForm.carType
								};
								addCarInfo(param).then((res) => {
									if(res.status === 1){
										_this.editLoading = false;
										NProgress.done();
										_this.btnEditText = '提 交';
										_this.$notify({
											title: '成功',
											message: '提交成功',
											type: 'success'
										});
										_this.editFormVisible = false;
										_this.getCars();
									}
								});
							} else {
								//编辑
								let param = {
									carId: _this.editForm.carId,
									carNumber: _this.editForm.carNumber,
									carType: _this.editForm.carType,
									carSeat: _this.editForm.carSeat
								};
								updateCarInfoByCarId(param).then((res) => {
									console.log("!!!",res)
									if(res.status === 1){
										_this.editLoading = false;
										NProgress.done();
										_this.btnEditText = '提 交';
										_this.$notify({
											title: '成功',
											message: '提交成功',
											type: 'success'
										});
										_this.editFormVisible = false;
										_this.getCars();
									}
								});

							}

						});

					}
				});

			},
			//显示新增界面
			handleAdd: function () {
				var _this = this;

				this.editFormVisible = true;
				this.editFormTtile = '新增';
				this.editForm.id = 0
				this.editForm.carId = "";
				this.editForm.carNumber = "";
				this.editForm.carType = "";
				this.editForm.carSeat = 0;
			}
		},
		mounted() {
			this.getCars();
		}
	}
</script>

<style scoped>
</style>