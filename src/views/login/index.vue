<template>

  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">yuan yuan's member manager system</h2>
      <el-form-item label="username" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {login, getUserInfo} from '@/api/login'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '帐号不能为空', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    //方法开始
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单给后端验证
          this.$store.dispatch('Login', this.form).then(response => {
            // reponse就是后台相应回来的真实对象
            if (response.flag) {
              this.$router.push('/')
            } else {
              this.$message({
                message: response.message,
                type: 'warning'
              })
            }
          }).catch(error => {

          })
        } else {
          //如果不合法 （未填项）
          console.log('有未填项等')
          return false
        }
      })
    }
    //方法结束
  }
}
</script>

<style scoped>
.login-form {
  width: 350px;
  /* 上下间隙 160px, 左右自动居中 */
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}

.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/login.jpg')
}

.login-title {
  color: #303133;
  text-align: center;
}
</style>
