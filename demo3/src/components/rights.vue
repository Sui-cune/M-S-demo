<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
             <el-table :data="rootlist" stripe border height="800">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column v-slot="scope" label="权限等级">
                    <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                    <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                    <el-tag v-else-if="scope.row.level == '2'" type="warning">三级</el-tag>
                </el-table-column>
                </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rootlist:[]
        }
    },
    methods:{
        async getroot(){
            let {data:res} = await this.$http.get('rights/' + 'list')    
            if(res.meta.status != 200){
                this.$message.error('获取权限失败')
            }else{
                this.rootlist = res.data
                console.log(this.rootlist);
            }
        }
    },
    created(){
        this.getroot()
    }
}
</script>

<style lang="less" scoped>

</style>