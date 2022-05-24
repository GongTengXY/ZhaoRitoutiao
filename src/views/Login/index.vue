<template>
  <div>
    <!-- 导航栏 -->
   <van-nav-bar title="登录" class="page-nav-bar">
     <van-icon name="arrow-left" slot="left"  size="16" @click="$router.push({path : '/layout/my'})"/>
   </van-nav-bar>

   <!-- 表单 -->
  <van-form @submit="onSubmit"   ref="loginUser">
    <van-field
      v-model="user.mobile"
      name="mobile"
      placeholder="请输入手机号"
      :rules="loginRules.mobile"
      maxlength=11>
    <i slot="left-icon" class="iconfont icon-shouji"></i>
    </van-field>
    <van-field
      v-model="user.code"
      type="password"
      name="密码"
      placeholder="请输入验证码"
      :rules="loginRules.code"
      maxlength=6>
      <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
      <template #button>
        <van-count-down :time="60 * 1000" @finish="showTime = false" format="ss 秒" v-if="showTime"/>
        <van-button class="yanzhengma" v-else round size="small" type="primary" @click="Onsend" native-type="button">获取验证码</van-button>
      </template>
      </van-field>
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">登录</van-button>
    </div>
  </van-form>
  </div>
</template>

<script>
import {login, sendCode} from '@/api/user'
export default {
  data () {
    return {
      user : {
        mobile : '',   //手机号
        code : '',     //验证码
        //账号：13911111111
        //密码：246810
      },
      loginRules : {
        mobile : [{ 
          required: true,
          message: '请填写用户名'
          },
          {
            pattern : /^1[3|4|5|6|7|8|9][0-9]{9}$/,
            message : '用户名格式错误'
          }],
        code : [{ 
          required: true,
          message: '请填写用户名' 
          },
          {
            pattern : /^\d{6}$/,
            message : '验证码格式错误'
          }]
      },  
      showTime : false,  //是否展示倒计时
    }
  },
  methods: {
    //登录验证
    async onSubmit() {
      //1.获取表单数据
      const user = this.user
      //2.表单验证

      //在组件中要用this.$toast调用
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,  //禁止点击其他
        duration : 0,  //如果为0，则持续展示
      });
      //3.提交表单请求登录
      try {
        const res = await login(user)
        const data = res.data.data
        this.$toast.success('登录成功')
        this.$store.commit('setUser', data)
        // console.log('登录成功', res)
        //登录成功，跳转回原来页面 使用back不严谨，后面再说
        this.$router.back()
      } catch(err){
        if (err.response.status === 400){
          this.$toast.fail('手机号或验证码错误')
          // console.log('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
          // console.log("登录失败，请稍后重试")
        }
      }
      //4.根据请求响应结果处理后续操作
      
    },
    async Onsend() {
      //1.要先校验手机号码
      try{
        //vant中的属性validate可以验证单个表单项
        await this.$refs.loginUser.validate("mobile")
      } catch(err) {
        return console.log('验证失败', err)
      }
      //2.验证通过，显示倒计时
      this.showTime = true
      //3.请求发送验证码 -- 调用接口接口就好
      try{
        await sendCode(this.user.mobile)
        this.$toast.success('发送成功')
      } catch {
        this.showTime = false
        if (err.response.status === 429) {
          this.$toast('发送频繁，请稍后重试');
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
  .van-form {
    .van-cell {
        line-height: 90px;
        padding: 20px 40px;
        .iconfont {
            font-size: 36px;
            margin-right: 20px;
        }
        .yanzhengma {
          width: 158px;
          height: 46px;
          background-color: #ededed;
          color: #000;
          border: none;
        }
    }
}
</style>
