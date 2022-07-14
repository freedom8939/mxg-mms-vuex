<template>
  <div class="header">
    <a href="/">
      <img class="logo" src="@/assets/logo.png" width="25px"/>
      <span class="company" >会员管理系统</span>
    </a>

    <el-dropdown @command="handleCommand">

       <span class="el-dropdown-link">
        {{ user.name }}
         <i class="el-icon-arrow-down el-icon--right"></i>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>
    <!--    修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 320px">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {logout} from "@/api/login"
import passwordApi from "@/api/password"

export default {
  data() {
    //在 return 上面进行自定义校验
    //校验旧密码是否正确
    const validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data
        if (resp.flag) {
          //验证通过
          callback()
        } else {
          //验证失败
          callback(new Error(resp.message))
        }
      })
    }
    //校验确认密码是否一致
    const validatePass = (rule, value, callback) => {
      //value: 值得是 checkPass
      if(value !== this.ruleForm.pass){
        callback(new Error( '两次输入的密码不一致' ))
      }else{
        //相等 则 通过
        callback()
      }
    }
    //注意在return 上面不能用逗号结束
    return {
      user: JSON.parse(localStorage.getItem("mxg-msm-user")),
      dialogFormVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          {required: true, message: '原密码不能为空', trigger: 'blur'},
          {validator: validateOldPass, trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '新密码不能为空', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {validator: validatePass, trigger: 'change'}

        ]
      },
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'a':
          // 打开修改密码窗口
          this.handlePwd()
            this.$nextTick(()=>{
              this.$refs['ruleForm'].resetFields()
            })
          break;
        case 'b':
          this.handleLogout()
          break;
        default:
          break;
      }
    },
    handleLogout() {
      logout(localStorage.getItem("mxg-msm-token")).then(response => {
        const resp = response.data;
        if (resp.flag) {
          //退出成功
          //清楚本地数据
          localStorage.removeItem("mxg-msm-user")
          localStorage.removeItem("mxg-msm-token")
          //回到登录页面
          this.$router.push('/login')
        } else {
          this.$message({
            message: resp.message,
            type: 'warning',
            duration: 500  //弹出停留时间
          })
        }
      })

    },
    //打开修改密码窗口
    handlePwd() {
      this.dialogFormVisible = true
    },
    //修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response=>{
            const resp = response.data
            //无论成功失败都进行题型
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'warning'
            })
            if(resp.flag){
              //更新成功,退出系统 回到登录页
              this.handleLogout()
              //关闭窗口
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}

.company {
  position: absolute;

  color: white;
}

/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>
