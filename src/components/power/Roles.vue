<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border>
        <el-table-column type="expand">
          <template v-slot:default="scoped">
            <!-- 渲染一级权限 -->
            <el-row :class="['bdbottom', indexOne === 0 ? 'bdtop' : '','vcenter' ]" v-for="(itemOne, indexOne) in scoped.row.children" :key="itemOne.id">
              <el-col :span="5">
                <el-tag>{{itemOne.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
            <!-- 渲染二级权限 -->
            <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[ indexTwo === 0 ? '' : 'bdtop' ,'vcenter']" v-for="( itemTwo, indexTwo) in itemOne.children" :key="indexTwo.id">
                  <el-col :span="6">
                    <el-tag type="success">{{ itemTwo.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 竖向排列 -->
                    <!-- <el-row :class="[ itemThree === 0 ? '' : 'bdtop' ]" v-for="( itemThree, indexThree) in itemTwo.children" :key="indexThree.id"> -->
                      <!-- 横向排列 -->
                      <el-col>
                        <el-tag @close="removeRightById(scoped.row, itemThree.id)" closable type="warning" v-for="(itemThree) in itemTwo.children" :key="itemThree.id" >{{ itemThree.authName }}</el-tag>
                      </el-col>
                    <!-- </el-row> -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- {{ scoped.row }} -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot:default="scoped">
            <!--  -->
            <el-button type="primary" class="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" class="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" class="el-icon-s-tools" size="mini" @click="shwoSetRightDialog(scoped.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightsList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClosed = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 角色数据列表
      roleList: [],
      // 分配角色弹框默认不显示
      setRightDialogVisible: false,
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的节点的 key 的数组
      defKeys: [],
      // 当前即将分配权限的角色id值
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败了！')
      }
      this.getRolesList()
    },
    // 展示分配角色权限弹框
    async shwoSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色权限失败！')
      }
      // 把获取到的权限数据保存到数组
      this.rightsList = res.data
      // console.log(this.rightsList)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归 查询三局目录下的所有权限id，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node没有children属性 则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果有children属性则不是三级节点 通过for循环当前节点 递归继续判断
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败！')
      }
      this.$message.success('分配角色权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
