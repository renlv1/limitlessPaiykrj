<template>
  <div class="accountMoney">
    <div class="goodsParticular-box">
      <div class="goodsParticular-content">
        <div class="goodsParticular-title">
          <h6>
            <router-link :to="{path: '/setSharePay', query:{address: userData.address}}" class="property">{{$t('setSharePay.text6')}} <span style="margin:0 10px"> > </span></router-link>
            <router-link to="/accountMoney" class="property">{{$t('setSharePay.text13')}}</router-link>
            <span style="margin:0 10px">> </span><i> {{this.$route.query.currency}}{{$t('setSharePay.text33')}}</i>
          </h6>
        </div>
        <div class="title-box">
          <div class="accountMoney-title">{{$t('setSharePay.text13')}}</div>
          <div class="btn-add" @click="addAccount()"><span>{{$t('setSharePay.text34')}}</span></div>
        </div>
        <div class="account-box">
          <div class="" v-loading.lock="fullscreenLoading" :element-loading-text="$t('dialog.text19')"></div>
          <div class="null-data" v-show="emptyData">
            {{$t('setSharePay.text35')}}{{this.$route.query.currency}}{{$t('setSharePay.text33')}}
          </div>
          <ul>
            <li v-for="(item,index) in bankAccountList" :key="index">
              <div class="account-type">
                <div class="name-box">
                  <div class="bank-icon"><i :style="{backgroundImage:'url('+ picAddress +')'}"></i></div>
                  <div class="bank-name">{{item.bankName}}</div>
                </div>
                <div class="account-num">{{item.accountNumber}}</div>
              </div>
              <div class="right-box" @click="delAccount(item, index)">
                <img src="../../assets/images/accountInfo/delete.png" alt="">
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--移除账户弹窗-->
    <div class="account-dialog" v-show="delAccountShow">
      <div class="myPopup-box">
        <a class="close" @click="delAccountShow = false"><img src="../../assets/images/home/Shutdown.png" alt=""></a>
        <h3 class="dialog-title">{{$t('setSharePay.text36')}}</h3>
        <ul>
          <li>
            <div class="account-type">
              <div class="bank-icon"><i :style="{backgroundImage:'url('+ picAddress +')'}"></i><span>{{bankName}}</span></div>
              <div class="bank-name">{{accountName}}</div>
            </div>
            <div class="down-box">
              {{accountNumber}}
            </div>
          </li>
        </ul>
        <button class="tradingCenter-btn" @click="deleteBtn()">{{$t('setSharePay.text37')}}</button>
      </div>
    </div>
    <!--添加新账户弹窗-->
    <div class="add-dialog" v-show="addAccountShow">
      <div class="myPopup-box">
        <a class="close" @click="closeIcon()"><img src="../../assets/images/home/Shutdown.png" alt=""></a>
        <h3 class="dialog-title">{{$t('setSharePay.text38')}}{{this.$route.query.currency}}{{$t('setSharePay.text33')}}</h3>
        <div class="" v-loading.lock="fullscreenLoading2" :element-loading-text="$t('dialog.text19')"></div>
        <div class="null-data" v-show="emptyBankData">
          {{$t('setSharePay.text35')}}{{this.$route.query.currency}}{{$t('setSharePay.text33')}}
        </div>
        <ul>
          <li v-for="(item,index) in NewBankList" :key="index">
            <div class="dialog-box">
              <div class="account-type">
                <div class="bank-icon"><i :style="{backgroundImage:'url('+ picAddress +')'}"></i><span>{{item.bankName}}</span></div>
                <div class="bank-name">{{item.realName}}</div>
              </div>
              <div class="down-box">{{item.accountNumber}}</div>
            </div>
            <div class="check-box">
              <div @click="chooseBox(item, index)" :class="{checkActive: item.flag === true}" class="choose-account"></div>
            </div>
          </li>
        </ul>
        <div class="null-data">{{msgTip}}</div>
        <button class="tradingCenter-btn" ref="addAccount" @click="confirmAdd" :class="{disableBtn: forbidden}" v-show="noBankData">{{$t('setSharePay.text42')}}</button>
      </div>
    </div>
    <!-- 添加成功弹窗 -->
    <el-dialog :visible.sync="centerDialogVisble" width="30%" center >
      <span>{{$t('setSharePay.text39')}}</span>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn">
          <el-button @click="sureBtn">{{$t('setSharePay.text40')}}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        msgTip: '', // 添加账户的错误提示
        forbidden: true,
        fullscreenLoading: true, // 默认加载
        fullscreenLoading2: true, // 默认加载
        emptyBankData: false, // 判断弹窗的数据是否为空
        emptyData: false,
        delAccountShow: false,
        addAccountShow: false,
        checkBox: false,
        checked: [],
        bankAccountList: [], // 已有的账户信息的列表
        coinImg: '', // 图标
        currLi: '', // 獲取當前的li
        noBankData: false, // 银行列表为0
        variable: 'http://ofjn5cjui.bkt.clouddn.com/', // 拼接字符串需要的变量
        NewBankList: [], // 弹窗里面的账户信息银行列表
        accountType: '', // 账户类型
        pageIndex: 1,
        pageSize: 20,
        currentPage: 1,
        totalCount: 0, // 获取当前数据的总条数
        picAddress: '', // 图片
        bankIdsArr: [], // 已有账户信息列表的ID
        bankIds: [], // 选择添加账户信息的ID
        bankIds2: '', // 传给后台的参数
        NewbankIdsArr: [], // 已有的账户信息和添加的账户信息拼成一个数组
        bankName: '', // 银行名称
        accountName: '', // 开户名
        accountNumber: '', // 账号
        delBankId: '', // 删除账户的ID
        currencyIndex: '',
        centerDialogVisble: false, // 添加成功弹窗
        joinFlag: false
      }
    },
    mounted() {
      this.getQueryCoinList()
      setTimeout(() => {
        this.chooseDiffentBankList()
      }, 30)
    },
    methods: {
      // 1.5 查询共享者币种设置列表
      // 接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList
      getQueryCoinList() { // 查询币种列表
        this.$http.post(`${this.$api2}pigame/queryBossSupportCurrencyList`).then((res) => {
          if (res.data.status === 'success') {
            this.fullscreenLoading = false
            let queryCoinList = res.data.data
            for (let i = 0; i < queryCoinList.length; i++) {
              if (queryCoinList[i].currency === this.$route.query.currency) {
                  if (queryCoinList[i].bossCurrency.bankAccountList === null) {
                    this.emptyData = true
                  } else {
                    this.bankAccountList = queryCoinList[i].bossCurrency.bankAccountList // 获取共享设置已有的账户信息列表
                    for (let i = 0; i < this.bankAccountList.length; i++) {
                      if (this.bankAccountList.length) {
                        this.bankIdsArr.push(this.bankAccountList[i].id) // 把已有的共享设置账户信息ID添加到数组里
                    }
                  }
                }
              }
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      chooseDiffentBankList() {
        let currency = this.$route.query.currency
        if (currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW') {
          this.accountType = 1
        } else if (currency === 'BTC') {
          this.accountType = 6
        }
        this.getBankList(1)
      },
      // 4.2 查询银行帐户列表
      // 接口URL: http://boss.pigamegroup.com/account/list
      getBankList(page) {
        this.$http.post(`${this.$api2}/account/list?currency=${this.$route.query.currency}&country=''&accountType=${this.accountType}&pageIndex=${page}&pageSize=${this.pageSize}`).then((res) => {
          if (res.data.status === 'success') {
            this.fullscreenLoading2 = false
            this.noBankData = true
            this.emptyBankData = false
            this.bankList = res.data.data.list
            this.totalCount = res.data.data.totalCount
            this.bankList.forEach(val => {
              val.flag = false
            })
            this.NewBankList = this.bankList // 点击添加新账户弹窗显示获取我的收款账户列表
            if (res.data.data.list.length !== 0) {
              for (let i = 0; i < this.NewBankList.length; i++) {
                this.picAddress = this.variable + this.NewBankList[i].coinImg
              }
            } else {
              this.noBankData = false
              this.emptyBankData = true
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 1.7 共享者币种币种支持充值支持的银行或虚拟币信息
      // 接口URL: http://boss.pigamegroup.com/pigame/bossSupprtCurrencyBank
      // 确认添加账户
      confirmAdd() {
        this.$http.post(`${this.$api2}pigame/bossSupprtCurrencyBank?currency=${this.$route.query.currency}&bankIds=${this.bankIds2}`).then((res) => {
          if (res.data.status === 'success') {
            this.centerDialogVisble = true
            this.emptyData = false
            this.addAccountShow = false
            for (let i = 0; i < this.NewBankList.length; i++) {
              if (this.NewBankList[i].flag) {
                this.bankAccountList.push(this.NewBankList[i]) // 把选择的账户加到共享设置已有的账户信息列表
                this.bankIdsArr = [] // 把已有的共享设置账户信息ID数组清空
              }
            }
            this.getQueryCoinList()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 1.9 删除共享者支持的银行卡
      // 接口URL: http://boss.pigamegroup.com/pigame/delSupprtCurrencyBank
      // 确认移除账户
      deleteBtn() {
        this.$http.post(`${this.$api2}pigame/delSupprtCurrencyBank?currency=${this.$route.query.currency}&bankId=${this.delBankId}`).then(res => {
          if (res.data.status === 'success') {
            this.bankAccountList.splice(this.currencyIndex, 1)
            this.delAccountShow = false
            for (let i = 0; i < this.bankIdsArr.length; i++) {
              if (this.bankIdsArr[i] === Number(this.delBankId)) {
                this.bankIdsArr.splice(this.currencyIndex, 1)
              }
            }
            for (let i = 0; i < this.NewbankIdsArr.length; i++) {
              if (this.NewbankIdsArr[i] === Number(this.delBankId)) {
                this.NewbankIdsArr.splice(this.currencyIndex, 1)
              }
            }
          }
          if (this.bankAccountList.length === 0) {
            this.emptyData = true
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 点击添加账户
      addAccount() {
        this.forbidden = true
        this.$refs.addAccount.disabled = true
        this.addAccountShow = true
        this.bankIds = [] // 将添加账户信息的ID数组清空
        this.msgTip = ''
        for (let i = 0; i < this.NewBankList.length; i++) {
          if (this.NewBankList[i].flag) {
            this.NewBankList[i].flag = !this.NewBankList[i].flag
          }
        }
      },
      // 点击移除账户
      delAccount(item, index) {
        this.delAccountShow = true
        this.delBankId = item.id // 删除的ID
        this.currencyIndex = index
        this.bankName = item.bankName
        this.accountName = item.realName
        this.accountNumber = item.accountNumber
      },
      // 选择添加账户
      chooseBox(item, index) {
        item.flag = !item.flag
        if (item.flag) {
          this.msgTip = ''
          this.bankIds.push(item.id) // 将账户信息的ID添加到数组
        } else {
          for (let i = 0; i < this.bankIds.length; i++) {
            if (this.bankIds[i] === item.id) { // 如果包含就删除
              this.bankIds.splice(i, 1)
            }
          }
        }
        for (let i = 0; i < this.bankIds.length; i++) {
          if (this.bankAccountList.length) {
            for (let j = 0; j < this.bankAccountList.length; j++) {
              if (this.bankIds[i] === this.bankAccountList[j].id) { // 如果收款账户的ID和共享设置已有的账户信息列表的ID相同
                this.msgTip = this.$t('setSharePay.text41')
                this.forbidden = true
                this.$refs.addAccount.disabled = true
                return false
              } else if (this.bankIds[i] !== this.bankAccountList[j].id) {
                this.joinFlag = true
                this.$refs.addAccount.disabled = false
                this.forbidden = false
              }
            }
            if (this.joinFlag) {
              this.msgTip = ''
              this.forbidden = false
              this.$refs.addAccount.disabled = false
            } else {
              this.forbidden = true
              this.$refs.addAccount.disabled = true
              this.msgTip = this.$t('setSharePay.text41')
          }
          }
        }
        // for (let i = 0; i < this.bankAccountList.length; i++) {
        //   console.log(this.bankIds, this.bankAccountList)
        //   console.log(this.bankIds.indexOf(this.bankAccountList[i].id))
        //   if (this.bankIds.indexOf(this.bankAccountList[i].id) === 0) {
        //     // this.joinFlag = false
        //     this.msgTip = '已有相同的账户，请重新添加'
        //     return false
        //   } else {
        //     this.joinFlag = true
        //   }
        // }
        // if (this.joinFlag) {
        //   console.log(this.joinFlag)
        //   this.msgTip = ''
        // } else {
        //   console.log(this.joinFlag)
        //   this.msgTip = '已有相同的账户，请重新添加'
        // }
        this.NewbankIdsArr = Array.from(new Set(this.bankIdsArr.concat(this.bankIds))) // 已有的账户信息和添加的账户信息拼成一个数组
        this.bankIds2 = this.NewbankIdsArr.join(',') // 将数组转换成字符串
        if (this.bankIds.length) {
          this.$refs.addAccount.disabled = false
          this.forbidden = false
        } else {
          this.msgTip = ''
          this.forbidden = true
          this.$refs.addAccount.disabled = true
        }
        this.joinFlag = false
      },
      sureBtn () {
        this.centerDialogVisble = false
        this.bankIds = []
      },
      closeIcon () {
        this.addAccountShow = false
        this.bankIds = []
      }
    },
    created() {
      // if (this.$route.query.bankAccountList) {
      //   this.bankAccountList = this.$route.query.bankAccountList
      //   console.log(this.$route.query.bankAccountList.length)
      // } else {
      //   this.bankAccountList = 0
      // }
      this.coinImg = this.$route.query.coinImg + this.variable
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
        h6
          a
            font-size 16px
            color #1a1a1a
      .accountMoney-title
        margin-bottom 60px
      .title-box
        display flex
        justify-content space-between
        .accountMoney-title
          font-size 34px
          color #1a1a1a
          font-weight bold
        .btn-add
          width 200px
          height 50px
          background-color #ffba14
          border-radius 4px
          text-align center
          cursor pointer
          outline none
          user-select none
          span
            line-height 50px
            color #fff
            font-size 18px
      .account-box
        ul
          width 100%
          display flex
          flex-wrap wrap
          li
            width 450px
            height 120px
            border-radius 4px
            background-color #fcfcfc
            border 1px solid #e7e8ec
            display flex
            align-items center
            justify-content space-between
            margin-bottom 24px
            margin-right 24px
            padding 0 30px 0 20px
            @media screen and (max-width: 1300px)
              width 400px
            .account-type
              .name-box
                display flex
                align-items center
                margin-bottom 20px
                .bank-icon
                  margin-right 10px
                  width 50px
                  height 50px
                  i
                    width 50px
                    height 50px
                    display inline-block
                    background-repeat: no-repeat;
                    background-size: cover;
                .bank-name
                  font-size 16px
                  color #1a1a1a
              .account-num
                font-size 16px
                color #1a1a1a
            .right-box
              cursor pointer
              outline none
              user-select none
              width 20px
              height 20px

  .add-dialog
    width 100%
    height 100%
    display flex
    align-items center
    justify-content center
    position fixed
    left 0
    top 0
    background-color rgba(0, 0, 0, 0.5)
    z-index 99
    .myPopup-box
      width 600px
      height 500px
      background-color #fff
      padding 60px 60px 170px
      border-radius 12px
      position relative
      .close
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        z-index: 999;
        cursor: pointer;
        user-select none
      .dialog-title
        text-align center
        font-size 20px
        color #1a1a1a
        font-weight bold
      ul
        width 100%
        max-height 100%
        overflow: auto
        height auto
        padding-right 10px
        li
          font-size 16px
          color #1a1a1a
          margin-top 40px
          margin-bottom 30px
          width 100%
          height 100px
          border-radius 4px
          border 1px solid #e7e8ec
          background-color #fff
          display flex
          .dialog-box
            padding 0 20px
            display flex
            flex-direction column
            justify-content center
            width 90%
            height 100%
            border-right 1px solid #e7e8ec
            .account-type
              display flex
              align-items center
              justify-content space-between
              margin-bottom 10px
              .bank-icon
                width 80%
                height 50px
                display flex
                align-items center
                i
                  margin-right 10px
                  width 50px
                  height 50px
                  display inline-block
                  background-repeat: no-repeat;
                  background-size: cover;
          .check-box
            display flex
            align-items center
            padding-left 12px
            .choose-account
              width 16px
              height 16px
              border-radius 4px
              border 1px solid #c4c6cc
              cursor pointer
              outline none
              user-select none
              &.checkActive
                &:before
                  content ''
                  background-image url("../../assets/images/accountInfo/selected.png")
                  background-position center
                  background-repeat no-repeat
                  display block
                  width 16px
                  height 16px
      .disableBtn
        cursor not-allowed
      .tradingCenter-btn
        margin-top 20px
</style>
