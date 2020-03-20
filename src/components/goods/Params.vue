<!--
 * @Author: your name
 * @Date: 2020-03-17 20:29:05
 * @LastEditTime: 2020-03-20 22:10:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\Params.vue
 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cat_opt">
        <!-- 选择商品分类 -->
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectdCatekeys"
            :options="cateList"
            :props="catCascaderPorps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页签区域 -->
       <el-tabs v-model="activeName" @tab-click="handleTabClick">
         <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many" >
             <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParmasDialog">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table
          :data="manyTableData"
          border
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <!-- 循环展示tags -->
            <template v-slot:default="scope">
              <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作" >
            <template v-slot:default="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParmasDialog">添加参数</el-button>
        <!-- 静态属性表格 -->
        <el-table
          :data="onlyTableData"
          border
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <!-- 循环展示tags -->
            <template v-slot:default="scope">
              <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作" >
            <template v-slot:default="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+ cateTitle"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules" label-width="100px">
        <el-form-item :label="cateTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParmasDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      @close="editDialogClosed"
      :title="'编辑'+ cateTitle"
      :visible.sync="editDialogVisible"
      width="30%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="cateTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      // 次级列表配置对象
      catCascaderPorps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定的数组
      selectdCatekeys: [],
      // 被激活页签的名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加参数对话框 默认关闭
      addDialogVisible: false,
      // 添加参数表单数据
      addForm: {
        attr_name: ''
      },
      // 修改参数表单数据
      editForm: {
        attr_name: ''
      },
      // 表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },
      // 修改参数对话框 默认关闭
      editDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 级联选择框变化会触发
    handleChange () {
      // console.log(this.selectdCatekeys)
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick () {
      // console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData () {
      // 证明选中的不是三级分类
      if (this.selectdCatekeys.length !== 3) {
        this.selectdCatekeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      // 证明选中的是三级分类
      // console.log(this.selectdCatekeys)
      // 根据所选分类的id和当前所处面板获取对应参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // 解决表格数据源问题
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加参数对话框
    addParmasDialog () {
      this.addDialogVisible = true
    },
    // 重置表单验证规则
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 监听修改参数对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      // console.log(res)
      this.editDialogVisible = true
    },
    // 重置提交表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改参数对话框
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 点击删除参数
    async removeParams (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('参数删除失败！')
      }
      this.$message.success('参数删除成功！')
      this.editDialogVisible = false
      this.getParamsData()
    },
    // 文本框失去焦点 或按下enter
    handleInputConfirm (row) {
      if (row.inputValue.trim() === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 若果没有return 则说明用户输入合法
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 文本自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应参数和选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮被禁用则返回true
    isBtnDisabled () {
      if (this.selectdCatekeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectdCatekeys.length === 3) {
        return this.selectdCatekeys[2]
      }
      return null
    },
    //
    cateTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px;
}
.el-tag {
    margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
