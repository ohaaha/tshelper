<template>
  <div class="content">
    <div class="mes shadow p-3 mb-5 bg-white rounded">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="tid">教师编号</label>
          <input type="text" class="form-control" id="tid" v-model="tid">
        </div>
        <div class="form-group">
          <label for="pwd">密码</label>
          <input type="password" class="form-control" id="pwd" v-model="pwd">
        </div>
        <button class="btn btn-primary" @click="userLogin()">登 录</button>
      </form>
    </div>
    <Bounce :type="requestStatus"  v-if="bounceShow==1">
      <span slot="mes">
        {{ msg }}
      </span>
    </Bounce>
  </div>
</template>

<script>
  import Bounce from '@/components/Bounce'
  import axios from 'axios'
    export default {
      data() {
        return {
          requestStatus: -1,
          bounceShow: 0,
          msg: '',
          tid: '',
          pwd: '',
        }
      },
      components: {
        Bounce
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
        userLogin() {
          if(this.tid.match(/^[ ]*$/) || this.pwd.match(/^[ ]*$/)) {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '内容不能为空';
          } else {
            axios.post('/teachers/login', {
              tid: this.tid,
              tpwd: this.pwd
            }).then((res)=>{
              if (res.data.status == 0) {
                this.$router.push({path:'calltheroll'});
              }
              else {
                this.requestStatus = 1;
                this.bounceShow = 1;
                this.msg = res.data.msg;
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
    height: 100vh;
    width: 100%;
  }
  .mes {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    height: 300px;
    width: 400px;
  }
  .mes input {
    background-color: rgba(136, 136, 136, .3);
  }
  .mes label {
    color: black;
    font-weight: bold;
  }
  .mes button {
    margin-top: 20px;
    width: 100%;
    cursor: pointer;
  }
</style>
