<template>
	<section>
		<el-col :span="30" class="toolbar" style="float:left">
			<el-form :inline="true" :model="filters">
                <el-form-item  style="float:right">
                    <el-button type="primary" v-on:click="getExcel">导出信息表</el-button>
                </el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>

				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverPhoneNumber" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>

				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.driverLevelStar" placeholder="信誉积分"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDriver">查询</el-button>
				</el-form-item>
				<el-form-item >
				<el-upload
						class="upload-demo"
						ref="upload"
						action="http://localhost:8000/admin/driver/importExcel"
						:on-preview="handlePreview"
						:on-remove="handleRemove"
                        :on-change="handleChange"
						:before-upload="beforeUpload"
                        :auto-upload="false"
						:limit="1"
						:file-list="fileList">
					<el-button  slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button  style="margin-left: 10px" size="small" type="success" @click ="submitUpload">导入信息</el-button>
					<span slot="tip" class="el-upload__tip">只能导入Excel文件</span>
				</el-upload>
				</el-form-item>
			</el-form>
		</el-col>


		<!--列表-->
		<el-table :data="driverInfo"
				  style="width: 100% ;margin: 10px 0 10px 0"
				  stripe
				  border
				  v-loading="listLoading">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="driverInfo.driverStatus" label="状态" align="center"  sortable  >
				<template slot-scope="scope" >
					<div style="text-algin:center;margin:auto">
						<i v-if="scope.row.driverInfo.driverStatus==0"  style="color:#F56C6C;">休息</i>
						<i v-else-if="scope.row.driverInfo.driverStatus==1"  style="color:#67C23A;"> 上岗</i>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="driverInfo.driverName" label="姓名" align="center"    >
			</el-table-column>
			<!--<el-table-column prop="driverInfo.driverWxId" label="微信号" align="center"  width="150" >-->
			<!--</el-table-column>-->
			<el-table-column prop="driverInfo.driverPhoneNumber" label="手机号"  align="center"   >
			</el-table-column>
			<el-table-column prop="driverInfo.driverIdentity" label="身份证"  align="center"   >
			</el-table-column>
			<!--<el-table-column prop="driverInfo.driverLicence" label="驾驶证"  align="center"   >-->
			<!--</el-table-column>-->
			<el-table-column prop="driverInfo.driverLevelStar" label="信誉积分"  align="center"  sortable  >
			</el-table-column>
			<el-table-column  label="车辆信息"  align="center"   >
				<el-table-column prop="carInfo.carNumber" label="车牌号码"  align="center"   >
				</el-table-column>
				<el-table-column prop="carInfo.carType" label="车辆类型"  align="center"  sortable >
				</el-table-column>
				<el-table-column prop="carInfo.carSeat" label="车座位数"  align="center"  sortable >
				</el-table-column>
                <el-table-column inline-template :context="_self" label="操作"   align="center">
	             <span>
					<el-button size="small" @click="changeCar(row)">换车</el-button>
				</span>
                </el-table-column>
			</el-table-column>

			<el-table-column inline-template :context="_self" label="操作"  width="180px" align="center">
	        <span>
                <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
            </span>
			</el-table-column>
		</el-table>

			<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="this.total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="driverName">
					<el-input v-model="editForm.driverName" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="微信号"  prop="driverWxId">-->
					<!--<el-input v-model="editForm.driverWxId"  size="medium"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item label="手机号"  prop="driverPhoneNumber">
					<el-input  v-model="editForm.driverPhoneNumber" ></el-input>
				</el-form-item>
				<el-form-item label="身份证"  prop="driverIdentity">
					<el-input  v-model="editForm.driverIdentity"></el-input>
				</el-form-item>
				<!--<el-form-item label="驾驶证"  prop="driverLicence">-->
					<!--<el-input  v-model="editForm.driverLicence"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item label="信誉积分"  prop="driverLevelStar">
				<el-input v-model="editForm.driverLevelStar"></el-input>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit2" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>
        <!--编辑换车界面-->
        <el-dialog title="换车操作界面" v-model="editFormVisible1" :close-on-click-modal="false" width = "30%" :visible.sync="dialogVisible">
            <el-row v-loading = "editLoading1">
            <el-form :model="editForm1" :rules="editFormRules1" ref="editForm1" label-width="100px">
                <el-form-item label="搜索">

                <el-col :span="5">
                    <el-input v-model="carForm.carNumber" placeholder="请输入车牌号码" ></el-input>
                </el-col>
					<el-col class="line" :span="2">&nbsp;</el-col>
					<el-button type="primary" v-on:click="getCar">查询</el-button>
            </el-form-item>
                <el-form-item label="车辆Id" prop="carId">
                    <el-col :span="5">
                    <el-input v-model="editForm1.carId"  style="width: 100%;" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="车牌号"  prop="carNumber">
                    <el-col :span="5">
                    <el-input v-model="editForm1.carNumber"  style="width: 100%;" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="车类型"  prop="carType">
                    <el-col :span="5">
                    <el-input  v-model="editForm1.carType" style="width: 100%;" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="车座位数"  prop="carSeat">
                    <el-col :span="5">
                    <el-input  v-model="editForm1.carSeat" style="width: 100%;" disabled></el-input>
                    </el-col>
                </el-form-item>
				<el-form-item label="司机姓名"  prop="carDriverIdADriverName">
					<el-col :span="5">
						<el-input  v-model="carDriverIdADriverName" style="width: 100%;" disabled></el-input>
					</el-col>
					<el-col class="line" :span="2">&nbsp;</el-col>
					<el-button type="primary" v-if="carDriverIdADriverName!=''" v-on:click="getCarOffA">解绑</el-button>
					<el-button   type="primary" v-else v-on:click="getCarOffA" disabled>解绑</el-button>
				</el-form-item>
				<el-form-item  prop="carDriverIdBDriverName">
					<el-col :span="5">
						<el-input  v-model="carDriverIdBDriverName" style="width: 100%;" disabled></el-input>

					</el-col>
					<el-col class="line" :span="2">&nbsp;</el-col>
					<el-button type="primary" v-if="carDriverIdBDriverName!=''" v-on:click="getCarOffB">解绑</el-button>
					<el-button   type="primary" v-else v-on:click="getCarOffB" disabled>解绑</el-button>
				</el-form-item>
				<!--<span v-if="editForm1.carDriverIdBDriverName!=''&&editForm1.carDriverIdADriverName!=''">-->

				<!--</span>-->
            </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible1 = false">取 消</el-button >
                <el-button type="primary" @click.native="editSubmit1()" :loading="editLoading1">{{btnEditText1}}</el-button>
            </div>
        </el-dialog>
	</section>
</template>

<script>
    import NProgress from 'nprogress'
    import {getCarOff, getDriverInfoByDriverId,getDriverInfoByMultiCondition,updateDriverInfoByDriverId,deleteDriverInfoByDriverId ,importExcel,makeExcel,getCarInfoNoCompatibleByCarNumber,changCar} from '../../api/api';
    export default {
        data() {
            return {
                fileList: [],
                filters: {
                    driverName:"",
                    driverPhoneNumber:"",
                    driverLevelStar:""
                },
                carForm: {
                    carNumber:""
                },
                carDriverIdADriverName:'',
                driverIdA:0,
                driverIdB:0,
                carDriverIdBDriverName:'',
                driverInfo: [],
                total: 0,
                page: 1,
                loading:false,
                dialogVisible:false,
                listLoading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '编辑',//编辑界面标题
                editFormVisible1: false,//换车界面显是否显示
                editFormTtile1: '换车',//换车界面标题
                //编辑界面数据
                editForm: {
                    id: 0,
                    driverName:"",
                    driverWxId:"",
                    driverPhoneNumber:"",
                    driverIdentity:"",
                    driverLicence:"",
                    driverLevelStar:"",
                },
                //换车界面数据
                editForm1: {
                    id: 0,
                    driverId:"",
                    carId:"",
                    carNumber:"",
                    carType:"",
                    carSeat:"",
                    carDriverIdA:"",
                    carDriverIdB:"",
                     driverName:"",
                },
                editLoading: false,
                editLoading1: false,
                btnEditText1: '确 定',
                btnEditText: '提 交',
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                editFormRules1: {
                    name: [
                        { required: true, message: '请输入车牌号码', trigger: 'blur' }
                    ]
                }

            }
        },
        methods: {
            submitUpload: function () {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleChange(file, fileList) {
                console.log(file);
                console.log(fileList);
            },
            beforeUpload: function (file) {
                console.log(file)
                var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 10
                if (!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                else if (!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 10MB!',
                        type: 'warning'
                    });
                }
                else {
                    //这里是重点，将文件转化为formdata数据上传
                    let fd = new FormData()
                    fd.append('file', file)
                    importExcel(fd).then((res) => {
                        if (res.status === 1) {
                        this.$notify({
                            title: '成功',
                            message: '导入司机信息成功',
                            type: 'success'
                        });
                        this.getDriver();
                        }
                        else
                        {
                            this.$message({
                                type: 'error',
                                message: '导入失败，'+res.result
                            });
                        }
                    });
                }
                return false;
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getDriver();
            },
            getDriver: function () {
                    let param = {
                        sort: "driver_id",
                        order: "asc",
                        offset: (this.page - 1) * 10,
                        limit: 10,
                        driverInfo: {
                            driverName: this.filters.driverName,
                            driverPhoneNumber: this.filters.driverPhoneNumber,
                            driverLevelStar: this.filters.driverLevelStar
                        }
                    }
                    this.listLoading = true;
                NProgress.start();
                getDriverInfoByMultiCondition(param).then((res) => {
                    if (res.status === 1) {
                        this.total = res.result.count;
                        this.driverInfo = res.result.driverInfos;
                        this.listLoading = false;
                        NProgress.done();
                    }
                });
            },
            getCar: function () {
                this.carDriverIdADriverName='';
				this.driverIdA=0;
                this.driverIdB=0;
				this.carDriverIdBDriverName='';
                var driverId = this.editForm1.driverId;
                var driverName = this.editForm1.driverName;
                this.editLoading1 = true;
                NProgress.start();
                if (this.carForm.carNumber == "") {
                    this.editLoading1 = false;
                    this.$notify.error({
                        title: '查询失败！',
                        message: "输入车牌号码为空查询失败",
                        type: 'error'
                    });
                    NProgress.done();
                    this.carForm.carNumber = '';
                }
                else if(this.carForm.carNumber == this.editForm1.carNumber)
				{
                    this.editLoading1 = false;
                    this.$notify.error({
                        title: '查询失败！',
                        message: "输入车牌号码相同，若想换新车请，请输入新的车牌号",
                        type: 'error'
                    });
                    this.carForm.carNumber = '';
                    NProgress.done();
				}
                else {
                    getCarInfoNoCompatibleByCarNumber(this.carForm.carNumber)
                        .then((res) => {
                            if (res.status === 1) {
                                this.editLoading1 = false;
                                this.editForm1 = res.result;
                                this.editForm1.driverId = driverId;
                                this.editForm1.driverName = driverName;
                                if(res.result.carDriverIdA != 0 )
								{
                                    getDriverInfoByDriverId(this.editForm1.carDriverIdA )
                                        .then((res) => {
                                            if (res.status === 1) {
                                                this.carDriverIdADriverName = res.result.driverName;
                                                this.driverIdA = res.result.driverId;
                                            }
                                        }
										)
								}
								else
                                    this.editForm1.carDriverIdADriverName ="";
                                if(res.result.carDriverIdB != 0  )
                                {
                                    getDriverInfoByDriverId(this.editForm1.carDriverIdB )
                                        .then((res) => {
                                                if (res.status === 1) {
                                                    this.editLoading1 = false;
                                                    this.carDriverIdBDriverName = res.result.driverName;
                                                    this.driverIdB = res.result.driverId;
                                                }
                                            }
                                        )
                                }
                                else
                                    this.editForm1.carDriverIdBDriverName ="";
                                this.editLoading1 = false;
                                this.$notify({
                                    title: '成功',
                                    message: '查询车辆信息成功，可以进行换车',
                                    type: 'success'
                                });
                                NProgress.done();
                            }
                            else {
                                this.editLoading1 = false;
                                this.carForm.carNumber = '';
                                this.$notify.error({
                                    title: '查询失败',
                                    message: "车牌号码不存在！",
                                    type: 'error'
                                });
                            }
                        })
                }
            },
            getExcel() {
                this.$confirm('确认导出司机信息报表吗？', '提示', {}).then(() => {
                        NProgress.start();
                        this.btnEditText = '提交中';
                makeExcel().then((response) => {
                        this.$notify({
                            title: '成功',
                            message: '导出信息表成功，文件存放在D盘微公交系统文件夹下',
                            type: 'success'
                        });
                    NProgress.done();
                    }).catch((error) => {
                    this.$message.error(error.data.message);
                    this.$notify({
                        title: '失败',
                        message: '导出信息表失败！',
                        type: 'error'
                    });
                    NProgress.done();
                })
					}).catch(() => {
                    NProgress.done();
                    this.$notify({
                        title: '失败',
                        message: '导出操作取消！',
                        type: 'error'
                    });
                });
            },
            // //删除
            handleDel: function (row) {
                var _this = this;
                this.$confirm('确认删除该司机信息吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    _this.listLoading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("driverId", row.driverInfo.driverId);
                    deleteDriverInfoByDriverId(param).then((res) => {
                        if (res.status === 1) {
                            _this.listLoading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除司机信息成功',
                                type: 'success'
                            });
                            _this.getDriver();
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
            getCarOffA: function () {
                var _this = this;
                _this.$refs.editForm1.validate((valid) => {
                        if (valid) {
                            _this.$confirm('确认该司机解绑该车辆吗？', '提示', {}).then(() => {
                                _this.editLoading1 = true;
                                NProgress.start();
                                _this.btnEditText = '提交中';
                                let param = {
                                    driverId: _this.driverIdA,
                                    carId: _this.editForm1.carId
                                };
                                getCarOff(param).then((res) => {
                                    if (res.status === 1) {
                                        _this.editLoading1 = false;
                                        this.carDriverIdADriverName=''
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '解绑成功',
                                            type: 'success'
                                        });
                                    }
                                    else
                                    {
                                        _this.editLoading1 = false;
                                        NProgress.done();
                                        this.$message({
                                            type: 'error',
                                            message: '解绑失败，'+res.result
                                        });
                                    }
                                });
                            }).catch((res) => {
                                _this.editLoading1 = false;
                                NProgress.done();
                                _this.$notify({
                                    title: '失败',
                                    message: '解绑操作取消！',
                                    type: 'error'
                                });
							});
                        }
                        else {
                            _this.$notify({
                                title: '失败',
                                message: '解绑操作取消！',
                                type: 'error'
                            });
                        }
                });
            },
            getCarOffB: function () {
                var _this = this;
                _this.$refs.editForm1.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认该司机解绑该车辆吗？', '提示', {}).then(() => {
                            _this.editLoading1 = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            let param = {
                                driverId: _this.driverIdB,
                                carId: _this.editForm1.carId
                            };
                            getCarOff(param).then((res) => {
                                if (res.status === 1) {
                                    this.carDriverIdBDriverName='';
                                    _this.editLoading1 = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '解绑成功',
                                        type: 'success'
                                    });
                                }
                                else
                                {
                                    _this.editLoading1 = false;
                                    NProgress.done();
                                    this.$message({
                                        type: 'error',
                                        message: '解绑失败，'+res.result
                                    });
                                }
                            });
                        }).catch((res) => {
                            _this.editLoading1 = false;
                            NProgress.done();
                            _this.$notify({
                                title: '失败',
                                message: '解绑操作取消！',
                                type: 'error'
                            });
                        });
                    }
                    else {
                        _this.$notify({
                            title: '失败',
                            message: '解绑操作取消！',
                            type: 'error'
                        });
                    }
                });
            },
            //显示司机信息编辑界面
            handleEdit: function (row) {
                this.editFormVisible = true;
                this.editFormTtile = '编辑';
                this.editForm.id = row.id;
                this.editForm.driverId = row.driverInfo.driverId;
                this.editForm.driverName = row.driverInfo.driverName;
                this.editForm.driverPhoneNumber = row.driverInfo.driverPhoneNumber;
                //this.editForm.driverWxId = row.driverInfo.driverWxId;
                this.editForm.driverIdentity = row.driverInfo.driverIdentity;
                //this.editForm.driverLicence = row.driverInfo.driverLicence;
                this.editForm.driverLevelStar = row.driverInfo.driverLevelStar;
            },
            //显示换车编辑界面
            changeCar: function (row) {
                this.editFormVisible1 = true;
                 this.editForm1.driverId = row.driverInfo.driverId;
                 this.editForm1.driverName = row.driverInfo.driverName;
                 this.editForm1.id = row.id;
				 this.editForm1.carId = '';
				 this.editForm1.carNumber = '';
				 this.editForm1.carType = '';
				 this.editForm1.carSeat ='';
                 this.carDriverIdADriverName = '';
                 this.carDriverIdBDriverName = '';
                 this.carForm.carNumber ='';
            },
            editSubmit1: function () {
                var _this = this;
                _this.$refs.editForm1.validate((valid) => {
                    if(this.carForm.carNumber == "") {
                        _this.$notify({
                            title: '失败',
                            message: '车牌号码为空,换车失败！',
                            type: 'error'
                        });
                    }
                    else if(this.carDriverIdADriverName!=''&&this.carDriverIdBDriverName!='')
					{
                        _this.$notify({
                            title: '失败',
                            message: '车辆位置已满，请先解绑司机！！',
                            type: 'error'
                        });
					}
					else if(this.carDriverIdADriverName == this.editForm1.driverName ||this.carDriverIdBDriverName == this.editForm1.driverName)
                    {
                        _this.$notify({
                            title: '失败',
                            message: '车辆信息相同，请选择新车！',
                            type: 'error'
                        });
                    }
                    else{
                    if (valid) {
                        _this.$confirm('确认换车吗？', '提示', {}).then(() => {
                            _this.editLoading1 = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            let param = {
                                driverId: _this.editForm1.driverId,
                                carId: _this.editForm1.carId
                            };
                            changCar(param).then((res) => {
                                if (res.status === 1) {
                                    _this.editLoading1 = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '换车成功',
                                        type: 'success'
                                    });
                                    this.carForm.carNumber = '';
                                    _this.carDriverIdADriverName='';
									_this.carDriverIdBDriverName='';
                                    _this.editFormVisible1 = false;
                                    _this.getDriver();
                                }
                                else
                                {
                                    _this.editLoading1 = false;
                                    NProgress.done();
                                    this.$message({
                                        type: 'error',
                                        message: '换车失败，'+res.result
                                    });
                                }
                            });
                        }).catch((res) => {
                            _this.editLoading1 = false;
                            NProgress.done();
                            _this.$notify({
                                title: '失败',
                                message: '换车操作取消！',
                                type: 'error'
                            });
                        });
                        }
					}
                });
            },
            editSubmit2: function () {
                var _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if( _this.editForm.driverId == '' ||_this.editForm.driverName == '' ||
							_this.editForm.driverPhoneNumber == '' ||
							_this.editForm.driverIdentity == ''  ||_this.editForm.driverLevelStar == ''){
                            _this.$notify({
                                title: '失败',
                                message: '司机信息为空，编辑司机信息失败！！',
                                type: 'error'
                            });
						}
						else{
                            _this.$confirm('确认修改该司机的信息吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            //编辑
                            let param = {
                                driverId: _this.editForm.driverId,
                                driverName: _this.editForm.driverName,
                              // driverWxId: _this.editForm.driverWxId,
                                driverPhoneNumber: _this.editForm.driverPhoneNumber,
                                driverIdentity: _this.editForm.driverIdentity,
                               // driverLicence: _this.editForm.driverLicence,
                                driverLevelStar: _this.editForm.driverLevelStar,
                            };
                            updateDriverInfoByDriverId(param).then((res) => {
                                if (res.status === 1) {
                                    _this.editLoading = false;
                                    NProgress.done();
                                    _this.btnEditText = '提 交';
                                    _this.$notify({
                                        title: '成功',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    _this.getDriver();
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
                        }).catch((res) => {
                            _this.editLoading= false;
                            NProgress.done();
                            _this.$notify({
                                title: '失败',
                                message: '编辑操作取消！',
                                type: 'error'
                            });
                        });
                    }}
                });
            }
        },
        mounted() {
            this.getDriver();
        }
    }
</script>

<style scoped>
    .uptemp .el-upload-list {
        position: absolute;
        left: 140px;
        top: 0;
        width: 50%;
    }

    .uptemp {
        position: relative;
    }

    .uptemp .el-upload-list .el-upload-list__item {
        margin-top: 0;
    }
</style>