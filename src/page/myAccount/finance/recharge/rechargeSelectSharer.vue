<template>
  <div class="selectSharer">
    <div class="bread">
      <router-link tag="i" to="/account/cashValue">充值/提现</router-link> 》
      <router-link tag="i" to="/account/recharge">充值</router-link> 》
      <span>选择共享者</span>
    </div>
    <div class="sharerHead">
      <h3>选择共享者</h3>
      <div class="btn" :class="{'active': liActive !== ''}" @click="sure()">
        确认充值
      </div>
    </div>
    <div class="sharerList">
      <ul>
        <li v-for="(item, index) in sharerList" :key="index" :class="{'active': liActive === index}" @click="doSelectSharer(index, item)">
          <div class="headImgBox">
            <div class="img-box">
              <img :src="imgUrl[item.payCurrency]" alt="">
            </div>
          </div>
          <div class="info">
            <div class="info-top">
              <p>{{item.username}}</p>
              <div class="bottom">
                <div class="charge">
                  <span>手续费：</span><i>{{item.feeRateStr}}</i>
                </div>
                <div class="credit">
                  <span>信用</span>
                  <ul>
                    <li v-for="(item2, index2) in starList" :key="index2" :class="{'yellow': item.creditLevel > index2}">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="info-bottom">
              <p>
                <span>交易金额：</span><i>{{item.payAmount | formattingMoney}} {{item.payCurrency}}</i>
              </p>
              <p>
                <span>支付方式：</span><i>{{item.payBand}}</i>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      orderId: this.$route.query.orderId,
      bossId: '',
      starList: ['', '', '', '', ''],
      imgUrl: {
        BTC: require('../../../../assets/images/finance/BTC.png'),
        CNY: require('../../../../assets/images/finance/CNY.png'),
        EUR: require('../../../../assets/images/finance/EUR.png'),
        HKD: require('../../../../assets/images/finance/HKD.png'),
        KRW: require('../../../../assets/images/finance/KRW.png'),
        USD: require('../../../../assets/images/finance/USD.png')
      },
      selectSharer: '',
      sharerList: [],
      liActive: 0, // 当前选择的选项
      pageIndex: 1,
      pageSize: 6
    }
  },
  mounted () {
    this.matchListByDeposit()
  },
  methods: {
    doSelectSharer (index, item) {
      this.liActive = index
      this.bossId = item.id
//      if (index === this.liActive) {
//        this.liActive = ''
//        this.bossId = ''
//      } else {
//        this.liActive = index
//        this.bossId = item.id
//      }
    },
    // 获取共享者列表
    matchListByDeposit () {
      let url = `${this.$api2}pigame/matchListByDeposit?id=${this.orderId}&sortBy=1&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.sharerList = res.data.data.list
          if (res.data.data.list.length > 0) {
            this.bossId = res.data.data.list[0].id
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 确定充值
    sure () {
      let url = `${this.$api2}deposit/chooseBoss?id=${this.orderId}&bossId=${this.bossId}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.$router.push({
            path: 'rechargeOrderDetail',
            query: {
              id: res.data.data.id
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
.selectSharer{
  padding: 40px 60px;
  .sharerHead{
    display: flex;
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

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      background-color: #999;
      cursor: not-allowed;
      &.active{
        background-color: #ffba14;
        cursor: pointer;
      }
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
