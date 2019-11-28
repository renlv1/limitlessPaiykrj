<template>
  <!-- 交易所-->
  <div class="transaction-w">
    <div class="transaction-s">
      <!-- 左侧菜单-->
      <div class="left-menu">
        <ul>
          <li class="menu-list" :class="{'current-menu': currentMenuIndex === index}" v-for="(item, index) in menuData" :key="index" @click="switchMenu(index, item)">
            <div class="menu-box">
              <div class="img-box"><img :src="moneyImgUrl(item.secondCurrency)" alt=""></div>
              <span>{{item.secondCurrency}}/{{item.firstCurrency}}</span>
            </div>
            <div class="pir">
              <span>${{item.newPrice | fourNumber}}</span>
              <span class="riseRate" :class="{'zheng-price': item.riseRate >= 0, 'fu-price': item.riseRate < 0}">{{item.riseRate}}%</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 右边内容-->
      <div class="right-cont">
        <!--图表-->
        <div class="echarts-main">
          <!-- 图表头部 -->
          <div class="top-m">
            <span class="current-money">{{secondCurrency}}/{{firstCurrency}}</span>
            <span class="jisuan">{{headerData.vwapPrice}} USD ≈ {{headerData.cnyVwapPrice}} CNY</span>
            <span class="zhang">{{$t('digiccy.text1')}} </span>
            <span class="float" :class="{'plus': headerData.riseRate >= 0, 'minus': headerData.riseRate < 0}"> {{headerData.riseRate}}%</span>
            <span class="margin">{{$t('digiccy.text2')}} {{headerData.highPrice | fourNumber}}</span>
            <span class="margin">{{$t('digiccy.text3')}} {{headerData.lowPrice | fourNumber}}</span>
            <span>24H{{$t('digiccy.text4')}} {{headerData.volume}} {{firstCurrency}}</span>
          </div>
          <div class="chart-w">
            <div class="chart-t">
              <span class="list">{{$t('digiccy.text5')}}</span>
              <span v-for="(item, index) in timeArr" :key="index" class="list cursor" :class="{'current-time': currentIndex === index + 2}" @click="getKline(index + 2)">{{item}}</span>
            </div>
            <div class="chart-cont" id="myChart" ref="myChart"></div>
          </div>
        </div>
        <!--交易-->
        <div class="flex-wrap">
          <div class="left-wrap">
            <div class="form-left">
              <ul class="form-top">
                <li class="jiaoyi-list" :class="{'current-list': jiaoyiStatus === index + 1}" v-for="(item, index) in jiaoYiArr" :key="index" @click="jiaoyiTable(index + 1)">{{item}}</li>
              </ul>
              <div class="form-w-flex">
                <!--买入-->
                <div class="form-cont">
                  <div class="form-item">
                    <div class="form-label">{{$t('digiccy.text6')}}</div>
                    <div class="form-input buyin-input"><input type="text" v-model="currentPrice1" :disabled="isdisabled"><span class="usd">USD</span></div>
                  </div>
                  <div class="form-item">
                    <div class="form-label form-label-two">{{$t('digiccy.text7')}}</div>
                    <div class="form-input buyin-input"><input type="number" v-model="buyAmount1" @input="changeBuyNum('buyAmount1')"></div>
                  </div>
                  <p class="transaction-money">{{$t('digiccy.text8')}}：{{buyJiaoyi1}} USD</p>
                  <div class="err-class" v-if="errMsg1">{{errMsg1}}</div>
                  <div class="btn-buyIn btn-click" @click="buyInAmount(1)">{{$t('chongzhiTixian.text28')}}{{secondCurrency}}</div>
                  <p class="account-money">{{$t('digiccy.text9')}}：{{account.usdBalance}} USD</p>
                </div>
                <!--卖出-->
                <div class="form-cont">
                  <div class="form-item">
                    <div class="form-label">{{$t('digiccy.text10')}}</div>
                    <div class="form-input"><input type="text" v-model="currentPrice2" :disabled="isdisabled"><span class="usd">USD</span></div>
                  </div>
                  <div class="form-item">
                    <div class="form-label form-label-two">{{$t('digiccy.text11')}}</div>
                    <div class="form-input"><input type="number" v-model="buyAmount2" @input="changeBuyNum('buyAmount2')"></div>
                  </div>
                  <p class="transaction-money">{{$t('digiccy.text8')}}：{{buyJiaoyi2}} USD</p>
                  <div class="err-class" v-if="errMsg2">{{errMsg2}}</div>
                  <div class="btn-buyOut btn-click" @click="buyInAmount(2)">{{$t('chongzhiTixian.text29')}}{{secondCurrency}}</div>
                  <p class="charge-money" @click="$router.push('/account/recharge')">{{$t('digiccy.text12')}}</p>
                </div>
              </div>
            </div>
            <div class="left-flex">
            <ul class="table-top-uls">
              <li v-for="(item, index) in entrustArr" @click="getCoinEntrustList(index + 1)" :key="index" class="table-top-list" :class="{'current-list': entrustIndex === index + 1}">{{item}}</li>
            </ul>
            <ul class="table-uls-entrus table-uls-head">
              <li class="creatAt creatAt-head">{{$t('chongzhiTixian.text5')}}</li>
              <li>{{$t('chongzhiTixian.text11')}}</li>
              <li class="buy-status-list">{{$t('chongzhiTixian.text34')}}</li>
              <li>{{$t('chongzhiTixian.text12')}}（USD）</li>
              <li>{{$t('digiccy.text13')}}</li>
              <li>{{$t('digiccy.text25')}}</li>
              <li>{{$t('digiccy.text26')}}</li>
              <li>{{$t('bill.text8')}}</li>
            </ul>
            <ul class="table-uls-entrus table-uls-body" v-for="(list, index) in coinEntrustData" :key="index">
              <li class="creatAt">{{$changeDate(list.createAt)}}</li>
              <li>{{list.sellCurrency}}/{{list.buyCurrency}}</li>
              <li class="buy-status-in" v-if="list.etype === 1">{{$t('chongzhiTixian.text28')}}</li>
              <li class="buy-status-out" v-if="list.etype === 2">{{$t('chongzhiTixian.text29')}}</li>
              <li>{{list.price | fourNumber}}</li>
              <li>{{list.amount | fourNumber}}</li>
              <li>{{list.tradeAmount | fourNumber}}</li>
              <li>{{(list.amount - list.tradeAmount) | fourNumber}}</li>
              <li class="cursor red-color" v-if="entrustIndex === 1" @click="cancelEntrust(list.id)">{{$t('digiccy.text27')}}</li>
              <li class="cursor red-color" v-else @click="digitalCurrencyDitalis(list.id)">{{$t('bill.text19')}}</li>
            </ul>
              <div class="no-result" v-show="noResult">
                <div class="load-more-box">
                  <div class="loading-img">
                    <img src="../../assets/images/home/nodata.png" alt="">
                  </div>
                  <p class="desc">{{$t('myAccount.text1')}}</p>
                </div>
              </div>
          </div>
          </div>
          <!--最新价格-->
          <div class="newprice-right">
            <div class="newprice-top">{{$t('digiccy.text14')}}</div>
            <ul class="table-header">
              <li></li>
              <li>{{$t('chongzhiTixian.text12')}}</li>
              <li>{{$t('chongzhiTixian.text17')}}</li>
            </ul>
            <div class="sell-w" ref="sellWap">
              <div class="sell-h" ref="sellH">
                <ul class="table-cont" v-for="(sell, index) in sellData" :key="index" @click="limitOrder(1, sell.price)">
                  <div class="table-data">
                    <li class="sell-text">{{$t('digiccy.text15')}}{{indexNumber(sellData, index)}}</li>
                    <li>{{sell.price}}</li>
                    <li>{{sell.amount}}</li>
                  </div>
                  <div class="progless sell-table" :style="{'left': (1 - sell.amount / totalSell) * 100 + '%'}"></div>
                </ul>
              </div>
            </div>
            <div class="br-line"></div>
            <div class="buy-w">
              <ul class="table-cont" v-for="(buy, index) in buyData" :key="index + 1000" @click="limitOrder(2, buy.price)">
                <div class="table-data">
                  <li class="buy-text">{{$t('digiccy.text16')}}{{index + 1}}</li>
                  <li>{{buy.price}}</li>
                  <li>{{buy.amount}}</li>
                </div>
                <div class="progless buy-table" :style="{'left': (1 - buy.amount / totalBuy) * 100 + '%'}"></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--账户解锁弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('chongzhiTixian.text18')}}</h3>
          <p class="pay-price"></p>
          <h5 class="trade-password">{{$t('chongzhiTixian.text19')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword" :placeholder="$t('chongzhiTixian.text20')">
          <h5 class="trade-password">{{$t('chongzhiTixian.text21')}}</h5>
          <!--谷歌-->
          <div class="shortMsg">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode" :placeholder="$t('chongzhiTixian.text22')" type="number">
            </div>
          </div>
          <div class="errmsg-tips">{{payFailTip}}</div>
          <div class="pay-box">
            <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
            <!--买入卖出确定-->
            <button class="tradingCenter-btn" @click="confirmPay()" v-if="isCancelOrder">{{$t('chongzhiTixian.text24')}}</button>
            <!--撤单取消-->
            <button class="tradingCenter-btn" @click="confirmPay2()" v-if="!isCancelOrder">{{$t('chongzhiTixian.text24')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 未设置验证码-->
    <div class="myPopup" v-if="setSafeVerific">
      <div class="myPopup-box" >
        <div class="close" @click="setSafeVerific = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
    <!-- 文字弹窗-->
    <div class="myPopup" v-if="textDialog">
      <div class="myPopup-box" >
        <div class="close" @click="textDialog = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{textMsg}}</p>
        <div class="pay-box">
          <button class="tradingCenter-btn" @click="textDialog = false">{{$t('chongzhiTixian.text24')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/candlestick')
require('echarts/lib/chart/bar')

export default {
  data () {
    return {
      isCancelOrder: false,
      errMsg1: '',
      errMsg2: '',
      firstFlag: true,
      openLineData: [],
      closeLineData: [],
      timer: null,
      textMsg: '',
      textDialog: false,
      setSafeVerific: false,
      payPopupShow: false,
      payFailTip: '',
      payPassword: '',
      payCode: '',
      isdisabled: true,
      currentPrice1: '',
      currentPrice2: '',
      buyAmount1: '',
      buyAmount2: '',
      chartData: {
        columns: ['date', 'open', 'close', 'lowest', 'highest', 'vol'],
        rows: []
      },
      setting: {
        showDataZoom: true,
        start: 30,
        end: 100,
        downColor: '#3bad6b',
        upColor: '#f32954',
        dataType: 'KMB'
      },
      noResult: false,
      headerData: '', // 头部数据
      menuData: [],
      currentMenuIndex: 0,
      currentIndex: 1,
      jiaoyiStatus: 1,
      entrustIndex: 1,
      firstCurrency: '',
      totalBuy: 0,
      totalSell: 0,
      secondCurrency: '',
      coinEntrustData: [], // 委托
      buyData: [], // 最新价格 买
      sellData: [], // 最新价格 卖
      entrustArr: [this.$t('digiccy.text17'), this.$t('digiccy.text18')],
      jiaoYiArr: [this.$t('digiccy.text19'), this.$t('digiccy.text20')],
      isBuyInOut: 1,
      weituoId: '',
      timeArr: this.$t('digiccy.timeArr')
    }
  },
  created () {
    // this.getTradeCurrency()
    this.getCoinRiseRate()
    this.timer = setInterval(() => {
      this.firstFlag = false
      this.getNewPrice()
      this.getNewHeader()
      this.getKline(2)
    }, 10000)
    this.getCoinEntrustList(1)
  },
  methods: {
    moneyImgUrl (money) {
      if (money === 'л') {
        return require('../../assets/images/finance/LTC.png')
      } else {
        return require('../../assets/images/finance/' + money + '.png')
      }
    },
    // 委托详情
    digitalCurrencyDitalis (id) {
      this.$router.push({
        path: '/account/digicashOrder/digicashOrderDetail',
        query: {
          id: id
        }
      })
    },
    // 取消委托弹窗
    cancelEntrust (id) {
      this.weituoId = id
      if (this.userData.openGoogleCode !== 2) {
        this.setSafeVerific = true
      } else {
        this.payPopupShow = true
        this.isCancelOrder = false
      }
    },
    // 1.7 查询各币种涨跌度 接口URL: http://wallet.pigamegroup.com/coinvolume/coinRiseRate
    getCoinRiseRate () {
      this.$postAxios.post(`${this.$api}coinvolume/coinRiseRate`).then(res => {
        if (res.data.success === true) {
          this.menuData = res.data.data
          this.firstCurrency = this.menuData[0].firstCurrency
          this.secondCurrency = this.menuData[0].secondCurrency
          this.getNewPrice()
          this.getNewHeader()
          this.getKline(2)
        }
      })
    },
    // 取消委托二次弹窗
    confirmPay2 () {
      this.payFailTip = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        this.$postAxios.post(`${this.$api}tx/unlock`, {
          tradePwd: this.payPassword,
          mobileCode: this.payCode,
          codeType: '1'
        }).then(res => {
          if (res.data.success === true) {
            this.$postAxios.post(`${this.$api}coinentrust/coinEntrustCancel`, {
              coinEntrustId: this.weituoId
            }).then(res => {
              this.payPopupShow = false
              this.textDialog = true
              this.getCoinEntrustList(1)
              if (res.data.success === true) {
                this.textMsg = this.$t('digiccy.text28')
              } else {
                this.textMsg = res.data.msg
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    // 关闭图标
    closeIcon () {
      this.setSafeVerific = false
      this.payPopupShow = false
      this.payFailTip = ''
      this.payPassword = ''
      this.payCode = ''
    },
    // 最新价格点击
    limitOrder (type, price) {
      this.jiaoyiStatus = 2
      this.currentPrice1 = ''
      this.currentPrice2 = ''
      if (type === 1) {
        this.currentPrice1 = price
      } else {
        this.currentPrice2 = price
      }
    },
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
    // 买入、卖出
    buyInAmount (index) {
      this.isCancelOrder = true
      this.errMsg1 = ''
      this.errMsg2 = ''
      if (this.userData.openGoogleCode !== 2) {
        this.setSafeVerific = true
      } else {
        if (index === 1) {
          if (this.buyAmount1 === '') {
            this.errMsg1 = this.$t('digiccy.text21')
          }
          if (this.currentPrice1 === '') {
            this.errMsg1 = this.$t('digiccy.text22')
          }
          if (this.buyJiaoyi1 > 0 && this.buyAmount1 > 0 && this.currentPrice1 > 0) {
            this.payPopupShow = true
          }
        } else {
          if (this.buyAmount2 === '') {
            this.errMsg2 = this.$t('digiccy.text23')
          }
          if (this.currentPrice2 === '') {
            this.errMsg2 = this.$t('digiccy.text24')
          }
          if (this.buyJiaoyi2 > 0 && this.buyAmount2 > 0 && this.currentPrice2 > 0) {
            this.payPopupShow = true
          }
        }
      }
      this.isBuyInOut = index
    },
    confirmPay () {
      this.payFailTip = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        let data = {
          eType: this.isBuyInOut, // short	(必填)委托类型 1: 买入 2:卖出
          firstCurrency: this.firstCurrency, // string	(必填)货币对第一币种
          secondCurrency: this.secondCurrency, // string	(必填)货币对第二币种
          priceType: this.jiaoyiStatus // short	(必填)1市价 2限价
        }
        if (this.isBuyInOut === 1) {
          data.amount = this.buyAmount1 // (必填)数量
        } else {
          data.amount = this.buyAmount2 // (必填)数量
        }
        if (this.jiaoyiStatus === 2) { //	(必填)委托价格(市价不传，限价传)
          if (this.isBuyInOut === 1) {
            data.price = this.currentPrice1
          } else {
            data.price = this.currentPrice2
          }
        }
        this.$postAxios.post(`${this.$api}tx/unlock`, {
          tradePwd: this.payPassword,
          mobileCode: this.payCode,
          codeType: '1'
        }).then(res => {
          if (res.data.success === true) {
            this.$postAxios.post(`${this.$api}coinentrust/coinEntrust`, data).then(res => {
              this.textDialog = true
              this.payPopupShow = false
              if (res.data.success === true) {
                if (this.isBuyInOut === 2) {
                  this.textMsg = this.$t('digiccy.text29')
                } else {
                  this.textMsg = this.$t('digiccy.text30')
                }
              } else {
                this.textMsg = res.data.msg
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    // 1.6 查询支持交易的货币对列表
    // 接口URL: http://wallet.pigamegroup.com/coinaccount/queryCoinTradeCurrency
    getTradeCurrency () {
      this.$postAxios.post(`${this.$api}coinaccount/queryCoinTradeCurrency`).then(res => {
        if (res.data.success === true) {
          this.menuData = res.data.data
          this.firstCurrency = this.menuData[0].firstCurrency
          this.secondCurrency = this.menuData[0].secondCurrency
          this.getNewPrice()
          this.getNewHeader()
          this.getKline(2)
        }
      })
    },
    // 1.8 查询货币对的最新行情数据[交易页面头部数据] http://wallet.pigamegroup.com/coinvolume/queryNewCoinTradeVolume
    getNewHeader () {
      this.$postAxios.post(`${this.$api}coinvolume/queryNewCoinTradeVolume`, {
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency
      }).then(res => {
        if (res.data.success === true) {
          this.headerData = res.data.data
        }
      })
    },
    // 1.5 新交易买卖委托列表(买卖5)
    // 接口URL: http://wallet.pigamegroup.com/coinentrust/queryCoinBookOffer
    getNewPrice () {
      this.$postAxios.post(`${this.$api}coinentrust/queryCoinBookOffer`, {
        count: '40',
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency
      }).then(res => {
        if (res.data.success === true) {
          this.buyData = res.data.data.buy
          let totalBuy = 0
          this.buyData.forEach((item) => {
            totalBuy += item.amount
          })
          this.totalBuy = totalBuy
          this.sellData = res.data.data.sell
          let totalSell = 0
          this.sellData.forEach((item) => {
            totalSell += item.amount
          })
          this.totalSell = totalSell
          // this.$refs.sellWap.scrollTop = 1000000
          if (this.sellData.length > 15) {
            this.$refs.sellWap.scrollTop = this.$refs.sellWap.scrollHeight
          }
          if (this.jiaoyiStatus === 1) {
            this.currentPrice1 = this.sellData[0].price
            this.currentPrice2 = this.buyData[0].price
          }
        }
      })
    },
    // 1.3 新交易查询用户个人委托列表【未完成/已完成订单】 历史委托、当前委托
    // 接口URL: http://wallet.pigamegroup.com/coinentrust/queryCoinEntrustList
    getCoinEntrustList (state) {
      this.coinEntrustData = []
      this.entrustIndex = state
      this.$postAxios.post(`${this.$api}coinentrust/queryCoinEntrustList`, {
        state: state,
        pageIndex: '1',
        pageSize: '20'
      }).then(res => {
        if (res.data.success === true) {
          this.coinEntrustData = res.data.data
          if (this.coinEntrustData.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
        }
      })
    },
    switchMenu (index, item) {
      this.buyAmount1 = ''
      this.buyAmount2 = ''
      this.currentMenuIndex = index
      this.firstCurrency = item.firstCurrency
      this.secondCurrency = item.secondCurrency
      this.getNewPrice()
      this.getNewHeader()
      this.getKline(2)
    },
    jiaoyiTable (index) {
      this.jiaoyiStatus = index
      this.buyAmount1 = ''
      this.buyAmount2 = ''
      if (index === 1) {
        this.currentPrice1 = this.sellData[0].price
        this.currentPrice2 = this.buyData[0].price
        this.isdisabled = true
      } else {
        this.currentPrice1 = ''
        this.currentPrice2 = ''
        this.isdisabled = false
      }
    },
    getKline (index) {
      this.currentIndex = index
      this.$postAxios.post(`${this.$api}coinvolume/queryCoinTradeKLine`, {
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency,
        dateType: index
      }).then(res => {
        if (res.data.success === true) {
          let lineArr = []
          let ret = res.data.data
          let openData = []
          let closeData = []
          ret.forEach((item) => {
            let obj = []
            obj.push(this.$changeDate(item.createAt, '-', 9))
            obj.push(item.openPrice)
            obj.push(item.closePrice)
            obj.push(item.lowPrice)
            obj.push(item.highPrice)
            obj.push(item.volume)
            lineArr.push(obj)
            openData.push(item.openPrice)
            closeData.push(item.closePrice)
          })
          this.openLineData = openData.reverse()
          this.closeLineData = closeData.reverse()
          lineArr = lineArr.reverse()
          this.kLineData = this.splitData(lineArr)
          this.drawLine()
        }
      })
    },
    splitData (rawData) {
      var categoryData = []
      var values = []
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0])
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData,
        values: values
      }
    },
    drawLine () {
      let upColor = '#f32954'
      let upBorderColor = '#f32954'
      let downColor = '#3bad6b'
      let downBorderColor = '#3bad6b'
      // 基于准备好的dom，初始化echarts实例
      // let myChart = echarts.init(document.getElementById('myChart'))
      let myChart = echarts.init(this.$refs.myChart)
      // 绘制图表
      myChart.setOption({
        grid: {
          top: '5%',
          left: '60',
          right: '3%',
          bottom: '10%'
        },
        xAxis: {
          data: this.kLineData.categoryData,
          axisLine: {
            lineStyle: {
              color: '#646466',
              width: 1
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        yAxis: {
          // min: 0,
          // max: 80,
          // splitNumber: 10,
          scale: true, // Y轴起始值为数据的最小值
          splitLine: {
            lineStyle: {
              color: '#e5e5e5',
              width: 1
            }
          },
          axisLine: {
            lineStyle: {
              color: '#646466',
              width: 1
            }
          }
        },
        dataZoom: {
          type: 'inside',
          start: 0,
          end: 100
        },
        series: [{
            type: 'candlestick',
            data: this.kLineData.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            }
          }
        ]
      })
      window.onresize = function () {
        myChart.resize()
      }
    },
    unAmount (list) {
      if (list.amount) {
        return (list.amount - list.tradeAmount).toFixed(4)
      }
    },
    // 倒序输出
    indexNumber (data, index) {
      return data.length - index
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    ...mapGetters([
      'account',
      'userData'
    ]),
    buyJiaoyi1 () {
      return Number(this.currentPrice1 * this.buyAmount1).toFixed(4)
    },
    buyJiaoyi2 () {
      return Number(this.currentPrice2 * this.buyAmount2).toFixed(4)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sell-w,.buy-w
  height 480px
  overflow-y auto
.sell-h
  height: auto
.err-class
  font-size: 14px;
  color: #e93a3a;
  margin: -24px 0 5px
.sell-text
  color #F75050
.buy-text
  color #36ce88
.no-result
  text-align: center
  color #e93a3a
  margin-top: 20px
.transaction-w
  width: 100%
  /*max-width: 1920px;*/
  .transaction-s
    display: flex
    width: 100%;
    padding-right: 58px
    margin: 10px auto 0;
  .left-menu
    width: 290px
    min-width 290px
    border-top: 1px solid #d7d9db
    border-right: 1px solid #d7d9db
    margin-right: 10px
    background-color: #fff
    .menu-list
      display flex
      flex-direction column
      justify-content center
      padding-left: 40px
      height: 80px
      font-size: 16px
      color #1a1a1a
      background-color: #fff
      cursor pointer
      position: relative
      &.current-menu
        background-color: #fff7e5
        &::before
          content ''
          position: absolute
          display: block
          left: 0
          top: 0
          width: 4px
          height: 100%
          background-color: #ffba14
      .menu-box
        display flex
        align-items center
      .img-box
        width: 24px
        height: 24px
        margin-right: 20px
        img
          display block
          width: 100%
          height: 100%
      .pir
        margin-top: 10px
        .riseRate
          margin-left: 20px
          &.zheng-price
            color #36ce88
          &.fu-price
            color #fc534c
  .right-cont
    width: 100%
    /*max-width 1650px*/
    .echarts-main
      .top-m
        height: 48px
        display: flex
        align-items center
        background-color: #f5f5f7
        color #1a1a1a
        .current-money
          color #1a1a1a
          padding: 0 20px
          font-size: 20px
          font-weight: bold
        .jisuan
          font-size: 20px
          color #1a1a1a
        .zhang
          font-size: 14px
          margin-left: 30px
        .float
          margin-right: 30px
          margin-left: 10px
          &.plus
            color #36ce88
          &.minus
            color #f75050
        .margin
          margin-right: 30px
      .chart-w
        padding-top: 10px
        border: 1px solid #d7d9db
        border-top: none
        background-color: #fff
        .chart-t
          display flex
          align-items center
          .list
            width: 56px
            height: 28px
            font-size: 12px
            color #1a1a1a
            display flex
            align-items center
            justify-content center
            margin-right: 10px
            &.current-time
              background-color: #ffba14
              color #fff
        .chart-cont
          height: 480px
          width: 100%
    .flex-wrap
      display flex
      margin-top: 10px
      .left-wrap
        display flex
        flex-direction column
        flex 1
      .form-left
        margin-right: 10px
        .form-top
          height: 48px
          width: 100%
          padding-left: 30px
          background-color: #f5f5f7
          display: flex
          align-items center
          .jiaoyi-list
            padding: 0 5px 2px 5px
            color #666
            margin-right: 70px
            height: 100%
            line-height: 100%
            display: flex
            align-items center
            justify-content center
            cursor pointer
            &.current-list
              color #4B84FF
              border-bottom: 2px solid #4B84FF
              padding-bottom: 0
        .form-w-flex
          height: 420px
          display: flex
          background-color: #fff
          .form-cont
            width: 50%
            padding: 38px 15px 0
            .form-item
              .form-label
                font-size: 14px
                color #666
                margin-bottom: 10px
                &.form-label-two
                  margin-top: 30px
              .form-input
                width: 100%
                height: 48px
                display flex
                align-items center
                border-radius 4px
                border: 1px solid #e7e8ec
                background-color: #fff
                &.buyin-input
                  background-color: #fdfdfe
                input
                  border none
                  display: block
                  padding: 0 15px
                  color #666
                  font-size: 14px
                  flex 1
                  height: 100%
                .usd
                  font-size: 14px
                  color #666
                  margin-right: 20px
            .transaction-money
              font-size: 14px
              color #666
              margin: 10px 0 28px
            .btn-click
              width: 100%
              height: 44px
              font-size: 14px
              color #fff
              border-radius 4px
              margin-bottom: 10px
              display: flex
              align-items center
              justify-content center
              cursor pointer
              &.btn-buyIn
                background-color: #36ce88
              &.btn-buyOut
                background-color: #f75050
            .charge-money
              font-size: 14px
              color #f75050
              cursor pointer
            .account-money
              font-size: 14px
              color #666
      .left-flex
        margin-right: 10px
        margin-top: 10px
        background-color: #fff
        flex 1
        min-height 400px
        .table-top-uls
          height: 48px;
          width: 100%;
          padding-left: 30px;
          background-color: #f5f5f7;
          display: flex;
          align-items: center;
          .table-top-list
            padding: 0 5px;
            color: #666;
            margin-right: 70px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.current-list
              color #4b84ff
              border-bottom: 2px solid #4b84ff
        .table-uls-entrus
          display flex
          align-items center
          @media screen and (max-width: 1350px)
            font-size: 12px
          &.table-uls-head
            height: 48px
          &.table-uls-body
            height: 40px
          li
            flex 1
            word-break:keep-all;
            white-space:nowrap;
            padding-left: 20px
          .buy-status-list
            flex 0.5
          .creatAt
            width: 200px
            padding-left: 30px
            flex none
            @media screen and (max-width: 1700px)
              width: 150px
              padding-left: 20px
          .creatAt-head
            color #36ce88
          .buy-status-out
            color #f75050
            flex 0.5
          .buy-status-in
            color #36ce88
            flex 0.5
      .newprice-right
        width: 560px
        background-color: #fff
        @media screen and (max-width: 1650px)
          width: 300px
        .newprice-top
          padding-left: 30px
          height: 48px
          line-height: 48px
          background-color: #f5f5f7
        .table-header
          display: flex
          align-items center
          justify-content center
          margin-bottom: 2px
          li
            flex 1
            height: 38px
            display: flex
            align-items center
            justify-content center
        .table-cont
          position: relative
          margin-bottom: 2px
          height: 30px
          cursor pointer
          &:hover
            background-color: #fafafa
          .table-data
            position: absolute
            width: 100%
            height: 30px
            display: flex
            align-items center
            justify-content center
            z-index: 10
          .progless
            height: 30px
            position: absolute
            right: 0
            top: 0
            &.sell-table
              background-color: #feeded
            &.buy-table
              background-color: #ebfaf3
          li
            flex 1
            height: 30px
            display: flex
            align-items center
            justify-content center
        .br-line
          border-top: 1px solid #e7e8ec
          margin: 8px 0
    .flex-item-two
      display: flex
      min-height: 362px
      .left-flex
        margin-right: 10px
        background-color: #fff
        .table-top-uls
          height: 48px;
          width: 1050px;
          padding-left: 30px;
          background-color: #f5f5f7;
          display: flex;
          align-items: center;
          .table-top-list
            padding: 0 5px;
            color: #666;
            margin-right: 70px;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.current-list
              color #4b84ff
              border-bottom: 2px solid #4b84ff
        .table-uls-entrus
          display flex
          align-items center
          &.table-uls-head
            height: 48px
          &.table-uls-body
            height: 40px
          li
            flex 1
            word-break:keep-all;
            white-space:nowrap;
            padding-left: 20px
          .creatAt
            width: 240px
            padding-left: 30px
            flex none
          .creatAt-head
            color #36ce88
          .buy-status-out
            color #f75050
          .buy-status-in
            color #36ce88
      .right-table
        flex: 1
        background-color: #fff
        .table-top
          padding-left: 30px;
          height: 48px;
          line-height: 48px;
          background-color: #f5f5f7;
        .table-uls
          padding-left: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e7e8ec
          &:hover
            background-color: #fafafa
          &:last-child,&.table-uls-header
            border-bottom none
          li
            flex: 1;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.buy-in
              color #36ce88
            &.buy-out
              color #f75050
</style>
