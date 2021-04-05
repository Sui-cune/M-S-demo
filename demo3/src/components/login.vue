<template>
  <div class="login">
    <div class="login_box">
      <div class="img_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <el-form :model="loginFrom" :rules="rules" ref="loginRef">
          <el-form-item class="login_t" prop="username">
            <el-input prefix-icon="el-icon-s-custom" v-model='loginFrom.username' class="" placeholder="用户名"></el-input>
          </el-form-item>

          <el-form-item class="login_t" prop='password'>
            <el-input prefix-icon="el-icon-lock" type="password" v-model="loginFrom.password" class="" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item class="login_btn">
            
            <el-button :plain='true' type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
    name:'login',
  data(){
    return{
      loginFrom:{
        username:'',
        password:'',
      },
      rules:{
        username:[
          {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        ],
        password:[
          {min:6,max:11,message:'长度在 6 到 11 个字符',trigger:'blur'}
        ]
      },
    }
  },
  methods:{
    reset(){
      this.$refs.loginRef.resetFields()
    },
    login(){
      this.$refs.loginRef.validate(async valid =>{
          if(!valid)  return;
          const {data:res} = await this.$http.post('login',this.loginFrom);
          // console.log(res);
          if(res.meta.status !='200')
            this.$message({
              type:'error',
                //dangerouslyUseHTMLString可让message识别HTML标签
              dangerouslyUseHTMLString:'true',
              message:'<span>用户不存在，请确认用户名和密码是否错误</span>'
            })
          else{
            this.$message({
              type:'success',
              dangerouslyUseHTMLString:'true',
              message:'<span>您好！用户 '+this.loginFrom.username+' 欢迎您的光临！</span>'
            })
            window.sessionStorage.setItem('token',res.data.token)
                // 编程式导航跳转后台页面
            this.$router.push('/main')
          }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login{
  display: flex;
  justify-self: center;
  align-items: center;
  background-color: teal;
  height: 100%;
}
.login_box{
  height: 400px;
  width: 550px;
  background-color: white;
  border-radius: 5px;
  margin: 0 auto;
  box-shadow: 3px 5px 8px 2px rgba(0, 0, 0, .4);
}
.img_box{
  height: 150px;
  width: 150px;
  margin: 0 auto;
  margin-bottom: 40px;
  text-align: center;
  padding: 10px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px 0 #ddd;
  background-color: white;
  border-radius: 50%;
  margin-top: -85px;
  img{
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_t{
  margin-left: 20px;
  margin-right: 20px;
}
.login_btn{
  text-align: center;
}
</style>