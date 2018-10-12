<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="组名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdminGroups">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd" disabled>新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="adminGroups" highlight-current-row v-loading="loading" style="width: 100%;"
					  stripe
					  border>
				<el-table-column type="index" width="60" align="center" >
				</el-table-column>
				<el-table-column prop="adminGroupId" label="Id" align="center"  sortable>
				</el-table-column>
				<el-table-column prop="groupName" label="组名"  align="center"  sortable>
				</el-table-column>
				<el-table-column prop="permission" label="权限" align="center"  sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" width="200" align="center" >
					<span>
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
					</span>
				</el-table-column>
			</el-table>
		</template>
		<!--分页-->
		<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
			<el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="this.total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--界面-->
		<el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="组名" prop="groupName">
					<el-input v-model="editForm.groupName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限"prop="permission">
					<el-input v-model="editForm.permission" auto-complete="off"></el-input>
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
    import {     deleteAdminGroup , addAdminGroup , updateAdminGroupById , getAllAdminGroup } from '../../../api/api';
    import NProgress from 'nprogress'
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                editForm: {
                    adminGroupId:'',
                    groupName:'',
                    permission:'',
                },
                total: 0,
                page: 1,
                loading: false,
                editFormVisible: false,//编辑界面显是否显示
                editFormTtile: '',//界面标题
                editLoading: false,
                editFormRules: {
                    groupName: [
                        { required: true, message: '请输入组名', trigger: 'blur' }
                    ],
                    permission: [
                        { required: true, message: '请输入权限', trigger: 'blur' }
                    ]
                },
                btnEditText:'确定',
                adminGroups: [],
            }
        },
        mounted(){
            this.getAdminGroups();
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getAdminGroups();
            },
            //获取所有分组列表
            getAdminGroups(){
                let param = {
                    sort: "user_group_id",
                    order: "asc",
                    offset: (this.page - 1) * 10,
                    limit: 10,
                    adminGroup:{
                        groupName:this.filters.name,
                    }
                };
                console.log(param);
               this.loading = true;
                NProgress.start();
                getAllAdminGroup(param).then((res) => {
                    if(res.status === 1){
                        this.adminGroups = res.result.adminGroup1;
                        this.total = res.result.total;
                        this.loading = false;
                        NProgress.done();
                    }

                });
            },

            //添加用户
            handleAdd: function (){

                this.editFormTtile = '添加分组';
                this.editForm.adminGroupId = -1;
                this.editForm.groupName = '';
                this.editForm.permission = '';
                // this.editForm.remark = '';
                // this.editForm.userGroupId = 2;
                this.editFormVisible = true;
            },
            //删除
            handleDel: function (row) {
                // console.log(row);
                // console.log(row.userId);
                var _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.Loading = true;
                    NProgress.start();
                    let param = new FormData();
                    param.append("adminGroupId", row.adminGroupId);
                    deleteAdminGroup(param).then((res) => {
                        if(res.status === 1){
                            _this.Loading = false;
                            NProgress.done();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.getAdminGroups();
                        }
                    });

                }).catch(() => {

                });
            },
            //修改时显示的编辑页面
            handleEdit: function (row) {
                //console.log("row,",row);

                this.editFormTtile = '修改';
                this.editFormTtile = '修改分组';
                this.editForm.adminGroupId = row.adminGroupId;
                this.editForm.groupName = row.groupName;
                this.editForm.permission = row.permission;
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

                            if (_this.editForm.adminGroupId === -1) {
                                //新增用户
                                let param = {
                                    groupName: _this.editForm.groupName,
                                    permission: _this.editForm.permission,
                                    // password: _this.editForm.password,
                                    // userGroupId: _this.editForm.userGroupId,
                                };
                                addAdminGroup(param).then((res) => {
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
                                        _this.getAdminGroups();
                                    }
                                });
                            } else {
                                //编辑用户
                                let param = {
                                    adminGroupId: _this.editForm.adminGroupId,
                                    groupName: _this.editForm.groupName,
                                    permission: _this.editForm.permission,
                                };
                                updateAdminGroupById(param).then((res) => {
                                    // console.log("!!!",res)
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
                                        _this.getAdminGroups();
                                    }
                                });

                            }

                        });

                    }
                });

            },
        }

    };
</script>

<style scoped>

</style>