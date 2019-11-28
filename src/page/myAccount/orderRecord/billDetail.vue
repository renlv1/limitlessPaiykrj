<template>
  <div class="mybill-detail">
    <!--账单详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/myBill')">{{$t('chongzhiTixian.text1')}}</span>
      <span class="icon">》</span>
      <span class="link" @click="$router.push('/account/myBill')">{{$t('chongzhiTixian.text2')}}</span>
      <span class="icon">》</span>
      <span>{{$t('chongzhiTixian.text3')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text3')}}</h3>
    <div class="details-box">
      <h3 class="title-details">{{dataInfo.leixing}}</h3>
      <h3 class="money">
        <span>{{dataInfo.zhengfu}} {{money[0]}}</span>.<span class="xiaoshu">{{money[1]}}</span>
        <span class="curren-money" v-if="dataInfo.currency === 'PAI'">π</span><span class="curren-money" v-else>{{dataInfo.currency}}</span>
      </h3>
      <div class="order-box">
        <ul class="order-uls">
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text4')}}</span>
            <span class="order-text">{{dataInfo.orderId}}</span>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text5')}}</span>
            <span class="order-text">{{$changeDate(dataInfo.time)}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      dataInfo: '',
      money: ''
    }
  },
  created () {
    if (this.$route.query.dataInfo) {
      this.dataInfo = JSON.parse(this.$route.query.dataInfo)
      this.money = this.dataInfo.amount.toFixed(4).split('.')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mybill-detail
  padding: 40px 0 0 60px
  .router-navigation
    display flex
    align-items center
    font-size: 16px
    color #1a1a1a
    .link
      cursor pointer
    .icon
      margin-left: 5px
  .title-text
    margin-top: 30px
    font-weight bold
    font-size: 34px
    color: #1a1a1a
    margin-bottom: 60px
  .details-box
    width: 100%
    height: 600px
    display flex
    flex-direction column
    align-items center
    border: 1px solid #e7e8ec
    padding-top: 40px
    .title-details
      margin-bottom: 20px
      line-height: 50px
      color #1a1a1a
      font-size: 20px
    .money
      margin-bottom: 40px
      font-size: 30px
      color #1a1a1a
      .curren-money
        font-size: 20px
        color #ffba14
    .order-uls
      .order-list
        display: flex
        width: 100%
        height: 50px
        align-items center
        border: 1px solid #e7e8ec
        border-bottom: none
        .order-text
          padding-left: 30px
          flex 1
</style>
