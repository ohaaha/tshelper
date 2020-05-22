<template>
  <div class="container">
    <nav class="nav">
      <div class="nav_left">
        <router-link class="tab_title" to="/calltheroll">Tshelper</router-link>
        <router-link class="tab_item" :class="{'active': showid==0}" to="/calltheroll">点名模块</router-link>
        <router-link class="tab_item" :class="{'active': showid==1}" to="/leave">请假管理</router-link>
        <router-link class="tab_item" :class="{'active': showid==2}" to="/project">项目管理</router-link>
      </div>
      <div class="nav_right">
        <span>{{ tname }}</span>
        <i class="fa fa-sign-out" aria-hidden="true" @click="logout"></i>
      </div>
    </nav>
    <div class="line"></div>
  </div>
</template>

<script>
  import axios from 'axios'
    export default {
    props: ['showid'],
      data() {
        return {
          tname: '',
          requestStatus: -1,
          msg: '',
          bounceShow: 0
        }
      },
      mounted() {
        this.checkLogin();
      },
      methods: {
        checkLogin() {
          axios.get("/teachers/checkLogin").then((response) => {
            let res = response.data;
            if (res.status == 0) {
              this.tname = res.result;
            } else {
              this.$router.push({name:'login'});
            }
          });
        },
        logout() {
          axios.post("/teachers/logout").then((response) => {
            let res = response.data;
            if (res.status == 0) {
              this.tname = '';
              this.$router.push({name:'login'});
            }
          });
        }
      }
    }
</script>

<style scoped>
  .nav {
    font-size: 18px;
    display: flex;
    height: 60px;
  }
  .nav_left {
    display: flex;
    width: 55%;
    justify-content: space-between;
    align-items: center;
  }
  .tab_title {
    font-size: 32px;
    color: rgba(0, 122, 255, .8);
  }
  .tab_title:hover {
    color: rgb(0, 122, 255);
    text-decoration: none;
  }
  .tab_item {
    color: black;
    transition: .3s;
  }
  .tab_item:hover {
    text-decoration: none;
    color: rgba(0, 122, 255, .8);
  }
  .active {
    color: rgba(0, 122, 255, .8);
  }
  .nav_right {
    width: 45%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .nav_right>i {
    margin-left: 24px;
    font-size: 24px;
    transition: .3s;
  }
  .nav_right>i:hover {
    color: rgba(0, 122, 255, .8);
    cursor: pointer;
  }
  .line {
    height: 2px;
    width: 100%;
    background-color: rgba(143, 143, 148, .5);
  }
</style>
