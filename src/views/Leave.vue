<template>
  <div class="container">
    <!--
        请假管理页面
    -->
    <Header :showid="1"></Header>
    <section class="content">
      <!--搜索栏-->
      <div class="inputarr">
        <input class="form-control" type="text" placeholder="学号" v-model="sid">
        <span>---</span>
        <input class="form-control" type="date" placeholder="时间" v-model="time">
        <span>---</span>
        <input class="form-control" type="text" placeholder="课程" v-model="name">
        <button type="button" class="btn btn-primary" @click="loadLeave(1)">搜索</button>
      </div>
      <!--搜索栏 end-->

      <!--显示结果的表格-->
      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">时间</th>
          <th scope="col">学号</th>
          <th scope="col">课程</th>
          <th scope="col">原因</th>
          <th scope="col">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in leaveArr" :key="index">
          <th scope="row">
            <i class="fa" :class="[selectList.includes(index)?'fa-check-square-o':'fa-square-o']" aria-hidden="true"  @click="select(index)"></i>
          </th>
          <td>{{ item.time }}</td>
          <td>{{ item.sid }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.reason }}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" @click="myoperate(0, index)">同意</button>
            <button type="button" class="btn btn-danger btn-sm" @click="myoperate(1, index)">拒绝</button>
          </td>
        </tr>
        </tbody>
      </table>
      <!--显示结果的表格 end-->

      <div class="line"></div>

      <!--对选中的进行操作-->
      <div class="btngroup">
        <i class="fa" :class="[selectAllFlag?'fa-check-square-o':'fa-square-o']" @click="checkAll" aria-hidden="true"></i>
        <div class="btnright">
          <button type="button" class="btn btn-primary btn-sm" @click="selectedOperate(0)">同意</button>
          <button type="button" class="btn btn-danger btn-sm" @click="selectedOperate(1)">拒绝</button>
        </div>
      </div>
      <!--对选中的进行操作 end-->

    </section>
    <Footer></Footer>
    <Bounce :type="requestStatus"  v-if="bounceShow==1">
      <span slot="mes">
        {{ msg }}
      </span>
    </Bounce>
  </div>
</template>

<script>
  import Header from '../components/Header'
  import Footer from '../components/Footer'
  import Bounce from '../components/Bounce'
  import axios from 'axios'
  export default {
    data() {
      return {
        requestStatus: -1,
        bounceShow: 0,
        msg: '',
        leaveArr: [], // 保存请假列表的内容
        selectList: [], // 获取选中的index
        name: '', // 获取搜索框上课程名的内容
        sid: '', // 获取搜索框上学号的内容
        time: '' // 获取搜索框上学号的内容
      }
    },
    components: {
      Header,
      Footer,
      Bounce
    },
    computed: {
      selectAllFlag() { // 实时计算是否全部选中
        return this.leaveArr.length == this.selectList.length;
      }
    },
    mounted() {
      this.loadLeave(0);
    },
    methods: {
      setTime() {
        const timer = setTimeout(() =>{
          this.bounceShow = 0;
        }, 2000);
        this.$once('hook:beforeDestroy', () => {
          clearTimeout(timer);
        });
      },
      myoperate(index, key) { // 同意的拒绝操作
        let flag = index;
        let id = this.leaveArr[key]._id;
        axios.post('/leaves/operate', {
          flag: flag,
          id: id
        }).then((res)=> {
          if (res.data.status == 0) {
            this.requestStatus = 0;
            this.bounceShow = 1;
            this.msg = res.data.msg;
            this.loadLeave(0);
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '操作失败';
          }
        })
        this.setTime();
      },
      loadLeave(index) { // 加载请假列表
        let sid = '',
          time = '',
          name = '';
        if(index == 1) {
          sid = this.sid;
          time = this.time;
          name = this.name;
        }
        axios.get('/leaves/teacher', {
          params: {
            sid: sid,
            time: time,
            name: name
          }
        }).then((res)=>{
          if(res.data.status==0) {
            this.leaveArr = res.data.result;
          }
        })
      },
      select(index) { // 把选中的存入数组
        if(this.selectList.includes(index)) {
          this.selectList = this.selectList.filter((ele)=>{
            return ele != index;
          });
        } else {
          this.selectList.push(index);
        }
      },
      checkAll() { // 全选
        let i;
        if(this.selectAllFlag) {
          this.selectList = [];
        } else {
          for(i = 0; i<this.leaveArr.length; i++) {
            if(!this.selectList.includes(i)) {
              this.selectList.push(i);
            }
          }
        }
      },
      selectedOperate(index) { // 对选中的进行操作
        if(this.selectList.length == 0) {
          this.requestStatus = 1;
          this.bounceShow = 1;
          this.msg = '请先选择';
        } else {
          let selArr = [];
          this.selectList.forEach((item) => {
            selArr.push(this.leaveArr[item]._id);
          })
          axios.post('/leaves/seloperate', {
            status: index,
            selarr: selArr
          }).then((res)=> {
            if (res.data.status == '0') {
              this.requestStatus = 0;
              this.bounceShow = 1;
              this.msg = res.data.msg;
              this.loadLeave(0);
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
    display: flex;
    flex-direction: column;
    padding: 0 15px;
  }
  .inputarr {
    width: 100%;
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: space-between;
  }
  .inputarr>input {
    width: 25%;
  }
  .btngroup {
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: space-between;
  }
  .line {
    width: 100%;
    height: 2px;
    background-color: rgba(143, 143, 148, .5);;
  }
  .btnright>button {
    width: 100px;
  }
  .btngroup>i {
    padding-left: 12px;
  }
  .btngroup>i {
    font-size: 18px;
  }
  i:hover {
    cursor: pointer;
  }
</style>
