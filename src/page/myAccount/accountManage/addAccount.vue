<template>
  <div class="wrapper-account">
    <div class="goodsParticular-title">
      <h6>
        <router-link to="/account/gatheringManage" class="property">{{$t('addAccount.text1')}} ></router-link>
        <span>  {{$t('addAccount.text2')}}</span></h6>
    </div>
    <h2>{{$t('addAccount.text2')}}</h2>
    <!-- 添加新账户(法币) -->
    <div class="fiat" v-show="isFiat">
      <div class="input-group">
        <div class="must-text-group">
          <p class="input-group-text">{{$t('addAccount.text3')}}</p>
          <div class="inputs">
            <ul>
              <li>
                <div class="title-group">
                  <span>{{$t('addAccount.text4')}}</span>
                  <input v-model="bankName" :placeholder="$t('addAccount.text5')" @blur="noMustInfo"/>
                </div>
                <div class="err-text" v-show="noBankNameErrText">{{$t('addAccount.text6')}}</div>
              </li>
              <li>
                <div class="title-group">
                  <span>{{$t('addAccount.text7')}}</span>
                  <input v-model="bankAccount" :placeholder="$t('addAccount.text8')" @blur="noMustInfo"/>
                </div>
                <div class="err-text" v-show="noBankAccountErrText">{{$t('addAccount.text9')}}</div>
              </li>
              <li>
                <div class="title-group">
                  <span>{{$t('addAccount.text10')}}</span>
                  <input v-model="holdName" :placeholder="$t('addAccount.text11')" @blur="noMustInfo"/>
                </div>
                <div class="err-text" v-show="noHoldNameErrText">{{$t('addAccount.text12')}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="optional-text-group">
          <p class="input-group-text">{{$t('addAccount.text13')}}</p>
          <div class="inputs">
            <ul>
              <li>
                <span>{{$t('addAccount.text14')}}</span>
                <input v-model="country"/>
              </li>
              <li>
                <span>{{$t('addAccount.text15')}}</span>
                <input v-model="subBankName"/>
              </li>
              <li>
                <span>SWIFT</span>
                <input v-model="swiftCode"/>
              </li>
              <li>
                <span>IBAN</span>
                <input v-model="iban"/>
              </li>
            </ul>
          </div>
        </div>
        <div class="red-color">{{fiatErrShow}}</div>
        <button class="save" @click="addAccount"
                :class="{disableBtn: !(this.bankName !== '' && this.bankAccount !== '' && this.holdName !== ''), ableBtn: (this.bankName !== '' && this.bankAccount !== '' && this.holdName !== '')}">
          {{$t('addAccount.text16')}}
        </button>
      </div>
    </div>
    <!-- 添加新账户(数字货币1) -->
    <div class="currency-one" v-show="isCurrencyOne">
      <ul>
        <li>
          <span>{{$t('addAccount.text17')}}</span>
          <div class="input-text-group">
            <input v-model="bankAccount" :placeholder="$t('addAccount.text22')" @blur="noAccountAddress"/>
            <div class="err-text" style="color: #E93A3A" v-show="noAccountAddressErrText">{{$t('addAccount.text18')}}</div>
          </div>
        </li>
        <li>
          <span>{{$t('addAccount.text19')}}</span>
          <div class="input-text-group">
            <input v-model="holdName" :placeholder="$t('addAccount.text25')"/>
            <div class="err-text">{{$t('addAccount.text20')}}</div>
            <div class="err-text" style="color: #E93A3A" v-show="noHoldNameErrText">{{$t('addAccount.text21')}}</div>
          </div>
        </li>
      </ul>
      <div class="red-color">{{msgOneErr}}</div>
      <button class="save" @click="addAccount"
              :class="{disableBtn: !(this.bankAccount !== ''), ableBtn: (this.bankAccount !== '')}">
        {{$t('addAccount.text16')}}
      </button>
    </div>
    <!-- 添加新账户(数字货币2) -->
    <div class="currency-two" v-show="isCurrencyTwo">
      <div class="input-group">
        <span>{{$t('addAccount.text17')}}</span>
        <div class="input-text-group">
          <input v-model="holdName" :placeholder="$t('addAccount.text22')" @blur="noBankAccount"/>
          <div class="err-text" style="color: #E93A3A" v-show="noAccountAddressErrText">{{$t('addAccount.text18')}}</div>
        </div>
      </div>
      <div class="red-color">{{msgTwoErr}}</div>
      <button class="save isClick" @click="addAccount">{{$t('addAccount.text16')}}</button>
    </div>
    <!-- 添加成功弹窗 -->
    <el-dialog :visible.sync="centerDialogVisble" width="30%" center @close="clearAllInfo">
      <span>{{$t('addAccount.text23')}}</span>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn">
          <el-button @click="sure">{{$t('addAccount.text24')}}</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 分页 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        fiatErrShow: '',
        msgTwoErr: '',
        msgOneErr: '',
        centerDialogVisble: false,
        isDisabled: true,
        isFiat: false,
        isCurrencyOne: false,
        isCurrencyTwo: false,
        bankName: '', // 银行名称
        bankAccount: '', // 银行账号
        holdName: '', // 持卡人姓名
        realName: '', // 账户地址
        subBankName: '', // 分行支行
        country: '', // 国家
        swiftCode: '', // 银行编码
        iban: '', // iban
        noBankNameErrText: false, // 银行名称不能为空的提示
        noBankAccountErrText: false, // 银行名称不能为空的提示
        noHoldNameErrText: false, // 当用户名为空时
        noAccountAddressErrText: false // 账户地址不能为空的提示
      }
    },
    created() {
      this.chooseAddWays()
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    methods: {
      // noSelect () {
      //   if (this.bankName !== '' && this.bankAccount !== '' && this.holdName !== '') {
      //     this.isDisabled = true
      //   } else {
      //     this.isDisabled = false
      //   }
      // },
      clearAllInfo() {
        this.bankName = '' // 银行名称
        this.bankAccount = '' // 银行账号
        this.holdName = '' // 持卡人姓名
        this.subBankName = '' // 分行支行
        this.country = '' // 国家
        this.swiftCode = '' // 银行编码
        this.iban = '' // iban
      },
      sure() {
        this.clearAllInfo()
        this.centerDialogVisble = false
        this.$router.push({path: '/account/gatheringManageDetail', query: {currency: this.$route.query.currency}})
      },
      chooseAddWays() {
        let currency = this.$route.query.currency
        if (currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW') {
          this.isFiat = true
        } else if (currency === 'LTC' || currency === 'BTC' || currency === 'XRP' || currency === 'BCH' || currency === 'ETH') {
          this.isCurrencyOne = true
        } else if (currency === 'SIE' || currency === 'HT') {
          this.isCurrencyTwo = true
        }
      },
      noMustInfo() {
        if (this.bankName === '' && this.bankAccount === '' && this.holdName === '') {
          this.noBankNameErrText = true
        } else if (this.bankName !== '' && this.bankAccount === '' && this.holdName === '') {
          this.noBankNameErrText = false
          this.noBankAccountErrText = true
        } else if (this.bankName !== '' && this.bankAccount !== '' && this.holdName === '') {
          this.noBankNameErrText = false
          this.noBankAccountErrText = false
          this.noHoldNameErrText = true
        } else {
          this.noBankNameErrText = false
          this.noBankAccountErrText = false
          this.noHoldNameErrText = false
        }
      },
      // noBankName () {
      //   if (this.bankName === '') {
      //     this.noBankNameErrText = true
      //   } else {
      //     this.noBankNameErrText = false
      //   }
      // },
      // noBankAccount () {
      //   if (this.bankAccount === '') {
      //     this.noBankAccountErrText = true
      //   } else {
      //     this.noBankAccountErrText = false
      //   }
      // },
      // noHoldName () {
      //   if (this.holdName === '') {
      //     this.noHoldNameErrText = true
      //   } else {
      //     this.noHoldNameErrText = false
      //   }
      // },
      noBankAccount() {
        this.msgTwoErr = ''
        if (this.holdName === '') {
          this.noAccountAddressErrText = true
        } else {
          this.noAccountAddressErrText = false
        }
      },
      noAccountAddress() {
        this.msgOneErr = ''
        if (this.holdName === '' && this.bankAccount === '') {
          this.noAccountAddressErrText = true
        } else if (this.holdName !== '' && this.bankAccount === '') {
          this.noAccountAddressErrText = false
          this.noHoldNameErrText = true
        } else {
          this.noAccountAddressErrText = false
          this.noHoldNameErrText = false
        }
      },
      addAccount() { // 增加账户接口
        this.fiatErrShow = ''
        this.msgOneErr = ''
        this.msgTwoErr = ''
        let currency = this.$route.query.currency
        let fordata = new FormData()
        fordata.append(`currency`, this.$route.query.currency)
        fordata.append(`bankName`, this.bankName)
        if (currency === 'SIE' || currency === 'HT') {
          fordata.append(`accountNumber`, this.holdName)
        } else if (currency === 'LTC' || currency === 'ETH' || currency === 'BTC' || currency === 'XRP' || currency === 'BCH') {
          // 标签
          if (this.holdName !== '') {
            fordata.append(`accountTag`, this.holdName)
          }
          fordata.append(`accountNumber`, this.bankAccount)
          fordata.append(`realName`, this.userData.username)
        } else {
          fordata.append(`accountNumber`, this.bankAccount)
          fordata.append(`realName`, this.holdName)
        }
        fordata.append(`country`, this.country)
        fordata.append(`subBankName`, this.subBankName)
        fordata.append(`swiftCode`, this.swiftCode)
        fordata.append(`iban`, this.iban)
        if (this.bankName !== '' && this.bankAccount !== '' && this.holdName !== '' && (currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW')) {
          this.$http.post(`${this.$api2}/account/add`, fordata).then((res) => {
            if (res.data.status === 'success') {
              this.centerDialogVisble = true
            } else {
              this.fiatErrShow = res.data.msg
            }
          })
        } else if (this.bankAccount && (currency === 'LTC' || currency === 'ETH' || currency === 'BTC' || currency === 'XRP' || currency === 'BCH')) {
          this.$http.post(`${this.$api2}/account/add`, fordata).then((res) => {
            if (res.data.status === 'success') {
              this.centerDialogVisble = true
            } else {
              this.msgOneErr = res.data.msg
            }
          })
        } else if (this.holdName && (currency === 'SIE' || currency === 'HT')) {
          this.$http.post(`${this.$api2}/account/add`, fordata).then((res) => {
            if (res.data.status === 'success') {
              this.centerDialogVisble = true
            } else {
              this.msgTwoErr = res.data.msg
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .goodsParticular-title
    margin-bottom 30px
    h6
      font-size 18px
      a
        color #1a1a1a

  h2
    font-weight bold
    letter-spacing 2px

  .fiat
    .input-group
      margin 0 auto
      width 550px
      display flex
      flex-direction column
      align-items stretch
      .must-text-group, .optional-text-group
        margin-top 60px
        display flex
        flex-direction column
        align-items flex-start
        .input-group-text
          font-size 18px
          font-weight bold
      .must-text-group
        ul
          li
            display flex
            flex-direction column
            span
              font-size 16px
              color #1a1a1a
            .title-group
              margin-top 30px
              width 580px
              display flex
              align-items center
              justify-content space-between
              input
                width 400px
                height 44px
                line-height 44px
                font-size 16px
                background #fff
                border-radius 4px
                border 1px solid #e7e8ec
                padding-left 30px
            .err-text
              font-size 14px
              letter-spacing 1px
              margin 12px 0 0 180px
              color #E93A3A
      .optional-text-group
        ul
          margin-top 50px
          li
            width 580px
            display flex
            flex-direction row
            align-items center
            justify-content space-between
            margin-bottom 50px
            span
              font-size 16px
              color #1a1a1a
            input
              width 400px
              height 44px
              line-height 44px
              font-size 16px
              background #fff
              border-radius 4px
              border 1px solid #e7e8ec
              padding-left 30px
      .save
        margin 0 auto
        width 200px
        color #fff
        padding 10px 0
        border-radius 4px
        background-color #ffba14
        font-size 18px
        letter-spacing 4px
      .disableBtn
        cursor not-allowed
      .ableBtn
        cursor pointer

  .currency-one
    display flex
    flex-direction column
    align-items center
    height 460px
    margin-top 60px
    background #fff
    ul
      margin 0 auto
      width 600px
      li
        margin 60px 0
        display flex
        flex-direction row
        justify-content space-between
        span
          margin-top 12px
          font-size 16px
          color #1a1a1a
        input
          width 400px
          height 44px
          line-height 44px
          font-size 16px
          background #fff
          border-radius 4px
          border 1px solid #e7e8ec
          padding-left 30px
        .err-text
          width 400px
          margin-top 10px
          font-size 14px
          letter-spacing 1px
          color #999
    .save
      margin 0 auto
      width 200px
      color #fff
      padding 11px 0
      border-radius 4px
      background-color #ffba14
      font-size 18px
      letter-spacing 4px
    .disableBtn
      cursor not-allowed
    .ableBtn
      cursor pointer

  .currency-two
    padding-top 50px
    background #fff
    margin-top 60px
    display flex
    flex-direction column
    align-items center
    .input-group
      display flex
      flex-direction row
      span
        margin-top 12px
        font-size 16px
        color #1a1a1a
      .input-text-group
        input
          margin-left 70px
          width 400px
          height 44px
          line-height 44px
          font-size 16px
          background #fff
          border-radius 4px
          border 1px solid #e7e8ec
          padding-left 30px
        .err-text
          font-size 14px
          letter-spacing 1px
          margin 10px 0 0 70px
    .save
      margin 100px auto
      width 200px
      color #fff
      padding 11px 0
      border-radius 4px
      background-color #ffba14
      font-size 18px
      letter-spacing 4px
</style>
