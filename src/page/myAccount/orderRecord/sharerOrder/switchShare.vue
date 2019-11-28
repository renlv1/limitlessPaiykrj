<template>
  <div class="selectSharer">
    <!--选择共享者-->
    <div class="bread">
      <i @click="$router.go(-1)">{{$t('chongzhiTixian.text44')}}</i> 》
      <router-link tag="i" to="/account/recharge" v-if="isChongzhi === 0">{{$t('chongzhiTixian.text45')}}</router-link>
      <router-link tag="i" to="/account/withdraw" v-if="isChongzhi === 1">{{$t('chongzhiTixian.text47')}}</router-link> 》
      <span>{{$t('bill.text27')}}</span>
    </div>
    <div class="sharerHead">
      <h3>{{$t('bill.text27')}}</h3>
      <div class="btn" @click="comfimRecharge" v-if="isChongzhi === 0 && this.sharerList.length > 0">{{$t('bill.text28')}}</div>
      <div class="btn" @click="comfimWithdraw" v-if="isChongzhi === 1 && this.sharerList.length > 0">{{$t('bill.text29')}}</div>
    </div>
    <div class="sharerList">
      <ul>
        <li v-for="(item, index) in sharerList" :key="index" :class="{'active': liActive === index}" @click="doSelectSharer(index, item.id)">
          <div class="headImgBox">
            <div class="img-box">
              <img :src="imgUrlMoney(item.payCurrency)" alt="" v-if="item.payCurrency">
            </div>
          </div>
          <div class="info">
            <div class="info-top">
              <p>{{item.username}}</p>
              <div class="bottom">
                <div class="charge">
                  <span>{{$t('bill.text30')}}：</span><i>{{item.feeRateStr}}</i>
                </div>
                <div class="credit">
                  <span>{{$t('bill.text31')}}</span>
                  <ul>
                    <li v-for="(item2, index2) in starList" :key="index2" :class="{'yellow': item.creditLevel > index2}">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="info-bottom">
              <p>
                <span>{{$t('bill.text25')}}：</span><i>{{item.payAmount.toFixed(6)}} {{item.payCurrency}}</i>
              </p>
              <p>
                <span>{{$t('bill.text32')}}：</span><i>{{item.payBand}}</i>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('myAccount.text1')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      noResult: false,
      bossId: '',
      isChongzhi: Number(this.$route.query.isChongzhi),
      starList: ['', '', '', '', ''],
      imgUrl: { // CAD SIE HT
        BTC: require('../../../../assets/images/finance/BTC.png'),
        CNY: require('../../../../assets/images/finance/CNY.png'),
        EUR: require('../../../../assets/images/finance/EUR.png'),
        HKD: require('../../../../assets/images/finance/HKD.png'),
        KRW: require('../../../../assets/images/finance/KRW.png'),
        BCH: require('../../../../assets/images/finance/BCH.png'),
        ETH: require('../../../../assets/images/finance/ETH.png'),
        KLB: require('../../../../assets/images/finance/KLB.png'),
        XRP: require('../../../../assets/images/finance/XRP.png'),
        LTC: require('../../../../assets/images/finance/LTC.png'),
        CAD: require('../../../../assets/images/finance/CAD.png'),
        SIE: require('../../../../assets/images/finance/SIE.png'),
        HT: require('../../../../assets/images/finance/HT.png'),
        USD: require('../../../../assets/images/finance/USD.png')
      },
      selectSharer: '',
      sharerList: [],
      liActive: 0 // 当前选择的选项
    }
  },
  created () {
    if (this.isChongzhi === 0) { // 充值共享者列表
      this.chongzhiSwitchBoss()
    } else { // 提现共享者列表
      this.tiXianSwitchBoss()
    }
  },
  methods: {
    imgUrlMoney (imgMoney) {
      imgMoney = imgMoney.toUpperCase()
      return this.imgUrl[imgMoney]
    },
    // 共享者选择
    doSelectSharer (index, id) {
      this.bossId = id
      this.liActive = index
//      if (index === this.liActive) {
//        this.liActive = ''
//      } else {
//        this.liActive = index
//      }
    },
    // 充值选择共享者
    chongzhiSwitchBoss () {
      this.$postAxios.post(`${this.$api2}pigame/matchListByDeposit`, {
        id: this.$route.query.id,
        pageIndex: '1',
        pageSize: '20'
      }).then(res => {
        if (res.data.status === 'success') {
          this.sharerList = res.data.data.list
          if (res.data.data.list.length > 0) {
            this.bossId = res.data.data.list[0].id
          } else {
            this.noResult = true
          }
        }
      })
    },
    // 提现选择共享者
    tiXianSwitchBoss () {
      this.$postAxios.post(`${this.$api2}pigame/matchListByDraw`, {
        id: this.$route.query.id,
        pageIndex: '1',
        pageSize: '20'
      }).then(res => {
        if (res.data.status === 'success') {
          this.sharerList = res.data.data.list
          if (res.data.data.list.length > 0) {
            this.bossId = res.data.data.list[0].id
          } else {
            this.noResult = true
          }
        }
      })
    },
    // 2.2 充值订单选择钱老板
    comfimRecharge () {
      Dialog({
        title: this.$t('bill.text28'),
        content: this.$t('bill.text33'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}deposit/chooseBoss`, {
            id: this.$route.query.id,
            bossId: this.bossId
          }).then(res => {
            if (res.data.status === 'success') {
              this.$router.push({
                path: '/account/orderCashValue/rechargeOrderDetail',
                query: {
                  id: res.data.data.id,
                  isChongzhi: 0
                }
              })
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          })
        }
      })
    },
    // 3.2 提现订单选择共享者
    comfimWithdraw () {
      Dialog({
        title: this.$t('bill.text29'),
        content: this.$t('bill.text34'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}draw/chooseBoss`, {
            id: this.$route.query.id,
            bossId: this.bossId
          }).then(res => {
            if (res.data.status === 'success') {
              this.$router.push({
                path: '/account/orderCashValue/tiXianOrderDetail',
                query: {
                  id: res.data.data.id,
                  isChongzhi: 1
                }
              })
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .selectSharer{
    padding: 40px 60px;
    .sharerHead{
      display: flex;
      margin-top: 30px;
      h3{
        font-size: 34px;
        font-weight: bold;
        color: #1a1a1a;
        margin-bottom: 60px;
        margin-right: 100px;
      }
      .btn{
        width: 210px;
        height: 50px;
        border: 1px solid transparent;
        border-radius: 4px;
        display: block;
        text-align: center;
        line-height: 50px;
        color: #fff;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: #ffba14;
      }
    }
    .sharerList{
      &>ul{
        display: flex;
        flex-wrap: wrap;
        &>li{
          width: 465px;
          height: 168px;
          display: flex;
          justify-content: space-between;
          border: 1px solid #e7e8ec;
          border-radius: 4px;
          padding-right: 30px;
          margin-right: 24px;
          margin-bottom: 24px;
          position: relative;
          cursor: pointer;
          &.active{
            border: 1px solid #ffba14;
            &:before{
              content: '';
              width: 41px;
              height: 41px;
              background-image: url("../../../../assets/images/finance/pitch_up.png");
              background-size: cover;
              position: absolute;
              top:0;
              right: 0 ;
            }
          }
          .headImgBox{
            width: 130px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .img-box{
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
          }
          .info{
            width: 370px;
            height: 100%;
            .info-top{
              padding: 20px 0 10px;
              border-bottom: 1px solid #e7e8ec;
              p{
                font-size: 20px;
                font-weight: bold;
                color: #1a1a1a;
                padding-bottom: 10px;
              }
              .bottom{
                display: flex;
                justify-content: space-between;
                .charge{
                  font-size: 16px;
                  span{
                    color: #999;
                  }
                  i{
                    color: #1a1a1a;
                  }
                }
                .credit{
                  display: flex;
                  align-items: center;
                  span{
                    color: #999;
                    font-size: 16px;
                  }
                  ul{
                    display: flex;
                    margin-left: 12px;
                    li{
                      background-image: url('../../../../assets/images/finance/star.png');
                      width: 14px;
                      height: 15px;
                      margin-left: 4px;
                      &.yellow{
                        background-image: url('../../../../assets/images/finance/star_yellow.png');
                      }
                    }
                  }
                }
              }
            }
            .info-bottom{
              padding-top: 20px;
              p{
                font-size: 16px;
                margin-bottom: 10px;
                span{
                  color: #999;
                }
                i{
                  color: #1a1a1a;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
