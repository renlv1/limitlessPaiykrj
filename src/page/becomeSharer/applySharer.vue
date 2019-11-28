<template>
  <div>
    <!--申请共享者-->
    <div class="registeredSharer-warp">
      <div class="registered-sharer-box">
        <div class="title">{{$t('sharer.text1')}}</div>
        <!--申请共享者-->
        <div class="tabBtn">
          <div class="btn appForbtn"></div>
          <div class="btn"></div>
          <div class="btn result"></div>
        </div>
        <!-- 审核的title-->
        <div class="tab-title">
          <div class="tit">{{$t('sharer.text2')}}</div>
          <div class="tit">{{$t('sharer.text3')}}</div>
          <div class="tit">{{$t('sharer.text4')}}</div>
        </div>
        <!-- form -->
        <div class="formTable">
          <div class="personal-details">{{$t('sharer.text5')}}</div>
          <div class="input-box zcname">
            <span>{{$t('sharer.text6')}}</span><input type="text" v-model.trim="realname" @focus="realnameHintShow = false" :placeholder="$t('sharer.text7')" autocomplete="off">
            <div class="hint" :class="{'allHintNullActive': realnameHintShow}">{{realnameMsgText}}</div>
          </div>
          <div class="input-box zcaddress">
            <span>{{$t('sharer.text8')}}</span><input type="text" v-model.trim="userAddress" @focus="addressHintShow = false" :placeholder="$t('sharer.text9')" autocomplete="off">
            <div class="hint" :class="{'allHintNullActive': addressHintShow}">{{addressMsgText}}</div>
          </div>
          <div class="input-box zcphone">
            <span>{{$t('sharer.text10')}}</span>
            <div class="phone">
              <div class="area-code" @click="phoneArea()">
                <div class="list-area">{{myArea}}</div>
                <div class="sel-img" :class="{active: activeChange}"></div>
                <div class="select" :class="{active: activeLink}">
                  <div class="list-sel" @click="myPhoneArea(item)" v-for="(item, index) in cityDatas" :key="index">{{item.code}}</div>
                </div>
              </div>
              <input type="number" v-model.trim="phoneNumber" @focus="phoneHintShow = false" :placeholder="$t('sharer.text11')" autocomplete="off">
            </div>
            <div class="hint" :class="{'allHintNullActive': phoneHintShow}">{{phoneMsgText}}</div>
          </div>
          <div class="input-box bondsman">
            <span>{{$t('sharer.text12')}}</span><input type="text" v-model.trim="surety" @focus="suretyHintShow = false" :placeholder="$t('sharer.text13')" autocomplete="off">
            <div class="hint" :class="{'allHintNullActive': suretyHintShow}">{{suretyMsgText}}</div>
          </div>
          <div class="procedure-rates">{{$t('sharer.text14')}}</div>
          <div class="input-box Pay">
            <span>{{$t('sharer.text15')}}</span><input type="number" v-model.trim="fiatTopUp" @focus="fiatTopUpHintShow = false" :placeholder="$t('sharer.text16')" autocomplete="off"><i>%</i>
            <div class="hint" :class="{'allHintNullActive': fiatTopUpHintShow}">{{fiatTopUpMsgText}}</div>
          </div>
          <div class="input-box embody">
            <span>{{$t('sharer.text17')}}</span><input type="number" v-model.trim="fiatWithdrawal" @focus="fiatWithdrawalHintShow = false" :placeholder="$t('sharer.text18')" autocomplete="off"><i>%</i>
            <div class="hint" :class="{'allHintNullActive': fiatWithdrawalHintShow}">{{fiatWithdrawalyMsgText}}</div>
          </div>
          <div class="contact-title">{{$t('sharer.text19')}}</div>
          <div class="input-box contact-way-box">
            <span>{{$t('sharer.text20')}}</span>
            <div class="inputcontact-box">
              <div class="input-type">
                <div class="contact-way" @click="ContactWayFan()">
                  <div class="list-way">{{myContactWay}}</div>
                  <div class="sel-img" :class="{active: activeWayChange}"></div>
                  <div class="select" :class="{active: activeWayLink}">
                    <div class="list-sel" @click="myContactWayFan(item)" v-for="item in ContactWayDatas" :key="item.value">{{item.value}}</div>
                  </div>
                </div>
              </div>
              <input type="text" v-model.trim="contact" @focus="contactHintShow = false" :placeholder="$t('sharer.text21')" autocomplete="off">
            </div>
            <div class="hint" :class="{'allHintNullActive': contactHintShow}">{{contactMsgText}}</div>
          </div>
          <!--提交注册共享者-->
          <div class="sibBtn" :class="{active: btnActive}" @click="siginSharer()">
            {{$t('sharer.text22')}}
            <div class="hint" :class="{'allHintNullActive': allHintShow}">{{allMagText}}</div>
          </div>
          <div class="bottim-text">{{$t('sharer.text23')}}</div>
        </div>
      </div>
      <!-- 支付保证金-->
      <div class="mask" v-show="paymentBondShow">
        <transition name="drop">
         <div class="amount-of-payment" v-if="paymentBondShow">
          <div class="close" @click="close()"></div>
          <div class="amount-of-payment-box">
            <div class="title">{{$t('sharer.text24')}}</div>
            <div class="money">{{amount}} π</div>
            <div class="tit">{{$t('sharer.text25')}}</div>
            <div class="input-box">
              <input type="password" v-model.trim="tradePwd" @focus="tradePwdHIntShow = false, paytheWrongShow = false" autocomplete="off" :placeholder="$t('sharer.text26')">
              <div class="hint" :class="{'allHintNullActive': tradePwdHIntShow}">{{tradePwdMsgShow}}</div>
            </div>
            <div class="tit">{{$t('sharer.text33')}}</div>
            <div class="input-box">
              <input type="number" v-model.trim="mobileCode" @focus="mobileCodeHIntShow = false, paytheWrongShow = false" autocomplete="off" :placeholder="$t('forgetPwd.text4')">
              <div class="hint" :class="{'allHintNullActive': mobileCodeHIntShow}">{{mobileCodeMsgShow}}</div>
            </div>
            <div class="amount-of-payment-btn button--ujarak button--inverted" @click="amountofpayment()">
              {{$t('sharer.text27')}}
              <div class="hint" :class="{'allHintNullActive': paytheWrongShow}">{{paytheWrongMsg}}</div>
            </div>
          </div>
        </div>
        </transition>
      </div>
    </div>
    <!-- 未设置验证码-->
    <div class="myPopup" v-if="setSafeVerific">
      <div class="myPopup-box" >
        <div class="close" @click="setSafeVerific = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('sharer.text28')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('sharer.text29')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('sharer.text30')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      setSafeVerific: false,
      paymentBondShow: false, // 支付金额弹框
      realname: '', // 真实姓名 01 input
      realnameHintShow: false, // 提示show
      realnameMsgText: '', // 错误提示类容
      userAddress: '', // 地址 02
      addressHintShow: false,
      addressMsgText: '',
      phoneNumber: '', // 手机号 03
      phoneHintShow: false,
      phoneMsgText: '',
      surety: '', // 担保人 04
      suretyHintShow: false,
      suretyMsgText: '',
      fiatTopUp: '', // 法币充值 05
      fiatTopUpHintShow: false,
      fiatTopUpMsgText: '',
      fiatWithdrawal: '', // 法币提现 06
      fiatWithdrawalHintShow: false,
      fiatWithdrawalyMsgText: '',
      contact: '', // 联系方式号码 07
      contactHintShow: false,
      allHintShow: false,
      allMagText: '',
      contactMsgText: '',
      activeLink: false,
      activeWayLink: false,
      cityDatas: [],
      myArea: '+86',
      myContactWay: 'QQ', // 联系方式
      activeChange: false,
      activeWayChange: false,
      tradePwd: '', // 支付密码
      tradePwdHIntShow: false,
      tradePwdMsgShow: '',
      mobileCode: '', // 谷歌验证
      mobileCodeHIntShow: false,
      mobileCodeMsgShow: '',
      paytheWrongShow: true, // 支付错误提示
      paytheWrongMsg: '', // 支付错误提示文本
      amount: '', // 支付保证金
      dealId: '', // 共享者ID
      payId: '', // 现金付款交易ID
      currency: '', // 现金付款单位，未用
      btnActive: false,
      payState: '',
      auditFailure: this.$route.query.auditFailure,
      ContactWayDatas: [
        {
          value: 'QQ'
        },
        {
          value: 'wechat'
        },
        {
          value: 'facebook'
        },
        {
          value: 'skype'
        },
        {
          value: 'twitter'
        },
        {
          value: 'whatsapp'
        },
        {
          value: 'line'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'account', // 用户账号
      'userData' // 用户
    ])
  },
  mounted () {
    this.$nextTick((res) => {
      this.$store.dispatch('getUserBalance')
      // console.log(this.account.address)
      // 根据审核失败状态,获取共享者信息,渲染重新提交数据
      if (this.auditFailure) {
        this.$http.post(`${this.$api2}pigame/queryByAddress?address=${this.account.address}`).then((res) => {
          if (res.data.status === 'success') {
            this.realname = res.data.data.realname
            this.myArea = res.data.data.phoneCode
            this.phoneNumber = res.data.data.phoneNumber
            this.userAddress = res.data.data.contactAddress
            this.fiatTopUp = res.data.data.depositRate
            this.fiatWithdrawal = res.data.data.drawRate
            this.surety = res.data.data.referenceUsername
            this.contactWay = res.data.data.contactWay
            let obj = JSON.parse(this.contactWay)
            for (var key in obj) {
              // console.log(key, obj[key])
              this.myContactWay = key
              this.contact = obj[key]
            }
          }
        })
      }
    })
    // 手机区号
    this.$http.get('./static/code/local_cn.json').then((res) => {
      this.cityDatas = res.data
    })
  },
  methods: {
    // 注册验证
    verify () {
      let phoneTest = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ // 手机
      if (this.realname === '') {
        this.realnameHintShow = true
        this.realnameMsgText = this.$t('sharer.text7')
      }
      if (this.userAddress === '') {
        this.addressHintShow = true
        this.addressMsgText = this.$t('sharer.text9')
      }
      if (this.phoneNumber === '') {
        this.phoneMsgText = this.$t('sharer.text11')
        this.phoneHintShow = true
      }
      if (!phoneTest.test(this.phoneNumber) && this.phoneNumber !== '') {
        this.phoneMsgText = this.$t('sharer.text31')
        this.phoneHintShow = true
      }
      if (this.surety === '') {
        this.suretyMsgText = this.$t('sharer.text13')
        this.suretyHintShow = true
      }
      if (this.fiatTopUp === '') {
        this.fiatTopUpMsgText = this.$t('sharer.text16')
        this.fiatTopUpHintShow = true
      }
      /* if (this.fiatTopUp > 100) {
        this.fiatTopUpMsgText = '法币充值费率不能大于100'
        this.fiatTopUpHintShow = true
      } */
      if (this.fiatWithdrawal === '') {
        this.fiatWithdrawalyMsgText = this.$t('sharer.text18')
        this.fiatWithdrawalHintShow = true
      }
      /* if (this.fiatWithdrawal > 100) {
        this.fiatWithdrawalyMsgText = '法币提现费率不能大于100'
        this.fiatWithdrawalHintShow = true
      } */
      if (this.contact === '') {
        this.contactHintShow = true
        this.contactMsgText = this.$t('sharer.text21')
      }
    },
    // 注册共享者
    siginSharer () {
      this.btnActive = !this.btnActive
      let phoneTest = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ // 手机
      this.verify()
      let formData = new FormData()
      formData.append('realname', this.realname) // 真实姓名
      formData.append('phoneCode', this.myArea) // 手机区号
      formData.append('phoneNumber', this.phoneNumber) // 手机号码
      formData.append('contactAddress', this.userAddress) // 联系地址
      formData.append('depositRate', this.fiatTopUp) // 法币充值费率
      formData.append('drawRate', this.fiatWithdrawal) // 法币提现费率
      formData.append('referenceUsername', this.surety) // 推荐人用户名=担保人用户名
      if (this.auditFailure) { // 审核失败,重新提交状态2
        formData.append('source', 2) // 数据来源 1注册 2共享者审核失败重新提交
      } else {
        formData.append('source', 1)
      }
      formData.append(this.myContactWay, this.contact) // 联系方式
      if (this.realname !== '' && this.userAddress !== '' && phoneTest.test(this.phoneNumber) && this.surety !== '' && this.fiatTopUp !== '' && this.fiatWithdrawal !== '' && this.contact !== '') {
        if (this.userData.openGoogleCode !== 2) { // 支付前用户谷歌必须是开通, 未开通去开启谷歌
          this.setSafeVerific = true
        } else {
          this.$http.post(`${this.$api2}pigame/registerBoss`, formData).then((res) => {
            // console.log('返回', res)
            if (res.data.status === 'success') {
              this.dealId = res.data.data.id
              this.$http.post(`${this.$api2}pigame/queryBossDetail?id=${this.dealId}`).then((res) => {
                // console.log('获取boss信息', res)
                if (res.data.status === 'success') {
                  this.cashPaymentOrder = res.data.data.cashPaymentOrder
                  this.amount = res.data.data.cashPaymentOrder.amount
                  this.payId = res.data.data.cashPaymentOrder.payId
                  this.currency = res.data.data.cashPaymentOrder.currency
                  // 未支付过，弹出支付弹窗
                  if (res.data.data.payState !== 2) { // 支付状态 2支付成功
                    this.paymentBondShow = true // 注册成功后, 未支付成功,显示弹窗支付保证金
                    this.payState = res.data.data.payState
                  } else { // 已支付成功,去审核页面
                    this.paymentBondShow = false
                    this.$router.push('/sharerAudit')
                  }
                }
              })
            } else {
              this.allMagText = res.data.msg
              this.allHintShow = true
            }
          })
        }
      }
    },
    close () {
      this.paymentBondShow = !this.paymentBondShow
      this.tradePwd = ''
      this.mobileCode = ''
      this.paytheWrongShow = false
      this.tradePwdHIntShow = false
      this.mobileCodeHIntShow = false
    },
    // 支付验证
    paymentVerify () {
      if (this.tradePwd === '') {
        this.tradePwdHIntShow = true
        this.tradePwdMsgShow = this.$t('sharer.text26')
      }
      if (this.mobileCode === '') {
        this.mobileCodeHIntShow = true
        this.mobileCodeMsgShow = this.$t('forgetPwd.text4')
      }
    },
    // 申请共享者支付保证金
    amountofpayment () {
      this.paymentVerify()
      if (this.tradePwd !== '' && this.mobileCode !== '' && this.payState !== 2 && this.userData.openGoogleCode === 2) {
        this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${this.tradePwd}&mobileCode=${this.mobileCode}`).then((res) => {
          if (res.data.success === true) {
            this.paymentBondShow = false
            Dialog({
              content: this.$t('sharer.text32'),
              okFn: () => {
                // 支付成功去审核页面
                this.$router.push('/sharerAudit')
              }
            })
          } else {
            this.paytheWrongMsg = res.data.msg
            this.paytheWrongShow = true
          }
        })
      }
    },
    // 手机区号
    phoneArea () {
      this.activeLink = !this.activeLink
      this.activeChange = !this.activeChange
    },
    // 选择区号
    myPhoneArea (item) {
      this.myArea = item.code
    },
    // 联系方式
    ContactWayFan () {
      this.activeWayLink = !this.activeWayLink
      this.activeWayChange = !this.activeWayChange
    },
    // 选择联系方式
    myContactWayFan (item) {
      this.myContactWay = item.value
    }
  }
}
</script>

<style lang="less" scoped>
  .registeredSharer-warp{
    width: 100%;
    height: 100%;
    background-color: #FAFAFC;
    .registered-sharer-box{
      width: 1550px;
      height: auto;
      margin: auto;
      @media screen and (max-width: 1590px){
        width: 100%;
        padding: 0 20px;
      }
      .title{
        font-size: 34px;
        font-weight: bold;
        color: #1a1a1a;
        padding: 60px 0;
      }
      .tabBtn{
        width: 552px;
        margin: auto;
        height: 2px;
        background-color: #c4c6cc;
        display: flex;
        justify-content: space-between;
        .btn{
          width: 20px;
          height: 20px;
          background-color: #FAFAFC;
          border: 2px solid #c4c6cc;
          border-radius: 100%;
          margin-top: -10px;
        }
        .appForbtn{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/ongoing.png") no-repeat;
          background-size: 100%;
          margin-left: -3px;
          position: relative;
        }
        .appForbtnShenHeLast{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/complete.png") no-repeat;
          background-size: 100%;
          margin-right: -2px;
        }
        .information{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/ongoing.png") no-repeat;
          background-size: 100%;
          margin-left: -3px;
        }
      }
      .tab-title{
        width: 634px;
        margin: auto;
        padding: 20px 0 70px;
        display: flex;
        font-size: 18px;
        color: #666;
        justify-content: space-between;
        .tit{
          width: 33%;
          &:nth-child(2){
            text-align: center;
          }
          &:nth-child(3){
            text-align: right;
            padding-right: 20px;
          }
        }
      }
      .formTable{
        width: 580px;
        margin: auto;
        .personal-details{
          font-size: 20px;
          font-weight: bold;
          padding: 12px 0;
          text-align: left;
        }
        .input-box{
          width: 100%;
          height: 44px;
          margin: 30px auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          span{
            flex: 1;
            height: 100%;
            line-height: 44px;
            display: inline-block;
            font-size: 16px;
            color: #1a1a1a;
          }
          input{
            width: 440px;
            height: 100%;
            background-color: #fff;
            border: 1px solid rgba(153, 153, 153, .4);
            box-shadow: 0 2px 2px rgba(153, 153, 153, .2);
            border-radius: 4px;
            padding-left: 30px;
            color: #999;
            font-size: 16px;
            &:focus{
              border: 1px solid rgba(153, 153, 153, .5);
              box-shadow: 0 0 2px 2px rgba(153, 153, 153, .1);
            }
          }
          .hint {
            position: absolute;
            top: 50px;
            left: 140px;
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            &.allHintNullActive {
              opacity: 1;
            }
          }
          .phone{
            width: 440px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            .area-code{
              width: 100px;
              height: 100%;
              text-align: center;
              line-height: 44px;
              background-color: #fff;
              border: 1px solid rgba(153, 153, 153, .4);
              box-shadow: 0 2px 2px rgba(153, 153, 153, .2);
              border-radius: 4px;
              color: #999;
              margin-right: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              .list-area{
                padding-right: 10px;
              }
              .sel-img{
                width: 11px;
                height: 6px;
                background: url("../../assets/images/applySharers/down_gray.png") no-repeat;
                background-position: center;
                transition: all .5s;
                &.active{
                  transform: rotate(180deg);
                }
              }
              .select{
                position: absolute;
                left: -1px;
                top: 44px;
                width: 100px;
                height: 0;
                overflow-y: auto;
                border-radius: 4px;
                transition: all .3s linear;
                &.active{
                  height: 120px;
                  border: 1px solid #999;
                }
                .list-sel{
                  width: 100%;
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                }
              }
            }
            input{
              flex: 1;
            }
            .error{
              font-size: 14px;
              color: #e93a3a;
              position: absolute;
              left: 120px;
              bottom: -20px;
            }
          }
          i{
            position: absolute;
            right: -20px;
            font-size: 16px;
            color: #1a1a1a;
          }
        }
        .procedure-rates{
          font-size: 20px;
          color: #1a1a1a;
          font-weight: bold;
          padding: 30px 0;
        }
        .contact-title{
          font-size: 20px;
          color: #1a1a1a;
          font-weight: bold;
          margin: 50px auto;
        }
        .contact-way-box{
          width: auto;
          padding-top: 0;
          margin-top: 0;
          margin-bottom: 80px;
          .inputcontact-box{
            width: 440px;
            height: 44px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .input-type{
              width: 120px;
              height: 100%;
              line-height: 44px;
              text-align: center;
              color: #999;
              font-size: 16px;
              margin-right: 20px;
              border-radius: 4px;
              .contact-way{
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 44px;
                background-color: #fff;
                border: 1px solid rgba(153, 153, 153, .4);
                box-shadow: 0 2px 2px rgba(153, 153, 153, .2);
                border-radius: 4px;
                color: #999;
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                .list-way{
                  padding-right: 10px;
                }
                .sel-img{
                  width: 11px;
                  height: 6px;
                  background: url("../../assets/images/applySharers/down_gray.png") no-repeat;
                  background-position: center;
                  transition: all .5s;
                  &.active{
                    transform: rotate(180deg);
                  }
                }
                .select{
                  position: absolute;
                  left: 0;
                  top: 45px;
                  width: 120px;
                  height: 0;
                  z-index: 10;
                  background-color: #fff;
                  overflow-y: auto;
                  transition: all .3s linear;
                  border-top-right-radius: 4px;
                  border-top-left-radius: 4px;
                  &.active{
                    height: 120px;
                    border: 1px solid #999;
                  }
                  .list-sel{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                  }
                }
              }
            }
            input{
              width: auto;
              flex: 1;
              color: #999;
              font-size: 16px;
            }
          }
        }
        .sibBtn{
          width: 200px;
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          background-color: #FFBA14;
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          margin: 0 auto;
          position: relative;
          cursor: pointer;
          &:hover{
            opacity: .9;
          }
          .hint {
            width: 580px;
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            color: #e93a3a;
            opacity: 0;
            &.allHintNullActive {
              opacity: 1;
            }
          }
        }
        .bottim-text{
          padding: 20px 0 60px;
          color: #999;
          text-align: center;
          font-size: 14px;
        }
      }
      .review-progress{
        width: 552px;
        margin: auto;
        .imgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/Waiting.png") no-repeat;
          margin: 0 auto;
        }
        .isSharerShowImgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/big_complete.png") no-repeat;
          margin: 0 auto;
        }
        .nOSharerShowImgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/big_failure.png") no-repeat;
          margin: 0 auto;
        }
        .textmsg{
          width: 552px;
          margin: auto;
          font-size: 16px;
          color: #1a1a1a;
          text-align: center;
          padding-top: 20px;
        }
        .notextmsg{
          color: #e93a3a;
          text-align: center;
          padding: 20px 0 60px;
        }
        .error-btn{
          width: 200px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 20px;
          background-color: #ffba14;
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          margin: auto;
          text-align: center;
        }
      }
    }
    .mask{
      width: 100%;
      height: 100vh;
      top: 0;
      left: 0;
      position: fixed;
      z-index: 500;
      background-color: rgba(0,0,0, .2);
      /*display: flex;
      align-items: center;
      justify-content: center;*/
      .amount-of-payment{
        width: 600px;
        padding-bottom: 80px;
        background-color: #fff;
        box-shadow: 0 1px 2px #4a86ff;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        position: relative;
        top: 25%;
        left: 50%;
        margin-left: -300px;
        .close{
          width: 17px;
          height: 17px;
          background: url("../../assets/images/login/Shutdown.png") no-repeat;
          background-size: 100%;
          background-position: center;
          position: absolute;
          top: 20px;
          right: 20px;
          cursor: pointer;
        }
        .amount-of-payment-box{
          width: 440px;
          .title{
            font-size: 20px;
            color: #1a1a1a;
            font-weight: bold;
            padding: 40px 0;
            text-align: center;
          }
          .money{
            font-size: 34px;
            color: #f75050;
            text-align: center;
            font-weight: bold;
          }
          .tit{
            font-size: 16px;
            color: #1a1a1a;
            padding-bottom: 10px;
            padding-top: 40px;
            text-align: left;
          }
          .input-box{
            width: 100%;
            height: 44px;
            line-height: 44px;
            position: relative;
            input{
              width: 100%;
              height: 100%;
              padding-left: 15px;
              font-size: 14px;
              border: 1px solid #e7e8ec;
              box-shadow: 0 3px 3px rgba(235, 236, 240, .5);
              border-radius: 4px;
              color: #999;
              &::-webkit-input-placeholder{
                color: #999;
              }
              &:-moz-placeholder{
                color: #999;
              }
              &::-moz-placeholder{
                color: #999;
              }
              &:-ms-input-placeholder{
                color: #999;
              }
              &:focus{
                box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1);
                border: 1px solid rgba(255, 153, 20, .4);
              }
            }
            .hint{
              position: absolute;
              left: 0;
              top: 50px;
              z-index: 10;
              font-size: 14px;
              line-height: 14px;
              color: #e93a3a;
              opacity: 0;
              &.allHintNullActive {
                opacity: 1;
              }
            }
          }
          .amount-of-payment-btn{
            width: 100%;
            height: 50px;
            line-height: 50px;
            margin-top: 50px;
            font-size: 20px;
            color: #fff;
            background-color: #ffba14;
            border-radius: 4px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
            cursor: pointer;
            position: relative;
            z-index: 1;
            &:hover{
              opacity: .8;
            }
            .hint {
              position: absolute;
              top: 50px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 14px;
              color: #e93a3a;
              opacity: 0;
              &.allHintNullActive {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
</style>
