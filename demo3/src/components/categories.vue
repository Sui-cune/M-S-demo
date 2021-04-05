<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary" @click="showaddcate">添加分类</el-button>
            
            <tree-table :data="catelist" :columns="columns"
            :selection-type="false" :expand-type="false"
            show-index index-text="#" border class="tree-table">
                <template class="isok" #isok="scope">
                    <i class="el-icon-success"
                    v-if="scope.row.cat_deleted == false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template #order="scope">
                    <el-tag size="small" 
                    v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag size="small" type="success"
                    v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag size="small" type="warning"
                    v-else>三级</el-tag>
                </template>
                <template #select="scope">
                    <el-button type="primary" size="small"
                    icon="el-icon-edit" @click="showedit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"
                    icon="el-icon-delete" @click="showdel(scope.row)">删除</el-button>
                </template>
            </tree-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
            title="添加分类"
            :visible.sync="addcate"
            width="30%"
            @close="reset">
            <el-form :model="addcateform" :rules="addcaterules"
            ref="addcateref" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addcateform.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                   <el-cascader
                    v-model="catekeys"
                    :props="cascaderprop"
                    :options="parentcatelist"
                    @change="parentcatechange"
                    clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcate = false">取 消</el-button>
                <el-button type="primary" @click="cateadd">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="修改分类"
            :visible.sync="editcate"
            width="30%"
            @close="reset">
            <el-form :model="editcatefrom" :rules="addcaterules"
            ref="addcateref" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editcatefrom.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editcate = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="警告！！" :visible.sync="warning"
        width="600px" @close="reset">
        <div class="a">
          <i class="el-icon-warning"></i>
          <span class="Warning">一旦删除用户信息，将无法恢复！您确定要删除吗？！</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="warning = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            queryinfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            addcateform:{
                cat_name:'',
                cat_pid: 0,
                cat_level: 0
            },
            addcaterules:{
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            cascaderprop:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'click',
                checkStrictly:'true',
            },
            editcatefrom:{},
            catelist:[],
            parentcatelist:[],
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name',
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok'
                },
                {
                    label:'排序',
                    type:'template',
                    template:'order'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'select'
                }
            ],
            catekeys:[],
            total:0,
            del_id:0,
            addcate:false,
            editcate:false,
            warning:false,
        }
    },
    created(){
        this.getcatelist()
    },
    methods:{
        async getcatelist(){
            let {data:res} = await this.$http.get('categories',{
                params:this.queryinfo
            })
            if(res.meta.status != 200){
                this.$message.error('获取商品分类失败')
            }else{
                this.catelist = res.data.result
                this.total = res.data.total
                // console.log(this.catelist);
            }
        },
        handleSizeChange(newsize){
            this.queryinfo.pagesize = newsize
            this.getcatelist()
        },
        handleCurrentChange(newpage){
            this.queryinfo.pagenum = newpage
            this.getcatelist()
        },
        showaddcate(){
            this.getparentcate()
            this.addcate = true
        },
        reset(){
            this.$refs.addcateref.resetFields()
            this.catekeys = []
            this.addcateform.cat_pid = 0
            this.addcateform.cat_level = 0
            this.del_id = 0
        },
        async getparentcate(){
            let {data:res} = await this.$http.get('categories',{
                params:{type:2}
            })
            if(res.meta.status != 200){
                this.$message.error('父级数据获取失败！！')
            }else{
                this.parentcatelist = res.data
            }
        },
        parentcatechange(){
            console.log(this.catekeys);
            if(this.catekeys.length > 0){
                this.addcateform.cat_pid = this.catekeys[this.catekeys.length - 1]
                this.addcateform.cat_level = this.catekeys.length
            }else{
                this.addcateform.cat_pid = 0
                this.addcateform.cat_level = 0
            }
        },
        cateadd(){
            this.$refs.addcateref.validate(async valid =>{
                if(!valid){
                    this.$message.error('校验失败，请确认添加信息是否合法')
                }else{
                    let {data:res} = await this.$http.post('categories',this.addcateform)
                    if(res.meta.status != 201){
                        this.$message.error('添加分类失败！！')
                    }else{
                        this.$message.success('添加分类成功！！')
                        this.getcatelist()
                        this.addcate = false
                    }
                }
            })   
        },
        async showedit(scope){
            let {data:res} = await this.$http.get('categories/'+ scope.cat_id)
            if(res.meta.status != 200){
                this.$message.error('获取失败！！！')
            }else{
                this.editcatefrom = res.data
                this.editcate = true
            }
            // console.log(scope);
        },
        edit(){
            this.$refs.addcateref.validate(async valid=>{
                if(!valid){
                    this.$message.error('校验失败！请检查信息是否合法！')
                }else{
                    let {data:res} = await this.$http.put('categories/' + this.editcatefrom.cat_id,{
                        cat_name:this.editcatefrom.cat_name
                    })
                    if(res.meta.status != 200){
                        this.$message.error('分类更改信息失败！！')
                    }else{
                        this.$message.success('分类信息更新成功！！')
                        this.getcatelist()
                        this.editcate = false
                    }
                }
            })
        },
        showdel(scope){
            this.del_id = scope.cat_id
            this.warning = true
            // console.log(this.del_id);
        },
        async del(){
            let {data:res} = await this.$http.delete('categories/' + this.del_id)
            if(res.meta.status != 200){
                this.$message.error('分类删除失败！！')
            }else{
                this.$message.success('分类删除成功！！')
                this.getcatelist()
                this.warning = false
            }
        }
    }
}
</script>

<style lang="less" scoped>
.el-icon-success{
    font-size: 20px;
    color: lightgreen;
}
.el-icon-error{
    font-size: 20px;
    color: red;
}
.tree-table{
    margin-top: 10px;
}
.el-cascader{
    width: 100%;
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