<template>
  <div class="accountMoney">
    <div class="goodsParticular-box">
      <div class="goodsParticular-content">
        <div class="goodsParticular-title">
          <h6>
            <router-link :to="{path:'/setSharePay', query:{address: userData.address}}" class="property">{{$t('setSharePay.text6')}}&nbsp;  </router-link>  <i> > </i><span>&nbsp;{{$t('setSharePay.text13')}}</span>
          </h6>
        </div>
        <div class="accountMoney-title">{{$t('setSharePay.text13')}}</div>
        <div class="Info-box">
          <div class="" v-loading.lock="fullscreenLoading" :element-loading-text="$t('dialog.text19')"></div>
          <ul>
            <!--<li v-for="(item,index) in infoList" :key="index" :class="{activeInfo: isActiveInfo === index}" @click="toDetail(item)">-->
              <!--<div class="Info-icon">-->
                <!--<img :src="item.img" alt="">-->
                <!--<div class="account-type">-->
                  <!--<div class="name">{{item.currency}}</div>-->
                  <!--<div class="account-num"><span>已绑定账号：</span><i>{{item.count}}</i></div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="right-box">-->
                <!--<img src="../../assets/images/accountInfo/right_yellow.png" alt="">-->
              <!--</div>-->
            <!--</li>-->
            <router-link :to="{path:'/accountInfo', query: {currency: item.currency, coinImg: item.coinImg}}" tag="li" class="isClick"  @click="toDetail(1)"
                         v-for="(item,index) in queryCoinList" :key="index">
              <div class="Info-icon">
                <i class="pic" width="50" height="50" :style="{backgroundImage:'url('+ picAddress[index] +')'}"></i>
                <div class="account-type">
                  <div class="name">{{item.currency}}</div>
                  <div class="account-num"><span>{{$t('setSharePay.text32')}}：</span><i>{{NewCoinListLength[index]}}</i></div>
                </div>
              </div>
              <div class="right-box">
                <img width="6" height="11" src="../../assets/images/accountInfo/right_yellow.png" alt="">
              </div>
            </router-link>
          </ul>
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
      infoList: [
        {
          img: require('../../assets/images/accountInfo/usd.png'),
          currency: 'USD',
          count: 6
        },
        {
          img: require('../../assets/images/accountInfo/cny.png'),
          currency: 'CNY',
          count: 6
        },
        {
          img: require('../../assets/images/accountInfo/HKD.png'),
          currency: 'HKD',
          count: 6
        },
        {
          img: require('../../assets/images/accountInfo/EUR.png'),
          currency: 'CAD',
          count: 6
        },
        {
          img: require('../../assets/images/accountInfo/KRW.png'),
          currency: 'KRW',
          count: 6
        },
        {
          img: require('../../assets/images/accountInfo/btc.png'),
          currency: 'BTC',
          count: 6
        }
      ],
      isActiveInfo: 0,
      fullscreenLoading: true, // 默认加载
      variable: 'http://ofjn5cjui.bkt.clouddn.com/', // 拼接字符串需要的变量
      queryCoinList: [], // 币种列表
      NewCoinListLength: [], // 绑定币种的个数
      picAddress: [], // 图标
      USDLength: 0, // 绑定USD账号的个数
      CNYLength: 0, // 绑定CNY账号的个数
      HKDLength: 0, // 绑定HKD账号的个数
      CADLength: 0, // 绑定CAD账号的个数
      KRWLength: 0, // 绑定KRW账号的个数
      BTCLength: 0 // 绑定BTC账号的个数
    }
  },
  created () {
    this.getQueryCoinList()
  },
  methods: {
    // 1.5 查询共享者币种设置列表
    // 接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList
    getQueryCoinList () { // 查询币种列表
      this.$http.post(`${this.$api2}pigame/queryBossSupportCurrencyList`).then((res) => {
        if (res.data.status === 'success') {
          this.fullscreenLoading = false
          this.queryCoinList = res.data.data
          for (let i = 0; i < this.queryCoinList.length; i++) {
            let picAddress = this.variable + this.queryCoinList[i].coinImg
            this.picAddress.push(picAddress)
            var CoinListLength = 0
            if (this.queryCoinList[i].bossCurrency.bankAccountList === null) {
              CoinListLength = 0
            } else {
              CoinListLength = this.queryCoinList[i].bossCurrency.bankAccountList.length
            }
            this.NewCoinListLength.push(CoinListLength)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', // 用户信息
      'loginFlag',
      'userData'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accountMoney
  .goodsParticular-content
    padding-top 40px
    .goodsParticular-title
      margin-bottom 30px
    .accountMoney-title
      margin-bottom 60px
    .accountMoney-title
      font-size 34px
      color #1a1a1a
      font-weight bold
    .Info-box
      width 100%
      ul
        width 100%
        display flex
        flex-wrap wrap
        li
          width 450px
          height 160px
          border-radius 4px
          margin-right 24px
          border 1px solid #e7e8ec
          background-color #fff
          margin-bottom 30px
          cursor pointer
          user-select none
          display flex
          justify-content space-between
          align-items center
          padding 0 30px 0 20px
          @media screen and (max-width: 1300px)
            width 400px
          &:nth-child(3n)
            margin-right 0
            @media screen and (max-width: 1700px)
              margin-right 24px
          &:hover,&.activeInfo
            box-shadow: 0px 1px 1px #FFAF0A;
            border 1px solid #ffba14
          .Info-icon
            display flex
            align-items center
            .pic
              display inline-block
              width 50px
              height 50px
              background-repeat: no-repeat;
              background-size: cover;
          .account-type
            margin-left 20px
            .name
              font-size 20px
              color #1a1a1a
              font-weight bold
            .account-num
              margin-top 20px
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
