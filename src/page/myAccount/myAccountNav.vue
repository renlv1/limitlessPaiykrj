<template>
  <div class="account">
    <div class="nav-wrapper">
      <ul class="nav-uls">
        <!-- 0 账户预览-->
        <li class="nav-item">
          <div class="item-title">
            <div class="item">
              <div class="item-top isClick" @click="selectList(0)">
                <div class="item-left">
                  <div class="user-icon"><img width="22" height="20" src="../../assets/images/account/account.png" alt=""/></div>
                  <div class="item-text">{{$t('myAccountNav.text1')}}</div>
                </div>
                <div class="arrow-icon"><img :class="{'active-arrow-icon': isFlag === 0}" width="11" height="6" src="../../assets/images/header/arrow.png" alt=""></div>
              </div>
              <ul class="uls-child" :class="{'active-nav': isFlag === 0}">
                <li class="child-item">
                  <router-link to="/account/myAccount" class="child-link">
                    <span>{{$t('myAccountNav.text2')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/gatheringManage" class="child-link" :class="{'router-link-active': isActiveFlag1}">
                    <span>{{$t('myAccountNav.text3')}}</span>
                  </router-link>
                </li>
                <!-- "openGoogleCode": 3, // 1：未设置  2:开启  3:关闭-->
                <li class="child-item">
                  <router-link v-if="userData.openGoogleCode !== 2" to="/account/googleAuthenticator" class="child-link">
                    <span>{{$t('myAccountNav.text4')}}</span>
                  </router-link>
                  <router-link v-if="userData.openGoogleCode === 2" to="/account/unbindGoole" class="child-link">
                    <span>{{$t('myAccountNav.text4')}}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <!-- 1无限竞拍 -->
        <li class="nav-item">
          <div class="item-title">
            <div class="item">
              <div class="item-top isClick" @click="selectList(1)">
                <div class="item-left">
                  <div class="user-icon"><img width="22" height="22" src="../../assets/images/account/bidding.png" alt=""/></div>
                  <div class="item-text">{{$t('myAccountNav.text5')}}</div>
                </div>
                <div class="arrow-icon"><img :class="{'active-arrow-icon': isFlag === 1}" width="11" height="6" src="../../assets/images/header/arrow.png" alt=""></div>
              </div>
              <ul class="uls-child" :class="{'active-nav': isFlag === 1}">
                <!--只有商家才显示 “竞拍商品管理” 入口-->
                <li class="child-item" v-if="isMerchant.isMerchant === true">
                  <router-link to="/account/goodsManagement" class="child-link">
                    <span>{{$t('myAccountNav.text6')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/myAuction" class="child-link">
                    <span>{{$t('myAccountNav.text7')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/buyGoodsMenage" class="child-link">
                    <span>{{$t('myAccountNav.text8')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/regulationTemp" class="child-link">
                    <span>{{$t('myAccountNav.text9')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/joinedSnap" class="child-link">
                    <span>{{$t('myAccountNav.text10')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/myPurchase" class="child-link">
                    <span>{{$t('myAccountNav.text11')}}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <!-- 2金融 -->
        <li class="nav-item">
          <div class="item-title">
            <div class="item">
              <div class="item-top isClick" @click="selectList(2)">
                <div class="item-left">
                  <div class="user-icon"><img width="22" height="22" src="../../assets/images/account/financial.png" alt=""/></div>
                  <div class="item-text">{{$t('myAccountNav.text12')}}</div>
                </div>
                <div class="arrow-icon"><img :class="{'active-arrow-icon': isFlag === 2}" width="11" height="6" src="../../assets/images/header/arrow.png" alt=""></div>
              </div>
              <ul class="uls-child" :class="{'active-nav': isFlag === 2}">
                <li class="child-item">
                  <router-link to="/account/paiWallet" class="child-link" :class="{'router-link-active': isActiveFlag2}">
                    <span>{{$t('myAccountNav.text13')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/transferAccounts" class="child-link">
                    <span>{{$t('myAccountNav.text14')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/cashValue" class="child-link" :class="{'router-link-active': isActiveFlag3}">
                    <span>{{$t('myAccountNav.text15')}}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <!-- 3订单记录 -->
        <li class="nav-item">
          <div class="item-title">
            <div class="item">
              <div class="item-top isClick" @click="selectList(3)">
                <div class="item-left">
                  <div class="user-icon"><img width="22" height="22" src="../../assets/images/account/order.png" alt=""/></div>
                  <div class="item-text">{{$t('myAccountNav.text16')}}</div>
                </div>
                <div class="arrow-icon"><img :class="{'active-arrow-icon': isFlag === 3}" width="11" height="6" src="../../assets/images/header/arrow.png" alt=""></div>
              </div>
              <ul class="uls-child" :class="{'active-nav': isFlag === 3}">
                <li class="child-item">
                  <router-link to="/account/myBill" class="child-link">
                    <span>{{$t('myAccountNav.text17')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/orderCashValue" class="child-link">
                    <span>{{$t('myAccountNav.text15')}}</span>
                  </router-link>
                </li>
                <li class="child-item">
                  <router-link to="/account/digicashOrder" class="child-link">
                    <span>{{$t('myAccountNav.text18')}}</span>
                  </router-link>
                </li>
                <!-- 是共享者才显示共享者订单 -->
                <li class="child-item" v-if="userData.isboss === 1">
                  <router-link to="/account/sharerOrder" class="child-link">
                    <span>{{$t('myAccountNav.text19')}}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      isFlag: 0, // 控制四个左侧导航栏
      isFlag1: false,
      isFlag2: false,
      isFlag3: false,
      isActiveFlag1: false,
      isActiveFlag2: false,
      isActiveFlag3: false
    }
  },
  created () {
    this.$store.dispatch('getUserBalance')
  },
  watch: {
    '$route': 'printPath'
  },
  mounted () {
    this.printPath()
  },
  computed: {
    ...mapGetters([
      'userData',
      'isMerchant'
    ])
  },
  methods: {
    printPath () {
      // console.log(this.$route.path === '/account/gatheringManageDetail')
      if (this.$route.path === '/account/gatheringManageDetail' || this.$route.path === '/account/addAccount') { // 控制菜单栏高亮（如同一菜单栏deep大于1需要动态绑定router-link-active的class才能使左侧导航栏高亮）
        this.isActiveFlag1 = true
      } else {
        this.isActiveFlag1 = false
      }
      if (this.$route.path === '/account/paiwalletDetail') { // 控制菜单栏高亮（如同一菜单栏deep大于1需要动态绑定router-link-active的class才能使左侧导航栏高亮）
        this.isActiveFlag2 = true
      } else {
        this.isActiveFlag2 = false
      }
      if (this.$route.path === '/account/recharge' || this.$route.path === '/account/withdraw') { // 控制菜单栏高亮（如同一菜单栏deep大于1需要动态绑定router-link-active的class才能使左侧导航栏高亮）
        this.isActiveFlag3 = true
      } else {
        this.isActiveFlag3 = false
      }
      if (this.$route.path === '/account/myAccount' || this.$route.path === '/account/gatheringManage' || this.$route.path === '/account/unbindGoole' || this.$route.path === '/account/googleAuthenticator' || this.$route.path === '/account/googleAuthenticator/googleQrCode') { // 控制是否下拉
        this.isFlag = 0
        this.isActiveFlag1 = false
      } else if (this.$route.path === '/account/addAccount') {
        this.isFlag = 0
        this.isActiveFlag1 = true
      } else if (this.$route.path === '/account/myAuction' || this.$route.path.indexOf('/account/regulationTemp') > -1 || this.$route.path === '/account/joinedSnap' || this.$route.path.indexOf('/account/myPurchase') > -1 || this.$route.path.indexOf('/account/buyGoodsMenage') > -1) {
        this.isFlag = 1
        this.isActiveFlag1 = false
      } else if (this.$route.path === '/account/paiWallet' || this.$route.path === '/account/transferAccounts' || this.$route.path === '/account/paiwalletDetail' || this.$route.path === '/account/cashValue') {
        this.isFlag = 2
        this.isActiveFlag1 = false
      } else if (this.$route.path === '/account/myBill' || this.$route.path.indexOf('/account/orderCashValue') > -1 || this.$route.path === '/account/digicashOrder' || this.$route.path.indexOf('/account/sharerOrder') > -1) {
        this.isFlag = 3
        this.isActiveFlag1 = false
      } else if (this.$route.query.currency) {
        this.isActiveFlag1 = true
      } else if (this.$route.path.indexOf('/account/goodsManagement') > -1) { // /account/myAuction
        this.isFlag = 1
        this.isActiveFlag1 = false
      } else {
        this.isActiveFlag1 = false
      }
    },
    selectList (val) {
      this.isFlag = val
      if (val === 0) {
        this.$router.push('/account/myAccount')
      } else if (val === 1) {
        if (this.isMerchant.isMerchant === true) {
          this.$router.push('/account/goodsManagement')
        } else {
          this.$router.push('/account/myAuction')
        }
      } else if (val === 2) {
        this.$router.push('/account/paiWallet')
      } else if (val === 3) {
        this.$router.push('/account/myBill')
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .account
    margin-top 10px
    max-width 1920px
    display flex
    flex-direction row
    overflow: hidden
    .right-content
      flex 1
    .nav-wrapper
      background #fff
      border-top 1px solid #e5e5e5
      border-right 1px solid #e5e5e5
      border-bottom 1px solid #e5e5e5
      position: fixed
      left: 0
      top: 100px
      z-index: 80
      overflow: auto
      height: calc(100vh - 179px);
      .nav-uls
        position relative
        padding 0 40px 50px
        width 290px
        // min-height: 630px;
        .nav-item
          overflow: hidden
          .item-title
            .item
              display flex
              flex-direction column
              .item-top
                display flex
                flex-direction row
                height 70px
                align-items center
                justify-content space-between
                .item-left
                  display flex
                  flex-direction row
                  .user-icon
                    img
                      vertical-align middle
                  .item-text
                    margin-left 20px
                    font-size 16px
                    color #1a1a1a
                .arrow-icon
                  height auto
                  img
                    margin-top -3px
                    vertical-align middle
                    transform rotate(-90deg)
                  .active-arrow-icon
                    transform rotate(0deg)
              .uls-child
                max-height 0
                transition max-height .3s linear
                .child-item
                  height 50px
                  a
                    &.router-link-active
                      border-left 4px solid #ffba14
                      padding-left: 78px;
                      position: absolute;
                      display: inline-block;
                      left: -42px;
                      right: 0;
                      width: 100%;
                      background-color: #fff7e5;
                      color: #fff;
                  .child-link
                    display flex
                    line-height 50px
                    margin-left 42px
                    span
                      display inline-block
                      color #1a1a1a
                      text-align center
                      font-size 16px
                      white-space: nowrap;
              .active-nav
                max-height 400px
    .right-content
      width 100%
      padding-left: 291px
      background #fafafc
</style>
