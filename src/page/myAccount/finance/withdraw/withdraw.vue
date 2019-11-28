<template>
  <div class="recharge" >
    <div class="bread">
      <router-link tag="i" to="cashValue">{{$t('chongzhiTixian.text44')}}</router-link> 》 <span>{{$t('chongzhiTixian.text47')}}</span>
    </div>
    <h3>{{$t('chongzhiTixian.text47')}}</h3>
    <div class="recharge-box">
      <div class="rechargeNum">
        <span>{{$t('finance.text8')}}</span>
        <div class="inputBox">
          <input type="text" :placeholder="$t('finance.text9')" v-model="rechargeNum" @blur="validata()" @input="changeBuyNum('rechargeNum')">
          <div class="input-curreny">{{iptCurreny}}</div>
          <span v-if="rechargeNumerror">{{rechargeNumerror}}</span>
        </div>
      </div>
      <div class="currency">
        <span>{{$t('finance.text10')}}</span>
        <div class="currencySelect">
          <div class="select" @click="selectCurrency()">
            <span>{{selectedCurrency.text}}</span><i :class="{'close':currencyToggle}"></i>
          </div>
          <ul :class="{'close': currencyToggle}" :style="{height: currencyListHeight + 'px'}">
            <!--:class="{'active':selectedCurrency.tag === item.tag}"-->
            <li v-for="(item, index) in coinList" :key="index" @click="changeCurrency(item)" >{{item.currency}}</li>
          </ul>
        </div>
      </div>
      <div class="payNumber" v-if="selectedCurrency.tag">
        <span>{{$t('finance.text11')}}</span>
        <div class="selectNumber">
          <div class="select" @click="accountToggle = !accountToggle">
            <span>{{payNumber}}</span><i :class="{'close':accountToggle && currencyFlag }"></i>
          </div>
          <div class="curNumber" v-if="selectedFlag">
            <div class="cur-li">
              <p>
                <span>{{selectedNumber.bankName}}</span><span>{{selectedNumber.realName}}</span>
              </p>
              <p><span>{{selectedNumber.accountNumber}}</span></p>
            </div>
          </div>
          <div class="accountNum" :class="{'close': accountToggle && currencyFlag}">
            <div class="addBtn" @click="$router.push({path: '/account/addAccount',query: {currency: selectedCurrency.tag}})">
              <p><span>{{$t('finance.text5')}}</span></p>
            </div>
            <ul>
              <li v-for="(item, index) in bankAccountList" :key="index" @click="selectBankCard(item)" v-if="item.accountType !== 2 && item.accountType !== 3">
                <p>
                  <span>{{item.bankName}}</span><span>{{item.realName}}</span>
                </p>
                <!--<b>默认</b>-->
                <p><span>{{item.accountNumber}}</span></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btn" :class="{'active': validataFlag}" @click="createDepositOrder()">{{$t('finance.text12')}}</div>
    </div>
    <!--支付弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('chongzhiTixian.text37')}}</h3>
          <p class="pay-price">{{rechargeNum}}{{iptCurreny}}</p>
          <h5 class="trade-password">{{$t('chongzhiTixian.text19')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword"  value="" :placeholder="$t('chongzhiTixian.text20')">
          <!--谷歌-->
          <h5 class="trade-password">{{$t('chongzhiTixian.text21')}}</h5>
          <div class="shortMsg">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode" :placeholder="$t('chongzhiTixian.text22')" type="text" value="">
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
        <div class="close" @click="setSafeVerific = false"><img src="../../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapGetters} from 'vuex'
export default {
  data () {
    return {
      iptCurreny: 'USD',
      setSafeVerific: false,
      rechargeNumerror: '',
      rechargeNum: '', // 充值数额
      currencyToggle: false, // 币种选择开关
      accountToggle: false,
      currencyFlag: false, // 是否已经选择了币种
      currencyList: [
        {
          tag: 'USD'
        },
        {
          tag: 'CNY'
        },
        {
          tag: 'BTC'
        },
        {
          tag: 'LTC'
        }
      ],
      selectedNumber: '', // 选择的银行卡号
      selectedFlag: false,
      selectedCurrency: {
        text: this.$t('finance.text13'),
        tag: ''
      },
      payNumber: this.$t('finance.text11'),
      payPwd: '',
      bankAccountList: '', // 银行账户列表
      validataFlag: false, // 验证是否通过
      currencyListHeight: 0, // 币种下拉列表高度
      payPopupShow: false, // 确定弹窗
      payPassword: '', // 交易密码
      payCode: '', // 谷歌验证码
      payFailTip: '', // 确认支付提示
      cashPaymentId: '',
      id: ''

    }
  },
  mounted () {
    this.queryCoinList()
  },
  computed: {
    ...mapGetters([
      'coinList',
      'userData'
    ])
  },
  methods: {
    changeBuyNum (field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
    },
    ...mapActions([
      'queryCoinList'
    ]),
    // 关闭图标
    closeIcon () {
      this.payPopupShow = false
      this.payFailTip = ''
      this.setSafeVerific = false
      this.confirmShow = false
    },
    // 调用支付接口 http://wallet.pigamegroup.com/pay/payOrder
    confirmPay () {
      this.payFailTip = ''
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        let url = `${this.$api2}pay/payOrder`
        this.$postAxios.post(url, {
          id: this.cashPaymentId,
          tradePwd: this.payPassword,
          mobileCode: this.payCode
        }).then(res => {
          if (res.data.status === 'success') {
            this.$router.push({
              path: '/account/orderCashValue/switchShare',
              query: {
                id: this.id,
                isChongzhi: 1
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 切换币种
    changeCurrency (item) {
      this.selectedCurrency.tag = item.currency
      this.selectedCurrency.text = item.currency
      this.currencyListHeight = 0
      this.currencyToggle = false
      this.currencyFlag = true
      this.selectedNumber = ''
      this.selectedFlag = false
      if (item.currency === 'USD' || item.currency === 'CNY' || item.currency === 'HKD' || item.currency === 'CAD' || item.currency === 'KRW') {
        this.iptCurreny = 'USD'
      } else {
        this.iptCurreny = item.currency
      }
      this.validata()
      this.getAccountList()
    },
    // 打开支付币种支付弹窗
    selectCurrency () {
      this.currencyToggle = !this.currencyToggle
      if (this.currencyToggle) {
        let l = this.coinList.length
        this.currencyListHeight = l * 44
      } else {
        this.currencyListHeight = 0
      }
    },
    // 选择银行卡号
    selectBankCard (item) {
      this.accountToggle = false
      this.selectedFlag = true
      this.selectedNumber = item
      this.validata()
    },
    surePay () {
      if (this.validataFlag) {
      }
    },
    // 调用充值接口
    createDepositOrder () {
      this.rechargeNumerror = ''
      this.payPassword = ''
      this.payCode = ''
      if (this.rechargeNum === '') {
        this.validataFlag = false
        return false
      }
      if (this.selectedNumber === '') {
        this.validataFlag = false
        return false
      }
      if (this.selectedCurrency.tag === '') {
        this.validataFlag = false
        return false
      }
      if (this.rechargeNum > 0) {
        let url = `${this.$api2}draw/createOrder?currency=${this.selectedCurrency.tag}&amount=${this.rechargeNum}&type=${this.selectedNumber.accountType}&remark=&bankAccountId=${this.selectedNumber.id}`
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            if (res.data.data.payState === 1) {
              this.id = res.data.data.id
              this.cashPaymentId = res.data.data.cashPaymentOrder.payId
              if (this.userData.openGoogleCode !== 2) {
                this.setSafeVerific = true
              } else {
                this.payPopupShow = true
              }
            }
//          this.$router.push({
//            path: 'withdrawSelectSharer',
//            query: {
//              orderId: res.data.data.id
//            }
//          })
          } else {
            this.rechargeNumerror = res.data.msg
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.rechargeNumerror = this.$t('finance.text14')
      }
    },
    // 充值提现接口》4.2 查询银行帐户列表 account/list
    getAccountList () {
      let url = `${this.$api2}account/list?currency=${this.selectedCurrency.tag}&pageIndex=1&pageSize=10000`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.bankAccountList = res.data.data.list
        }
      }).catch(err => {
        console.log(err)
      })
    },
    validata () {
      if (this.rechargeNum === '') {
        this.validataFlag = false
        return false
      }
      if (this.selectedNumber === '') {
        this.validataFlag = false
        return false
      }
      if (this.selectedCurrency.tag === '') {
        this.validataFlag = false
        return false
      }
      this.validataFlag = true
      return true
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .recharge{
    background-color: #fafafc;
    width: 100%;
    padding: 40px 60px;
    h3{
      font-size: 34px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 60px;
    }
    .recharge-box{
      width: 760px;
      padding: 40px;
      border: 1px solid #e7e8ec;
      border-radius: 4px;
      background-color: #fff;
      .rechargeNum{
        padding-right: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          color: #1a1a1a;
          font-size: 16px;
        }
        .inputBox{
          position: relative;
          input{
            width: 440px;
            border: 1px solid #e7e8ec;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            padding: 0 20px;
          }
          .input-curreny{
            position: absolute;
            right: 20px;
            top: 0;
            color: #1a1a1a;
            font-size: 16px;
            line-height: 50px;
          }
          span{
            position: absolute;
            top: 50px;
            left:0;
            color: #e60000;
          }
        }
      }
      .currency{
        margin-top: 30px;
        padding-right: 70px;
        display: flex;
        margin-bottom: 30px;
        align-items: center;
        justify-content: space-between;
        &>span{
          color: #1a1a1a;
          font-size: 16px;
        }
        .currencySelect{
          width: 440px;
          height: 50px;
          border: 1px solid #e7e8ec;
          position: relative;
          padding: 0 20px;
          .select{
            width: 100%;
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
              line-height: 50px;
              display: block;
              color: #999;
            }
            i{
              display: block;
              height: 0px;
              width: 0px;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid #ffba14;
              transition: all 0.5s;
              transform: rotate(180deg);
              &.close{
                transform: rotate(0deg);
              }
            }
          }
          ul{
            position: absolute;
            top: 50px;
            left: 0;
            box-shadow: 0px 5px 20px #ccc;
            height: 0;
            overflow: hidden;
            transition: all 0.5s;
            z-index: 10;
            li{
              width: 440px;
              height: 44px;
              border-bottom: 1px solid #e7e8ec;
              line-height: 44px;
              text-align: center;
              background-color: #fff;
              cursor: pointer;
              color: #999;
              &:hover{
                color: #1a1a1a;
              }
              &.active{
                color: #1a1a1a;
              }
            }
          }

        }
      }
      .payNumber{
        margin-top: 30px;
        padding-right: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 200px;
        &>span{
          color: #1a1a1a;
          font-size: 16px;
        }
        .selectNumber{
          width: 440px;
          height: 50px;
          border: 1px solid #e7e8ec;
          position: relative;
          padding: 0 20px;
          .select{
            width: 100%;
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
              line-height: 50px;
              display: block;
              color: #999;
            }
            i{
              display: block;
              height: 0px;
              width: 0px;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid #ffba14;
              transition: all 0.5s;
              transform: rotate(180deg);
              &.close{
                transform: rotate(90deg);
              }
            }
          }
          .curNumber{
            padding: 20px  ;
            position: absolute;
            top: 50px;
            left: -1px;
            border: 1px solid #e7e8ec;
            border-top: none;
            width: 440px;
            height: 140px;
            z-index: 8;
            background-color: #fff;
            .cur-li{
              width: 380px;
              height: 100px;
              margin: 0 auto;
              border: 1px solid #e7e8ec;
              background-color: #fcfcfc;
              margin-bottom: 20px;
              padding: 20px 30px 20px 20px;
              p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 30px;
                span {
                  font-size: 16px;
                  color: #1a1a1a;
                  vertical-align: middle;
                  line-height: 30px;
                  i {
                    display: inline-block;
                    background-image: url('../../../../assets/images/finance/bank.png');
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background-size: cover;
                    margin-right: 10px;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
          .accountNum{
            position: absolute;
            top: 49px;
            left: 0px;
            width: 440px;
            height: 0px;
            box-shadow: 0px 5px 20px #ccc;
            transition: all 0.5s;
            overflow: hidden;
            background-color: #fff;
            z-index: 9;
            &.close{
              height: 448px;
            }
            .addBtn{
              padding: 18px 0;
              border-bottom: 1px solid #e7e8ec;
              p{
                width: 380px;
                height: 44px;
                border: 1px dashed #ffba14;
                border-radius: 4px;
                text-align: center;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content:center;
                cursor: pointer;
                span{
                  text-align: center;
                  font-size: 16px;
                  color: #1a1a1a;
                  &:before{
                    content: '+';
                    display: inline-block;
                    margin-right: 10px;
                    font-size:16px;
                  }
                }
              }
            }
            ul{
              padding: 10px 0 0 ;
              height: 370px;
              overflow-y: auto;
              &::-webkit-scrollbar {display:none}
              li{
                width: 380px;
                height: 100px;
                margin: 0 auto;
                border: 1px solid #e7e8ec;
                background-color: #fcfcfc;
                margin-bottom: 20px;
                padding: 20px 30px 20px 20px;
                cursor: pointer;
                p{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  span{
                    font-size: 16px;
                    color: #1a1a1a;
                    vertical-align: middle;
                    line-height: 30px;
                    i{
                      display: inline-block;
                      background-image: url('../../../../assets/images/finance/bank.png');
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background-size: cover;
                      margin-right: 10px;
                      vertical-align: middle;
                    }
                  }
                  b{
                    color: #4b84ff;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
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
        margin-left: 165px;
        cursor: not-allowed;
        &.active{
          background-color: #ffba14;
          cursor: pointer;
        }
      }
    }
  }
</style>
