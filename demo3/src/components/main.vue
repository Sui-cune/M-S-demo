<template>
    <el-container class="c_top">
        <el-header>
            <i class="el-icon-coin"></i>
            <span>简易管理系统</span>
        </el-header>

        <el-container class="c_main">
            <el-aside :width="toggle_boo?'64px':'200px'">
                <div class="back_btn" @click="toggle">|||</div>
                <el-menu background-color="mediumseagreen" text-color="white"
                 active-text-color="yellow" :collapse="toggle_boo"
                 :collapse-transition="false" router :default-active="active">   
                    <el-submenu :index="menu.id.toString()" v-for="menu in menulist" :key="menu.id">
                        <template slot="title">
                            <i :class="iconlist[menu.authName]"></i>
                            <span>{{menu.authName}}</span>
                        </template>

                        <el-menu-item :index="'/'+children.path" 
                        v-for="children in menu.children"
                        :key="children.id" @click="change('/' + children.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{children.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

                <el-button class="out" @click="out()">退出</el-button>
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        
        <el-footer>footer</el-footer>
    </el-container>
</template>

<script>
export default {
    name:'main',
    data(){
        return{
            menulist:[],
            // 创建一个对象存储对应的图标，这个应该是要放后端接口绑定
            // 由于目前后端是拿别人的他也没有说在哪里添加，所以只好在
            // 前端用这种方式添加对象，用循环遍历出图标，等我会写api再改
            iconlist:{
                '用户管理':'el-icon-s-custom',
                '权限管理':'el-icon-s-flag',
                '商品管理':'el-icon-s-goods',
                '订单管理':'el-icon-s-claim',
                '数据统计':'el-icon-s-data',
            },
            tolist:{
                '用户列表':'/user',
                '角色列表':'/people',
                '权限列表':'/flag',
                '商品列表':'/goods',
                '分类参数':'/class',
                '商品分类':'/goodsclass',
                '订单列表':'/order',
                '数据报表':'/data',
            },
            toggle_boo:false,
            active:'',
        }
    },
    methods:{
        out(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status!=200) return this.$message.console.error(res.meta.msg);
            this.menulist=res.data
            // console.log(res)
        },
        toggle(){
            this.toggle_boo = !this.toggle_boo
        },
        change(e){
            window.sessionStorage.setItem('active',e)
        },
    },
    created(){
        this.getMenuList()
        this.active = window.sessionStorage.getItem('active')
    },
}
</script>

<style lang='less' scoped>
.c_top{
    height: 1000px;
}
.el-header{
    display: flex;
    align-items: center;
    background-color:mediumseagreen;
    height: 300px;
    color: white;
    i{
        font-size: 50px;
    }
    span{
        font-size: 30px;
        margin-left: 10px;
    }
}
.el-footer{
    
}
.c_main{
    
}
.el-aside{
    background-color: mediumseagreen;
    transition: all .5s ;
    .back_btn{
        background-color: white;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
        letter-spacing: .3em;
        font-size: 12px;
        color: mediumseagreen;
    }
    .el-menu{
        height: 700px;
        border: none;
        font-size: 30px;
        i{
            z-index: 1;
            color: white;
            font-size: 25px;
        }
        .el-icon-menu{
            color: unset;
        }
        a{
            display: inline-block;
            width: 100%;
            border: 1px solid;
            z-index: 100;
        }
        .active{
            transition: all .5s;
            color: yellow;
        }
    }
}
.el-main{
    box-shadow: inset 4px 2px 10px rgba(0, 0, 0, .5);
    background-color: #eeeeee33;
}
span{
    font-size: 15px;
}
.out{
    display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 150px;
}
</style>