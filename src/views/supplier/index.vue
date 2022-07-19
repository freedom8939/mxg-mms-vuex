<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 30px">
      <!--// 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名， 指定了才会生效-->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 200px"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>

    </el-form>
    <!--      主体表格
            highlight-current-row 激活单选行
           @current-change="handleCurrentChange" 当点击某一行后 ，会调用响应的函数
           还会接受两个参数 currentRow,oldCurrentRow
-->
    <el-table
        :data="list"
        height="380"
        :highlight-current-row = "isDialog"
        @current-change="HandleCurrentChange"
        border
        style="width: 100%">
      <!--      type = "index" 获取索引值  ，从1开始，label显示标题，prop数据字段名-->
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="90"></el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话"></el-table-column>
      <el-table-column v-if="!isDialog"  prop="remark" label="备注"></el-table-column>
      <el-table-column  v-if="!isDialog" label="操作" width="150">
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
    <!--       分页组件-->
    <el-pagination
        :layout="!isDialog ?  'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
        @size-change="handleSizeChange"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :total="total">
    </el-pagination>

    <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
          :rules="rules"
          ref="pojoForm"
          label-width="120px"
          label-position="right"
          style="width: 400px"
          :model="pojo">

        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>

        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
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
import supplierApi from "@/api/supplier"

export default {
  //接收父组件传递过来的isDialog=“true"
  props:{
    //通过isDailog是否是弹框 如果是true 是弹窗 反之
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      pageSize: 10,//每页显示 10 条
      currentPage: 1, //当前页码
      total: 0, //总记录数
      searchMap: {
        name: '',
        mobile: '',
        linkman: ''
      }, //条件查询的绑定字段值
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: '',
        linkman: '',
        mobile: '',
        remark: ''
      },
      rules: {
        name: [{required: true, message: '供应商不能为空', trigger: 'blur'}],
        linkman: [{required: true, message: '联系人不能为空', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      supplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        const data = response.data.data
        this.list = data.rows
        this.total = data.total
      })
    },

    // 当每页显示条数改变后 调用该方法,val是改变后的条数
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
      //以上两行代码解读： 我们需要重新赋值给data中的数据
      //以便调用this.fetchData重新拉取数据展示
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //打开新增窗口
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields()
        this.pojo.id = null
      })
    },
    //提交新增表单
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data
            if (resp.flag) {
              //新增成功
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              //新增失败
              this.$message({
                message: response.message,
                type: 'warning'
              })
            }
          })
        } else {
          //不提交表单
          return false
        }
      })
    },

    handleDelete(id) {
      console.log('删除',id)
      this.$confirm('确认删除这条记录？','提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(()=>{
        supplierApi.deleteById(id).then(response=>{
          const resp = response.data

          this.$message({
            message: resp.message,
            type: resp.flag ? 'success' : 'error'
          })

          if(resp.flag){
            //删除成功，刷新数据
              this.fetchData()
          }
        })
      }).catch(()=>{
        //取消删除  不写逻辑
      })

    },
    //打开编辑窗口
    handleEdit(id) {
      // console.log('编辑', id)
      //清除原来的表单数据和校验结果
      this.handleAdd()
      supplierApi.getById(id).then(response => {
        const resp = response.data
        if (resp.flag) {
          this.pojo = resp.data
        } else {
          //提示获取数据失败
          this.$message({
            message: resp.message,
            type: 'warning'
          })
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //页面校验通过 更新数据
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data
            if (resp.flag) {
              //更新成功，刷新数据，关闭窗口
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })


    },
    //当点击某一行时会调用这个函数
    HandleCurrentChange(currentRow){
      //子组件向父组件传递值(传递到商品管理中)
      // 父组件可以在 option-supplier 这个适应对应的处理函数中进行接收数据
      this.$emit('option-supplier',currentRow)
    }
  }
}
</script>

<style scoped>

</style>
