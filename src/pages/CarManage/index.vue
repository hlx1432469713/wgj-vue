<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.carNumber" placeholder="车牌号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.carType" placeholder="车辆类型"></el-input>
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
			<el-table :data="cars" highlight-current-row v-loading="listLoading" style="width: 100%;"stripe
					  border>
				<el-table-column type="index" width="60" align="center"  >
				</el-table-column>
				<el-table-column prop="carInfo.carNumber" label="车牌号" align="center"  sortable>
				</el-table-column>
				<el-table-column prop="carInfo.carType" label="车辆类型"  align="center" >
				</el-table-column>
				<el-table-column prop="carInfo.carSeat" label="座位数" align="center"  sortable>
				</el-table-column>
				<el-table-column  prop="driverInfo.driverName" label="上岗司机姓名"  align="center"  >
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" width="180"align="center"  >
					<span>	
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>

<!--分页-->
<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageParam.limit" :total="total" style="float:right;">
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
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click.native="editFormVisible = false">取 消</el-button>
		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
	</div>
</el-dialog>
</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { findCarInfoByMultiCondition,deleteCarInfoByCarId, updateCarInfoByCarId, addCarInfo } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					carType: '',
					carNumber: ''
				},
				cars: [{
				    driverInfo:{
				        driverName :''
					}
				}],
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
                    carSeat: ''
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
					order: "asc",
					limit: 10,
				}

			}
		},
        // computed: {
        //     timeOut: {
        //         set (val) {
        //             this.$store.state.timeout.compileTimeout = val;
        //         },
        //         get() {
        //             return this.$store.state.timeout.compileTimeout;
        //         }
        //     },
        // },
		methods: {

            //     vehicleAggregationAlarm() {
            // let _this = this
            // let timer = setInterval(()=>{
            //     axios.get(url,(res)=>{
            //         // TODO 返回结果的判断
            //     ...
            //         _this.list.push(res)
            //     })
            // },500)},
			handleCurrentChange(val) {
				this.page = val;
				this.getCars();
			},
			//获取用户列表
			getCars() {
			    var i;
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
                        console.log(this.cars);
                        // this.getListIng();
                        // console.log("dsdsd");
                        this.listLoading = false;
						NProgress.done();

					}
				});
			},

			//删除
			handleDel: function (row) {
				//console.log(row);
				var _this = this;
				this.$confirm('确认删除该车辆的信息吗?', '提示', {
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
                        else
                        {
                            _this.listLoading = false;
                            NProgress.done();
                            this.$message({
                                type: 'error',
                                message: '删除失败，'+res.result
                            });
                        }
					});

				}).catch(() => {
                    _this.listLoading = false;
                    NProgress.done();
                    _this.$notify({
                        title: '失败',
                        message: '删除操作取消！',
                        type: 'error'
                    });

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
			//编辑
			editSubmit: function () {
				var _this = this;

				_this.$refs.editForm.validate((valid) => {
					if (valid) {
                        if( _this.editForm.carNumber == '' ||_this.editForm.carType == '' || _this.editForm.carSeat == '' ){
                            _this.$notify({
                                title: '失败',
                                message: '车辆信息为空，编辑或者新增车辆信息失败！！',
                                type: 'error'
                            });

                        }
                        else{
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';

							if (_this.editForm.id == 0) {
								//新增
								let param = {
									carNumber: _this.editForm.carNumber,
									carType: _this.editForm.carType,
                                    carSeat: _this.editForm.carSeat
								};
								addCarInfo(param).then((res) => {
									if(res.status === 1){
										_this.editLoading = false;
										NProgress.done();
										_this.btnEditText = '提 交';
										_this.$notify({
											title: '成功',
											message: '新增车辆成功',
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
									if(res.status === 1){
										_this.editLoading = false;
										NProgress.done();
										_this.btnEditText = '提 交';
										_this.$notify({
											title: '成功',
											message: '编辑成功',
											type: 'success'
										});
										_this.editFormVisible = false;
										_this.getCars();
									}
                                    else
                                    {
                                        _this.btnEditText = '提 交';
                                        _this.editLoading = false;
                                        NProgress.done();
                                        this.$message({
                                            type: 'error',
                                            message: '编辑失败，'+res.result
                                        });
                                    }
								});

							}

						}).catch((res) => {
                            _this.editLoading= false;
                            NProgress.done();
                            _this.$notify({
                                title: '失败',
                                message: '编辑操作取消！',
                                type: 'error'
                            });
                        });}

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
				this.editForm.carSeat = '';
			},

		},
		mounted() {
			this.getCars();
            // if ( this.timeOut ) {
            //     clearTimeout(this.timeOut);
            // }
            // setInterval(this.getListIng,1000*60*15);//s*1000
		}
	}
</script>

<style scoped>
</style>