<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary" class="addrole">添加角色</el-button>
            <el-table :data="roleslist" border stripe height="700">
                <el-table-column type="expand" v-slot="scope">
                    <el-row class="level1"
                    v-for="level1 in scope.row.children"
                    :key="level1.id">
                        <el-col :span="5">
                            <el-tag closable
                            @close="tag(scope.row,level1.id)">{{level1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row
                             v-for="level2 in level1.children"
                             :key="level2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable
                                    @close="tag(scope.row,level2.id)">{{level2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag v-for="level3 in level2.children"
                                    :key="level3.id" type="warning" closable
                                    @close="tag(scope.row,level3.id)">{{level3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-table-column>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column label="角色名称" min-width="100px" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" min-width="150px" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" min-width="300px" v-slot="scope">
                    <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button size="small" type="warning" icon="el-icon-s-tools"
                    @click="showroot(scope.row)">权限设置</el-button>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="警告！！" :visible.sync="remove"
        width="600px" @close="reset">
            <div class="a">
                <i class="el-icon-warning"></i>
                <span class="Warning">一旦删除用户信息，将无法恢复！您确定要删除吗？！</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="remove = false">取 消</el-button>
                <el-button type="primary" @click="Del">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="分配权限" :visible.sync="setroot"
            width="30%" @close="reset">
            <el-tree :data="setrootlist" :props="treeprop"
            show-checkbox node-key="id" default-expand-all
            :default-checked-keys="rootkeys" ref="treeref"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setroot = false">取 消</el-button>
                <el-button type="primary" @click="addsetroot">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            roleslist:[],
            setrootlist:[],
            rootkeys:[],
            treeprop:{
                children:'children',
                label:'authName',
            },
            tag_roleid:0,
            tag_rightid:0,
            setrootid:0,
            remove:false,
            setroot:false,
        }
    },
    methods:{
        // 当前scope下三级权限数据更新函数
        rool(data){
            for(let i=0;i<this.roleslist.length;i++){
                if(this.roleslist[i].id==this.tag_roleid){
                    this.roleslist[i].children=data
                    // console.log(this.roleslist[i].children);
                }
            }
        },
        async showroot(role){
            let {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status != 200){
                this.$message.error('权限信息获取失败！！')
            }else{
                this.setrootlist = res.data
                this.getsetrootkeys(role,this.rootkeys)
                this.setrootid = role.id
                // console.log(this.setrootlist);
                this.setroot = true
            }
        },
        async getroles(){
            let {data:res} = await this.$http.get('roles')
            if(res.meta.status != 200){
                this.$message.error('获取角色权限信息失败QAQ')
            }else{
                this.roleslist = res.data
                // console.log(this.roleslist);
            }
        },
        async addsetroot(){
            let keys = [
                ...this.$refs.treeref.getCheckedKeys(),
                ...this.$refs.treeref.getHalfCheckedKeys()
            ]
            let idstr = keys.join(',')
            let {data:res} = await this.$http.post(
                `roles/${this.setrootid}/rights`,
                {rids:idstr}
            )
            if(res.meta.status != 200){
                this.$message.error('分配权限失败！！')
            }else{
                this.$message.success('分配权限成功！!')
                this.getroles()
                this.setroot = false
            }
        },  
        //通过递归获取所有三级权限保存在rootkey中
        getsetrootkeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item =>
                this.getsetrootkeys(item,arr))
        },
        reset(){
            this.tag_id = null 
            this.tag_scope = null
            // 没次关闭让rootkeys为空数组，不能为“null”
            // 这样会使数组类型变成布尔类型，只能用“[]”
            this.rootkeys = []
            this.setrootid = null
        },
        tag(role,id){
            this.remove = true
            this.tag_roleid = role.id
            this.tag_rightid = id
        },
        async Del(){
            let {data:res} = await this.$http.delete(
                `roles/${this.tag_roleid}/rights/${this.tag_rightid}`
                )
            if(res.meta.status != 200){
                this.$message.error('权限删除失败！')
            }else{
                this.$message.success('权限删除成功！！')
                this.remove = false
                console.log(res.data);
                this.rool(res.data)
                
            }
        },
    },
    created(){
        this.getroles()
    }
}
</script>

<style lang="less" scoped>
.addrole{
    margin-bottom: 10px;
}
.el-tag{
    margin: 7px;
}
.level1:first-child{
    border-top: 1px solid #eee;
}
.level1 .el-row,.level1{
    border-bottom: 1px solid #eee;
}
.level1 .el-row:last-child{
    border-bottom: none;
}
.el-row{
    display: flex;
    align-items: center;
}
.el-col{
    min-width: 100px;
}
.a{
    display: flex;
    .el-icon-warning{
    color: orange;
    font-size: 40px;
    margin-right: 10px;
    }
    .Warning{
      line-height: 40px;
      font-size: 20px;
      color: orangered;
    }
  }
</style>