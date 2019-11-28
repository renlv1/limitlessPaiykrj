<template>
  <div class="login">
    <!--注册-->
    <div class="signin-box">
      <div class="sigin">
        <div class="title">{{$t('signIn.text1')}}</div>
        <div class="new-user">
          <input type="text" v-model.trim="userZcNamer" @focus="userHintShow = false" autocomplete="off" maxlength="16" :placeholder="$t('signIn.text2')">
          <div class="hint" :class="{'allHintNullActive': userHintShow}">{{userMsgText}}</div>
        </div>
        <div class="sex">
          <div class="tit">{{$t('signIn.text3')}}</div>
          <div class="sex-input">
             <span v-for="item in $t('signIn.sexDatas')" :key="item.id">
               <span class="radio" style="margin-left: 50px" :class="{checkSex: defaultSexIndex === item.id}" @click="sexRadio(item.id)">
                 <img src="../../assets/images/applySharers/sex.png" alt="">
               </span>
               <i>{{item.sex}}</i>
             </span>
          </div>
        </div>
        <div class="new-password email-box">
          <input type="email" v-model.trim="email" @focus="emailHintShow = false" autocomplete="off" maxlength="30" :placeholder="$t('signIn.text4')">
          <div class="hint" :class="{'allHintNullActive': emailHintShow}">{{emailMsgText}}</div>
        </div>
        <div class="new-password new-password22">
          <input type="password" v-model.trim="userZcPassword" oncopy = "return false" onpaste="return false" @blur="pwdBlur()" @focus="userZcPasswordHintShow = false" autocomplete="off" maxlength="26" :placeholder="$t('login.text3')">
          <div class="hint" :class="{'allHintNullActive': userZcPasswordHintShow}">{{userZcPwdMsgText}}</div>
          <div class="hint22" v-show="hintPwdIsSHow">{{$t('signIn.text6')}}</div>
        </div>
        <div class="new-password confirmPassWord">
          <input type="password" v-model.trim="confirmThePassword" oncopy = "return false" onpaste="return false" @focus="confirmPswHintShow = false" maxlength="26" autocomplete="off" :placeholder="$t('signIn.text7')">
          <div class="hint" :class="{'allHintNullActive': confirmPswHintShow}">{{confirmPswMsgText}}</div>
        </div>
        <div class="new-password short" :class="{active: shortColor}">
          <input type="number" v-model.trim="verificationCode" @focus="emailCodeHintShow = false, shortColor = true, afterHr = true" @blur="shortColor = false, afterHr = false" autocomplete="off" :placeholder="$t('signIn.text8')">
          <div class="getCode-box" :class="{afterHr: afterHr}" @click="sendPhoneCode()">
            <button class="getCode" :class="{active: activeBgColor}" ref="sendMsg">{{countDownText}}</button>
          </div>
          <div class="hint" :class="{'allHintNullActive': emailCodeHintShow}">{{emailCodeMsgText}}</div>
        </div>
        <div class="new-password pay">
          <input type="password" v-model.trim="paymentPassword" @focus="patPswHintShow = false" autocomplete="off" :placeholder="$t('signIn.text9')">
          <div class="hint" :class="{'allHintNullActive': patPswHintShow}">{{patPswMsgText}}</div>
        </div>
        <div class="btn button--ujarak button--inverted" :class="{'active': goLoginActive}" @click="registrationSubmitted()">
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
        <router-link to="/login" replace tag="div" class="back-login">{{$t('signIn.text11')}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      defaultSexIndex: 1,
      userZcNamer: '', // 用户名
      userZcPassword: '', // 输入密码
      confirmThePassword: '', // 确认密码
      verificationCode: '', // 输入短信验证码
      email: '',
      paymentPassword: '', // 输入你的支付密码
      allHintNullActive: false, // 都为空show
      userHintShow: false, // get焦点用户名的show
      patPswHintShow: false, // 支付密码show
      emailCodeHintShow: false, // 邮箱验证码show
      emailHintShow: false,
      userZcPasswordHintShow: false,
      confirmPswHintShow: false, // 确认密码show
      hintPwdIsSHow: true, // 确认密码show
      userMsgText: '', // 错误提示
      emailMsgText: '',
      userZcPwdMsgText: '',
      confirmPswMsgText: '', // 确认密码
      countDownText: this.$t('signIn.text12'),
      emailCodeMsgText: '',
      patPswMsgText: '',
      sendBtnTimes: 60,
      timer: null,
      activeBgColor: false,
      goLoginActive: false,
      loadingShow: false,
      shortColor: false,
      afterHr: false
    }
  },
  created () {
    /* document.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
      }
    }) */
  },
  mounted () {
  },
  methods: {
    pwdBlur () {
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/
      if (passWordTest.test(this.userZcPassword) && this.userZcPassword !== '') {
        this.userZcPasswordHintShow = false
        this.hintPwdIsSHow = false
      } else {
        this.userZcPasswordHintShow = false
        this.hintPwdIsSHow = true
      }
    },
    onTabVerification (index) {
      this.defaultIndex = index
    },
    close () {
      this.authenticationShow = !this.authenticationShow
      this.loginShow = !this.loginShow
    },
    // 注册部分
    sexRadio (index) {
      this.defaultSexIndex = index
    },
    // 验证
    signInTest () {
      // let phoneTest = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ // 手机
      // let userNameTest = /^[a-zA-Z0-9]{6,16}$/ // 用户名 可以全字母或数字
      let userNameTest = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/ // 用户名
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/ //  密码匹配长度为6到26位,字母和数字组成必须包含大写小写
      if (this.userZcNamer === '') {
        this.userHintShow = true
        this.userMsgText = this.$t('signIn.text13')
      }
      if (!userNameTest.test(this.userZcNamer) && this.userZcNamer !== '') {
        this.userHintShow = true
        this.userMsgText = this.$t('signIn.text14')
      }
      if (this.email === '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text15')
      }
      if (!emailTest.test(this.email) && this.email !== '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text16')
      }
      if (this.userZcPassword === '') {
        this.userZcPasswordHintShow = true // 更换提示内容 密码不能为空
        this.hintPwdIsSHow = false
        this.userZcPwdMsgText = this.$t('login.text3')
      }
      if (!passWordTest.test(this.userZcPassword) && this.userZcPassword !== '') {
        this.userZcPasswordHintShow = false
        this.hintPwdIsSHow = true
      }
      if (this.confirmThePassword === '') {
        this.confirmPswHintShow = true // 更换提示内容 确认密码不能为空
        this.confirmPswMsgText = this.$t('signIn.text7')
      }
      if (this.confirmThePassword !== this.userZcPassword && this.confirmThePassword !== '') {
        this.confirmPswHintShow = true
        this.confirmPswMsgText = this.$t('signIn.text19')
      }
      if (this.verificationCode === '') {
        this.emailCodeHintShow = true
        this.emailCodeMsgText = this.$t('signIn.text20')
      }
      if (this.paymentPassword === '') { // 支付密码
        this.patPswHintShow = true
        this.patPswMsgText = this.$t('signIn.text21')
      }
      if (!passWordTest.test(this.paymentPassword) && this.paymentPassword !== '') { // 支付密码
        this.patPswHintShow = true
        this.patPswMsgText = this.$t('signIn.text22')
      }
      if (this.paymentPassword === this.userZcPassword && this.paymentPassword !== '') { // 支付密码與確認密碼
        this.patPswHintShow = true
        this.patPswMsgText = this.$t('signIn.text23')
      }
    },
    // 注册
    registrationSubmitted () {
      this.goLoginActive = !this.goLoginActive
      this.signInTest()
      let userNameTest = /^[a-zA-Z0-9]{6,26}$/ // 用户名
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      let passWordTest = /^(?![0-9]+$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?![a-zA-Z]+$)[0-9A-Za-z]{6,26}$/ //  密码匹配长度为6到26位,字母和数字组成必须包含大写小写
      let formData = new FormData()
      formData.append('username', this.userZcNamer) // 用户名
      formData.append('gender', this.defaultSexIndex) // 性别 1 男 2 女
      formData.append('email', this.email) // 邮箱
      formData.append('password', this.userZcPassword) // 密码
      formData.append('verifyCode', this.verificationCode) // 验证密码
      formData.append('pay_pwd', this.paymentPassword) // 支付密码
      if (userNameTest.test(this.userName) && emailTest.test(this.email) && passWordTest.test(this.userZcPassword) && (passWordTest.test(this.confirmThePassword) === passWordTest.test(this.userZcPassword)) && this.verificationCode !== '' && (passWordTest.test(this.paymentPassword) && this.paymentPassword !== this.userZcPassword)) {
        this.$http.post(`${this.$api}/user/register_user`, formData).then((res) => {
          this.loadingShow = true
          if (res.data.success) {
            this.sendBtnTimes = 0 // 关闭倒计时
            this.loadingShow = false
            Dialog({
              title: this.$t('login.text5'),
              content: this.$t('signIn.text24'),
              okFn: () => {
                this.$router.replace('/login')
              }
            })
          } else {
           this.loadingShow = false
            Dialog({
              title: this.$t('login.text5'),
              content: res.data.msg,
              okFn: () => {
                this.$router.replace('/signIn')
              }
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    countDown () {
      if (this.sendBtnTimes === 0) {
        this.$refs.sendMsg.innerHTML = this.$t('signIn.text25')
        this.sendBtnTimes = 60
        this.$refs.sendMsg.style.color = 'rgba(74, 134, 255, 1)'
        this.$refs.sendMsg.disabled = false
        clearTimeout(this.timer)
      } else {
        this.sendBtnTimes--
        this.$refs.sendMsg.innerHTML = this.sendBtnTimes
        this.$refs.sendMsg.disabled = true
        this.$refs.sendMsg.style.color = 'rgba(255, 153, 20, 1)'
        this.timer = setTimeout(() => this.countDown(), 1000)
      }
    },
    sendPhoneCode () { // 发送验证码
      this.activeBgColor = !this.activeBgColor
      let sendCodeMsg // 发送提醒
      let emailTest = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱
      if (this.email === '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text27')
      } else if (!emailTest.test(this.email) && this.email !== '') {
        this.emailHintShow = true
        this.emailMsgText = this.$t('signIn.text16')
      } else {
        let formData = new FormData()
        /* formData.append('json', JSON.stringify({'type': 'register', 'phoneNumber': this.phoneZc})) */
        formData.append('email', this.email) // 邮箱
        formData.append('sendType', 1) // 邮箱
        this.$http.post(`${this.$api}user/sendEmailCode`, formData).then(res => {
          if (res.data.success) {
            sendCodeMsg = this.$t('signIn.text26')
            this.emailCodeMsgText = sendCodeMsg
            this.emailCodeHintShow = true
          } else {
            sendCodeMsg = res.data.msg
            this.emailCodeMsgText = sendCodeMsg
            this.emailCodeHintShow = true
          }
        }).catch((err) => {
          console.log(err)
        })
        this.countDown()
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
    display: flex;
    align-items: center;
    justify-content: center;
    .signin-box{
      width: 560px;
      height: auto;
      background-color: rgba(255,255,255, .96);
      box-shadow: 0 0 16px 2px rgba(74, 134, 255, .2);
      border-radius: 4px;
      .sigin{
        width: 100%;
        padding: 20px 40px;
        .title{
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          padding-bottom: 40px;
        }
        .new-user{
          width: 100%;
          height: 44px;
          position: relative;
          input{
            width: 100%;
            height: 100%;
            padding-left: 20px;
            font-size: 14px;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
            border-radius: 4px;
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
          .hint{
            position: absolute;
            left: 0;
            top: 46px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            transition: opacity ease-out .3s;
            &.allHintNullActive{
              opacity: 1;
              transition: opacity ease-out .3s;
            }
          }
        }
        .sex{
          height: 44px;
          line-height: 44px;
          margin: 30px auto;
          display: flex;
          justify-content: space-between;
          .tit{
            width: 100px;
            height: 44px;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
            border-radius: 4px;
            text-align: center;
            font-size: 14px;
            color: #999;
            margin-right: 20px;
          }
          .sex-input{
            flex: 1;
            height: 44px;
            line-height: 44px;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            span{
              display: block;
              line-height: 44px;
              .radio{
                -webkit-appearance: none;
                display: inline-block;
                font-size: 14px;
                color: #999;
                width: 18px;
                height: 18px;
                line-height: 20px;
                border: 1px solid rgba(153, 153, 153, .3);
                border-radius: 100%;
                margin-right: 6px;
                cursor: pointer;
                margin-left: 30px;
                vertical-align: text-bottom;
                box-shadow: 0 0 2px 2px rgba(153, 153, 153, .1);
                &.checkSex{
                  width: 18px;
                  height: 18px;
                  display: inline-block;
                  background-color: rgba(74, 134, 255, .9);
                  border-radius: 100%;
                  border: none;
                  position: relative;
                  box-shadow: 0 0 2px 1.8px rgba(74, 134, 255, .4);
                  transition: all ease-out .3s;
                  vertical-align: sub;
                  img{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: inline-block;
                    width: 10px;
                    height: 7px;
                  }
                }
              }
              i{
                color: #999;
                font-size: 14px;
                vertical-align: middle;
              }
            }
          }
        }
        .phone-box{
          width: 100%;
          height: 44px;
          display: flex;
          justify-content: space-between;
          .phone{
            width: 360px;
            height: 100%;
            border: 1px solid #999;
            border-radius: 4px;
            padding-left: 30px;
            position: relative;
            input{
              width: 100%;
              height: 100%;
              font-size: 14px;
              color: #999;
              border: 1px solid #e7e8ec;
              box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
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
            .hint{
              position: absolute;
              left: 0;
              top: 46px;
              font-size: 14px;
              color: #e93a3a;
              opacity: 0;
              transition: opacity ease-out .3s;
              &.allHintNullActive{
                opacity: 1;
                transition: opacity ease-out .3s;
              }
            }
          }
        }
        .email-box{
          width: 100%;
          height: 44px;
        }
        .new-password{
          width: 100%;
          height: 44px;
          margin: 30px auto;
          position: relative;
          input{
            width: 100%;
            height: 44px;
            font-size: 14px;
            padding-left: 20px;
            color: #999;
            border: 1px solid #e7e8ec;
            box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
            border-radius: 4px;
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
            position: absolute;
            top: 50px;
            left: 0;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            transition: opacity ease-out .3s;
            &.allHintNullActive {
              opacity: 1;
              transition: opacity ease-out .3s;
            }
          }
          .hint1{
            position: absolute;
            left: 0;
            top: 48px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 1;
            transition: opacity ease-out .3s;
            &.allHintNullActive{
              opacity: 1;
              transition: opacity ease-out .3s;
            }
          }
          .hint22{
            position: absolute;
            top: 50px;
            left: 0;
            font-size: 14px;
            color: #e93a3a;
            opacity: .9;
            transition: all ease-out .3s;
            &.allHintNullActive{
              opacity: 1;
              transition: opacity ease-out .3s;
            }
          }
        }
        .new-password22{
          height: auto;
        }
        .confirmPassWord {
          .hint {
            position: absolute;
            left: 0;
            top: 46px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            &.allHintNullActive {
              opacity: 1;
              transition: all ease-out .3s;
            }
          }
        }
        .short{
          display: flex;
          align-items: center;
          justify-content: space-around;
          border: 1px solid #e7e8ec;
          box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
          border-radius: 4px;
          &.active{
            box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
            border: 1px solid rgba(255, 153, 20, .4);
            transition: all ease-out .3s;
          }
          input{
            flex: 1;
            border: none;
            &:focus{
              box-shadow: none;
              border: none;
            }
          }
          .getCode-box{
            width: 120px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            position: relative;
            &.afterHr{
              &:after{
                background-color: rgba(255, 153, 20, .4);
              }
            }
            &:after{
              content: '';
              display: block;
              width: 1px;
              height: 16px;
              background-color: #e7e8ec;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
            .getCode{
              width: 100%;
              height: 100%;
              padding: 0 20px;
              text-align: center;
              border-radius: 4px;
              color: #4b84ff;
              cursor: pointer;
              &.active{
                color: #F29800;
                transition: opacity ease-out .3s;
              }
            }
          }
          .hint {
            position: absolute;
            left: 0;
            top: 46px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            transition: opacity ease-out .3s;
            &.allHintNullActive {
              opacity: 1;
              transition: all ease-out .2s;
            }
          }
        }
        .pay{
          .hint {
            position: absolute;
            left: 0;
            top: 46px;
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
        .back-login{
          display: block;
          width: 200px;
          margin: auto;
          text-align: center;
          padding-top: 20px;
          color: #4b84ff;
          font-size: 14px;
          cursor: pointer;
          transition: opacity ease-out .3s;
          &:hover{
            color: #ffba14;
            transition: all ease-out .2s;
          }
        }
      }
    }
  }
</style>
