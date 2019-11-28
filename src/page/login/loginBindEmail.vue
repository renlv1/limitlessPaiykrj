<template>
    <div class="loginBindEmail">
      <div class="main">
        <div class="logging">
          <div class="title">{{$t('login.text8')}}</div>
          <div class="input-box">
            <input type="email" v-model.trim="email" @focus="emailHintShow = false" :placeholder="$t('signIn.text15')" maxlength="30" autocomplete="off">
            <div class="hint" :class="{'allHintNullActive': emailHintShow}">{{emailMsgText}}</div>
          </div>
          <div class="input-box">
            <input type="password" v-model.trim="userPwd" @focus="userPwdHintShow = false" autocomplete="off" maxlength="26" :placeholder="$t('login.text3')">
            <div class="hint" :class="{'allHintNullActive': userPwdHintShow}">{{userZcPwdMsgText}}</div>
          </div>
          <div class="input-box1">
            <smscode
              @focus="msgAationCodeShow = false"
              @click="getMailCode()"
              v-model="msgAationCode"
              ref="smscode"
              height="40px"
            ></smscode>
          </div>
          <div class="btn button--ujarak button--inverted" :class="{'active': goLoginActive}" @click="goToVerify()">
            {{$t('signIn.text10')}}
            <div class="hint" :class="{'allHintNullActive': msgAationCodeShow}">{{msgAationCodeHint}}</div>
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
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import smscode from '@/components/smscode'
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      goLoginActive: false,
      loadingShow: false,
      emailHintShow: false,
      userPwdHintShow: false,
      msgAationCodeShow: false,
      email: '',
      emailMsgText: '',
      userPwd: '',
      userZcPwdMsgText: '',
      msgAationCode: '',
      msgAationCodeHint: '',
      address: this.$route.query.goaddress
    }
  },
  mounted () {
    // console.log('my', this.$route.query.goaddress)
  },
  components: {
    smscode
  },
  methods: {
    // 验证
    biangMailInTest () {
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      if (this.email === '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text15')
      }
      if (!emailTest.test(this.email) && this.email !== '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text16')
      }
      if (this.userPwd === '') {
        this.userPwdHintShow = true // 更换提示内容 密码不能为空
        this.hintPwdIsSHow = false
        this.userZcPwdMsgText = this.$t('login.text3')
      }
      if (this.msgAationCode === '') {
        this.msgAationCodeShow = true
        this.msgAationCodeHint = this.$t('signIn.text20')
      }
    },
    goToVerify () {
      this.biangMailInTest()
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      this.goLoginActive = !this.goLoginActive
      let formData = new FormData()
      formData.append('email', this.email)
      formData.append('emailCode', this.msgAationCode) // 验证密码
      formData.append('userAddress', this.address) // 地址
      formData.append('loginPass', this.userPwd) // 密码
      this.loadingShow = true
      setTimeout(() => {
        this.loadingShow = false
      }, 600)
      if (emailTest.test(this.email) && this.userPwd !== '' && this.msgAationCode !== '') {
        this.$http.post(`${this.$api}/user/bindUserEmail`, formData).then((res) => {
          this.loadingShow = true
          if (res.data.success === true) {
            this.$store.dispatch('getUserBalance')
            this.loadingShow = false
            Dialog({
              content: this.$t('login.text9'),
              okFn: () => {
                this.$router.replace('/home')
              }
            })
          } else {
            setTimeout(() => {
              this.msgAationCodeHint = res.data.msg
              this.msgAationCodeShow = true
              this.loadingShow = false
            }, 1000)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    // 邮箱验证
    getMailCode () {
      let sendCodeMsg
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      if (this.email === '' || !emailTest.test(this.email)) {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text15')
      } else if (!emailTest.test(this.email) && this.email !== '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text16')
      } else {
        let formData = new FormData()
        formData.append('email', this.email)
        formData.append('sendType', 1)
        this.$http.post(`${this.$api}/user/sendEmailCode`, formData).then((res) => {
          this.$refs.smscode.loading = true // 显示loading
          if (res.data.success) {
            sendCodeMsg = this.$t('signIn.text26')
            this.msgAationCodeHint = sendCodeMsg
            this.msgAationCodeShow = true
            this.$refs.smscode.loading = false
          } else {
            sendCodeMsg = res.data.msg
            this.msgAationCodeHint = sendCodeMsg
            this.msgAationCodeShow = true
            this.$refs.smscode.loading = false
          }
          this.getCountDown()
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    getCountDown () {
      setTimeout(() => {
        this.$refs.smscode.loading = false // 显示loading
        this.$refs.smscode.start() // 开始倒计时
      }, 1000)
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  }
}
</script>

<style lang="less" scoped>
  .main-container{
    padding: 0;
    min-height: auto;
  }
  .loginBindEmail{
    width: 100%;
    height: calc(100vh - 159px);
    margin-top: 100px;
    background: url("../../assets/images/login/bg.png") no-repeat;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .main{
      width: 660px;
      height: 500px;
      border-radius: 4px;
      background-color: rgba(255,255,255, .94);
      box-shadow: 0 0 16px 2px rgba(74, 134, 255, .2);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .logging{
        width: 100%;
        padding: 0 100px;
        .title{
          font-size: 20px;
          color: #1a1a1a;
          text-align: center;
        }
        .input-box{
          width: 100%;
          height: 44px;
          line-height: 44px;
          margin: 30px auto;
          background-color: #fff;
          position: relative;
          input{
            display: block;
            width: 100%;
            height: 100%;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, 0.5);
            border-radius: 4px;
            padding-left: 15px;
            font-size: 14px;
            color: #999;
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
            &:focus{
              box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
              border: 1px solid rgba(255, 153, 20, .4);
              transition: all ease-out .3s;
            }
          }
          .hint {
            height: 14px;
            line-height: 14px;
            position: absolute;
            top: 52px;
            left: 0;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            &.allHintNullActive {
              opacity: 1;
              transition: all ease-out .2s;
            }
          }
        }
        .input-box1{
          height: 44px;
          /deep/ .sms-container{
            height: 44px !important;
            line-height: 44px !important;
            border: 1px solid #e7e8ec;
            border-radius: 4px;
            margin-top: 10px;
          }
          /deep/ .sms-container .sms-input {
            border: none;
            &::-webkit-input-placeholder{
              color: #999 !important;
            }
            &:-moz-placeholder{
              color: #999 !important;
            }
            &::-moz-placeholder{
              color: #999 !important;
            }
            &:-ms-input-placeholder{
              color: #999 !important;
            }
          }
          /deep/ .sms-container .sms-btn{
            &:after{
              display: block;
              position: absolute;
              content: '';
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
              height: 18px;
              background-color: #e7e8ec;
            }
          }
          /deep/.sms-container .sms-btn:disabled {
            background: none !important;
            color: rgba(74, 134, 255, 1);
          }
          .hint {
            height: 14px;
            line-height: 14px;
            position: absolute;
            top: 50px;
            left: 0;
            font-size: 14px;
            color: #e93a3a;
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
          margin: 30px auto 10px;
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
        .signin-link{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #4b84ff;
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
          padding-top: 16px;
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
        .hint{
          opacity: 0;
          height: 14px;
          line-height: 14px;
          position: absolute;
          top: -22px;
          left: 0;
          font-size: 14px;
          color: #e93a3a;
          &.allHintNullActive {
            opacity: 1;
            transition: all ease-out .2s;
          }
        }
      }
    }
  }
</style>
