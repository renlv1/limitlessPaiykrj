<template>
  <div class="wrapper-account">
    <h2>{{$t('addAccount.text1')}}</h2>
    <div class="Info-box">
      <div class="" v-loading.lock="fullscreenLoading" :element-loading-text="$t('dialog.text19')"></div>
      <ul>
        <router-link :to="{path:'/account/gatheringManageDetail', query: {currency: item.currency}}" tag="li"
                     class="isClick"
                     v-for="(item,index) in queryCoinList" :key="index"
                     :class="{activeInfo: isActiveInfo === index}"
                     @click="toDetail(item)">
          <div class="Info-icon">
            <i class="pic" width="80" height="80" :style="{backgroundImage:'url('+ picAddress[index] +')'}"></i>
            <div class="account-type">
              <div class="name">{{item.currency}}</div>
              <div class="account-num"><span>{{$t('addAccount.text26')}}：</span><i>{{queryCoinLength[index]}}</i></div>
            </div>
          </div>
          <div class="right-box">
            <img width="6" height="11" src="../../../assets/images/accountInfo/right_yellow.png" alt="">
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        infoList: [
          {
            img: require('../../../assets/images/accountInfo/usd.png'),
            currency: 'USD',
            count: 6
          },
          {
            img: require('../../../assets/images/accountInfo/cny.png'),
            currency: 'CNY',
            count: 6
          },
          {
            img: require('../../../assets/images/accountInfo/HKD.png'),
            currency: 'HKD',
            count: 6
          },
          {
            img: require('../../../assets/images/accountInfo/EUR.png'),
            currency: 'CAD',
            count: 6
          },
          {
            img: require('../../../assets/images/accountInfo/KRW.png'),
            currency: 'KRW',
            count: 6
          },
          {
            img: require('../../../assets/images/accountInfo/btc.png'),
            currency: 'BTC',
            count: 6
          }
        ],
        isActiveInfo: 0,
        fullscreenLoading: true, // 默认加载
        queryCoinList: [],
        picAddress: [],
        queryCoinLength: [],
        variable: 'http://ofjn5cjui.bkt.clouddn.com/', // 拼接字符串需要的变量
        USDLength: 0, // 绑定USD账号的个数
        CNYLength: 0, // 绑定CNY账号的个数
        HKDLength: 0, // 绑定HKD账号的个数
        CADLength: 0, // 绑定CAD账号的个数
        KRWLength: 0, // 绑定KRW账号的个数
        BTCLength: 0, // 绑定BTC账号的个数
        LTCLength: 0, // 绑定LTC账号的个数
        ETHLength: 0, // 绑定ETH账号的个数
        XRPLength: 0, // 绑定XRP账号的个数
        BCHLength: 0, // 绑定BCH账号的个数
        SIELength: 0, // 绑定SIE账号的个数
        HTLength: 0 // 绑定HT账号的个数
      }
    },
    created() {
      this.getUsdBankList()
    },
    methods: {
      getQueryCoinList() { // 查询币种列表
        this.$http.post(`${this.$api2}/account/queryCoinList?sourceType=5`).then((res) => {
          if (res.data.status === 'success') {
            this.fullscreenLoading = false
            this.queryCoinList = res.data.data
            for (let i = 0; i < this.queryCoinList.length; i++) {
              let picAddress = this.variable + this.queryCoinList[i].coinImg
              this.picAddress.push(picAddress)
            }
          }
        })
      },
      getUsdBankList() { // 获取USD绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=USD&country=''&accountType=1&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.USDLength = res.data.data.list.length
            this.queryCoinLength.push(this.USDLength)
            this.getCnyBankList()
          }
        })
      },
      getCnyBankList() { // 获取CNY绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=CNY&country=''&accountType=1&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.CNYLength = res.data.data.list.length
            this.queryCoinLength.push(this.CNYLength)
            this.getHkdBankList()
          }
        })
      },
      getHkdBankList() { // 获取HKD绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=HKD&country=''&accountType=1&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.HKDLength = res.data.data.list.length
            this.queryCoinLength.push(this.HKDLength)
            this.getCadBankList()
          }
        })
      },
      getCadBankList() { // 获取CAD绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=CAD&country=''&accountType=1&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.CADLength = res.data.data.list.length
            this.queryCoinLength.push(this.CADLength)
            this.getKrwBankList()
          }
        })
      },
      getKrwBankList() { // 获取KRW绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=KRW&country=''&accountType=1&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.KRWLength = res.data.data.list.length
            this.queryCoinLength.push(this.KRWLength)
            this.getBtcBankList()
          }
        })
      },
      getBtcBankList() { // 获取BTC绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=BTC&country=''&accountType=6&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.BTCLength = res.data.data.list.length
            this.queryCoinLength.push(this.BTCLength)
            this.getLtcBankList()
          }
        })
      },
      getLtcBankList() { // 获取LTC绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=LTC&country=''&accountType=7&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.LTCLength = res.data.data.list.length
            this.queryCoinLength.push(this.LTCLength)
            this.getEthBankList()
          }
        })
      },
      getEthBankList() { // 获取LTC绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=ETH&country=''&accountType=8&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.ETHLength = res.data.data.list.length
            this.queryCoinLength.push(this.ETHLength)
            this.getXrpBankList()
          }
        })
      },
      getXrpBankList() { // 获取XRP绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=XRP&country=''&accountType=9&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.XRPLength = res.data.data.list.length
            this.queryCoinLength.push(this.XRPLength)
            this.getBchBankList()
          }
        })
      },
      getBchBankList() { // 获取BCH绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=BCH&country=''&accountType=10&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.BCHLength = res.data.data.list.length
            this.queryCoinLength.push(this.BCHLength)
            this.getSieBankList()
          }
        })
      },
      getSieBankList() { // 获取SIE绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=SIE&country=''&accountType=11&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.SIELength = res.data.data.list.length
            this.queryCoinLength.push(this.SIELength)
            this.getHtBankList()
          }
        })
      },
      getHtBankList() { // 获取HT绑定的账户
        this.$http.post(`${this.$api2}/account/list?currency=HT&country=''&accountType=12&pageIndex=1&pageSize=10000`).then((res) => {
          if (res.data.status === 'success') {
            this.HTLength = res.data.data.list.length
            this.queryCoinLength.push(this.HTLength)
            this.getQueryCoinList()
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrapper-account
    h2
      font-weight bold
      margin-bottom 60px
    .Info-box
      width 100%
      ul
        width 100%
        display flex
        flex-wrap wrap
        min-width 1200px
        margin 10px 0
        li
          float left
          margin 10px
          padding 0 30px 0 20px
          width 450px
          height 160px
          border 1px solid #e7e8ec
          background-color #fff
          display flex
          justify-content space-between
          align-items center
          @media screen and (max-width: 1800px)
            width 380px
            height 140px
          @media screen and (max-width: 1601px)
            width 360px
            height 130px
          &:hover, &.activeInfo
            box-shadow: 0px 1px 1px #FFAF0A;
            border 1px solid #ffba14
          .Info-icon
            display flex
            flex-direction row
            align-items center
            .pic
              width 50px
              height 50px
              display inline-block
              background-repeat: no-repeat;
              background-size: cover;
          .account-type
            margin-left 20px
            .name
              font-size 20px
              color #1a1a1a
              font-weight bold
            .account-num
              font-size 16px
              color #999
          .right-box
            width 6px
            height 11px
            img
              display block
              width 6px
              height 11px
</style>
