<template>
  <div class="mybill-detail">
    <!--数字货币交易  详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/digicashOrder')">{{$t('bill.text15')}}</span>
      <span class="icon">》</span>
      <span class="link" @click="$router.push('/account/digicashOrder')">{{$t('chongzhiTixian.text7')}}</span>
      <span class="icon">》</span>
      <span>{{$t('chongzhiTixian.text3')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text3')}}</h3>
    <div class="account-info">
      <h3 class="account-title">{{$t('chongzhiTixian.text6')}}</h3>
      <div class="account-flex">
        <div class="money-box">
          <span class="money1">{{moneyFixed[0]}}</span>
          <span class="money2">.{{moneyFixed[1]}}</span>
          <span class="money3"> {{detailsData.buyCurrency}}</span>
        </div>
        <div class="button" v-show="detailsData.finishState === 1" @click="cancelEntrust">{{$t('chongzhiTixian.text9')}}</div>
      </div>
      <ul class="order-uls">
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text4')}}</span>
          <span class="order-text">{{detailsData.id}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text5')}}</span>
          <span class="order-text" v-show="detailsData.createAt">{{$changeDate(detailsData.createAt)}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text10')}}</span>
          <span class="order-text">{{isBuy(detailsData.etype)}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text11')}}</span>
          <span class="order-text">{{detailsData.buyCurrency}}/{{detailsData.sellCurrency}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text12')}}</span>
          <span class="order-text">{{detailsData.price | fourNumber}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text13')}}</span>
          <span class="order-text">{{detailsData.amount}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">{{$t('chongzhiTixian.text14')}}</span>
          <span class="order-text">{{detailsData.tradeAmount}}</span>
        </li>
      </ul>
      <div class="title-list">{{$t('chongzhiTixian.text15')}}</div>
      <div class="table-box">
        <ul class="table-uls">
          <li class="table-list">{{$t('chongzhiTixian.text16')}}</li>
          <li class="table-list">{{$t('chongzhiTixian.text12')}}</li>
          <li class="table-list">{{$t('chongzhiTixian.text17')}}</li>
        </ul>
        <ul class="table-uls" v-for="(item, index) in orderList" :key="index">
          <li class="table-list" v-show="item.createAt">{{$changeDate(item.createAt)}}</li>
          <li class="table-list">{{item.tradePrice}}</li>
          <li class="table-list">{{item.tradeAmount}}</li>
        </ul>
      </div>
    </div>
    <!--账户解锁弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('chongzhiTixian.text18')}}</h3>
          <p class="pay-price"></p>
          <h5 class="trade-password">{{$t('chongzhiTixian.text19')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword" :placeholder="$t('chongzhiTixian.text20')">
          <h5 class="trade-password">{{$t('chongzhiTixian.text21')}}</h5>
          <!--谷歌-->
          <div class="shortMsg">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode" :placeholder="$t('chongzhiTixian.text22')" type="number">
            </div>
          </div>
          <div class="errmsg-tips">{{payFailTip}}</div>
          <div class="pay-box">
            <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
            <button class="tradingCenter-btn" @click="confirmPay()">{{$t('chongzhiTixian.text24')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 未设置验证码-->
    <div class="myPopup" v-if="setSafeVerific">
      <div class="myPopup-box" >
        <div class="close" @click="setSafeVerific = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
    <!-- 文字弹窗-->
    <div class="myPopup" v-if="textDialog">
      <div class="myPopup-box" >
        <div class="close" @click="textDialog = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{textMsg}}</p>
        <div class="pay-box">
          <button class="tradingCenter-btn" @click="textDialog = false">{{$t('chongzhiTixian.text24')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      textMsg: '',
      textDialog: false,
      setSafeVerific: false,
      payPopupShow: false,
      payFailTip: '',
      payPassword: '',
      payCode: '',
      detailsData: '',
      orderList: [],
      moneyFixed: ''
    }
  },
  created () {
    this.getDetails()
  },
  methods: {
    // 充值详情
    getDetails () {
      this.$postAxios.post(`${this.$api}coinentrust/queryCoinEntrustDetail`, {
        coinEntrustId: this.$route.query.id,
        pageIndex: '1',
        pageSize: '20'
      }).then(res => {
        if (res.data.success === true) {
          this.detailsData = res.data.data.coinEntrust
          this.orderList = res.data.data.coinTradeList
          this.moneyFixed = res.data.data.coinEntrust.cashAmount.toFixed(4).split('.')
        }
      })
    },
    // 关闭图标
    closeIcon () {
      this.setSafeVerific = false
      this.payPopupShow = false
      this.payFailTip = ''
      this.payPassword = ''
      this.payCode = ''
    },
    // 取消委托弹窗
    cancelEntrust () {
      if (this.userData.openGoogleCode !== 2) {
        this.setSafeVerific = true
      } else {
        this.payPopupShow = true
      }
    },
    // 取消委托二次弹窗
    confirmPay () {
      this.payFailTip = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        this.$postAxios.post(`${this.$api}tx/unlock`, {
          tradePwd: this.payPassword,
          mobileCode: this.payCode,
          codeType: '1'
        }).then(res => {
          if (res.data.success === true) {
            this.$postAxios.post(`${this.$api}coinentrust/coinEntrustCancel`, {
              coinEntrustId: this.$route.query.id
            }).then(res => {
              this.payPopupShow = false
              this.textDialog = true
              this.getDetails()
              if (res.data.success === true) {
                this.textMsg = this.$t('chongzhiTixian.text27')
              } else {
                this.textMsg = res.data.msg
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    isBuy (type) { // 1: 买入  2:卖出
      if (type === 1) {
        return this.$t('chongzhiTixian.text28')
      } else {
        return this.$t('chongzhiTixian.text29')
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
.account-info
  width: 100%
  background-color: #fff
  border: 1px solid #e7e8ec
  padding: 40px 100px 100px
  .account-title
    line-height: 50px
    font-size: 20px
    color #1a1a1a
    font-weight bold
  .account-flex
    height: 44px
    display flex
    align-items center
    justify-content space-between
    margin: 20px 0 40px
    .money-box
      color #1a1a1a
      font-weight bold
      .money1
        font-size: 30px
      .money2
        font-size: 20px
      .money3
        font-size: 20px
        color #ffba14
    .button
      width: 200px
      height: 44px
      display flex
      align-items center
      justify-content center
      background-color: #ffba14
      color #ffffff
      font-size: 20px
      cursor pointer
      border-radius 4px
  .title-list
    font-size: 20px
    font-weight bold
    color #1a1a1a
    margin: 60px 0 40px
  .table-box
    .table-uls
      display flex
      align-items center
      height: 50px
      border-bottom: 1px solid #e7e8ec
      &:nth-child(odd)
        background-color: #fcfcfc
      &:nth-child(even)
        background-color: #fff
      .table-list
        flex 1
        display flex
        align-items center
        &:nth-child(1)
          padding-left: 30px
        &:nth-child(2)
          padding-left: 70px
        &:nth-child(2)
          padding-left: 70px
</style>
