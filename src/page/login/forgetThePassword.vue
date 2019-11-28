<template>
  <div class="login">
    <!--忘记密码-->
    <div class="retrievePassword-box">
      <div class="retrievePassword">
        <div class="title">{{$t('forgetPwd.text1')}}</div>
        <div class="input-box">
          <input type="text" v-model.trim="userName" @focus="userNameHintShow = false" @blur="userExists()" :placeholder="$t('signIn.text13')" autocomplete="off">
          <div class="hint" :class="{'allHintNullActive': userNameHintShow}">{{userMsgText}}</div>
        </div>
        <div class="btn button--ujarak button--inverted" :class="{'active': goLoginActive}" @click="getfThePwd()">
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
      <!-- 没绑定谷歌和邮箱提示 -->
      <div class="noGoogleEmail" v-show="noGoogleEmailShow">
        <div class="main">
          <div class="title">{{$t('forgetPwd.text1')}}</div>
          <div class="smgImg"><img src="../../assets/images/login/noGoogleEmail.png" alt=""></div>
          <div class="hint">{{$t('forgetPwd.text3')}}</div>
          <router-link to="/login" replace tag="div" class="return-login">{{$t('signIn.text11')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userName: '',
      userMsgText: '',
      userNameHintShow: false,
      goLoginActive: false,
      loadingShow: false,
      noGoogleEmailShow: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    userExists () {
      if (this.userName === '') {
        this.userNameHintShow = true
        this.userMsgText = this.$t('signIn.text13')
      } else {
        this.$http.post(`${this.$api}/user/checkaccount?account=${this.userName}`).then((res) => {
          if (res.data.success) {
            this.username = res.data.data.username
          } else {
            this.userMsgText = res.data.msg
            this.userNameHintShow = true
          }
        })
      }
    },
    getfThePwd () {
      this.goLoginActive = !this.goLoginActive
      if (this.userName !== '') {
        this.$http.post(`${this.$api}/user/checkaccount?account=${this.userName}`).then((res) => {
          this.loadingShow = true
          if (res.data.success) {
            this.loadingShow = false
            this.username = res.data.data.username
            if (res.data.data.openGoogleCode === 2) { // 账号开启谷歌
              // 跳到谷歌验证码页面找回密码
              this.$router.push({path: '/googlePwd', query: {googleUsername: this.userName}})
            } else if (res.data.data.email !== '' && res.data.data.openGoogleCode !== 2) {
              // 跳到邮箱验证码页面找回密码
              this.$router.push({path: '/emailPwd', query: {emailUsername: this.userName, goemail: res.data.data.email}})
            } else {
              // 谷歌邮箱都没有,则提示,你的账号未绑定谷歌或邮箱验证码,请联系推荐人找回密码
              this.noGoogleEmailShow = true
            }
          } else {
            setTimeout(() => {
              this.loadingShow = false
              this.userMsgText = res.data.msg
              this.userNameHintShow = true
            }, 1000)
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
    display: flex;
    align-items: center;
    justify-content: center;
    // 忘记密码
    .retrievePassword-box{
      width: 660px;
      height: auto;
      border-radius: 4px;
      background-color: rgba(255,255,255, .94);
      box-shadow: 0 0 16px 2px rgba(74, 134, 255, .2);
      position: relative;
      .retrievePassword{
        padding: 60px 90px;
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
          input{
            display: block;
            width: 100%;
            height: 100%;
            color: #999;
            border: 1px solid #e7e8ec;
            border-radius: 4px;
            box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
            padding-left: 15px;
            font-size: 14px;
            transition: all ease-out .3s;
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
            left: 15px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            transition: all ease-out .3s;
            &.allHintNullActive {
              opacity: 1;
              transition: all ease-out .3s;
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
            transition: all ease-out .3s;
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
          text-align: center;
          color: #4b84ff;
          font-size: 14px;
          cursor: pointer;
          transition: all ease-out .3s;
          &:hover{
            color: #ffba14;
            transition: all ease-out .2s;
          }
        }
      }
      .noGoogleEmail{
        position: absolute;
        width: 100%;
        height: auto;
        left: 0;
        top: 0;
        z-index: 10;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 16px 2px rgba(167, 177, 194, .4);
        display: flex;
        align-items: center;
        justify-content: center;
        .main{
          width: 100%;
          height: auto;
          .title{
            text-align: center;
            padding: 30px 0 0;
            font-size: 18px;
            color: #1a1a1a;
          }
          .smgImg{
            width: 180px;
            height: 150px;
            margin: 40px auto;
          }
          .hint{
            padding-bottom: 60px;
          }
          .hint,.return-login{
            text-align: center;
            font-size: 16px;
          }
          .return-login{
            width: 100px;
            margin: auto;
            color: #4b84ff;
            padding-bottom: 30px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
