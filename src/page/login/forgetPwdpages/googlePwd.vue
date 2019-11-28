<template>
    <div class="googlePwd">
      <div class="main">
        <form class="form-table">
          <div class="title">{{$t('forgetPwd.text1')}}</div>
          <div class="input-box">
            <div class="userName">{{googleUsername}}</div>
          </div>
          <div class="input-box">
            <input type="password" v-model.trim="password" @blur="pwdBlur()" @focus="passwordHintShow = false, pwdShow = true" autocomplete="off" maxlength="26" :placeholder="$t('login.text3')">
            <div class="hint" :class="{'allHintNullActive': passwordHintShow}">{{userZcPwdMsgText}}</div>
            <div class="hintf" v-show="pwdShow">密码必须包含大小写和数字，不能少于6位</div>
          </div>
          <div class="input-box">
            <input type="password" v-model.trim="confirmPassword" @blur="confiPwdBlur()" @focus="confirmPswHintShow = false, coincideShow = true"  maxlength="26" autocomplete="off" :placeholder="$t('signIn.text7')">
            <div class="hint" :class="{'allHintNullActive': confirmPswHintShow}">{{confirmPswMsgText}}</div>
            <div class="hintf" v-show="coincideShow">{{$t('signIn.text19')}}</div>
          </div>
          <div class="input-box">
            <input type="number" v-model.trim="googleCode" @focus="googleCodeHintShow = false" maxlength="26" autocomplete="off" :placeholder="$t('forgetPwd.text4')">
            <div class="hint" :class="{'allHintNullActive': googleCodeHintShow}">{{googleCodeMsgText}}</div>
          </div>
          <div class="btn button--ujarak button--inverted" :class="{'active': goLoginActive}" @click="gooogleToPwd()">
            {{$t('signIn.text10')}}
            <!--login加載-->
            <div class="loding-box">
              <div v-show="loadingShow" class="spinner">
                <div class="spinner-container container1">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
                <div class="spinner-container container2">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
                <div class="spinner-container container3">
                  <div class="circle1"></div>
                  <div class="circle2"></div>
                  <div class="circle3"></div>
                  <div class="circle4"></div>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/login" replace tag="div" class="return-login">{{$t('signIn.text11')}}</router-link>
        </form>
      </div>
    </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
export default {
  data() {
    return {
      googleUsername: '',
      password: '', // 登录密码
      userZcPwdMsgText: '', // 登录密码提示内容
      passwordHintShow: false, // 密码提示
      pwdShow: true,
      confirmPassword: '', // 确认密码
      confirmPswHintShow: '', // 确认密码提示
      confirmPswMsgText: '',
      coincideShow: true,
      googleCode: '',
      googleCodeHintShow: false,
      googleCodeMsgText: '',
      goLoginActive: false,
      loadingShow: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.googleUsername = this.$route.query.googleUsername
    })
  },
  components: {},
  methods: {
    pwdBlur () {
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/
      if (passWordTest.test(this.password) && this.password !== '') {
        this.pwdShow = false
        this.passwordHintShow = false
      } else {
        this.pwdShow = true
        this.passwordHintShow = false
      }
    },
    confiPwdBlur () {
      if (this.confirmPassword === this.password && this.password !== '' && this.confirmPassword !== '') {
        this.coincideShow = false
        this.confirmPswHintShow = false
      } else {
        this.coincideShow = true
        this.confirmPswHintShow = false
      }
    },
    verify () {
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/ //  密码匹配长度为6到26位,字母和数字组成必须包含大写小写
      if (this.password === '') {
        this.passwordHintShow = true
        this.pwdShow = false
        this.userZcPwdMsgText = this.$t('login.text3')
      }
      if (this.password !== '' && !passWordTest.test(this.password)) {
        this.passwordHintShow = false
        this.pwdShow = true
      }
      if (this.password !== '' && passWordTest.test(this.password)) {
        this.passwordHintShow = false
        this.pwdShow = false
      }
      if (this.confirmPassword === '') {
        this.confirmPswHintShow = true
        this.coincideShow = false
        this.confirmPswMsgText = this.$t('signIn.text7')
      }
      if (this.confirmPassword !== '' && this.confirmPassword !== this.password) {
        this.confirmPswHintShow = false
        this.coincideShow = true
      }
      if (this.confirmPassword !== '' && this.confirmPassword === this.password) {
        this.confirmPswHintShow = false
        this.coincideShow = false
      }
      if (this.googleCode === '') {
        this.googleCodeHintShow = true
        this.googleCodeMsgText = this.$t('forgetPwd.text4')
      }
    },
    gooogleToPwd () {
      this.verify()
      this.goLoginActive = !this.goLoginActive
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/ //  密码匹配长度为6到26位,字母和数字组成必须包含大写小写
      let formData = new FormData()
      formData.append('username', this.googleUsername)
      formData.append('password', this.password)
      formData.append('codeType', 1)
      formData.append('code', this.googleCode)
      if (this.googleUsername !== '' && passWordTest.test(this.password) && this.password === this.confirmPassword && this.googleCode !== '') {
        this.$http.post(`${this.$api}/security/findpassword`, formData).then((res) => {
          this.loadingShow = true
          if (res.data.success) {
            this.loadingShow = false
            Dialog({
              title: this.$t('forgetPwd.text1'),
              content: this.$t('forgetPwd.text5'),
              okFn: () => {
                this.$router.replace('/login')
              }
            })
          } else {
            this.loadingShow = false
            Dialog({
              title: this.$t('forgetPwd.text1'),
              content: res.data.msg,
              okFn: () => {
                this.$router.replace('/googlePwd')
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .main-container{
    padding: 0;
    min-height: auto;
  }
  .googlePwd{
    width: 100%;
    height: calc(100vh - 159px);
    margin-top: 100px;
    background: url("../../../assets/images/login/bg.png") no-repeat;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .main{
      width: 660px;
      height: auto;
      background-color: #fff;
      padding: 40px 0;
      border-radius: 4px;
      background-color: rgba(255,255,255, .94);
      box-shadow: 0 0 16px 2px rgba(74, 134, 255, .2);
      .form-table{
        width: 460px;
        margin: auto;
        .title{
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          color: #1a1a1a;
        }
        .input-box{
          width: 100%;
          height: 44px;
          line-height: 44px;
          margin: 30px auto;
          background-color: #fff;
          position: relative;
          input,.userName{
            display: block;
            width: 100%;
            height: 100%;
            padding-left: 15px;
            font-size: 14px;
            color: #999;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, 0.5);
            border-radius: 4px;
            &:focus{
              box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
              border: 1px solid rgba(255, 153, 20, .4);
              transition: all ease-out .3s;
            }
          }
          .userName{
            cursor: default;
          }
          .hint,.hintf {
            height: 14px;
            line-height: 14px;
            position: absolute;
            top: 52px;
            left: 0;
            font-size: 14px;
            color: #e93a3a;
          }
          .hint{
            opacity: 0;
            &.allHintNullActive {
              opacity: 1;
              transition: all ease-out .2s;
            }
          }
        }
        .btn{
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          color: #fff;
          margin: 30px auto 20px;
          background-color: #ffba14;
          border-radius: 4px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          cursor: pointer;
          position: relative;
          z-index: 1;
          &.active{
            opacity: .9;
            transition: all ease-out .2s;
          }
          &:hover{
            background-color: #F29800;
            transition: all ease-out .2s;
          }
          .loding-box{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 40%;
            .spinner {
              width: 18px;
              height: 18px;
              position: relative;
            }
            .container1 > div, .container2 > div, .container3 > div {
              width: 6px;
              height: 6px;
              background-color: #fff;
              border-radius: 100%;
              position: absolute;
              -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
              animation: bouncedelay 1.2s infinite ease-in-out;
              -webkit-animation-fill-mode: both;
              animation-fill-mode: both;
            }
            .spinner .spinner-container {
              position: absolute;
              width: 100%;
              height: 100%;
            }
            .container2 {
              -webkit-transform: rotateZ(45deg);
              transform: rotateZ(45deg);
            }
            .container3 {
              -webkit-transform: rotateZ(90deg);
              transform: rotateZ(90deg);
            }
            .circle1 { top: 0; left: 0; }
            .circle2 { top: 0; right: 0; }
            .circle3 { right: 0; bottom: 0; }
            .circle4 { left: 0; bottom: 0; }
            .container2 .circle1 {
              -webkit-animation-delay: -1.1s;
              animation-delay: -1.1s;
            }
            .container3 .circle1 {
              -webkit-animation-delay: -1.0s;
              animation-delay: -1.0s;
            }
            .container1 .circle2 {
              -webkit-animation-delay: -0.9s;
              animation-delay: -0.9s;
            }
            .container2 .circle2 {
              -webkit-animation-delay: -0.8s;
              animation-delay: -0.8s;
            }
            .container3 .circle2 {
              -webkit-animation-delay: -0.7s;
              animation-delay: -0.7s;
            }
            .container1 .circle3 {
              -webkit-animation-delay: -0.6s;
              animation-delay: -0.6s;
            }
            .container2 .circle3 {
              -webkit-animation-delay: -0.5s;
              animation-delay: -0.5s;
            }
            .container3 .circle3 {
              -webkit-animation-delay: -0.4s;
              animation-delay: -0.4s;
            }
            .container1 .circle4 {
              -webkit-animation-delay: -0.3s;
              animation-delay: -0.3s;
            }
            .container2 .circle4 {
              -webkit-animation-delay: -0.2s;
              animation-delay: -0.2s;
            }
            .container3 .circle4 {
              -webkit-animation-delay: -0.1s;
              animation-delay: -0.1s;
            }
            @-webkit-keyframes bouncedelay {
              0%, 80%, 100% { -webkit-transform: scale(0.0) }
              40% { -webkit-transform: scale(1.0) }
            }
            @keyframes bouncedelay {
              0%, 80%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
              } 40% {
                  transform: scale(1.0);
                  -webkit-transform: scale(1.0);
                }
            }
          }
        }
        .return-login{
          text-align: center;
          color: #4b84ff;
          font-size: 14px;
          cursor: pointer;
          transition: all ease-out .2s;
          &:hover{
            color: #ffba14;
            transition: all ease-out .2s;
          }
        }
      }
    }
  }
</style>
