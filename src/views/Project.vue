<template>
  <div class="container">
    <!--
        项目管理页面
    -->
    <Header :showid="2"></Header>
    <section class="content">
      <!--左侧tab-->
      <div class="bglayer">
        <div class="btn-group-vertical" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-light" @click="changeTab(0)">项目详情</button>
          <div class="line"></div>
          <button type="button" class="btn btn-light" @click="changeTab(1)">发布项目</button>
          <div class="line"></div>
          <button type="button" class="btn btn-light" @click="changeTab(2)">申请管理</button>
          <div class="line"></div>
        </div>
      </div>
      <!--左侧tab end-->

      <!--项目详情-->
      <table class="table" v-if="showTab==0">
        <thead>
        <tr>
          <th scope="col" width="120px">名称</th>
          <th scope="col" width="200px">要求</th>
          <th scope="col">时限</th>
          <th scope="col">电话</th>
          <th scope="col">竞争人数</th>
          <th scope="col">委托人</th>
          <th scope="col">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in projectArr" :key="index" style="height: 10px !important; overflow: hidden">
          <td style="padding: 15px;">{{ item.name }}</td>
          <td style="padding: 5px;" class="trequire">{{ item.require }}</td>
          <td style="padding: 15px;">{{ item.limit }}</td>
          <td style="padding: 15px;">{{ item.tel }}</td>
          <td style="padding: 15px;">{{ item.sid.length }}</td>
          <td style="padding: 15px;">{{ sname[index] }}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" @click="editProject(index)" data-toggle="modal" data-target="#editModal" data-whatever="@fat">编辑</button>
            <button type="button" class="btn btn-danger btn-sm" @click="delNum=index" data-toggle="modal" data-target="#deldrop">撤销</button>
          </td>
        </tr>
        </tbody>
      </table>
      <!--项目详情 end-->

      <!--发布项目-->
      <div class="addpro" v-if="showTab==1">
        <form class="pmes">
          <div class="form-group row">
            <label for="pname" class="col-sm-2 col-form-label">项目名称：</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="pname" v-model="pname">
            </div>
          </div>
          <div class="form-group row">
            <label for="plimit" class="col-sm-2 col-form-label">项目时限：</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="plimit" v-model="plimit">
            </div>
          </div>
          <div class="form-group row">
            <label for="ptel" class="col-sm-2 col-form-label">联系电话：</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="ptel" v-model="ptel">
            </div>
          </div>
          <div class="form-group row">
            <label for="require" class="col-sm-2 col-form-label">项目要求：</label>
            <div class="col-sm-10">
              <textarea class="form-control" id="require" v-model="prequire" style="height: 200px"></textarea>
            </div>
          </div>
          <button type="button" @click="submitProject" class="btn btn-primary btn-lg btn-block" style="margin-top: 60px;">发布</button>
        </form>
      </div>
      <!--发布项目 end-->

      <!--申请管理-->
      <div class="applypro" v-if="showTab==2">
        <div class="dropdown" style="margin-top: 20px">
          <button v-text="dropcontent" class="btn btn-success dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button" v-for="(item, index) in proName" :key="index" @click="searchByPname(index)">{{ item.pname }}</button>
          </div>
        </div>
        <table class="table" style="width: 100%; margin-top: 30px">
          <thead>
          <tr>
            <th scope="col">项目名称</th>
            <th scope="col">申请人学号</th>
            <th scope="col">申请人</th>
            <th scope="col">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in applyArr" :key="index">
            <td>{{ item.pname }}</td>
            <td>{{ item.applysid }}</td>
            <td>{{ item.applysname }}</td>
            <td>
              <button type="button" class="btn btn-primary btn-sm" @click="applyOperate(index, 0)">同意</button>
              <button type="button" class="btn btn-danger btn-sm" @click="applyOperate(index, 1)">拒绝</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--申请管理 end-->

    </section>
    <Footer></Footer>
    <Bounce :type="requestStatus"  v-if="bounceShow==1">
      <span slot="mes">
        {{ msg }}
      </span>
    </Bounce>

    <!--编辑模态框-->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">编辑项目</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="prname" class="col-form-label">项目名称:</label>
                <input type="text" class="form-control" id="prname" v-model="prname">
              </div>
              <div class="form-group">
                <label for="prlimit" class="col-form-label">项目时限:</label>
                <input type="text" class="form-control" id="prlimit" v-model="prlimit">
              </div>
              <div class="form-group">
                <label for="prtel" class="col-form-label">联系电话:</label>
                <input type="text" class="form-control" id="prtel" v-model="prtel">
              </div>
              <div class="form-group">
                <label for="prrequire" class="col-form-label">项目要求:</label>
                <textarea class="form-control" id="prrequire" v-model="prrequire"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="sendEdit">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--删除模态框-->
    <div class="modal fade" id="deldrop" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">撤销提示</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            您确认撤销该项目吗？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">我再想想</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="sendDel">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../components/Header'
  import Footer from '../components/Footer'
  import axios from 'axios'
  import Bounce from '../components/Bounce'
  export default {
    data() {
      return {
        pnamenum: 0,// 记录选中的是哪一个项目
        editNum: -1, // 记录编辑的序号
        delNum: -1, // 记录删除的序号
        requestStatus: -1, // 记录状态栏的背景色
        bounceShow: 0, // 控制Bounce
        msg: '', // 控制Bounce中的显示内容
        showTab: 0, // 控制显示左侧谁的内容
        applyArr: [], // 保存申请内容
        projectArr: [], // 保存老师所发布的项目
        proName: [], // 记录还没被人接下的项目名称和_id
        sname: [],  // 记录学生姓名的内容
        pname: '',  // 记录添加项目中项目名的内容
        plimit: '',  // 记录添加项目中时限的内容
        ptel: '',  // 记录添加项目中联系电话的内容
        prequire: '',  // 记录添加项目中项目需求的内容
        prname: '',  // 记录编辑项目中项目名的内容
        prlimit: '',  // 记录编辑项目中项目时限的内容
        prtel: '',  // 记录编辑项目中联系电话的内容
        prrequire: '',  // 记录编辑项目中项目需求的内容
        dropcontent: '请选择项目' // 申请管理中下拉菜单显示的文字
      }
    },
    components: {
      Header,
      Footer,
      Bounce
    },
    mounted() {
      this.loadProject()
    },
    methods: {
      loadProjectName() { //获取项目名称
        axios.get('projects/getname').then((res) => {
          if(res.data.status==0) {
            this.proName = res.data.result;
          }
        })
      },
      setTime() {
        const timer = setTimeout(() =>{
          this.bounceShow = 0;
        }, 2000);
        this.$once('hook:beforeDestroy', () => {
          clearTimeout(timer);
        });
      },
      loadProject() { // 加载项目
        axios.get('/projects/teacher').then((res)=>{
          if(res.data.status==0) {
            this.projectArr = res.data.result.doc;
            this.sname = res.data.result.sname
          }
        })
      },
      searchByPname(index) { // 按照项目名字搜索
        this.pnamenum = index;
        this.dropcontent = this.proName[index].pname;
        this.changeTab(2);
      },
      editProject(index) { // 编辑项目
        this.prname = this.projectArr[index].name;
        this.prlimit = this.projectArr[index].limit;
        this.prtel = this.projectArr[index].tel;
        this.prrequire = this.projectArr[index].require;
        this.editNum = index;
      },
      changeTab(index) { // 更换左侧tab
        this.loadProjectName();
        this.showTab = index;
        if(index == 0) {
          this.loadProject();
        } else if (index == 2) {
          let id = '全部';
          if(this.pnamenum != 0) {
            id = this.proName[this.pnamenum].id;
          }
          axios.get('projects/applylist', {
            params: {
              id: id
            }
          }).then((res) => {
            if(res.data.status==0) {
              this.applyArr = res.data.result;
            }
          })
        }
      },
      applyOperate(index, key) { // 教师对学生的申请进行处理
        let id = this.applyArr[index].id;
        let sid = this.applyArr[index].applysid;
        axios.post('/projects/applyopt', {
          id: id,
          flag: key,
          sid: sid
        }).then((res) => {
          if (res.data.status == 0) {
            this.requestStatus = 0;
            this.bounceShow = 1;
            this.msg = res.data.msg;
            this.changeTab(2);
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '操作失败';
          }
        })
        this.setTime();
      },
      sendEdit() { // 保存修改内容
        if(this.prname.match(/^[ ]*$/) || this.prlimit.match(/^[ ]*$/)
          || this.prrequire.match(/^[ ]*$/) || this.prtel.match(/^[ ]*$/)
        ) {
          this.requestStatus = 1;
          this.bounceShow = 1;
          this.msg = '请完善信息';
        } else {
          axios.post('/projects/editproject', {
            prname: this.prname,
            prtel: this.prtel,
            prrequire: this.prrequire,
            prlimit: this.prlimit,
            id: this.projectArr[this.editNum]._id
          }).then((res) => {
            if (res.data.status == 0) {
              this.requestStatus = 0;
              this.bounceShow = 1;
              this.msg = res.data.msg;
              this.loadProject();
            } else {
              this.requestStatus = 1;
              this.bounceShow = 1;
              this.msg = '操作失败';
            }
          })
        }
        this.setTime();
      },
      sendDel() { // 撤销项目
        axios.post('/projects/delproject', {
          id: this.projectArr[this.delNum]._id,
          prname: this.prname,
          prtel: this.prtel,
          prrequire: this.prrequire,
          prlimit: this.prlimit
        }).then((res) => {
          if (res.data.status == 0) {
            this.requestStatus = 0;
            this.bounceShow = 1;
            this.msg = res.data.msg;
            this.loadProject();
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '操作失败';
          }
        })
      },
      submitProject() { // 添加项目
        if(this.pname.match(/^[ ]*$/) || this.plimit.match(/^[ ]*$/)
          || this.prequire.match(/^[ ]*$/) || this.ptel.match(/^[ ]*$/)
        ) {
          this.requestStatus = 1;
          this.bounceShow = 1;
          this.msg = '请完善信息';
        } else {
          axios.post('/projects/addproject', {
            pname: this.pname,
            ptel: this.ptel,
            prequire: this.prequire,
            plimit: this.plimit
          }).then((res) => {
            if (res.data.status == 0) {
              this.requestStatus = 0;
              this.bounceShow = 1;
              this.msg = res.data.msg;
              this.pname = '';
              this.ptel = '';
              this.prequire = '';
              this.plimit = '';
              this.loadProject();
            } else {
              this.requestStatus = 1;
              this.bounceShow = 1;
              this.msg = '操作失败';
            }
          })
        }
        this.setTime();
      }
    }
  }
</script>

<style scoped>
  .content {
    min-height: calc(100vh - 160px);
    padding: 0 15px;
    display: flex;
    margin-top: 10px;
  }
  .bglayer {
    height: 80vh;
    width: 10%;
    background-color: #f8f9fa;
    margin-right: 10px;
  }
  .table, .addpro, .applypro{
    width: 89%;
  }
  .btn-group-vertical {
    width: 100%;
    height: 200px;
  }
  .line {
    width: 100%;
    background-color: rgba(143, 143, 148, .3);
    height: 2px;
  }
  .btn-light {
    color: black;
  }
  .trequire {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .pmes {
    display: flex;
    flex-direction: column;
    height: 400px;
    justify-content: space-between;
  }
</style>
