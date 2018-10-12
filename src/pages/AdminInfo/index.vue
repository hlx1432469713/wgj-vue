<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmins">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"
					  stripe
					  border>
				<el-table-column type="index" width="60" align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.userId" label="序号"  sortable align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.realname" label="真实姓名"  align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.username" label="用户名"  align="center" >
				</el-table-column>
				<el-table-column prop="adminInfo.phonenumber" label="手机号码"  align="center" >
				</el-table-column>
				<el-table-column prop="adminGroupAuthority.adminGroupName" label="权限所属" align="center" >
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" width="200" align="center" >
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="this.total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" :label-position="labelPosition">
				<el-form-item label="真实姓名"  prop="realname">
					<el-input v-model="editForm.realname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名"  prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phonenumber">
					<el-input v-model="editForm.phonenumber" ></el-input>
				</el-form-item>
				<el-form-item label="权限所属" prop="authorityName">
					<el-radio-group v-model="editForm.authorityName ">
						<el-radio label="超级管理员"></el-radio>
						<el-radio label="高级管理员"></el-radio>
						<el-radio label="中级管理员"></el-radio>
						<el-radio label="初级管理员"></el-radio>
					</el-radio-group>
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
    import { getUserInfoById , getAllAdminInfo , deleteAdminInfoById , addAdminInfo , updateAdminInfo } from '../../api/api';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                labelPosition: 'left',
                editForm: {
                    userId:'',
                    username:'',
                    password:'',
                    realname:'',
                    userGroupId:'',
                    phonenumber:'',
                    authorityName:''
                },
                total: 0,
                page: 1,
                loading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '',//界面标题
                editLoading: false,
                editFormRules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    realname: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' }
                    ],
                    phonenumber: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' }
                    ],
                    authorityName: [
                        { required: true, message: '请选择权限所属', trigger: 'change' }
                    ],
                },
                btnEditText:'确定',
                users: [],
            }
        },
        mounted(){
            this.getAdmins();
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getAdmins();
            },
            //获取用户列表
            getAdmins(){
                let param = {
                    sort: "user_id",
                    order: "asc",
                    offset: (this.page - 1) * 10,
                    limit: 10,
                    adminInfo:{
                        username:this.filters.name,
                    }
                };
                this.loading = true;
                NProgress.start();
                getAllAdminInfo(param).then((res) => {
                    if(res.status === 1){
                        this.total = res.result.count;
                        this.users = res.result.adminInfos;
                        this.loading = false;
                        NProgress.done();
                    }

                });
            },
            //添加用户
            handleAdd: function (){
                this.editFormTtile = '添加用户';
                this.editForm.userId = -1;
                this.editForm.username = '';
                this.editForm.realname = '';
                this.editForm.password = '';
                this.editForm.phonenumber = '';
                this.editForm.authorityName = '';
                this.editFormVisible = true;
            },
            //删除
            handleDel: function (row) {
                // console.log(row);
                // console.log(row.userId);
                var _this = this;
                this.$confirm('确认删除该用户吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.Loading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("userId", row.adminInfo.userId);
                    deleteAdminInfoById(param).then((res) => {
                        if(res.status === 1){
                            _this.Loading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除用户成功',
                                type: 'success'
                            });
                            _this.getAdmins();
                        }
                        else
                        {
                            _this.Loading = false;
                            NProgress.done();
                            this.$message({
                                type: 'error',
                                message: '删除失败，'+res.result
                            });
                        }
                    });

                }).catch((res) => {
                    _this.Loading= false;
                    NProgress.done();
                    _this.$notify({
                        title: '失败',
                        message: '删除操作取消！',
                        type: 'error'
                    });
                });
            },
            //修改时显示的编辑页面
            handleEdit: function (row) {
                //console.log("row,",row);
                this.editFormTtile = '修改';
                this.editForm.userId = row.adminInfo.userId;
                this.editForm.username = row.adminInfo.username;
                this.editForm.realname = row.adminInfo.realname;
                this.editForm.password = row.adminInfo.password;
                this.editForm.phonenumber = row.adminInfo.phonenumber;
                this.editForm.authorityName = row.adminGroupAuthority.adminGroupName;
                this.editFormVisible = true;
            },
            //新增或者修改点击的确定按钮
            editSubmit: function () {
                var _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            NProgress.start();
                            _this.btnEditText = '提交中';
                            if (_this.editForm.userId === -1) {
                                //新增用户
                                var authorityId ;
                                if(_this.editForm.authorityName == "超级管理员")
                                {
                                    authorityId=1;
                                }
                                else if(_this.editForm.authorityName == "高级管理员")
                                {
                                    authorityId=2;
                                }
                                else if(_this.editForm.authorityName == "中级管理员")
                                {
                                    authorityId=3;
                                }
                               else if(_this.editForm.authorityName == "初级管理员")
                                {
                                    authorityId=4;
                                }
                                let param = {
                                    username: _this.editForm.username,
                                    realname: _this.editForm.realname,
                                    phonenumber: _this.editForm.phonenumber,
                                    password: _this.editForm.password,
                                    authorityId : authorityId,
                                };
                                addAdminInfo(param).then((res) => {
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '新增用户成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdmins();
                                    }
                                    else
                                    {
                                        _this.btnEditText = '提 交';
                                        _this.editLoading = false;
                                        NProgress.done();
                                        this.$message({
                                            type: 'error',
                                            message: '新增失败，'+res.result
                                        });
                                    }
                                });
                            } else {
                                //编辑用户
                                var authorityId ;
                                if(_this.editForm.authorityName == "超级管理员")
                                {
                                    authorityId=1;
                                }
                                else if(_this.editForm.authorityName == "高级管理员")
                                {
                                    authorityId=2;
                                }
                                else if(_this.editForm.authorityName == "中级管理员")
                                {
                                    authorityId=3;
                                }
                                else if(_this.editForm.authorityName == "初级管理员")
                                {
                                    authorityId=4;
                                }
                                let param = {
                                    userId:_this.editForm.userId,
                                    username: _this.editForm.username,
                                    realname: _this.editForm.realname,
                                    phonenumber: _this.editForm.phonenumber,
                                    password: _this.editForm.password,
                                    authorityId: authorityId,
                                };
                                updateAdminInfo(param).then((res) => {
                                    // console.log("!!!",res)
                                    if(res.status === 1){
                                        _this.editLoading = false;
                                        NProgress.done();
                                        _this.btnEditText = '提 交';
                                        _this.$notify({
                                            title: '成功',
                                            message: '编辑用户成功',
                                            type: 'success'
                                        });
                                        _this.editFormVisible = false;
                                        _this.getAdmins();
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
                                message: '新增或者编辑操作取消！',
                                type: 'error'
                            });
                        });

                    }
                });

            },
        }

    };
</script>

<style scoped>

</style>