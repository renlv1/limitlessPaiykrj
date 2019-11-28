<template>
  <div class="page-limit">
    <!-- 我的抢购 申请发货-->
    <div class="location">
      <a href="">{{$t('goodsManagement.text55')}}</a><span>  》 </span>{{$t('goodsManagement.text56')}}
    </div>
    <div class="title">{{$t('goodsManagement.text56')}}</div>
    <div class="content">
      <div class="info">
        <div class="address">
          <div class="sub-title justify">
            <div>{{$t('goodsManagement.text57')}}</div>
            <div v-if="defaultShow" class="add-new" @click="changeDefult">{{$t('goodsManagement.text58')}}</div>
            <div v-if="!defaultShow" class="flex-btn">
              <div class="add-new" @click="addAddress">+ {{$t('goodsManagement.text59')}}</div>
              <div @click="defaultShow = true" class="cancle">{{$t('goodsManagement.text5')}}</div>
            </div>
            <!--<div class="add-new" @click="addAddress">+ 新增收货地址</div>-->
          </div>
          <ul v-show="defaultShow">
            <li class="address-item current" v-show="isAddressData">
              <div class="justify">
                <div class="cursor">
                  <div>{{$t('goodsManagement.text60')}}：{{addressOneArr.realName}} <span>（{{phoneCodeAdd(addressOneArr.phoneCode)}}）{{addressOneArr.phone}}</span></div>
                  <p>{{$t('goodsManagement.text61')}}：{{addressOneArr.country}}  {{addressOneArr.district}}  {{addressOneArr.realAddress}}</p>
                </div>
              </div>
            </li>
          </ul>
          <ul v-show="!defaultShow" class="list-uls-address">
            <li class="address-item cursor" @click="switchOne(index, item.id, item)" v-show="isAddressData" v-for="(item, index) in orderArr" :key="index" :class="{'current': defultOrder === index}">
              <div class="justify">
                <div class="cursor">
                  <div>{{$t('goodsManagement.text60')}}：{{item.realName}} <span>（{{phoneCodeAdd(item.phoneCode)}}）{{item.phone}}</span></div>
                  <p>{{$t('goodsManagement.text61')}}：{{item.country}}  {{item.district}}  {{item.realAddress}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="prod">
          <div class="sub-title">{{$t('goodsManagement.text62')}}</div>
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
                    <div>
                      <img :src="orderRecord.productLogo" width="60" height="60" alt="">
                      <span>{{orderRecord.productName}}</span>
                    </div>
                  </td>
                  <td>{{orderRecord.merchantName}}</td>
                  <td>{{orderRecord.id}}</td>
                  <td>{{$route.query.roundId}}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">
              <div class="t2">
                <span>{{$t('goodsManagement.text67')}}：</span>
                <span v-if="orderRecord.panicAmount">{{orderRecord.panicAmount | fourNumber}} π</span>
                <span v-else>0.0000 π</span>
              </div>
              <div class="t3">
                <span>{{$t('goodsManagement.text68')}}：</span>
                <span v-if="orderRecord.panicAmountCny">{{orderRecord.panicAmountCny | fourNumber}} CNY</span>
                <span v-else>0.0000 CNY</span>
              </div>
              <div class="btn" @click="sendOrder">{{$t('goodsManagement.text56')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增地址弹框  -->
    <div class="mask" v-show="maskShow">
      <div class="mask-wrap">
        <i class="mask-close" @click="maskShow = !maskShow"></i>
        <div class="mask-title" v-show="isModify">{{$t('goodsManagement.text69')}}</div>
        <div class="mask-title" v-show="!isModify">{{$t('goodsManagement.text59')}}</div>
        <div class="mask-content">
          <div class="mask-from">
            <div class="field">
              <label>{{$t('goodsManagement.text70')}}</label>
              <input class="input" type="text" v-model.trim="username">
            </div>
            <div class="hint" v-show="errorShow1">{{$t('goodsManagement.text71')}}</div>
            <div class="field">
              <label>{{$t('goodsManagement.text72')}}</label>
              <div class="phone">
                <div class="area-code" @click="phoneArea()">
                  <div class="list-area">{{myArea}}</div>
                  <div class="sel-img" :class="{active: activeChange}"></div>
                  <div class="select" :class="{active: activeLink}">
                    <div class="list-sel" @click="myPhoneArea(item)" v-for="(item, index) in cityDatas" :key="index">{{item.code}}</div>
                  </div>
                </div>
                <input type="number" v-model.trim="phoneNumber" @focus="phoneHintShow = false" autocomplete="off">
              </div>
            </div>
            <div class="hint" v-show="errorShow2">{{$t('goodsManagement.text73')}}</div>
            <div class="field">
              <label>{{$t('goodsManagement.text74')}}</label>
              <input class="input" type="number" v-model.trim="postalcode">
            </div>
            <div class="hint" v-show="errorShow3">{{$t('goodsManagement.text75')}}</div>
            <div class="field">
              <label>{{$t('goodsManagement.text76')}}</label>
              <input class="input" type="text" v-model.trim="country">
            </div>
            <div class="hint" v-show="errorShow4">{{$t('goodsManagement.text77')}}</div>
            <div class="field">
              <label>{{$t('goodsManagement.text78')}}</label>
              <input class="input" type="text" v-model.trim="location">
            </div>
            <div class="hint" v-show="errorShow5">{{$t('goodsManagement.text79')}}</div>
            <div class="field">
              <label>{{$t('goodsManagement.text80')}}</label>
              <textarea class="input" v-model.trim="address"></textarea>
            </div>
            <div class="hint" v-show="errorShow6">{{$t('goodsManagement.text81')}}</div>
            <div class="hint" v-show="errD">{{errD}}</div>
            <button class="btn" @click="saveFrom">{{$t('goodsManagement.text82')}}</button>
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
      defultOrder: 0,
      addressOneArr: [],
      defaultShow: true,
      isAddressData: false,
      errorShow1: false,
      errorShow2: false,
      errorShow3: false,
      errorShow4: false,
      errorShow5: false,
      errorShow6: false,
      cityDatas: [],
      phoneMsgText: '',
      phoneHintShow: false,
      activeChange: false,
      myArea: '86',
      username: '',
      phoneNumber: '',
      activeLink: false,
      postalcode: '',
      country: '',
      location: '',
      address: '',
      orderRecord: '',
      orderId: this.$route.query.id,
      orderArr: [],
      errD: '',
      isModify: false,
      modifyId: '',
      wuliu: [],
      maskShow: false
    }
  },
  created () {
    this.getOrderDetail()
    this.getOrderAddress()
    this.cityDatas = require('@/../static/code/local_cn.json')
  },
  methods: {
    changeDefult () {
      this.defaultShow = !this.defaultShow
    },
    phoneCodeAdd (code) {
      if (code && code.indexOf('+') > -1) {
        return code
      } else {
        return '+' + code
      }
    },
    switchOne (index, id, item) {
      this.defultOrder = index
      this.modifyId = id
      this.addressOneArr = item
      this.defaultShow = true
    },
    getOrderAddress () {
      this.$postAxios.post(`${this.$api2}shopMine/queryOrderReceiptList`, {
        pageIndex: 1,
        pageSize: 20,
        type: 1
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderArr = res.data.data
          if (res.data.data.length !== 0) {
            this.isAddressData = true
            this.modifyId = res.data.data[0].id
            this.addressOneArr = res.data.data[0]
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 申请发货
    sendOrder () {
      if (this.orderArr.length > 0) {
        Dialog({
          title: '',
          content: this.$t('goodsManagement.text83'),
          okFn: () => {
            this.$postAxios.post(`${this.$api2}infinite/infiniteOrderConfimReceiveInfo`, { // 2.8抢购人确认收货地址
              infiniteOrderId: this.orderId,
              receiptPlaceId: this.modifyId
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
      } else {
        Dialog({
          title: '',
          content: this.$t('goodsManagement.text84')
        })
      }
    },
    // 2.3 竞价订单详情
    getOrderDetail () {
      this.$postAxios.post(`${this.$api2}infinite/queryInfiniteOrderDetail`, {
        infiniteOrderId: this.orderId
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderRecord = res.data.data.infiniteOrderRecord
          this.wuliu = res.data.data.expressList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    editorAddress (id) {
      this.isModify = true
      this.username = ''
      this.phoneNumber = ''
      this.postalcode = ''
      this.country = ''
      this.location = ''
      this.address = ''
      this.$postAxios.post(`${this.$api2}shopMine/orderReceiptView`, {
        receiptId: id
      }).then(res => {
        if (res.data.status === 'success') {
          this.username = res.data.data.realName
          this.myArea = res.data.data.phoneCode
          this.phoneNumber = res.data.data.phone
          this.postalcode = res.data.data.postCode
          this.country = res.data.data.country
          this.location = res.data.data.district
          this.address = res.data.data.realAddress
        }
      }).catch(err => {
        console.log(err)
      })
      this.maskShow = true
      this.errorShow1 = false
      this.errorShow2 = false
      this.errorShow3 = false
      this.errorShow4 = false
      this.errorShow5 = false
      this.errorShow6 = false
      this.modifyId = id
    },
    addAddress () {
      this.isModify = false
      this.errorShow1 = false
      this.errorShow2 = false
      this.errorShow3 = false
      this.errorShow4 = false
      this.errorShow5 = false
      this.errorShow6 = false
      this.username = ''
      this.phoneNumber = ''
      this.postalcode = ''
      this.country = ''
      this.location = ''
      this.address = ''
      this.maskShow = true
    },
    saveFrom () {
      if (this.username === '') {
        this.errorShow1 = true
      } else {
        this.errorShow1 = false
      }
      if (this.phoneNumber === '') {
        this.errorShow2 = true
      } else {
        this.errorShow2 = false
      }
      if (this.postalcode === '') {
        this.errorShow3 = true
      } else {
        this.errorShow3 = false
      }
      if (this.country === '') {
        this.errorShow4 = true
      } else {
        this.errorShow4 = false
      }
      if (this.location === '') {
        this.errorShow5 = true
      } else {
        this.errorShow5 = false
      }
      if (this.address === '') {
        this.errorShow6 = true
      } else {
        this.errorShow6 = false
      }
      if (this.username !== '' && this.phoneNumber !== '' && this.postalcode !== '' && this.country !== '' && this.location !== '' && this.address !== '') {
        if (this.isModify === false) {
          this.$postAxios.post(`${this.$api2}shopMine/saveOrderReceipt`, {
            realName: this.username,
            phoneCode: this.myArea,
            phone: this.phoneNumber,
            postCode: this.postalcode,
            country: this.country,
            district: this.location,
            realAddress: this.address,
            type: '1',
            operateType: '1'
          }).then(res => {
            if (res.data.status === 'success') {
              this.maskShow = false
//              let id = res.data.data.id
              this.getOrderAddress()
              this.addressOneArr = res.data.data
              this.defaultShow = true
//              this.orderArr.forEach((item, index) => {
//                if (item.id === id) {
//                  this.defultOrder = index
//                }
//              })
              Dialog({
                title: '',
                content: this.$t('goodsManagement.text85')
              })
            } else {
              this.errD = res.data.msg
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$postAxios.post(`${this.$api2}shopMine/saveOrderReceipt`, {
            realName: this.username,
            phoneCode: this.myArea,
            phone: this.phoneNumber,
            postCode: this.postalcode,
            country: this.country,
            district: this.location,
            realAddress: this.address,
            type: '1',
            operateType: '2',
            receiptId: this.modifyId
          }).then(res => {
            if (res.data.status === 'success') {
              this.maskShow = false
              let id = res.data.data.id
              this.getOrderAddress()
              this.orderArr.forEach((item, index) => {
                if (item.id === id) {
                  this.defultOrder = index
                }
              })
              Dialog({
                title: '',
                content: this.$t('goodsManagement.text86')
              })
            } else {
              this.errD = res.data.msg
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    // 显示手机区号
    phoneArea () {
      this.activeLink = !this.activeLink
      this.activeChange = !this.activeChange
    },
    // 选择区号
    myPhoneArea (item) {
      this.myArea = item.code
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
  .list-uls-address{
    max-height: 370px;
    overflow-y: auto;
  }
  .flex-btn{
    display: flex;
    .cancle{
      font-size: 16px;
      padding-right: 30px;
      cursor: pointer;
    }
  }
  .mask-wrap{
    padding: 0 80px 80px 80px;
  }
  .info{
    background: #fff;
    border: 1px solid #e7e8ec;
    padding: 28px 50px 86px;
    > div{
      padding-left: 50px;
      padding-right: 50px;
    }
  }
  .address{
    padding-bottom: 50px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e7e8ec;
    .address-item{
      border: 1px solid #e7e8ec;
      padding: 12px 30px 20px;
      line-height: 34px;
      margin-bottom: 30px;
      &.current{
        border-color: @yellow;
      }
    }
    .editor-btn{
      color: @blue;
      padding: 10px 0 10px 30px;
    }
    a{
      color: @blue
    }
    .add-new{
      color: @yellow;
      font-size: 16px;
      cursor: pointer;
      font-weight: normal;
      margin-right: 30px;
    }
  }
  .sub-title{
    font-size: 20px;
    font-weight: bold;
    line-height: 70px;
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
