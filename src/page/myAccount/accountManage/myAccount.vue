<template>
  <div class="wrapper-account">
    {{$t('myAccountNav.text1')}} > {{$t('myAccountNav.text2')}}
    <h2>{{$t('setSharePay.text13')}}</h2>
    <div class="trading-address-container">
      <span class="address-container-title"> {{$t('transfer.text12')}}：</span>
      <span id="copy_text" class="address-container-value">{{account.address}}</span>
      <span class="address-container-btn" data-clipboard-action="copy" data-clipboard-target="#copy_text" @click="copy">{{$t('transfer.text13')}}</span>
    </div>
    <h4>{{$t('transfer.text14')}}</h4>
    <!-- 个人资产列表 -->
    <ul>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img01.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{$t('transfer.text15')}}</div>
          <div class="assets-value">{{account.fundBalance | fourNumber}} {{$t('transfer.text20')}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img02.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{$t('myAccountNav.text13')}}</div>
          <div class="assets-value">{{userData.paiPurseBalance | fourNumber}} π</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img05.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{$t('transfer.text16')}}</div>
          <div class="assets-value">{{account.usdBalance | fourNumber}} USD</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img04.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{$t('transfer.text17')}}</div>
          <div class="assets-value">{{account.voucherBalance | fourNumber}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img06.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{$t('transfer.text18')}}</div>
          <div class="assets-value">{{balances[0] | fourNumber}} π</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img07.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[1]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[1] | fourNumber}} {{currencys[1]}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img08.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[2]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[2] | fourNumber}} {{currencys[2]}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/finance/ETH.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[3]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[3] | fourNumber}} {{currencys[3]}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img09.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[4]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[4] | fourNumber}} {{currencys[4]}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img10.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[5]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[5] | fourNumber}} {{currencys[5]}}</div>
        </div>
      </li>
      <li>
        <div class="assets-left">
          <img src="../../../assets/images/account/img10.png"/>
        </div>
        <div class="assets-right">
          <div class="assets-title">{{currencys[6]}}{{$t('transfer.text19')}}</div>
          <div class="assets-value">{{balances[6] | fourNumber}} {{currencys[6]}}</div>
        </div>
      </li>
    </ul>
    <h4>{{$t('transfer.text21')}}</h4>
    <div class="assets-wrapper">
      <div class="tab-wrapper">
        <!--<div @click="changeTab(index)" :class="{active: currentIndex === index}" class="assets-tab" v-for="(item, index) in tabsTitle" :key="item.index">{{item}}</div>-->
        <div @click="changeTab(0)" :class="{active: currentIndex === 0}" class="assets-tab">{{$t('setSharePay.text4')}} ({{TopUpLength}})</div>
        <div @click="changeTab(1)" :class="{active: currentIndex === 1}" class="assets-tab">{{$t('setSharePay.text5')}} ({{drawLength}})</div>
        <div @click="changeTab(2)" :class="{active: currentIndex === 2}" class="assets-tab">{{$t('home.text1')}} ({{infiniteLength}})
        </div>
        <div @click="changeTab(3)" :class="{active: currentIndex === 3}" class="assets-tab">{{$t('header.text2')}}
          ({{queryCoinEntrustLength}})
        </div>
        <!-- 是共享者才显示共享者订单 -->
        <div v-if="userData.isboss === 1" @click="changeTab(4)" :class="{active: currentIndex === 4}" class="assets-tab">{{$t('myAccountNav.text19')}} ({{drawSharersCount +
          depositSharersCount}})
        </div>
      </div>
      <div class="table-container">
        <!-- 充值内容 -->
        <table v-show="currentIndex === 0">
          <thead>
          <tr>
            <td v-for="(item,index) in topUpHead" :key="index">
              {{item.title}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in topUpList" :key="item.index">
            <td>{{item.id}}</td>
            <td>{{item.amount | formattingMoney}} {{item.currency}}</td>
            <td v-if="item.bossNick === '未选择共享者'">{{$t('orderStatus.text10')}}</td>
            <td v-else>{{item.bossNick}}</td>
            <td>{{$changeDate(item.createAt, '-')}}</td>
            <td>{{$orderTipMsg(item.tipMsg, item.typeTitle, 0, item)}}</td>
            <td class="changeRed" @click="$router.push({path: '/account/orderCashValue/rechargeOrderDetail', query: {id: item.id, isChongzhi: 0}})">{{$t('bill.text9')}}</td>
          </tr>
          </tbody>
          <div class="null-data" v-if="topUpList.length === 0">
            {{$t('myAccount.text1')}}
          </div>
          <v-turnPage v-if="topUpList.length !== 0" :propsPage="totalPage1" @orderLogTrunPage="topUpTurnPage"
                      ref="turnPage1"></v-turnPage>
        </table>
        <!-- 提现内容 -->
        <table v-show="currentIndex === 1">
          <thead>
          <tr>
            <td v-for="(item,index) in withdrawalHead" :key="index">
              {{item.title}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in drawList" :key="item.index">
            <td>{{item.id}}</td>
            <td>{{item.amount | formattingMoney}} {{item.currency}}</td>
            <td v-if="item.bossNick === '未选择共享者'">{{$t('orderStatus.text10')}}</td>
            <td v-else>{{item.bossNick}}</td>
            <td>{{$changeDate(item.createAt, '-')}}</td>
            <td>{{$orderTipMsg(item.tipMsg, item.typeTitle, 1, item)}}</td>
            <td class="changeRed" @click="$router.push({path: '/account/orderCashValue/tiXianOrderDetail', query: {id: item.id, isChongzhi: 1}})">{{$t('bill.text9')}}</td>
          </tr>
          </tbody>
          <div class="null-data" v-if="drawList.length === 0">
            {{$t('myAccount.text1')}}
          </div>
          <v-turnPage v-if="drawList.length !== 0" :propsPage="totalPage2" @orderLogTrunPage="drawTurnPage"
                      ref="turnPage2"></v-turnPage>
        </table>
        <!-- 代理商竞拍内容 -->
        <table v-show="currentIndex === 2">
          <thead>
          <tr>
            <td v-for="(item,index) in agentHead" :key="index">
              {{item.title}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in infiniteBidList" :key="item.index">
            <td>{{item.infiniteSaleProduct.id}}</td>
            <td>{{item.infiniteSaleProduct.productName}}</td>
            <td>{{item.infiniteSaleProduct.nowBidPrice}}</td>
            <td>{{item.infiniteSaleProduct.merchantName}}</td>
            <td>{{item.infiniteSaleProduct.productUserName}}</td>
            <td class="changeRed"
                @click="$router.push({path: '/goodsParticular', query: {id: item.infiniteSaleProduct.id}})">查看详情
            </td>
          </tr>
          </tbody>
          <div class="null-data" v-if="infiniteBidList.length === 0">
            {{$t('myAccount.text1')}}
          </div>
          <v-turnPage v-if="infiniteBidList.length !== 0" :propsPage="totalPage3"
                      @orderLogTrunPage="infiniteTurnPage" ref="turnPage3"></v-turnPage>
        </table>
        <!-- 数字货币交易内容 -->
        <table v-show="currentIndex === 3">
          <thead>
          <tr>
            <td v-for="(item,index) in digitalHeade" :key="index">
              {{item.title}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in queryCoinEntrustList" :key="item.index" @click="$router.push({path: '/account/digicashOrder/digicashOrderDetail', query: {id: item.id}})">
            <td>{{item.id}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount - item.tradeAmount}}</td>
            <td>{{changeEtype(item.etype)}}</td>
            <td class="changeRed">{{$changeDate(item.createAt, '-')}}</td>
          </tr>
          </tbody>
          <div class="null-data" v-if="queryCoinEntrustLength === 0">
            {{$t('myAccount.text1')}}
          </div>
          <v-turnPage v-if="queryCoinEntrustLength !== 0" :propsPage="totalPage4" @orderLogTrunPage="DigitalCoinTradingTurnPage"
                      ref="turnPage4"></v-turnPage>
        </table>
        <!-- 共享者订单 -->
        <table v-show="currentIndex === 4">
          <thead>
          <tr>
            <td v-for="(item,index) in sharersHead" :key="index">
              {{item.title}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in sharersList" :key="item.index">
            <td>{{item.id}}</td>
            <td>{{item.amount | formattingMoney}} {{item.currency}}</td>
            <td>{{item.userNick}}</td>
            <td>{{$changeDate(item.createAt, '-')}}</td>
            <td>{{changeText5(item, item.type)}}</td>
            <td>{{changeToText(item.type)}}</td>
            <td class="changeRed" @click="toDetailShare(item.type, item.id)">{{$t('bill.text9')}}</td>
          </tr>
          </tbody>
          <div class="null-data" v-if="(drawSharersCount + depositSharersCount) === 0">
            {{$t('myAccount.text1')}}
          </div>
          <v-turnPage v-if="(drawSharersCount + depositSharersCount) !== 0" :propsPage="totalPage5"
                      @orderLogTrunPage="parentTurnPage" ref="turnPage5"></v-turnPage>
        </table>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{$t('transfer.text22')}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">{{$t('dialog.text14')}}</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import Clipboard from 'clipboard'

  export default {
    data() {
      return {
        // 充值
        topUpHead: this.$t('transfer.topUpHead'),
        // 提现
        withdrawalHead: this.$t('transfer.withdrawalHead'),
        // 代理商竞拍
        agentHead: this.$t('transfer.agentHead'),
        // 数字货币交易
        digitalHeade: this.$t('transfer.digitalHeade'),
        // 共享者订单
        sharersHead: this.$t('transfer.sharersHead'),
        currentIndex: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        totalPage1: 0,
        totalPage2: 0,
        totalPage3: 0,
        totalPage4: 1,
        totalPage5: 0,
        currentPage: 1, // 默认当前页为1
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        startDate: '1997-10-10', // 查询充值记录(开始时间 参数)
        endDate: '2118-10-10', // 查询充值记录(结束时间 参数)
        orderState: '',
        balances: [], // 我的账户信息中下面七个li的余额
        currencys: [], // 我的账户信息中下面七个li的单位
        topUpList: [], // 我的账户里面充值记录列表
        TopUpLength: 0, // 我的账户里面充值记录列表总的长度
        drawList: [], // 我的账户里面提现记录列表
        drawLength: 0, // 我的账户里面提现记录列表总的长度
        infiniteBidList: [], // 竞价列表
        queryCoinEntrustList: [], // 数字货币交易列表
        queryCoinEntrustLength: 0, // 数字货币订单总条数
        drawSharersCount: 0, // 提现共享者订单总条数
        depositSharersCount: 0, // 充值共享者订单总条数
        infiniteLength: 0, // 代理商总条数
        totalRecord: 0, // 充提共享者订单
        sharersList: [], // 共享者订单
        drawSharersList: [], // 提现共享者订单
        depositSharersList: [], // 充值共享者订单
        dialogVisible: false // 复制文本弹窗
      }
    },
    created() {
      this.getCoinUserAccount()
      this.getTopUp(1)
      this.getDraw(1)
      this.infinite(1)
      this.DigitalCoinTrading(1)
      this.drawSharers()
      this.depositSharers()
    },
    components: {
      vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
    },
    computed: {
      ...mapGetters([
        'account', // 用户信息
        'userData'
      ])
    },
    methods: {
      copy () {
        let clipboard = new Clipboard('.address-container-btn')
        clipboard.on('success', e => {
          console.info('Action:', e.action)
          console.info('Text:', e.text)
          console.info('Trigger:', e.trigger)
          this.dialogVisible = true
          e.clearSelection()
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy()
        })
      },
      toDetailShare(type, id) {
        if (type === 0) { // 跳转到提现页面
          this.$router.push({path: 'sharerOrder/withdraw', query: {id: id}})
        } else if (type === 1) { // 跳转到充值页面
          this.$router.push({path: 'sharerOrder/shareRechargeOrderDetail', query: {id: id}})
        }
      },
      changeText1(item) {
        if (item.orderState === 2 && item.payState === 1) {
          return this.$t('orderStatus.text8')
        } else if (item.orderState === 1 && item.payState === 1) {
          return this.$t('orderStatus.text9')
        } else {
          return item.tipMsg
        }
      },
      changeText2(item, chongzhi) {
        if (chongzhi) {
          if (chongzhi === 1 && item.payState === 1 && item.orderState === 2) {
            return this.$t('orderStatus.text1')
          } else {
            if (item.tipMsg.indexOf(',') === 0) {
              return item.tipMsg.splice(0, 1)
            } else {
              return item.tipMsg
            }
          }
        }
      },
      changeText5(item, chongzhi) {
        if (chongzhi > -1) {
          if (chongzhi === 1 && item.payState === 1 && item.orderState === 2) {
            return this.$t('orderStatus.text1')
          } else {
            if (item.tipMsg.indexOf(',') === 0) {
              return item.tipMsg.splice(0, 1)
            } else {
              return item.tipMsg
            }
          }
        }
      },
      changeToText(num) {
        if (num === 1) {
          return this.$t('setSharePay.text4')
        } else if (num === 0) {
          return this.$t('setSharePay.text5')
        }
      },
      changeEtype(num) {
        if (num === 1) {
          return this.$t('chongzhiTixian.text28')
        } else if (num === 2) {
          return this.$t('chongzhiTixian.text29')
        }
      },
      ...mapActions([
        'getUserBalance'
      ]),
      changeTab(index) {
        this.currentIndex = index
        if (index === 0) {
          if (this.$refs.turnPage1) {
            this.$refs.turnPage1.resetPage(1)
          }
          this.getTopUp(1)
        } else if (index === 1) {
          if (this.$refs.turnPage2) {
            this.$refs.turnPage2.resetPage(1)
          }
          this.getDraw(1)
        } else if (index === 2) {
          if (this.$refs.turnPage3) {
            this.$refs.turnPage3.resetPage(1)
          }
          this.infinite(1)
        } else if (index === 3) {
          if (this.$refs.turnPage4) {
            this.$refs.turnPage4.resetPage(1)
          }
          this.DigitalCoinTrading(1)
        } else if (index === 4) {
          if (this.$refs.turnPage5) {
            this.$refs.turnPage5.resetPage(1)
            this.concatSharersList()
          }
        }
      },
      topUpTurnPage(page) {
        this.currentPage = page
        this.getTopUp(page)
      },
      drawTurnPage(page) {
        this.currentPage1 = page
        this.getDraw(page)
      },
      infiniteTurnPage(page) {
        this.currentPage2 = page
        this.infinite(page)
      },
      DigitalCoinTradingTurnPage(page) {
        this.currentPage3 = page
        this.DigitalCoinTrading(page)
      },
      parentTurnPage(page) { // 页码
        this.currentPage4 = page
        // this.getTopUp(page)
        // this.getDraw(page)
        // this.infinite(page)
        // this.DigitalCoinTrading(page)
        this.concatSharersList(page)
      },
      // 查询最新余额 接口地址 http://boss.pigamegroup.com/user/balance
      // 查询用户多种货币 接口地址 http://boss.pigamegroup.com/coinaccount/queryCoinUserAccount
      getCoinUserAccount() {
        this.$http.post(`${this.$api}coinaccount/queryCoinUserAccount`).then((res) => {
          if (res.data.success === true) {
            let presonBalance = res.data.data
            for (let i = 0; i < presonBalance.length; i++) {
              this.balances.push(presonBalance[i].balance)
              this.currencys.push(presonBalance[i].currency)
            }
          }
        })
      },
      // 查询充值记录
      getTopUp(page) {
        this.$http.post(`${this.$api2}deposit/queryMyOrderList?pageIndex=${page}&pageSize=${this.pageSize}&isFinish=2`).then((res) => {
          if (res.data.status === 'success') {
            this.topUpList = res.data.data.list // 充值记录列表
            this.totalPage1 = res.data.data.totalPage
            this.TopUpLength = res.data.data.totalCount
          }
        })
      },
      // 查询提现
      getDraw(page) {
        this.$http.post(`${this.$api2}draw/queryMyOrderList?pageIndex=${page}&pageSize=${this.pageSize}&isFinish=2`).then((res) => {
          if (res.data.status === 'success') {
            this.drawList = res.data.data.list // 提现记录列表
            this.totalPage2 = res.data.data.totalPage
            this.drawLength = res.data.data.totalCount
          }
        })
      },
      // 代理商竞拍
      infinite(page) {
        this.$http.post(`${this.$api2}infinite/queryMyBidRecordList?pageIndex=${page}&pageSize=${this.pageSize}&queryType=1`).then((res) => {
          if (res.data.status === 'success') {
            this.infiniteBidList = res.data.data.infiniteBidList
            this.totalPage3 = res.data.data.totalPage
            this.infiniteLength = res.data.data.totalCount
          }
        })
      },
      // 数字货币交易--只查未完成
      DigitalCoinTrading(page) {
        this.$http.post(`${this.$api}coinentrust/queryCoinEntrustList?pageIndex=${page}&pageSize=${this.pageSize}&state=1`).then((res) => {
          if (res.data.status === 'success') {
            this.totalPage4 = res.data.mapData.totalPage
            if (res.data.data.length !== 0) {
              this.queryCoinEntrustLength = res.data.mapData.totalCount
              this.queryCoinEntrustList = res.data.data // 数字货币交易列表
            }
          }
        })
      },
      // 提现共享者订单
      drawSharers() {
        this.$http.post(`${this.$api2}draw/queryMyOrderList?pageIndex=1&pageSize=10000&isFinish=2&orderType=pigame`).then((res) => {
          if (res.data.status === 'success') {
            this.drawSharersList = res.data.data.list
            this.drawSharersCount = res.data.data.totalCount
            this.drawSharersList.forEach(item => {
              item.type = 0
            })
            // console.log(this.drawSharersList)
          }
        })
      },
      // 充值共享者订单
      depositSharers() {
        this.$http.post(`${this.$api2}deposit/queryMyOrderList?pageIndex=1&pageSize=10000&isFinish=2&orderType=pigame`).then((res) => {
          if (res.data.status === 'success') {
            this.depositSharersList = res.data.data.list
            this.depositSharersCount = res.data.data.totalCount
            this.depositSharersList.forEach(item => {
              item.type = 1
            })
          }
        })
      },
      concatSharersList(page) {
        this.totalRecord = this.drawSharersList.concat(this.depositSharersList).length
        this.sharersList = this.drawSharersList.concat(this.depositSharersList).splice((page - 1) * this.pageSize, this.pageSize)
        this.totalPage5 = Math.ceil(this.totalRecord / this.pageSize)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrapper-account
    h2
      margin-top 30px
      font-weight bold
    .trading-address-container
      position relative
      height 60px
      width 1000px
      margin-top 50px
      display flex
      flex-direction row
      align-items center
      border-bottom 1px dotted #ccc
      .address-container-value
        position absolute
        right 100px
      .address-container-btn
        color #ffba14
        cursor pointer
        user-select none
        position absolute
        right 0
    h4
      font-weight bold
      margin 50px 0 20px
    ul
      width 100%
      display flex
      flex-wrap wrap
      min-width 1200px
      li
        display flex
        flex-direction row
        align-items center
        margin 0 40px 40px 0
        width 22%
        height 130px
        float left
        padding 0 28px
        border 1px solid #e7e8ec
        box-shadow 0 0 5px #e7e8ec
        border-radius 4px
        &:hover
          cursor pointer
          border none
          box-shadow 0 0 5px #ffba14
        &:active
          opacity 0.6
          user-select none
        .assets-left
          img
            width 60px
            height 60px
            border-radius 100%
            margin-right 30px
        @media screen and (max-width: 1900px)
          margin-right 20px
        .assets-right
          .assets-title
            font-size 18px
            margin-bottom 10px
            color #1a1a1a
          .assets-value
            font-size 18px
            font-weight bold
            span
              color #ffba14
    .assets-wrapper
      .tab-wrapper
        height 60px
        line-height 60px
        display flex
        flex-direction row
        border-bottom 1px solid #ffba14
        justify-content space-between
        .assets-tab
          flex 1
          text-align center
          &:hover
            cursor pointer
          &:active
            user-select none
            opacity 0.6
        .active
          color #fff
          border-radius 4px 4px 0 0
          background #ffba14
</style>
