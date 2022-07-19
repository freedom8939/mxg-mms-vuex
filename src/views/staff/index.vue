<template>
  <div>

    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 30px">

      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>

      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="审批人"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>

    </el-form>

    <el-table
        :data="list"
        height="380"
        border
        style="width: 100%">
      <!--      type = "index" 获取索引值  ，从1开始，label显示标题，prop数据字段名-->
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="90"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.row.id)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="500px">
      <el-form
          :rules="rules"
          ref="pojoForm"
          label-width="120px"
          label-position="right"
          style="width: 400px"
          :model="pojo">

        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
              style="width: 200px"
              v-model="pojo.entryDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="入职时间">
          </el-date-picker>

        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import staffApi from "@/api/staff"
export default {
  data(){
    return {
      list:[],
      searchMap: {
        username: '',
        name: ''
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      pojo:{
        id: null,
        username: '',
        name: '',
        age: 0,
        mobile: '',
        salary: 0.0,
        entryDate: '',
      },
      rules:{
        username:[{required:true,message: '账号必填项',trigger:'blur'}],
        name:[{required:true,message: '名称必填项',trigger:'blur'}]
      },
      dialogFormVisible: false
    }
  },
  methods:{
    handleSizeChange(val){
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.fetchData()

    },
    //查询拉取数据
    fetchData(){
      staffApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
        const resp = response.data
        this.total = resp.data.total
        this.list=resp.data.rows

      })
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields()
        this.pojo.id = null
      })
    },
    addData(formName){
      console.log('新增')
        this.$refs[formName].validate(valid=>{
          if(valid){
            //通过验证
            staffApi.add(this.pojo).then(response=>{
              const resp = response.data
              if(resp.flag){
                //提交成功
                this.$message({
                  message: '新增成功，初始密码为123456',
                  type: "success"
                })
                this.fetchData()
                this.dialogFormVisible = false
              }else{
                this.$message({
                  message: resp.message,
                  type: 'warning'
                })
              }
            })
          }else{
            //未通过验证,不提交表单
            return false
          }
        })
    },
    handleEdit(id){
      this.handleAdd()
      staffApi.getById(id).then(response=>{
        const resp = response.data
        console.log(resp.data)
        this.pojo = resp.data
      })
    },
    handleDelete(id){
      this.$confirm('确认删除这条记录吗？','提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(()=>{
        //点击确认
        staffApi.deleteById(id).then(response =>{
          const resp = response.data

          this.$message({
            message: resp.message,
            type: resp.flag ? 'success' : 'error'
          })


          if(resp.flag){
            //删除成功,刷新列表数据
            this.fetchData()
          }else{
            //删除失败
          }
        })
      }).catch(()=>{
        //点击取消 ， 不用理会
        // console.log('取消')
      })

    },
    updateData(formName){
      console.log('更新')
      this.$refs[formName].validate(valid =>{
        if(valid){
          //提交更新成功
          staffApi.update(this.pojo).then(response =>{
            const resp = response.data
            if(resp.flag){
              //刷新列表
              this.fetchData()
              this.dialogFormVisible = false
            }else{
              //更新失败
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        }else{
          //提交更新失败
          return false
        }
      })
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

