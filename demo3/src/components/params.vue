<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false">
            </el-alert>

            <p>
                <span>选择商品分类：</span>
                <el-cascader
                v-model="catekeys"
                :props="cateprop"
                :options="catelist"
                @change="catechange"
                clearable>
                </el-cascader>
            </p>

            <el-tabs v-model="activeName" @tab-click="tabclick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="small" type="primary"
                    :disabled="btndisabled" @click="showadd">添加参数</el-button>

                    <el-table class="many" :data="manydata" border stripe>
                        <el-table-column type="expand" v-slot="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-tag v-for="(item,index) in scope.row.attr_vals"
                                :key="index" closable :disable-transitions="true"
                                @close="deltag(index,scope.row)">
                                    {{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag"
                                size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </el-form>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作" v-slot="scope">
                            <el-button type="primary" size="small"
                            icon="el-icon-edit" @click="showedit(scope.row,'修改')">修改</el-button>
                            <el-button type="danger" size="small"
                            icon="el-icon-delete" @click="showedit(scope.row,'删除')">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button size="small" type="primary"
                    :disabled="btndisabled" @click="showadd">添加属性</el-button>

                    <el-table class="many" :data="onlydata" border stripe>
                        <el-table-column type="expand" v-slot="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-tag v-for="(item,index) in scope.row.attr_vals"
                                :key="index" closable :disable-transitions="true"
                                @close="deltag(index,scope.row)">
                                    {{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag"
                                size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </el-form>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作" v-slot="scope">
                            <el-button type="primary" size="small"
                            icon="el-icon-edit" @click="showedit(scope.row,'修改')">修改</el-button>
                            <el-button type="danger" size="small"
                            icon="el-icon-delete" @click="showedit(scope.row,'删除')">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
        :title="'添加' + titletext"
        :visible.sync="addcate"
        width="30%"
        @close="reset">
            <el-form :model="addForm" :rules="addrules" ref="addref" label-width="80px">
                <el-form-item :label="titletext" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcate = false">取 消</el-button>
                <el-button type="primary" @click="cateadd">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
        :title="this.e_d + titletext"
        :visible.sync="editcate"
        width="30%"
        @close="reset">
            <el-form :model="editForm" :rules="addrules"
            ref="addref" label-width="80px"
            :class="this.e_d == '删除'? 'none': 'block'">
                <el-form-item :label="titletext" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <div :class="this.e_d == '修改'? 'none': 'block a'">
                <i class="el-icon-warning"></i>
                <span class="Warning">一旦删除用户信息，将无法恢复！您确定要删除吗？！</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editcate = false">取 消</el-button>
                <el-button type="primary" @click="roolmodul">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeName:'many',
            e_d:'',
            inputValue:'',
            catelist:[],
            catekeys:[],
            manydata:[],
            onlydata:[],
            cateprop:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            addrules:{
                attr_name:[
                    { required: true, message: '不能为空', trigger: 'blur'}
                ]
            },
            addForm:{
                attr_name:'',
            },
            editForm:{},
            addcate:false,
            editcate:false,
            inputVisible:false,
        }
    },
    created(){
        this.getcatelist()
    },
    methods:{
        async getcatelist(){
            let {data:res} = await this.$http.get('categories')
            if(res.meta.status != 200){
                this.$message.error('分类信息获取失败！!')
            }else{
                this.catelist = res.data
            }
        },
        async catechange(){
            if(this.catekeys.length !=3){
                this.catekeys = []
                this.manydata = []
                this.onlydata = []
                return
            }
            console.log(this.catekeys[2]);

            let {data:res} = await this.$http.get(
                `categories/${this.cateid}/attributes`,{
                    params: {sel: this.activeName}
            })
            if(res.meta.status != 200){
                this.$message.error('获取失败！请选择商品的三级分类！')
            }else{
                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })
                if(this.activeName == 'many'){
                    this.manydata = res.data
                }else{
                    this.onlydata = res.data
                }
                console.log(res.data);
            }
        },
        tabclick(){
            this.catechange()
            // console.log(this.activeName);
        },
        reset(){
            this.$refs.addref.resetFields()
        },
        showadd(){
            this.addcate =true
        },
        cateadd(){
            this.$refs.addref.validate(async valid =>{
                if(!valid){
                    this.$message.error('校验失败，请确保数据的合法性！')
                }else{
                    let {data:res} = await this.$http.post(
                        `categories/${this.cateid}/attributes`,{
                            attr_name:this.addForm.attr_name,
                            attr_sel:this.activeName,
                    })
                    if(res.meta.status != 201){
                        this.$message.error('添加失败！！')
                    }else{
                        this.$message.success('添加成功！！')
                        this.catechange()
                        this.addcate = false
                    }
                }
            })
        },
        showedit(scope,str){
            this.e_d = str
            this.editmodul(scope.attr_id)
            this.editcate = true
            console.log(this.e_d);
        },
        roolmodul(){
            if(this.e_d != '删除'){
                this.edit()
            }else{
                this.del()
            }
        },
        edit(){
            this.$refs.addref.validate(async valid =>{
                if(!valid){
                    this.$message.error('校验失败，请确保数据的合理性')
                }else{
                    let {data:res} = await this.$http.put(
                        `categories/${this.cateid}/attributes/${this.editForm.attr_id}`,{
                            attr_name:this.editForm.attr_name,
                            attr_sel:this.activeName
                        })
                        if(res.meta.status != 200){
                            this.$message.error('修改'+this.titletext+'失败！！')
                        }else{
                            this.$message.success('修改'+this.titletext+'成功！！')
                            this.catechange()
                            this.editcate = false
                        }
                }
            })
        },
        async del(){
            let {data:res} = await this.$http.delete(
                `categories/${this.cateid}/attributes/${this.editForm.attr_id}`
            )
            if(res.meta.status != 200){
                this.$message.error('删除'+this.titletext+'失败！！')
            }else{
                this.$message.success('删除'+this.titletext+'成功！！')
                this.catechange()
                this.editcate = false
            }
        },
        async editmodul(id){
            let {data:res} = await this.$http.get(
                `categories/${this.cateid}/attributes/${id}`,{
                    params:{attr_sel:this.activeName}
            })
            if(res.meta.status != 200){
                this.$message.error('获取参数信息失败')
            }else{
                this.editForm = res.data
                console.log(this.editForm);
            }
        },
        async saveattr(scope){
            let {data:res} = await this.$http.put(
                `categories/${this.cateid}/attributes/${scope.attr_id}`,{
                    attr_name:scope.attr_name,
                    attr_sel:scope.attr_sel,
                    attr_vals:scope.attr_vals.join(' ')
            })
            if(res.meta.status != 200){
                this.$message.error('修改'+this.titletext+'失败！')
            }else{
                this.$message.success('修改'+this.titletext+'成功！')
            }
                scope.inputVisible = false
        },
        async handleInputConfirm(scope){
            if(scope.inputValue.trim().length == 0){
                scope.inputValue = ''
                scope.inputVisible = false
                return
            }else{
                scope.attr_vals.push(scope.inputValue.trim())
                scope.inputValue = ''
                this.saveattr(scope)
            }
        },
        showInput(scope){
            scope.inputVisible = true
            // $nextTick是当页面上元素重新渲染时，就调用函数下的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        deltag(index,scope){
            scope.attr_vals.splice(index,1)
            this.saveattr(scope)
        },
    },
    computed:{
        btndisabled(){
            if(this.catekeys.length != 3){
                return true
            }else{
                return false
            }
        },
        cateid(){
            if(this.catekeys.length == 3){
                return this.catekeys[2]
            }else
                return null
        },
        titletext(){
            if(this.activeName == 'many'){
                return '动态参数'
            }else 
                return '静态属性'
        },
    },
}
</script>
<style lang="less" scoped>
.many{
    margin-top: 10px;
}
.none{
    display: none;
}
.block{
    display: block;
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
  .el-tag{
      margin: 0 10px 10px 0;
  }
  .input-new-tag{
      width: 120px;
  }
</style>