<template>
  <div>
    <!-- 行内搜索的三个表单-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 30px">
      <!--// 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名， 指定了才会生效-->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px">
          <!--          不要忘记绑定到data中-->
          <el-option v-for="option in payTypeOptions" :key="option.type"
                     :label="option.name"
                     :value="option.type">
          </el-option>

        </el-select>
      </el-form-item>

      <!--      value-format="yyyy-MM-dd" 指定绑定的格式  -->
      <el-form-item prop="birthday">
        <el-date-picker
            style="width: 200px"
            v-model="searchMap.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="出生日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>

      </el-form-item>

    </el-form>

    <!--    主体表格区域-->
    <el-table
        :data="list"
        height="380"
        border
        style="width: 100%">
      <!--      type = "index" 获取索引值  ，从1开始，label显示标题，prop数据字段名-->
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="90"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>

      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="会员地址"></el-table-column>

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

    <!--    分页组件  -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <!--    弹出新增窗口
        title: 窗口标题
        :visible.sync 当它为true的时候，窗口会被弹出
    -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
          :rules="rules"
          ref="pojoForm"
          label-width="120px"
          label-position="right"
          style="width: 400px"
          :model="pojo">

        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>

        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>

        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
              style="width: 200px"
              v-model="pojo.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="会员生日">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>

        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>

        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>

        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width: 110px">
            <!--    不要忘记绑定到data中-->
            <el-option v-for="option in payTypeOptions" :key="option.type" :label="option.name" :value="option.type">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
<!--        <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>-->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import memberApi from "@/api/member";

// 支付类型
const payTypeOptions = [
  {type: '1', name: '现金'},
  {type: '2', name: '微信'},
  {type: '3', name: '支付宝'},
  {type: '4', name: '银行卡'},
]


export default {
  data() {
    return {
      list: [],
      total: 0,//总记录数
      currentPage: 1,//默认页码
      pageSize: 20,  //每页显示10条数据
      searchMap: {
        cardNum: '',
        name: '',
        payType: '',
        birthday: ''
      },
      //条件查询绑定的条件值
      payTypeOptions,
      dialogFormVisible: false, //弹出对话框
      pojo: {
        //提交的数据
        id: null,
        cardNum: '',
        name: '',
        birthday: '',
        phone: '',
        money: 0,
        integral: 0,
        payType: '',
        address: ''

      },
      rules: {
        //校验规则
        cardNum: [{required: true, message: '卡号不能为空', trigger: 'blur'}],
        name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
        payType: [{required: true, message: '支付类型不能为空', trigger: 'change'}]
      }
    }
  },
  created() {
    //初始化获取列表数据
    this.fetchData()
  },
  methods: {
    //当每页显示条数改变后，被触发 ,val是最新的 每一页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    //当页码改变后被处罚，val是最新的页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()

    },
    fetchData() {
      //调用分页查询数据
      memberApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        const resp = response.data
        this.list = resp.data.rows
        this.total = resp.data.total
      })
    },
    handleEdit(id) {
      console.log("编辑" + id)
      //打开编辑窗口  异步清空
      this.handleAdd()
      memberApi.getById(id).then(response =>{
        const resp = response.data
        if(resp.flag){
          //查询成功
          this.pojo = resp.data
          console.log(this.pojo)
        }
      })

    },
    //删除会员
    handleDelete(id) {
      console.log("删除", id)
      this.$confirm('确认删除这条记录吗？','提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(()=>{
        //点击确认
        console.log('确认删除')
        memberApi.deleteById(id).then(response =>{
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
      this.$refs[formName].validate(valid =>{
        if(valid){
          //提交更新成功
          memberApi.update(this.pojo).then(response =>{
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
    },

    //重置
    resetForm(formName) {
      // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名， 指定了才会生效
      this.$refs[formName].resetFields()
    },
    //提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交
          memberApi.add(this.pojo).then(response => {
            const resp = response.data
            if (resp.flag) {
              //新增成功 ,刷新列表数据 就是 重新获取最新数据
              this.fetchData()
              //然后关闭窗口
              this.dialogFormVisible = false
            } else {
              // 失败 提示信息
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
          // console.log('addData success')
        } else {
          return false;
        }
      })
    },
    //弹出新增窗口
    handleAdd() {
      // this.pojo = {}  这是解决方案1
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick 是一个异步事件 ，当渲染结束之后 他的回调函数才会执行
        //弹出窗口打开后，需要加载Dom,  表单没有渲染 不能清除  我们要等待加载完Dom 在调用 重置表单
        this.$refs['pojoForm'].resetFields()
      })
    }
  },
  filters: {
    payTypeFilter(type) {
      // (obj => obj.type === type)
      /**
       *   回调函数 ,obj  里面是数组的 每一个数据
       *   obj.type === type  如果  相等  即条件满足 那么就把 obj返回出去
       */
      const payObj = payTypeOptions.find((obj) => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
}
</script>
