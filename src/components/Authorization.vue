<template>
  <div class="authorization">
    <ValidationObserver v-slot="{handleSubmit} ">
      <form @submit.prevent="handleSubmit(submit)">
        <ValidationProvider name="用户名" rules="required" v-slot="{errors}">
          <div class="filed">
            <!-- 用户名输入框 -->
            <a-input 
              type="text"
              :class="{error:errors[0]}" 
              placeholder="请输入用户名"  
              v-model="form.name">
              <a-icon type="user" slot="prefix" class="icon"></a-icon>
            </a-input>
            <!-- 用户名错误信息 -->
            <span class="error-tip">{{errors[0]}}</span>
          </div>
        </ValidationProvider>
        <ValidationProvider name="密码" rules="required" v-slot="{errors}">
          <div class="filed">
            <!-- 密码输入框 -->
            <a-input 
              type="password"
              :class="{error:errors[0]}"
              placeholder="请输入密码" 
              v-model="form.password" >
              <a-icon type="lock" slot="prefix" class="icon"></a-icon>
            </a-input>
            <!-- 密码错误信息 -->
            <span class="error-tip">{{errors[0]}}</span>
          </div>
        </ValidationProvider>
        <div class="filed">
          <!-- 提交按钮 -->
          <a-button type="primary" htmlType="submit">提交</a-button>
        </div>
      </form>
    </ValidationObserver>
    
  </div>
</template>

<script>
//引入axios编辑的api
import  {api} from "../utils/api"

export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      }
    };
  },
  computed:{
    
  },
  methods: {
    //提交表单，想后台提出请求
    submit() {
      this.$store.dispatch('user/login',this.form)
      }
      
    }
  }

</script>

<style lang="scss" scoped>
.authorization {
  display: flex;
  justify-content: center;
}
form {
  width: 400px;
}
.filed {
  margin: 20px;
  button {
    width: 100%;
  }
}
.icon {
  color: rgba(0, 0, 0, 0.25);
}
.error{
  border:1px solid red;
}
.error-tip{
  color:red;
}
</style>