<template>
  <div class="top" >
    <div class="imge1">
    <img src="/static/4.png" style="width: 100% ;height: 100%" />
    </div>
    <div class="center">
          <span style="color:#f4fff8;font-size: 65px;font-family: 楷体;font-weight:bold;">青田县城市微公交预约管理平台</span>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">

    <h3 class="title" style="font-family: 楷体;font-size: 30px;font-weight:bold;">管理员登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked style="margin:0px 0px 35px 0px;">记住密码</el-checkbox>
<el-form-item style="width:100%;">
<el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
<!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
</el-form-item>
</el-form>
    </div>
  </div>
</template>

<script>
  import { requestLogin ,adminLogin} from '../api/api';
  import NProgress from 'nprogress'
  export default {
    data() {
      return {

        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: false
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        let params = {
             username:this.ruleForm2.account,
             password:this.ruleForm2.checkPass
        }
        console.log(params)
        adminLogin(params).then(res => {
            if(res !=null) {
                if (res.data.status === 1) {
                    this.$router.push({path: '/order/complaint'});
                }
            }
            else {
              this.$notify({
                  title: '登录提示',
                  message: '登录失败，密码或者用户名错误！',
                  type: 'warning'
              });
          }
        })

      }
    }
  }
</script>

<style scoped>
  *{ overflow-y: hidden;
    overflow-x: hidden;
    }

  .top {
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    background: url("/static/3.jpg") no-repeat ;
      background-size:contain;
    background-size: 100% 100% ;
    moz-background-size:100% 100%;
      z-index:1;
    overflow-y: hidden;
    overflow-x: hidden;
    position: fixed;

  }
  .center{
    position: fixed;
      width: 940px ;
    /*position:absolute;*/
    left:25%;
    top:14%;
  }
  .imge1{
      position: absolute;
      top:5%;
      left:2%;
      width: 15% ;
      height: 24%;
  }
  .font1{
      position: absolute;
      left:28%;
      top:14%;
      width: 940px ;
      height: 88px;
  }
  .card-box {
    width: 40%;
    margin-left: 25%;
    margin-top: 5%;
    padding: 20px;
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: rgba(	256,256,256,1);
  }
  
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
    font-size: 20px;
  }
  
  .loginform {
    padding: 35px 35px 15px 35px;
  }
</style>