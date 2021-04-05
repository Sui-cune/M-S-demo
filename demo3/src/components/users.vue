<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="'/main'">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card>
      <el-input class="seach" placeholder="请输入所搜索内容" 
      v-model="datalist.query" clearable @clear="getuserlist">
        <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
      </el-input>          

      <el-button type="primary" @click="add = true">添加用户</el-button>


      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- “scope”当前数据，在不同组件下嵌套el-switch涉及到跨组件传值
        所以switch用不了tabel的userlist只能使用scope获取状态 -->
        <el-table-column v-slot="scope" label="状态">
          <el-switch v-model="scope.row.mg_state" @change="statechange(scope.row)"></el-switch>
        </el-table-column>
        <el-table-column label="操作" v-slot="scope" min-width="200px">
          <el-tooltip content="修改" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="small "
            @click="showedit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="small "
            @click="showdel(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="设置" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="small "
            @click="showsetrole(scope.row)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="SizeChange" @current-change="CurrentChange"
      :current-page="datalist.pagenum" :page-sizes="[1,2,3,4]"
      :page-size="datalist.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total"></el-pagination>
    </el-card>

      <el-dialog title="添加用户" :visible.sync="add"
        width="50%" @close="reset">
        <el-form :model="addform" :rules="addrules" ref="addref" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addform.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addform.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addform.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="Add">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="修改信息" :visible.sync="edit"
        width="50%" @close="reset">
        <el-form :model="editform" :rules="addrules" ref="addref"
        label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editform.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="Edit">确 定</el-button>
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
          <el-button type="primary" @click="Del">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="分配角色" :visible.sync="setrole"
        width="30%" @close="reset">
        <div>
          <p>当前用户：{{userinfo.username}}</p>
          <p>当前角色：{{userinfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectvalue" clearable placeholder="请选择">
              <el-option v-for="item in roleslist" :key="item.id"
                :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setrole = false">取 消</el-button>
          <el-button type="primary" @click="saveinfo">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>
 
<script>
  export default {
    data() {
      const checkemail=(rule,value,back)=>{
          const regmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if(regmail.test(value)){
            return back()
          }
            back(new Error('请输入合法邮箱'))
          
        }
        const checkmobile=(rule,value,back)=>{
          const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
          if(regmobile.test(value)){
            return back()
          }else{
            back(new Error('请输入合法的手机号码'))
          }
        }
      return {
        input:'',
        selectvalue:'',
        userlist:[],
        roleslist:[],
        datalist:{
          query:'',
          pagenum:1,
          pagesize:2,
        },
        addform:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        addrules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur'}
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { validator:checkemail, trigger:'blur'},
          ],
          mobile:[
            { validator:checkmobile, trigger:'blur'},
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ]
        },
        editform:{},
        userinfo:{},
        total:0,
        add:false,
        edit:false,
        set:false,
        warning:false,
        setrole:false,
        del_id:0,
      }
    },
    methods:{
      async getuserlist(){
        let {data:res} = await this.$http.get('users',{
            params:this.datalist
          })
        if(res.meta.status != 200){
          return this.$message.error(res.meta.msg);
        }else{
          this.userlist=res.data.users
          this.total=res.data.total          
        }  
          // console.log(res);
      },
      SizeChange(newsize){
        this.datalist.pagesize=newsize
        this.getuserlist()
      },
      CurrentChange(newpage){
        this.datalist.pagenum=newpage
        this.getuserlist()
      },
      async statechange(scope){
        let {data:res} = await this.$http.put(`users/${scope.id}/state/${scope.mg_state}`)
        if(res.meta.status != 200){
          scope.mg_state =! scope.mg_state
          return this.$message.error('更新失败');
        }else{
          this.$message.success('更新成功')
        }
      },
      reset(){
        this.$refs.addref.resetFields()
        this.del_id=null
        console.log(this.del_id);
      },
      Add(){
        this.$refs.addref.validate(async valid =>{
          if(!valid){
            this.$message.error('请填写合法的用户信息！')
          }else{
            let {data:res} = await this.$http.post("users",this.addform)
            if(res.meta.status != 201){
              this.$message.error('添加用户失败！')
            }else{
              this.$message.success('添加用户成功！！')
              this.add=false
              this.getuserlist()
            }
          }
        })
      },
      async showedit(scope){
        let {data:res} = await this.$http.get('users/' + scope.id)
        if(res.meta.status != 200){
          return this.$message.error('数据查询有误！')
        }else
          this.editform = res.data
        this.edit = true
        // console.log(this.editform);
      },
      Edit(){
        this.$refs.addref.validate(async valid=>{
          if(!valid){
            this.$message.error('表单填写错误！')
          }else{
            let {data:res} = await this.$http.put('users/'+ this.editform.id,{
              email: this.editform.email,
              mobile: this.editform.mobile
              })
            if(res.meta.status != 200){
              this.$message.error('用户信息更新失败QAQ')
            }else{
              this.$message.success('用户信息更新成功！')
              this.edit=false
              this.getuserlist()
            }
          }
        })
      },
      showdel(scope){
        this.warning = true
        this.del_id = scope.id
        console.log(this.del_id);
      },
      async Del(){
        let {data:res} = await this.$http.delete('users/'+ this.del_id)
        if(res.meta.status != 200){
          this.$message.error('用户信息删除失败！')
        }else{
          this.$message.success('用户信息删除成功！！')
          this.getuserlist()
          this.warning=false
        }
      },
      async showsetrole(scope){
        this.userinfo = scope
        let {data:res} = await this.$http.get('roles')
        if(res.meta.status != 200){
          this.$message.error('获取角色列表失败！')
        }else{
          this.roleslist = res.data
          // console.log(this.roleslist);
          this.setrole = true
        }
      },
      async saveinfo(){
        if(!this.selectvalue){
          this.$message.error('请选择分配角色')
        }else{
          let {data:res} = await this.$http.put(
            `users/${this.userinfo.id}/role`,
            {rid:this.selectvalue}
          )
          if(res.meta.status !=200){
            this.$message.error('角色更新失败！！')
          }else{
            this.$message.success('角色更新成功！！')
            this.getuserlist()
            this.selectvalue = ''
            this.setrole = false
          }
        }
      }
    },
    created(){
      this.getuserlist()
    },
}
</script>
 
<style lang="less" scoped>
  .seach{
    width: 400px;
    margin-right: 20px;
    margin-bottom: 20px;
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