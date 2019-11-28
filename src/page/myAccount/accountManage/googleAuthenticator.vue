<template>
    <div class="warp-googleAtc">
      <div class="title">
        <h2>{{$t('bossGoogle.text1')}}</h2>
        <div class="goto-google-btn" @click="gotoGoogle()">{{$t('bossGoogle.text2')}}</div>
      </div>
      <div class="main">
        <div class="goto-googleImg"><img src="../../../assets/images/login/goTo-lock.png" alt=""></div>
        <div class="tit">{{$t('addAccount.text29')}}</div>
        <div class="con">{{$t('bossGoogle.text3')}}</div>
      </div>
      <!-- 弹窗,身份验证-->
      <div class="mask-box" v-show="maskShow">
        <transition name="drop">
         <div class="content" v-if="maskShow">
          <div class="close"><img @click="close()" src="../../../assets/images/login/Shutdown.png" alt=""></div>
          <div class="mask-title">{{$t('bossGoogle.text4')}}</div>
          <form onsubmit="return false" class="formTable">
            <div class="input-tit">{{$t('bossGoogle.text5')}}</div>
            <div class="input-box">
              <input type="password" :class="{'active': pwdHintShow}"  @focus="pwdHintText = ''" autocomplete="off" :placeholder="$t('sharer.text26')" v-model.trim="payPassword">
              <div class="hint">{{pwdHintText}}</div>
            </div>
            <div class="input-tit">{{$t('bossGoogle.text6')}}</div>
            <smscode
              @focus="payFailTip = ''"
              @click="getEmailCode()"
              v-model.trim="emailCode"
              ref="smscode"
              height="40px"
            ></smscode>
            <div class="hint">{{payFailTip}}</div>
          </form>
          <div class="btn-box">
            <div class="cancel" @click="close()">{{$t('sharer.text29')}}</div>
            <div class="confirm" :class="{active: activeBtn}" @click="getOpenAjaxgoole()">{{$t('signIn.text10')}}</div>
          </div>
        </div>
        </transition>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import smscode from '@/components/smscode'
  export default {
    data() {
      return {
        payPassword: '',
        emailCode: '',
        payFailTip: '',
        pwdHintText: '',
        pwdHintShow: false,
        codeHintShow: false,
        maskShow: false,
        activeBtn: false,
        googleHintText: this.$t('bossGoogle.text15')
      }
    },
    components: {
      smscode
    },
    methods: {
      gotoGoogle () {
        this.maskShow = true
      },
      close () {
        this.maskShow = false
        if (this.maskShow === false) {
          this.emailCode = ''
          this.payPassword = ''
          this.pwdHintText = ''
          this.payFailTip = ''
          this.$refs.smscode.countTime = 0
        }
      },
      // 邮箱验证
      getEmailCode () {
        let sendCodeMsg
        if (this.userData.email !== '') {
          this.$http.post(`${this.$api}/user/sendEmailCode?email=${this.userData.email}&sendType=2`).then((res) => {
            this.$refs.smscode.loading = true // 显示loading
            if (res.data.success) {
              sendCodeMsg = this.$t('addAccount.text30')
              this.payFailTip = sendCodeMsg
              this.$refs.smscode.loading = false
            } else {
              sendCodeMsg = res.data.msg
              this.payFailTip = sendCodeMsg
              this.$refs.smscode.loading = false
            }
          }).catch((err) => {
            console.log(err)
          })
          this.getCountDown()
        }
      },
      getCountDown () {
        setTimeout(() => {
          this.$refs.smscode.loading = false // 显示loading
          this.$refs.smscode.start() // 开始倒计时
        }, 1000)
      },
      // 开启，身份验证
      getOpenAjaxgoole () {
        this.activeBtn = !this.activeBtn
        if (this.payPassword === '') {
          this.pwdHintText = this.$t('addAccount.text31')
        }
        if (this.emailCode === '') {
          this.payFailTip = this.$t('addAccount.text32')
        }
        if (this.payPassword !== '' && this.emailCode !== '') {
          this.$postAxios.post(`${this.$api}security/google_reset`, { // 9 重置Google验证码，成功，Google验证码会被关闭
            tradePwd: this.payPassword,
            emailCode: this.emailCode
          }).then(res => {
            if (res.data.success === true) {
              this.maskShow = false
              this.$store.dispatch('getUserBalance')
              this.$router.push({
                path: 'googleAuthenticator/googleQrCode',
                query: {
                  qrcode: res.data.data.qrUrl,
                  secret: res.data.data.secret
                }
              })
            } else {
              this.payFailTip = res.data.msg
            }
          })
        }
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
  .warp-googleAtc{
    padding: 60px 60px 0 60px;
    &.fullScreen{
      height: 100vh;
    }
    .title{
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h2{
        font-weight: bold;
      }
      .goto-google-btn{
        width: 200px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        background-color: #ffba14;
        color: #fff;
        cursor: pointer;
        border-radius: 6px;
        font-size: 18px;
        box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
        &:hover{
          opacity: .9;
        }
      }
    }
    .main{
      height: 400px;
      padding-top: 200px;
      .goto-googleImg{
        width: 102px;
        height: 132px;
        margin: auto;
        text-align: center;
        position: relative;
        &:after{
          content: '';
          display: block;
          position: absolute;
          bottom: -80px;
          left: 0;
          height: 14px;
          width: 100%;
          background-color: rgba(0, 0, 0, .1);
          border-radius: 100%;
          box-shadow: 0 0 6px 4px rgba(0, 0, 0, .1);
          transform: translateY(-56px);
        }
      }
      .tit{
        padding: 40px 0 30px;
        font-size: 24px;
        color: rgba(232, 58, 58, .6);
        text-shadow: 0 2px 2px rgba(232, 58, 58, .1);
        text-align: center;
      }
      .con{
        font-size: 16px;
        color: #1a1a1a;
        text-align: center;
      }
    }
    .mask-box{
      position: fixed;
      z-index: 100;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0, .2);
      .content{
          width: 660px;
          position: fixed;
          padding-bottom: 40px;
          background-color: #fff;
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(74, 134, 255, 1);
          overflow: auto;
          z-index: 120;
          top: 25%;
          left: 50%;
          // transform: translate(-50%, -50%);
          margin-left: -330px;
          .close{
            width: 100%;
            height: 17px;
            text-align: right;
            margin: 15px auto;
            padding: 0 20px;
            img{
              width: 17px;
              cursor: pointer;
            }
          }
          .mask-title{
            font-size: 20px;
            color: #1a1a1a;
            text-align: center;
            padding-bottom: 50px;
            font-weight: bold;
          }
          .formTable{
            width: 400px;
            margin: auto;
            position: relative;
            .input-tit{
              font-size: 16px;
              color: #1a1a1a;
            }
            .input-box{
              width: 100%;
              height: 44px;
              margin: 15px auto 30px;
              position: relative;
              input{
                width: 100%;
                height: 100%;
                border: 1px solid #e7e8ec;
                box-shadow: 0 3px 3px rgba(235, 236, 240, 0.5);
                border-radius: 4px;
                padding-left: 15px;
                font-size: 14px;
                color: #999;
                &:focus{
                  box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
                  border: 1px solid rgba(255, 153, 20, .4);
                }
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
                &.active{
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
              .hint{
                position: absolute;
                left: 0;
                bottom: -20px;
                font-size: 14px;
                color: #e93a3a;
              }
            }
            /deep/ .sms-container{
              height: 44px !important;
              line-height: 44px !important;
              border: 1px solid #e7e8ec;
              box-shadow: 0 3px 3px rgba(235, 236, 240, 0.5);
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
            .hint{
              position: absolute;
              left: 0;
              bottom: -20px;
              font-size: 14px;
              color: #e93a3a;
            }
          }
          .btn-box{
            width: 400px;
            height: 40px;
            line-height: 40px;
            margin:  50px auto 0;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: space-between;
            .cancel{
              flex: 1;
              height: 100%;
              background-color: #ccc;
              margin-right: 20px;
              cursor: pointer;
              border-radius: 4px;
              color: #fff;
              box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
              &:hover{
                opacity: .9;
              }
            }
            .confirm{
              flex: 1;
              height: 100%;
              background-color: #ffba14;
              border-radius: 4px;
              color: #fff;
              cursor: pointer;
              box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
              &:hover{
                opacity: .9;
              }
              &.active{
                animation: btnActive .4s 1;
                @keyframes btnActive {
                  from{
                    transform: scale(1.1, 1.1);
                  }
                  to{
                    transform: scale(1, 1);
                  }
                }
              }
            }
          }
        }
    }
  }
</style>
