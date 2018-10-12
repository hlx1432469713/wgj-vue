<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item label="投诉发起时间(时间和日期必须都选)">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="trackDate.startYmd" style="width: 100%;" ></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="trackDate.startHms" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
				<!--<el-form-item label="结束时间">-->
					<!--<el-col :span="11">-->
						<!--<el-date-picker type="date" placeholder="选择日期"  v-model="trackDate.endYmd" style="width: 100%;"></el-date-picker>-->
					<!--</el-col>-->
					<!--<el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>-->
					<!--<el-col :span="11">-->
						<!--<el-time-picker type="fixed-time" placeholder="选择时间"  v-model="trackDate.endHms" style="width: 100%;"></el-time-picker>-->
					<!--</el-col>-->
				<!--</el-form-item>-->
				<!--<br>-->
                <el-select v-model="filters.complaintStatus" placeholder="投诉状态" clearable>
                    <el-option
                            v-for="item in complaintStatusData"
                            :key="item.complaintStatus"
                            :label="item.roleName"
                            :value="item.complaintStatus">
                    </el-option>
                </el-select>
				<el-form-item>
					<el-input v-model="filters.passengerId" type="number" placeholder="投诉人编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getComplaintInfoList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="complaintlist" highlight-current-row v-loading="listLoading" style="width: 100%;"
                      stripe
					  border>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column  label="投诉状态"  sortable  align="center">
                    <template slot-scope="scope" >
                        <div>
                            <i v-if="scope.row.complaintStatus==1"  style="color:#909399;">未受理</i>
                            <i v-if="scope.row.complaintStatus==2"  style="color:#F56C6C;">未反馈</i>
                            <i v-else-if="scope.row.complaintStatus==3"  style="color:#67C23A;"> 反馈</i>
                        </div>
                    </template>
				</el-table-column>
				<el-table-column prop="complaintId" label="投诉编号" sortable  align="center">
				</el-table-column>
				<el-table-column prop="complaintContent" label="投诉内容"   align="center">
				</el-table-column>
				<el-table-column prop="passengerId" label="投诉人编号"  sortable  align="center">
				</el-table-column>
				<el-table-column prop="orderId" label="订单编号"  sortable  align="center">
				</el-table-column>
				<el-table-column prop="complaintCreateTime" label="投诉发起时间" align="center" :formatter="formatTime"sortable width="200px">
				</el-table-column>
				<el-table-column prop="complaintFeedbackTime" label="投诉反馈时间"   align="center":formatter="formatTime1"  width="200px" sortable>
				</el-table-column>
				<el-table-column label="投诉反馈内容"   align="center">
                    <template slot-scope="scope">
                    <i v-if="scope.row.complaintFeedback !=null ">
                            <el-popover placement="top-start" title="反馈内容" width="150" trigger="hover">
                                <slot>{{scope.row.complaintFeedback }}</slot>
                                <el-button slot="reference">反馈内容</el-button>
                             </el-popover>

                            </i>
                    </template>
				</el-table-column>
				<el-table-column  label="操作"  align="center" width="180">
                    <template slot-scope="scope">
						<el-button  size="small" type="primary" @click="handleEdit(scope.row)" v-if="scope.row.complaintStatus ==1 ">受理</el-button>
                       <el-button   size="small" type="primary" @click="handleEdit(scope.row)"  v-if="scope.row.complaintStatus >1 "disabled>受理</el-button>
                       <el-button size="small" type="danger"  @click="handleDel(scope.row)" v-if="scope.row.complaintStatus ==2 ">反馈</el-button>
                        <el-button size="small" type="danger"  @click="handleDel(scope.row)" v-if="scope.row.complaintStatus >0 && scope.row.complaintStatus !=2 " disabled>反馈</el-button>
                    </template>
				</el-table-column>
			</el-table>
		</template>

		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
     //import util from '../../common/util'
    import NProgress from 'nprogress'
    import {findComplaintInfoByMultiCondition,updateComplaintInfoByComplaintId} from "../../../api/api";
     //import { formatDate } from '../../common/util'

    export default {
        data() {
            return {
                loading:true,
                filters: {
                    complaintStatus:'',
                    passengerId:'',
                    complaintCreateTime:'',
                },
                complaintStatusData: [{
                    complaintStatus: 1,
                    roleName: '未受理'
                },{
                    complaintStatus: 2,
                    roleName: '未反馈'
                },{
                    complaintStatus: 3,
                    roleName: '反馈'
                }],
				counts:0,
                trackDate: {
                    startYmd: null,
                    startHms: null,
                    // endYmd: null,
                    // endHms: null
                },
                complaintlist: [],
                total: 0,
                page: 1,
                listLoading: false,
                // editFormVisible: false,//查看详情界面显是否显示
                // editFormTtile: '查看详情',//查看详情界面标题
                //查看详情界面数据
                // editForm: {
                //     logId: '',
                //     action: '',
                //     roleId: '',
                //     logTime: '',
                //     orderId: '',
                // },
                // editLoading: false,
                // btnEditText: '提 交',
                // editFormRules: {
                //     name: [
                //         { required: true, message: '请输入姓名', trigger: 'blur' }
                //     ]
                // }

            }
        },
        methods: {

            formatTime: function (row, column) {
                if (row.complaintCreateTime != null) {
                var d = new Date(row.complaintCreateTime);
                var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                return times;
            }
            },
            formatTime1: function (row, column) {
                if (row.complaintFeedbackTime != null) {
                    var d = new Date(row.complaintFeedbackTime);
                    var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    return times;
                }
     },
            formatDate(date, flag) {

                if (date != null) {
                    var date = new Date(date);
                    if (flag === 0) {//格式化年月日
                        let y = date.getFullYear();
                        let m = date.getMonth() + 1;
                        let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                        return `${y}-${m}-${d}`
                    } else {//格式化时分秒
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
                this.getComplaintInfoList();
            },
            //获取投诉列表
            getComplaintInfoList() {

                var start ='';
                if(this.trackDate.startYmd!=null&&this.trackDate.startYmd!=''&&this.trackDate.startHms!=''&&this.trackDate.startHms!=null)
                {
                    start = this.formatDate(this.trackDate.startYmd, 0) + " " + this.formatDate(this.trackDate.startHms, 1)
                    if (start == 'null null') {
                        start = '';
                    }
                }
                    else{
                        start = '';
                }

                    let para = {
                        sort: "complaint_status",
                        order: "asc",
                        offset: (this.page - 1) * 10,
                        limit: 10,
                        startTime: start,
                        complaintInfo: {
                            complaintStatus: this.filters.complaintStatus,
                            passengerId: this.filters.passengerId,
                            complaintCreateTime: this.filters.complaintCreateTime,
                        },
                    };

                    this.listLoading = true;
                    NProgress.start();
                    findComplaintInfoByMultiCondition(para).then((res) => {
                        this.total = res.result.count;
                        this.complaintlist = res.result.complaintInfos;
                        this.counts = res.result.count1;
                        this.listLoading = false;
                        NProgress.done();
                        if(this.counts!=0)
						{
						    this.open2();
						}
                    });
            },
            handleEdit(row) {
                this.$confirm('将对此投诉进行受理, 是否进行?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    let param = {
                            complaintId: row.complaintId,
                            complaintStatus:row.complaintStatus,
                    };
                    updateComplaintInfoByComplaintId(param).then((response) => {
                        if (response.status === 1) {
                            this.getComplaintInfoList();
                            this.$message({
                                type: 'success',
                                message: '受理成功'
                            });
                        }
                    else
                        {
                            this.$message({
                                type: 'error',
                                message: '受理失败，'+response.result
                            });
						}
                }).catch((response) => {
                        this.loading = false;
                        this.$notify.error({
                            title: '错误',
                            message: response.result,
                            duration: 2000
                        });
                    })
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                    this.$message({
                        type: 'info',
                        message: '已取消受理'
                    });
                });

            },
            handleDel(row) {
                this.$prompt('请输入反馈信息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\S/,
                    inputErrorMessage: '反馈内容不能为空'
                }).then(({ value }) => {
                    let param = {
                        complaintId: row.complaintId,
                        complaintStatus: row.complaintStatus,
                        complaintFeedback: value
                    };
                    updateComplaintInfoByComplaintId(param).then((response) => {
                        this.getComplaintInfoList();
                        this.$message({
                            type: 'success',
                            message: '反馈成功'
                        });
                    }).catch((error) => {
                        this.$notify.error({
                            title: '错误',
                            message: error.data.message,
                            duration: 2000
                        });
                    })
                })
                        .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消反馈'
                        });
                    });

            },
            open2: function () {
                this.$notify.info({
                    title: '投诉信息提示',
					message:  '您还有' + this.counts + '条投诉未处理或者反馈，请及时处理或者反馈！',
                    duration: 0
                });
            }

        },

        mounted() {
         this.getComplaintInfoList();

        }
    }
</script>

<style scoped>
</style>