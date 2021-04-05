<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="请输入内容"
                    v-model="goodsquery.query" clearable
                    @clear="getgoodslist">
                        <el-button slot="append" icon="el-icon-search"
                        @click="getgoodslist"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"
                    @click="goaddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table
                :data="goodslist"
                border stripe
                max-height="670px"
                class="table">
                <el-table-column
                type="index"
                label="#">
                </el-table-column>
                <el-table-column
                prop="goods_name"
                label="商品名称">
                </el-table-column>
                <el-table-column
                prop="goods_price"
                label="商品价格"
                width="95px">
                </el-table-column>
                <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="70px">
                </el-table-column>
                <el-table-column
                prop="add_time"
                label="创建时间"
                width="140px"
                v-slot="scope">
                {{scope.row.add_time | dataFormat}}
                </el-table-column>
                <el-table-column
                label="操作"
                width="190px"
                v-slot="scope">
                <el-button type="primary" size="small"
                icon="el-icon-edit"
                @click="show(scope.row,'修改')">修改</el-button>
                <el-button type="danger" size="small"
                icon="el-icon-delete"
                @click="show(scope.row,'删除')">删除</el-button>
                </el-table-column>
            </el-table>

            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="goodsquery.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="goodsquery.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
        </el-card>

        <el-dialog
        :title="titletext"
        :visible.sync="editgoods"
        width="30%"
        @close="reset">
            <el-form :model="editForm" :rules="editrules"
            ref="editref" label-width="80px"
            :class="this.e_d == '删除'? 'none': 'block'">
                <el-form-item :label="titletext" prop="goods_name">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
            </el-form>
            <div :class="this.e_d == '修改'? 'none': 'block a'">
                <i class="el-icon-warning"></i>
                <span class="Warning">一旦删除用户信息，将无法恢复！您确定要删除吗？！</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editgoods = false">取 消</el-button>
                <el-button type="primary" @click="roolmodul">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            e_d:'',
            total:0,
            editgoods:false,
            editForm:{},
            editrules:{
                goods_name:[
                    { required: true, message: '不能为空', trigger: 'blur'}
                ]
            },
            goodsquery:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodslist:[],
        }
    },
    created(){
        this.getgoodslist()
    },
    methods:{
        async getgoodslist(){
            let {data:res} = await this.$http.get('goods',{
                params:this.goodsquery
            })
            if(res.meta.status != 200){
                this.$message.error('获取商品列表失败！！')
            }else{
                this.goodslist = res.data.goods
                this.total = res.data.total
                console.log(res.data);
            }
        },
        handleSizeChange(newsize){
            this.goodsquery.pagesize = newsize
            this.getgoodslist()
        },
        handleCurrentChange(newpage){
            this.goodsquery.pagenum = newpage
            this.getgoodslist()
        },
        reset(){
            this.$refs.editref.resetFields()
            this.editForm = {}
        },
        show(scope,key){
            this.e_d = key
            // console.log(scope.goods_id);
            this.getgoodid(scope.goods_id)
            this.editgoods = true
        },
        async getgoodid(id){
            let {data:res} = await this.$http.get('goods/' + id)
            if(res.meta.status != 200){
                this.$message.error('商品信息查询失败！！')
            }else{
                // console.log(res.data);
                this.editForm = res.data
            }
        },
        roolmodul(){
            if(this.e_d  == '修改'){
                this.edit()
            }else{
                this.del()
            }
            this.editgoods = false
        },
        edit(){

        },
        async del(){
            let {data:res} = await this.$http.delete('goods/' + this.editForm.goods_id)
            if(res.meta.status != 200){
                this.$message.error('商品删除失败！！')
            }else{
                this.$message.success('商品删除成功！！')
                this.getgoodslist()
            }
        },
        goaddpage(){
            this.$router.push('/goods/add')
        },
    },
    computed:{
        titletext(){
            if(this.e_d == '修改'){
                return '商品修改'
            }else{
                return '警告'
            }
        }
    }
}
</script>
<style lang="less" scoped>
.table{
    margin-top: 20px;
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
.none{
    display: none;
}
.block{
    display: block;
}
</style>