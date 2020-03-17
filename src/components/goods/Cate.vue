<!--
 * @Author: your name
 * @Date: 2020-03-16 10:14:16
 * @LastEditTime: 2020-03-16 10:15:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\List.vue
 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
      <!-- 添加分类按钮 -->
        <el-button @click="showAddCateDialog" class="addBtn" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <el-col>
          <!-- 分类表格 -->
          <tree-table border class="treeTable" index-text="#"
            :data="cateList"
            :columns="columns"
            :expand-type="false"
            :selection-type="false"
            :show-index="true">
            <!-- 是否有效 -->
            <template #isok="scoped">
              <i class="el-icon-success" v-if="scoped.row.cat_deleted === false" style="color: lightgreen"></i>
              <i class="el-icon-error" style="color: red" v-else></i>
            </template>
            <!-- 等级 -->
            <template #islevel="scoped">
              <!-- {{scoped.row.cat_level}} -->
              <el-tag type="success" v-if="scoped.row.cat_level === 0">等级一</el-tag>
              <el-tag type="info" v-else-if="scoped.row.cat_level === 1">等级二</el-tag>
              <el-tag type="warning" v-else>等级三</el-tag>
            </template>
            <template #isopt="scoped">
              <el-button class="el-icon-edit" type="primary" size="mini" @click="showEditCateDialog(scoped.row.cat_id)">编辑</el-button>
              <el-button class="el-icon-delete" type="danger" size="mini" @click="deleteCateById(scoped.row.cat_id)">删除</el-button>
            </template>
            </tree-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum "
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="sizes, prev, pager, next, total, jumper"
              :total="total">
            </el-pagination>
        </el-col>
      </el-row>
      <!-- 分页区域 -->
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      @close="addCateDialogClosed"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <el-form
       :model="addCateForm"
       :rules="addCateFormRules"
       ref="addCateFormRef"
       label-width="100px">
        <el-form-item label="分类名称:"  prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
         <div class="block">
           <!-- options数据源 -->
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderPorps"
            @change="parentCateChange"></el-cascader>
        </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      @close="editCateDialogClosed"
      :visible.sync="editCateDialogVisible"
      width="30%">
      <el-form
      :model="editForm"
      :rules="editCateFormRules"
      ref="editCateFormRef" label-width="90px">
        <el-form-item label="分类名称:" prop="cat_name" >
          <el-input clearable v-model="editForm.cat_name" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表默认为空
      cateList: [],
      // 获取用户列表参数对象
      queryInfo: {
        type: 3,
        // 当前页数
        pagenum: 1,
        //  每页显示的条数
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 控制添加分类对话框显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 默认一级分类
        cat_level: 0
      },
      // 父级分类列表
      parentCateList: [],
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 修改用户分类表单验证规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 指定级联选择器的配置对象
      cascaderPorps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑分类弹窗的显示与隐藏
      editCateDialogVisible: false,
      editForm: {
        cat_id: '',
        cat_name: ''
      },
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示当前列定义为模板页
        type: 'template',
        // 当前模板名称
        template: 'isok'
      },
      {
        label: '等级',
        // 表示当前列定义为模板页
        type: 'template',
        // 当前模板名称
        template: 'islevel'
      },
      {
        label: '操作',
        type: 'template',
        template: 'isopt'
      }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 监听商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // 将数据列表赋值给cateList
      this.cateList = res.data.result
      // 将总条数赋值给total
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页码值
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择器发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 如果selectKeys数组中的length的长度大于0 证明选中父级分类
      // 反之就说名没有选中
      // 父级分类id
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        this.addCateForm.cat_pid = 0
        // 当前分类等级
        this.addCateForm.cat_level = 0
      }
    },
    // 点击添加新分类
    async addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) { return false }
      })
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      if (res.meta.status !== 200) {
        this.$message.error('添加分类失败!')
      }
      this.$message.success('添加分类成功')
      this.getCateList()
      this.addCateDialogVisible = false
    },
    // 监听对话框关闭重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 监听编辑用户分类弹框显示与隐藏
    async showEditCateDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('修改分类失败!')
      }
      this.editForm = res.data
      this.editCateDialogVisible = true
    },
    // 修改分类信息并提交
    editCateInfo () {
      // 提交之前二次验证
      // console.log(this.editForm)
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) { return false }
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败!')
        }
        this.editCateDialogVisible = false
        this.getCateList()
        this.$message.success('修改分类成功')
      })
    },
    // 重置表单
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 根据id删除分类
    async deleteCateById (id) {
      // 弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功!')
      this.getCateList()
    }
  }
}
</script>
<style lang="less">
.treeTable{
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
