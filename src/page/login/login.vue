<template>
    <div class="login">
      <!--登录-->
      <div class="logging-box">
        <div class="logging">
          <div class="title">{{$t('login.text1')}}</div>
          <div class="text-input login-user" :class="{active: activeUserColor}">
            <div class="user-img" :class="{'userActive': userActiveShow}">
             <span></span>
            </div>
            <input :class="{'allFontAcive': userFontAcive, 'nullInput': nullUserActive}" id="user" @keyup.enter="goToLogin()" type="text" v-model.trim="userName" @focus="nullUserActive = false, userFontAcive = false, errorShow = false, userActiveShow =true, activeUserColor = true" @blur="userActiveShow = false, activeUserColor = false" :placeholder="$t('login.text2')" autocomplete="off">
          </div>
          <div class="text-input login-password" :class="{active: activePwdColor}">
            <div class="psw-img" :class="{'pswActive': pswActiveShow}">
             <span></span>
            </div>
            <input :class="{'allFontAcive': pwdFontAcive, 'nullInput': nullPwdActive}" id="password" @keyup.enter="goToLogin()" type="password" v-model.trim="passWord" @focus="nullPwdActive = false, pwdFontAcive = false, errorShow = false, pswActiveShow = true, activePwdColor = true" @blur="pswActiveShow = false, activePwdColor = false" :placeholder="$t('login.text3')" autocomplete="off">
          </div>
          <div class="btn button--ujarak button--inverted" :class="{'active': goLoginActive}" ref="loginBtn" @click="goToLogin()">{{$t('login.text4')}}
            <div class="error" v-show="errorShow">{{errorText}}</div>
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
          <div class="signin-link">
            <router-link to="/signIn" tag="div" class="signin">{{$t('login.text5')}}</router-link>
            <router-link to="/forgetThePassword" tag="div" class="forget-password">{{$t('login.text6')}}</router-link>
          </div>
          <div class="download-app"><a target="_blank" href="https://app.pi-group.biz/appdownload/us/pi.html">{{$t('login.text7')}}</a></div>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      loadingShow: false, // 登錄加載show
      errorText: '', // 请求錯誤提示文本
      nullPwdActive: false,
      nullUserActive: false,
      userMsg: false,
      psdMsg: false,
      errorShow: false, // 錯誤提示show
      userName: '',
      passWord: '',
      userActiveShow: false, // 用户名获取焦点,背景样式
      pswActiveShow: false, // 密码获取焦点,背景样式
      userFontAcive: false, // 错误提示时,input字体颜色红
      pwdFontAcive: false, // 错误提示时,input字体颜色红
      goLoginActive: false,
      activeUserColor: false,
      activePwdColor: false,
      address: ''
    }
  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      if (!this.$route.query.id && !this.$route.query.purchaseId && this.loginFlag === true) {
        // console.log(Number(this.$route.query.purchaseId))
        this.isNoLoginFag()
      }
      // 挂载完成后，判断浏览器是否支持popstate
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.goBack, false)
      }
    })
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
  },
  computed: {
    ...mapGetters([
      'account',
      'loginFlag'
    ])
  },
  methods: {
    goBack () {
      if (window.history.length > 1) {
        this.$router.go(1)
      }
    },
    isNoLoginFag () {
      this.$http.get(`${this.$api}user/balance`).then((res) => { // 用戶是否登錄過,登錄過進入首頁
        if (res.data.success === true) {
          if (!this.$route.query.id && !this.$route.query.purchaseId) {
            this.$router.push({path: '/home', query: {homeaddress: this.account.address}})
          }
        } else {
          if (!this.$route.query.id && !this.$route.query.purchaseId) {
            this.$router.replace('/login')
          }
        }
      })
    },
    loginVerify () {
      if (this.userName === '') {
        this.nullUserActive = true
        this.userFontAcive = true
      }
      if (this.passWord === '') {
        this.nullPwdActive = true
        this.pwdFontAcive = true
      }
    },
    // 登录
    goToLogin () {
      // 用户名提示验证
      this.goLoginActive = !this.goLoginActive
      this.loginVerify()
      if (this.userName !== '' && this.passWord !== '') {
        this.$http.post(`${this.$api}user/userlogin?username=${this.userName}&password=${this.passWord}`).then((res) => {
          this.loadingShow = true
          if (res.data.success === true) {
              this.$store.dispatch('getUserBalance')
            if (Number(this.$route.query.id) >= 0) {
               // console.log(Number(this.$route.query.id))
              this.$router.replace({path: '/buyGoods', query: {id: this.$route.query.id, shareCode: this.$route.query.shareCode}})
            } else if (Number(this.$route.query.purchaseId) >= 0) {
              this.$router.replace({path: '/buyGoodsDetail', query: {purchaseId: this.$route.query.purchaseId, shareCode: this.$route.query.shareCode}})
            } else {
              this.$router.push({path: '/home', query: {homeaddress: this.account.address}})
            }
            this.loadingShow = false
          } else {
            setTimeout(() => {
              this.errorText = res.data.msg
              this.loadingShow = false
              this.errorShow = true
              if (res.data.resultCode === 'INCORRECT_PASSWORD' || res.data.resultCode === 'USER_NOT_FOUND') { // 账号密码错误，用户不存在input字体红色
                this.pwdFontAcive = true
                this.userFontAcive = true
              } else {
                this.pwdFontAcive = false
                this.userFontAcive = false
              }
            }, 1000)
            if (res.data.resultCode === 'EMAIL_NOT_NULL') { // 账号未绑定邮箱，去绑定邮箱再登陆
              if (this.userName !== '') {
                this.$http.post(`${this.$api}/user/checkaccount?account=${this.userName}`).then((res) => {
                  if (res.data.success) {
                    this.address = res.data.data.address
                    this.$router.replace({path: '/loginBindEmail', query: {goaddress: this.address}})
                  }
                })
              }
            }
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
  .login{
    width: 100%;
    height: calc(100vh - 159px);
    margin-top: 100px;
    background: url("../../assets/images/login/bg.png") no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .logging-box{
      width: 660px;
      height: 470px;
      border-radius: 4px;
      background-color: rgba(255,255,255, .94);
      box-shadow: 0 0 20px 2px rgba(74, 134, 255, .1);
      display: flex;
      align-items: center;
      justify-content: center;
      .logging{
        width: 100%;
        padding: 0 100px;
        .title{
          font-size: 20px;
          color: #1a1a1a;
          text-shadow: 0 2px 2px rgba(153, 153, 153, .3);
        }
        .text-input{
          width: 100%;
          height: 44px;
          border: 1px solid #e7e8ec;
          box-shadow: 0 3px 3px rgba(235, 236, 240, 0.5);
          border-radius: 4px;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          &.active{
            box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
            border: 1px solid rgba(255, 153, 20, .4);
            transition: all ease-out .4s;
          }
          span{
            display: inline-block;
            width: 18px;
            height: 20px;
            background-size: 100%;
            margin: 0 15px;
          }
          input{
            width: 100%;
            height: 100%;
            padding-left: 8px;
            color: rgba(26, 26, 26, .7);
            font-size: 15px;
            &::-webkit-input-placeholder{
              color: #999;
            }
            &:-moz-placeholder{
              color: #999;
            }
            &::-moz-placeholder{
              color: #999;
            }
            &:-ms-input-placeholder{
              color: #999;
            }
            &.nullInput{
              transition: opacity ease-out .3s;
              &::-webkit-input-placeholder{
                color: #e93a3a;
              }
              &:-moz-placeholder{
                color: #e93a3a;
              }
              &::-moz-placeholder{
                color: #e93a3a;
              }
              &:-ms-input-placeholder{
                color: #e93a3a;
              }
            }
          }
          input:-webkit-autofill {
            background-color: #fff;
            background-image: none;
          }
        }
        .login-user{
          margin: 30px auto;
          .user-img{
            width: auto;
            height: 100%;
            border-right: none;
            display: flex;
            align-items: center;
            justify-content: center;
            &.userActive{
              background-color: rgba(255, 153, 20, 0.2);
              transition: all ease-out .4s;
            }
            span{
              background: url("../../assets/images/login/user.png") no-repeat;
            }
          }
          #user{
            flex: 1;
            &.allFontAcive{
              color: #e93a3a;
              transition: all ease-out .2s;
            }
          }
        }
        .login-password{
          margin-bottom: 6px;
          .psw-img{
            width: auto;
            height: 100%;
            border-right: none;
            display: flex;
            align-items: center;
            justify-content: center;
            &.pswActive{
              background-color: rgba(255, 153, 20, 0.2);
              transition: all ease-out .4s;
            }
          }
          span{
            background: url("../../assets/images/login/password.png") no-repeat;
          }
          #password{
            flex: 1;
            &.allFontAcive{
              color: #e93a3a;
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
          background-color: rgba(255, 177, 20, .9);
          border-radius: 4px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          text-shadow: 0 2px 2px rgba(0, 0, 0, .4);
          cursor: pointer;
          position: relative;
          z-index: 1;
          .error{
            position: absolute;
            left: 0;
            top: -40px;
            font-size: 14px;
            color: #e93a3a;
            text-shadow: none;
            transition: opacity ease-out .3s;
          }
          &.active{
            opacity: .9;
            transition: all ease-out .3s;
          }
          &:hover{
            background-color: rgba(242, 145, 0, .6);
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
                  transform: scale(1);
                  -webkit-transform: scale(1);
                }
            }
          }
        }
        .signin-link{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #4b84ff;
          transition: opacity ease-out .3s;
          .signin{
            cursor: pointer;
            &:hover{
              color: #ffba14;
              transition: all ease-out .2s;
            }
          }
          .forget-password{
            cursor: pointer;
            &:hover{
              color: #ffba14;
              transition: all ease-out .2s;
            }
          }
        }
        .download-app{
          text-align: center;
          padding-top: 30px;
          a{
            display: inline-block;
            font-size: 14px;
            color: #1a1a1a;
            padding-bottom: 2px;
            border-bottom: 1px solid #1a1a1a;
            &:hover{
              color: #ffba14;
              border-bottom: 1px solid #ffba14;
              transition: all ease-out .2s;
            }
          }
        }
      }
    }
  }
  // 身份验证
  .authentication-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(0,0,0, .2);
    display: flex;
    align-items: center;
    justify-content: center;
    .authentication{
      width: 600px;
      height: 374px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 3px 8px rgba(74, 134, 255, 0.4);
      position: relative;
      .close{
        width: 17px;
        height: 17px;
        background: url("../../assets/images/login/Shutdown.png") no-repeat;
        background-size: 100%;
        background-position: center;
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
      }
      .tab-box{
        width: 440px;
        margin: 40px auto;
        .title{
          font-size: 20px;
          color: #1a1a1a;
          font-weight: bold;
          text-align: center;
        }
        .verification{
          width: 100%;
          height: 38px;
          line-height: 38px;
          margin-top: 40px;
          text-align: center;
          font-size: 16px;
          color: #1a1a1a;
          display: flex;
          .google-authenticator{
            flex: 1;
          }
          .sms-verification{
            flex: 1;
            border-bottom: 1px solid #999;
            cursor: pointer;
            &.active{
              width: 100%;
              height: 100%;
              background-color: #ffba14;
              color: #fff;
              border-bottom: none;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              transition: opacity ease-out .3s;
            }
          }
        }
        .input-box{
          width: 100%;
          height: 44px;
          border: 1px solid #999;
          border-top-style: none;
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .code{
            flex: 1;
            padding-left: 30px;
            font-size: 16px;
            color: #999;
          }
          .code-btn{
            width: auto;
            height: 44px;
            display: flex;
            align-items: center;
            cursor: pointer;
            .btn-veri{
              padding: 0 20px;
              border-left: 1px solid #999;
              font-size: 16px;
              color: #4b84ff;
            }
          }
        }
        .btn{
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 4px;
          background-color: #ffba14;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          color: #fff;
          font-size: 20px;
          margin: 40px auto 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
