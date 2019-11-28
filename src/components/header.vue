<template>
  <div>
    <div class="header">
      <div class="header-content container">
        <div class="head-left">
          <router-link v-show="loginFlag" tag="div" to="/home" class="logo isClick">
            <img src="../assets/images/header/logo.png"/>
          </router-link>
          <router-link v-show="!loginFlag" tag="div" to="/" class="logo">
            <img src="../assets/images/header/logo.png"/>
          </router-link>
          <ul class="nav" v-show="loginFlag">
            <router-link tag="li" :to="{path:'/home'}" class="bidding" :class="{'router-link-active': isActiveFlag}">
              <!--<img width="22" height="22" src="../assets/images/header/bidding.png"/>-->
              <i></i>
              <span>{{$t('header.text1')}}</span>
            </router-link>
            <router-link tag="li" :to="{path: '/tradingPlatform'}" class="exchange">
              <!--<img width="20" height="20" src="../assets/images/header/exchange.png"/>-->
              <i></i>
              <span>{{$t('header.text2')}}</span>
            </router-link>
          </ul>
        </div>
        <div class="head-right">
          <div class="header-rt-user">
            <div class="activeBox" ref="userNameDiv" @mouseover="showMenu(1)" @mouseout="closeShowMenu(1)">
              <div class="log-reg-button" v-show="!loginFlag">
                <li class="header-rt-btn isClick" @click="$router.replace({path: '/login'})">{{$t('header.text3')}}</li>
                <span class="segmentation">/</span>
                <li class="header-rt-btn isClick" @click="$router.push({path: '/signIn'})">{{$t('header.text4')}}</li>
              </div>
              <div class="common alreadyLogin" v-show="loginFlag">
                <div class="user-wrapper isClick">
                  <img class="userImg" :src="avatar + userData.address" alt="" v-if="userData.address" @error="errorImg" ref="imgUrl">
                  <img class="userImg" alt="" src="../assets/images/account/defualtAvatar.png" v-else>
                  <span class="userName"><span v-if="userData.nickname">{{userData.nickname}}</span><span v-if="!userData.nickname">{{userData.username}}</span><i class="arrowDown" :class="{arrowActive: userMenuShow}"></i></span>
                </div>
                <div class="user-panel">
                  <ul class="dropDownMenu" v-show="userMenuShow" :class="{dropDownMenuActive: userMenuShow}">
                    <router-link class="isClick" tag="li" to="/account">{{$t('header.text5')}}</router-link>
                    <li class="isClick" @click="toShareRecharge">{{$t('header.text6')}}</li>
                    <li class="isClick" @click="logout()">{{$t('header.text7')}}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="activeBox" ref="userNameDiv" @mouseover="showMenu(2)" @mouseout="closeShowMenu(2)">
              <div class="common lang">
                <div class="user-wrapper isClick">
                  <span class="userName">{{langText}}<i class="arrowDown" :class="{arrowActive: langMenuShow}"></i></span>
                </div>
                <div class="user-panel">
                  <ul class="dropDownMenu" v-show="langMenuShow" :class="{dropDownMenuActive: langMenuShow}">
                    <li class="isClick" @click="chooseLang(0)">中文</li>
                    <li class="isClick" @click="chooseLang(1)">English</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {i18n} from '../i18n/config'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      userMenuShow: false,
      langMenuShow: false,
      isActiveFlag: false, // 控制导航栏是否高亮
      langText: this.$t('header.text8'),
      langActive: 0,
      payState: '',
      paystatus: '',
      avatar: `${this.$api2}` + `file/img?type=user&size=2&id=` // 头像地址前缀
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', // 用户信息
      'loginFlag',
      'userData',
      'account'
    ])
  },
  created () {
  },
  mounted () {
    if (this.$route.path !== '/login') {
      this.$store.dispatch('getUserBalance')
    }
    this.printPath()
    if (localStorage.Qlang === 'EN') {
      this.langText = 'English'
    } else if (localStorage.Qlang === 'CN') {
      this.langText = '中文'
    }
  },
  watch: {
    '$route': 'printPath'
  },
  methods: {
    errorImg (e) { // 用户图片error时
      this.$refs.imgUrl.src = require('../assets/images/account/defualtAvatar.png')
    },
    logout () { // 退出登录
      this.$store.dispatch('logoutAction')
    },
    toShareRecharge () { // 是否是老板1:是 2:审核中 8：否
      if (this.userData.isboss === 1) {
        this.$router.push({
          path: '/setSharePay',
          query: {
            address: this.userData.address
          }
        })
      } else if (this.userData.isboss === 2) {
        this.$router.push({path: '/sharerAudit', query: {shaddress: this.userData.address}})
      /*  let url = `${this.$api2}pigame/queryByAddress?address=${this.account.address}`
        this.$http.post(url).then((res) => {
          if (res.data.status === 'success') {
            this.payState = res.data.data.payState
            this.paystatus = res.data.data.status // "status":0,// 状态 0--待审核 1--审核通过  2--暂停服务  3--审核被拒绝  4--被封禁(终止服务)
            if (this.payState === 2 && this.paystatus !== 1) { // 支付成功,未通过审核去,查看审核
              this.$router.push({path: '/sharerAudit', query: {shaddress: this.userData.address}})
            } else if (this.payState === 2 && this.paystatus === 1) { // 支付成功,通过审核,去编辑共享者页面
              this.$router.push('/setSharePay')
            } else {
              this.$router.push('/becomeSharer') // 去申请
            }
          } else {
            if (res.data.resultCode === 'NOT_FOUND') {
              this.$router.push('/becomeSharer') // 去申请
            }
          }
        }) */
      } else {
        this.$router.push('/becomeSharer') // 去申请
      }
    },
    showMenu (num) {
      if (num === 1) {
        this.userMenuShow = true
      } else if (num === 2) {
        this.langMenuShow = true
      }
    },
    closeShowMenu (num) {
      if (num === 1) {
        this.userMenuShow = false
      } else if (num === 2) {
        this.langMenuShow = false
      }
    },
    chooseLang (val) { // 选择语言
      this.$router.go(0)
      this.langActive = val
      if (val === 0) {
        localStorage.setItem('Qlang', 'CN')
        i18n.locale = 'CN'
        this.langText = '中文'
        return (this.langText = '中文')
      } else if (val === 1) {
        localStorage.setItem('Qlang', 'EN')
        i18n.locale = 'EN'
        this.langText = 'English'
        return (this.langText = 'English')
      } else if (val === 2) {
        localStorage.setItem('Qlang', 'JN')
        i18n.locale = 'JN'
      } else if (val === 3) {
        localStorage.setItem('Qlang', 'KN')
        i18n.locale = 'KN'
      }
      location.reload()
    },
    printPath () {
      if (this.$route.path === '/goodsParticular') {
        this.isActiveFlag = true
      } else {
        this.isActiveFlag = false
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .header
    width 100%
    height 88px
    background-color #fff
    position fixed
    top 0
    z-index 99
    border-bottom 1px solid #d7d9db
    min-width 1200px
    .header-content
      height 100%
      display flex
      align-items center
      justify-content space-between
      .head-left
        display flex
        flex-direction row
        .nav
          display flex
          flex-direction row
          align-items cente
          /*img*/
            /*margin-right 10px*/
          li
            width 250px
            text-align center
            font-size 16px
            color #161616
            display flex
            flex-direction row
            align-items center
            justify-content center
            cursor pointer
            i
              display inline-block
              width 22px
              height 22px
              margin-right 10px
          .bidding
            i
              background url("../assets/images/header/unactivebidding.png") no-repeat
            &:hover
              i
                background url("../assets/images/header/bidding.png") no-repeat
              span
                color #ffba14
            &.router-link-active
              i
                background url("../assets/images/header/bidding.png") no-repeat
              span
                color #ffba14
          .exchange
            i
              background url("../assets/images/header/unactiveexchange.png") no-repeat
            &:hover
              i
                background url("../assets/images/header/exchange.png") no-repeat
              span
                color #ffba14
            &.router-link-active
              i
                background url("../assets/images/header/exchange.png") no-repeat
              span
                color #ffba14
        .logo
          width 250px
          height 88px
          display flex
          align-items center
          border-right 1px solid #e6e6e6
          img
            display block
            width 173px
            height 40px
      .head-right
        display flex
        flex-direction row
        align-items center
        .header-rt-user
          display flex
          flex-direction row
          align-items center
          .activeBox
            .log-reg-button
              margin-right 54px
              display flex
              flex-direction row
              align-items center
              .segmentation
                 margin 0 10px
                 font-weight bold
                 color #1a1a1a
            .alreadyLogin
              margin-right 54px
            .common
              position relative
              height 88px
              line-height 88px
              .user-wrapper
                display flex
                flex-direction row
                align-items center
                .userImg
                  width 36px
                  height 36px
                  margin-right 20px
                  border-radius 2px
                  box-shadow 0 0 5px #1a1a1a
                .userName
                  i
                    display inline-block
                    width 10px
                    height 6px
                    vertical-align middle
                    background url("../assets/images/header/arrow.png") no-repeat
                    background-size cover
                    margin-left 20px
                    transition .2s
                    &.arrowActive
                      transform rotate(180deg)
              .user-panel
                width auto
                min-width 100%
                top 75px
                left 0
                position absolute
                background #fff
                box-shadow 0 0 5px #d7d9db
                .dropDownMenu
                  text-align center
                  line-height 40px
                  li
                    padding 0 5px
                    color #999
                    background #fff
                    border-bottom 1px solid #e7e8ec
                    &:hover
                      background #fcfcfc
                      color #1a1a1a
</style>
