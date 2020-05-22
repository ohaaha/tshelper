<template>
    <div class="container">
      <!--
        点名模块页面
      -->
      <Header :showid="0"></Header>
      <section class="content">
        <!--左侧tab-->
        <div class="bglayer">
          <div class="btn-group-vertical" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" @click="changeTab(0)">点名板块</button>
            <div class="line"></div>
            <button type="button" class="btn btn-light" @click="changeTab(1)">出勤板块</button>
            <div class="line"></div>
          </div>
        </div>
        <!--左侧tab end-->
        <!--点名板块-->
        <div class="left" v-if="showTab==0">
          <div class="note">
            <div class="shadow p-3 mb-5 bg-white rounded sample">
              <img src="../assets/img/sample.png" alt="sample例子">
              <span>请按照如图所示的结构上传Excel文件</span>
            </div>
            <div class="upfile shadow p-3 mb-5 bg-white rounded">
              <input type="file"  @change="uploadFile()" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
              <button class="btn btn-primary btn-sm" @click="begainNote">开始点名</button>
            </div>
            <button type="button" class="btn btn-info btn-block" @click="handleStatus" style="margin-bottom: 10px">点名完成（上传结果）</button>
            <div class="audioplay shadow p-3 mb-5 bg-white rounded">
              <audio controls id="audiocon">
                <source id="ttsserver" type="audio/mpeg" :src="linkContent">
              </audio>
            </div>
            <button type="button" class="btn btn-primary btn-block" @click="randomNote">随机点名</button>
          </div>
          <div class="right shadow p-3 mb-5 bg-white rounded">
            <span>学生名单</span>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">学号</th>
                  <th scope="col">姓名</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataList" :key="index">
                  <th scope="row">{{ index+1 }}</th>
                  <td>{{ item.sid }}</td>
                  <td>{{ item.sname }}</td>
                  <td>
                    <button type="button" class="btn btn-danger btn-sm" @click="addInList(1, index)">缺课</button>
                    <button type="button" class="btn btn-warning btn-sm" @click="addInList(0, index)">迟到</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--点名板块 end-->
        <!--出勤板块-->
        <div class="attendance" v-if="showTab==1">
          <div class="searchStu">
            <input class="form-control" type="text" placeholder="学号" v-model="sid">
            <button type="button" class="btn btn-primary" @click="getStuAtt(1)">搜索</button>
          </div>
          <div class="shadow p-3 mb-5 bg-white rounded">
            <span>本堂课出勤状况</span>
            <table class="table">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">学号</th>
                <th scope="col">姓名</th>
                <th scope="col">状态</th>
                <th scope="col">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in attenArr" :key="index">
                <th scope="row">{{ index+1 }}</th>
                <td>{{ item.sid }}</td>
                <td>{{ item.sname }}</td>
                <td>
                  <span v-if="item.status==0">迟到</span>
                  <span v-else-if="item.status==1">旷课</span>
                </td>
                <td>
                  <button type="button" class="btn btn-warning btn-sm" @click="changeStatus(index, 0)" v-if="item.status!=0">迟到</button>
                  <button type="button" class="btn btn-danger btn-sm" @click="changeStatus(index, 1)" v-if="item.status!=1">旷课</button>
                  <button type="button" class="btn btn-primary btn-sm" @click="changeStatus(index, 2)" v-if="item.status!=2">准时上课</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--出勤板块 end-->
        <Bounce :type="requestStatus"  v-if="bounceShow==1">
      <span slot="mes">
        {{ msg }}
      </span>
        </Bounce>
      </section>
      <Footer></Footer>
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
          dataList: '', // 保存Excel表里面的内容
          showTab: 0, // 控制两个板块
          playText: '', // 存储点名的内容
          linkContent: '', // 链接内容
          sid: '', // 存储搜索框里面的学号
          attenArr: [], // 保存本堂课出勤状况
          statusArr: [], // 保存出勤状态
          sidArr: [], // 保存学号
          snameArr: [] // 保存姓名
        }
      },
      components: {
        Header,
        Footer,
        Bounce
      },
      methods: {
        addInList(status, index) { // 把教师的标记先存入数组
          this.statusArr.push(status);
          this.sidArr.push(this.dataList[index].sid);
          this.snameArr.push(this.dataList[index].sname);
        },
        changeTab(index) { // 切换左侧的tab
          this.showTab = index;
          if(index == 1) {
            this.getStuAtt(0);
          }
        },
        setTime() {
          const timer = setTimeout(() =>{
            this.bounceShow = 0;
          }, 2000);
          this.$once('hook:beforeDestroy', () => {
            clearTimeout(timer);
          });
        },
        changeStatus(index, status) { // 改变出勤状态
          if(this.dataList.length > 0) {
            axios.post('/attendances/changestatus', {
              id: this.attenArr[index]._id,
              status: status
            }).then((res) => {
              if (res.data.status == 0) {
                this.requestStatus = 0;
                this.bounceShow = 1;
                this.msg = res.data.msg;
                this.getStuAtt(0);
              }
            })
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '请先导入Excel文件';
          }
          this.setTime();
        },
        getStuAtt(index) { // 获取出勤信息
          let searchId = '';
          if(this.dataList.length > 0) {
            if (index == 1) {
              if (this.sid.match(/^[ ]*$/)) {
                this.requestStatus = 1;
                this.bounceShow = 1;
                this.msg = '请输入学号';
              }
              searchId = this.sid;
            }
            axios.get('/attendances/loadatten', {
              params: {
                name: this.dataList[0].course,
                sid: searchId
              }
            }).then((res) => {
              if (res.data.status == 0) {
                this.sid = '';
                this.attenArr = res.data.result;
              }
            })
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '请先导入Excel文件';
          }
          this.setTime();
        },
        handleStatus() { // 点击点名完成后提交所有数据
          if(this.dataList.length > 0) {
            if (this.statusArr.length > 0) {
              axios.post('attendances/attenstatus', {
                status: this.statusArr,
                name: this.dataList[0].course,
                sid: this.sidArr,
                sname: this.snameArr
              }).then((res) => {
                if (res.data.status == 0) {
                  this.requestStatus = 0;
                  this.bounceShow = 1;
                  this.msg = res.data.msg;
                } else {
                  this.requestStatus = 1;
                  this.bounceShow = 1;
                  this.msg = '操作失败';
                }
              })
            }
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '请先导入Excel文件';
          }
          this.setTime();
        },
        randomNote() { // 随机抽一名同学回答问题
          if(this.dataList.length > 0) {
            let num = Math.floor(Math.random() * (this.dataList.length));
            console.log(num);
            let tts = document.getElementById('ttsserver');
            let audio = document.getElementById('audiocon');
            this.linkContent = 'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&spd=3&per=0&tex=' + this.dataList[num].sname;
            tts.parentNode.load();
            audio.play();
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '请先导入Excel文件';
            this.setTime();
          }
        },
        begainNote() { // 开始点名
          let stutable = '';
          if(this.dataList.length > 0) {
            let tts = document.getElementById('ttsserver');
            let audio = document.getElementById('audiocon');
            this.linkContent = 'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&spd=3&per=0&tex=';
            this.dataList.forEach((item) => {
              stutable = stutable + item.sname + '....';
            })
            this.linkContent = this.linkContent + stutable;
            console.log(this.linkContent)
            tts.parentNode.load();
            audio.play();
          } else {
            this.requestStatus = 1;
            this.bounceShow = 1;
            this.msg = '请先导入Excel文件';
            this.setTime();
          }
        },
        uploadFile() { // 处理Excel文件
          let _this = this;
          this.file = event.currentTarget.files[0];
          let rABS = false; //是否将文件读取为二进制字符串
          let f = this.file;
          let reader = new FileReader();
          FileReader.prototype.readAsBinaryString = function (f) {
            let binary = "";
            let rABS = false; //是否将文件读取为二进制字符串
            let wb; //读取完成的数据
            let outdata;
            let reader = new FileReader();
            reader.onload = function (e) {
              let bytes = new Uint8Array(reader.result);
              let length = bytes.byteLength;
              for (let i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              let XLSX = require('xlsx');
              if (rABS) {
                wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                  type: 'base64'
                });
              } else {
                wb = XLSX.read(binary, {
                  type: 'binary'
                });
              }
              outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
              let arr = []
              outdata.map(v => {
                let dataobj = {}
                dataobj.sid = v.学号
                dataobj.sname = v.姓名
                dataobj.tname = v.教师姓名
                dataobj.course = v.课程名
                arr.push(dataobj)
              })
              _this.dataList = [...arr];
            }
            reader.readAsArrayBuffer(f);
          }
          if (rABS) {
            reader.readAsArrayBuffer(f);
          } else {
            reader.readAsBinaryString(f);
          }
        }
      }
    }
</script>

<style scoped>
  .content {
    min-height: calc(100vh - 160px);
    margin: 0 15px;
    display: flex;
  }
  .sample {
    height: 200px;
    width: 100%;
    margin-top: 10px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .sample>span {
    font-weight: bold;
    color: red;
  }
  .sample>img {
    width: 100%;
  }
  .left {
    width: 89%;
    display: flex;
    justify-content: space-between;
  }
  .note {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .audioplay {
    width: 100%;
    height: 80px;
  }
  .audioplay>audio {
    width: 100%;
  }
  .right {
    width: 58%;
    margin-top: 10px;
  }
  .upfile {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .upfile>input {
    width: 140px;
  }
  .bglayer {
    height: 80vh;
    width: 10%;
    background-color: #f8f9fa;
    margin-right: 10px;
  }
  .line {
    width: 100%;
    background-color: rgba(143, 143, 148, .3);
    height: 2px;
  }
  .btn-group-vertical {
    width: 100%;
    height: 160px;
  }
  .attendance {
    width: 89%;
    margin-top: 10px;
  }
  .attendance>table {
    width: 100%;
  }
  .right>span, .attendance>div>span {
    color: rgba(0, 122, 255, .8);
    font-size: 22px;
    font-weight: bold
  }
  td>button {
    margin-right: 10px
  }
  .searchStu {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .searchStu>input {
    width: 80%;
    margin-right: 20px;
  }
</style>
