<template>
  <div class="page-limit">
    <div class="location">
      <a href="">{{$t('goodsManagement.text55')}}</a><span> 》 </span>{{$t('goodsManagement.text92')}}
    </div>
    <div class="title">{{$t('goodsManagement.text92')}}</div>
    <div class="content">
      <div class="detail-step">
        <div class="line">
          <div class="line-item active"></div>
          <div class="line-item" :class="{'active': orderRecord.status >= 2}"></div>
        </div>
        <ul>
          <li class="complete list ok-list">
            <p>{{$t('goodsManagement.text97')}}</p>
            <span>{{orderTime1}}</span>
          </li>
          <li class="current list" :class="{'ok-list': orderRecord.status === 2 || orderRecord.status === 3}">
            <p>{{$t('goodsManagement.text98')}}</p>
            <span>{{orderTime1}}</span>
          </li>
          <li class="list" :class="{'ok-list': orderRecord.status === 3, 'current': orderRecord.status === 2, 'default': orderRecord.status === 1 ||  orderRecord.status === 4}">
            <p>{{$t('goodsManagement.text99')}}</p>
            <span>{{orderTime2}}</span>
          </li>
        </ul>
      </div>
      <div class="info">
        <div class="section address">
          <div class="sub-title justify">{{$t('goodsManagement.text57')}}</div>
          <div class="address-item" v-if="orderRecord.realname">
            <div>{{$t('goodsManagement.text60')}}：{{orderRecord.realname}} <span>{{orderRecord.phone}}</span></div>
            <div class="justify">
              <p>{{$t('goodsManagement.text61')}}：{{orderRecord.receiptAddress}}</p>
            </div>
          </div>
        </div>
        <div class="section" >
          <div class="sub-title justify">{{$t('goodsManagement.text100')}}</div>
          <div class="express" v-if="expressInfo">
            <div class="express-head">
              <span>{{$t('goodsManagement.text101')}}： {{expressInfo.expressName}}</span>
              <span>{{$t('goodsManagement.text102')}}： {{expressInfo.expressNumber}}</span>
            </div>
            <div class="express-step">
              <p>{{$t('goodsManagement.text103')}}</p>
              <ul v-if="expressInfoList.length > 0">
                <li v-for="(item, index) in expressInfoList" :key="index">
                  <span class="intro">{{item.context}}</span>
                  <span class="time">{{item.time}}</span>
                </li>
              </ul>
              <div class="no-express2" v-else>{{expressInfo.message}}</div>
            </div>
          </div>
          <div v-else class="no-express">{{$t('goodsManagement.text104')}}</div>
        </div>
        <div class="section prod">
          <div class="sub-title">{{$t('goodsManagement.text105')}}</div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <td>{{$t('goodsManagement.text63')}}</td>
                  <td>{{$t('goodsManagement.text64')}}</td>
                  <td>{{$t('goodsManagement.text65')}}</td>
                  <td>{{$t('goodsManagement.text66')}}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="img-wrap">
                    <div v-if="orderRecord.productLogo">
                      <img :src="$imgUrlPro(orderRecord.productLogo)" alt="" width="60" height="60">
                      <span>{{orderRecord.productName}}</span>
                    </div>
                  </td>
                  <td>{{orderRecord.merchantName}}</td>
                  <td>{{orderRecord.id}}</td>
                  <td>{{roundId}}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">
              <div class="t2">
                <span>{{$t('goodsManagement.text64')}}：</span>
                <span v-if="orderRecord.panicAmount">{{orderRecord.panicAmount | fourNumber}} π</span>
                <span v-else>0.0000 π</span>
              </div>
              <div class="t3">
                <span>{{$t('goodsManagement.text68')}}：</span>
                <span v-if="orderRecord.panicAmountCny">{{orderRecord.panicAmountCny | fourNumber}} CNY</span>
                <span v-else>0.0000 CNY</span>
              </div>
              <div class="btn" v-if="orderRecord.status === 2" @click="sendOrder">{{$t('goodsManagement.text106')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      orderRecord: '',
      expressList: '',
      expressInfo: '',
      expressInfoList: [],
      length: 0,
      orderTime1: '',
      orderTime2: '',
      orderId: this.$route.query.id,
      roundId: this.$route.query.roundId
    }
  },
  created () {
    this.getRecordList()
  },
  methods: {
    // 2.3 竞价订单详情
    getRecordList () {
      this.$postAxios.post(`${this.$api2}infinite/queryInfiniteOrderDetail`, {
        infiniteOrderId: this.orderId
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderRecord = res.data.data.infiniteOrderRecord
          this.expressList = res.data.data.expressList
          if (res.data.data.expressInfo) {
            this.expressInfo = res.data.data.expressInfo
            if (res.data.data.expressInfo.expressInfoList) {
              this.expressInfoList = res.data.data.expressInfo.expressInfoList.reverse()
              this.orderTime1 = this.expressInfoList[0].time
              this.orderTime2 = this.expressInfoList[this.expressInfo.expressInfoList.length - 1].time
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    sendOrder () {
      Dialog({
        title: '',
        content: this.$t('goodsManagement.text107'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}infinite/infiniteOrderConfirmOrder`, {
            infiniteOrderId: this.orderId,
            flagType: '1'
          }).then(res => {
            if (res.data.status === 'success') {
              this.$router.push('/account/myPurchase')
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
  .detail-step{
    margin-bottom: 50px;
    position: relative;
    ul{
      position: relative;
      display: flex;
      justify-content: center;
      text-align: center;
      color: #666;
      font-size: 18px;
      line-height: 1;
    }
    li{
      width: 260px;
      &:before{
        content: '';
        width: 30px;
        height: 30px;
        display: inline-block;
        margin-bottom: 15px;
      }
      &.list{
        color: #000;
        &.ok-list:before{
          background: url(~@/assets/images/limitlessPai/icon_right.png);
        }
      }
      &.current:before{
        background: url(~@/assets/images/limitlessPai/icon_current.png);
      }
      &.default:before{
        background: url(~@/assets/images/limitlessPai/icon_circle.png);
      }
      p{
        padding-bottom: 5px;
      }
      span{
        font-size: 14px;
      }
    }
    .line{
      position: absolute;
      top: 12px;
      .hor-center;
      display: flex;
      &-item{
        background: #c4c6cc;
        width: 260px;
        height: 2px;
        &.active{
          background: @blue;
        }
      }
    }
  }
  .info{
    background: #fff;
    border: 1px solid #e7e8ec;
    padding: 28px 50px 86px;
    .section{
      padding-left: 50px;
      padding-right: 50px;
      border-bottom: 1px solid #e7e8ec;
      &:last-child{
        border-bottom: none;
      }
    }
  }
  .no-express{
    text-align: center;
    color: #fc534c;
    margin: 30px 0;
  }
  .no-express2{
    text-align: center;
    color: #fc534c;
  }
  .address{
    padding-bottom: 50px;
    margin-bottom: 20px;
    .address-item{
      border: 1px solid #e7e8ec;
      padding: 12px 30px 20px;
      line-height: 34px;
    }
    a{
      color: @blue
    }
    .add-new{
      color: @yellow;
      font-size: 16px;
      font-weight: normal;
    }
  }
  .sub-title{
    font-size: 20px;
    font-weight: bold;
    line-height: 70px;
  }
  .express{
    padding-bottom: 30px;
    margin-bottom: 50px;
    border: 1px solid #e7e8ec;
    &-head{
      border-bottom: 1px solid #e7e8ec;
      padding: 0 30px;
      line-height: 48px;
      span + span{margin-left: 140px;}
    }
    &-step{
      padding: 0 30px;
      p{
        line-height: 1;
        padding: 20px 0 30px;
      }
      .time{
        font-size: 12px;
        color: #999;
      }
    }
    &-step{
      ul{
        position: relative;
        overflow: hidden;
      }
      ul:after{
        content: '';
        width: 2px;
        height: 100%;
        background: @blue;
        top: 0;
        left: 10px;
        position: absolute;
      }
      li{
        .justify;
        width: 1000px;
        position: relative;
        padding-left: 36px;
        &:before{
          .circle(21px);
          content: '';
          background: @blue;
          position: absolute;
          left: 0;
          top: 0;
        }
        & + li{
          margin-top: 50px;
        }
        /*&:last-child:before{
          background: url(~@/assets/images/limitlessPai/icon_current.png) no-repeat -2px;
          background-size: 20px;
          width: 20px;
          height: 20px;
        }*/
        .intro{
          width: 800px;
          display: inline-block;
        }
      }
    }
  }
  .table-wrap{
    thead{
      td{
        height: 44px;
        vertical-align: middle;
        background: @gray;
      }
    }
    td{
      padding: 0 25px;
      border: 1px solid #e7e8ec;
    }
    tbody{
      td{
        vertical-align: top;
        padding: 20px 25px;
        font-size: 14px;
      }
    }
    .img-wrap{
      width: 320px;
      padding: 20px;
      text-align: left;
      line-height: 20px;
      div{
        display: flex;
        align-items: center;
      }
      img{
        margin-right: 20px;
      }
  }
  }
  .total{
    line-height: 36px;
    padding: 10px 30px 30px;
    text-align: right;
    border: 1px solid #e7e8ec;
    border-top: none;
    font-size: 14px;
    .t2{
      color: #999;
    }
    .t3{
      font-weight: bold;
      font-size: 16px;
      span{
        color: @yellow;
      }
    }
    .btn{
      display: inline-block;
      margin-top: 20px;
    }
  }
</style>
