<template>
  <a-layout id="app">
    <a-layout-header class="header flexrow">
      <h2>eStudy</h2>
      <div class="right flexrow" v-if="loggedIn">
        <!-- 老师界面 -->
        <div v-if="isTeacher" class="flexrow">
          <h3>
            <span>{{info.full_name}}</span>
          </h3>
          <a-button
            icon="file-add"
            class="vcenter"
            type="primary"
            @click="showAssignment = true"
          >新建作业</a-button>
        </div>
        <!-- 学生界面 -->
        <div class="flexrow" v-else>
          <h3 class="flexcol">
            <span>{{info.full_name}}</span>
            <span>学号:{{info.name}}</span>
          </h3>
          <h4 class="flexcol">
            <span v-for="(org,value) in studentOrgs" :key="`${org}_${value}`">{{org}}</span>
          </h4>
          <div>
            <span class="label">{{stats.uncommitted}}个作业待提交</span>
            <span class="label">{{stats.revising}}个作业待批改</span>
            <span class="label">{{stats.improvable}}个作业需完善</span>
            <span class="label">{{stats.finished}}个作业已完成</span>
          </div>
        </div>
        <a class="vcenter" href="http://vipgit.chanke.xyz" target="_blank">
          <a-button icon="home">代码仓库</a-button>
        </a>
        <a-button class="vcenter" icon="logout" @click="$store.dispatch('user/logout')">退出</a-button>
      </div>
    </a-layout-header>
    <a-layout-content>
      <Authorization v-if="!loggedIn"></Authorization>
      <div v-else>
        <Teacher v-if="isTeacher"></Teacher>
        <Student v-else></Student>
      </div>
      <!-- 创建作业框 -->
      <a-modal :visible="showAssignment" @cancel="showAssignment = false" :footer="null">
        <a-form>
          <a-form-item label="课程" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
            <a-select name="org_id" v-model="createAssignmentForm.org_id">
              <a-select-option
                :key= "`org_${index}`"
                v-for= "(org,index) in teacherOrgs"
                :value= "org.id"
              >{{org.full_name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label= "作业名称" :label-col= "{ span: 5 }" :wrapper-col= "{ span: 16 }">
            <a-input v-model= 'createAssignmentForm.name'></a-input>
          </a-form-item>
          <a-form-item label="开始/结束时间" :label-col= " { span: 5 }">
             <a-range-picker :placeholder="['开始时间', '结束时间']"  @change= 'onChange' />
          </a-form-item>
          <a-form-item :wrapper-col= "{ span: 14, offset: 5 }">
            <a-button type="primary" @click= "createAssignment">保存</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Authorization from "./components/Authorization";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import { mapState, mapMutations } from "vuex";
import { api } from "./utils/api";

export default {
  name: "app",
  data() {
    return {
      showAssignment: false,
      createAssignmentForm: {
        org_id : "",
        name : '',
        time_range : []
      }
    };
  },
  computed: {
    ...mapState("user", ["loggedIn", "info"]),
    ...mapState("student", ["studentOrgs", "stats", "studentAssignments"]),
    ...mapState("teacher", ["teacherOrgs", "teacherAssignments"]),
    //判断登陆请求成功后返回的信息是否老师用户
    isTeacher() {
      return this.info.is_admin > 0;
    }
  },
  watch: {
    //登陆账号时触发（监控是否登陆）
    loggedIn(val) {
      if (val) {
        this.loadDetails();
      }
    }
  },
  components: {
    Authorization,
    Teacher,
    Student
  },
  methods: {
    loadDetails() {
      if (this.isTeacher) {
        api.get("/teacher/detail").then(data => {
          this.updataTeacher(data);
        });
      } else {
        api.get("/student/detail").then(data => {
          this.updataStudent(data);
        });
      }
    },
    handleCancel() {
      this.showAssignment = false;
    },
    onChange(value,dateString){
      this.createAssignmentForm.time_range = dateString
    },
    createAssignment(){
      api.post('/teacher/createAssignment',
                {org_id:this.createAssignmentForm.org_id,
                name:this.createAssignmentForm.name,
                start_time:this.createAssignmentForm.time_range[0],
                end_time:this.createAssignmentForm.time_range[1]}).then(data => {
                  this.addAssignment(data);
                  this.$message.info('添加成功');
                  this.showAssignment = false;
                }
              )
    },
    //引入学生用户的信息更新方法
    ...mapMutations("student", ["updataStudent"]),
    //引入教师用户的信息更新方法
    ...mapMutations("teacher", ["updataTeacher","addAssignment"])
  },

  
  //钩子函数，刷新页面执行（重新加载程序时执行)
  created() {
    if (this.loggedIn) {
      this.loadDetails();
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
.header {
  color: white;
  font-size: 1.1em;
  h2,
  h3,
  h4 {
    color: white;
  }
  .right > .flexrow > * {
    margin-right: 25px;
  }
  .label {
    padding: 0 5px;
  }
}
.flexrow {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
}
.right {
  margin-left: auto;
}
.flexcol {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly; 
  height: 100%;
  span {
    flex: 1;
    max-height: 20px;
    line-height: 20px;
  }
}
.vcenter {
  align-self: center; //弹性盒子的居中属性
}
</style>
