<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert title="添加商品信息" type="info"
            center show-icon :closable="false"></el-alert>

            <el-steps :space="200" :active="activeindex - 0"
            finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addrules" class="addform"
            ref="addref" label-width="100px" :lable-position="'top'">
                <el-tabs v-model="activeindex"
                :tab-position="'left'"
                :before-leave="btl"
                @tab-click="tabclick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"
                            type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"
                            type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"
                            type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                            expand-trigger="hover"
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            :props="cateprops"
                            @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                        
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" class="block"
                        v-for="item in manydata" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="check"
                                v-for="(check,index) in item.attr_vals"
                                :key="index" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name"
                        v-for="item in onlydata"
                        :key="item.attr_id" label-width="150px">
                        <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action:图片上传的后台API地址 -->
                        <el-upload
                        action="http://localhost:8888/api/private/v1/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :headers="headerObj"
                        :on-success="handleSuccess"
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" class="btnadd"
                        @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <el-dialog
        title="提示"
        :visible.sync="photovisiable"
        width="50%">
            <img :src="previewpath" alt="">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            previewpath:'',
            activeindex:'0',
            catelist:[],
            manydata:[],
            onlydata:[],
            photovisiable:false,
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[],
            },
            addrules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请输入商品分类', trigger: 'blur'}
                ]
            },
            cateprops:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            headerObj:{
                Authorization: window.sessionStorage.getItem('token')
            },
        }
    },
    created(){
        this.getcatelist()
    },
    methods:{
        async getcatelist(){
            let{data:res} = await this.$http.get('categories')
            if(res.meta.status != 200){
                this.$message.error('获取商品分类失败！')
            }else{
                this.catelist = res.data
                // console.log(res.data);
            }
        },
        handleChange(){
            if(this.addForm.goods_cat.length != 3){
                this.addForm.goods_cat = []
                return
            }
        },
        btl(activename,oldactivename){
            if(oldactivename == '0' && this.addForm.goods_cat.length != 3){
                this.$message.error('请先进行上一个步骤的基本填写操作!')
                return false
            }
        },
        async tabclick(){
            if(this.activeindex == '1' ){
              let {data:res} = await  this.$http.get(`categories/${this.cateid}/attributes`,{
                    params:{ sel:'many'}
                })
                if(res.meta.status != 200){
                    this.$message.error('获取动态列表失败！！')
                }else{
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manydata = res.data
                }
            }else if(this.activeindex == '2'){
                let {data:res} = await this.$http.get(`categories/${this.cateid}/attributes`,{
                    params:{ sel:'only'}
                })
                if(res.meta.status != 200){
                    this.$message.error('获取静态属性失败！！')
                }else{
                    // console.log(res.data);
                    this.onlydata = res.data
                }
            }
        },
        handlePreview(file){
            console.log(file);
            console.log(file.response.data.url);
            this.previewpath = file.response.data.url
            this.photovisiable = true
        },
        async handleRemove(file){
            // console.log(file)
            let filepath=file.response.data.tem_path
            let i = this.addForm.pics.findIndex(x =>{
                x.pic == filepath
            })
            this.addForm.pics.splice(i,1)
            console.log(this.addForm);
        },
        handleSuccess(response){
            // console.log(response);
            let picinfo = {
                pic:response.data.tmp_path
            }
            this.addForm.pics.push(picinfo)
            console.log(this.addForm);
        },
        add(){
            this.$refs.addref.validate(async valid =>{
                if(!valid){
                    this.$message.error('请填写合法的表单信息！')
                }
                    let dd =  _.cloneDeep(this.addForm)
                    dd.goods_cat = dd.goods_cat.join(',')
                    console.log(dd);
                    this.manydata.forEach(item =>{
                        const newinfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newinfo)
                    })

                    this.onlydata.forEach(item =>{
                        const newinfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newinfo)
                    })
                    dd.attrs = this.addForm.attrs
                    console.log(this.addForm.attrs);
            })
        },
    },
    computed:{
        cateid(){
            if(this.addForm.goods_cat.length == 3){
                return this.addForm.goods_cat[2]
            }else{
                return null
            }
        }
    }
}
</script>
<style lang="less" scoped>
.el-steps{
    margin-top: 20px;
}
.el-step{
    font-size: 13px!important;
}
.el-checkbox, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin: unset;
    margin: 0 10px;
}
.el-form-item__label{
    margin: unset;
}
.addform{
    margin-top: 20px;
}
.btnadd{
    margin-top: 10px;
}
</style>