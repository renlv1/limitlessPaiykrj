<template>
  <div class="paiWallet">
    <h3>{{$t('chongzhiTixian.text44')}}</h3>
    <div class="userInfo">
      <div class="info-top">
        <span>{{$t('finance.text15')}}</span>
      </div>
      <div class="info-center">
        <span>{{formatMoney(account.usdBalance).split('.')[0]}}.</span><b>{{formatMoney(account.usdBalance).split('.')[1]}}</b><i> USD</i>
      </div>
      <div class="info-bottom">
        <span @click="$router.push('/account/transferAccounts')">{{$t('finance.text16')}}</span>
        <span @click="$router.push('/account/recharge')">{{$t('chongzhiTixian.text45')}}</span>
        <span @click="$router.push('/account/withdraw')">{{$t('chongzhiTixian.text47')}}</span>
      </div>
    </div>
    <div class="record">
      <h6>{{$t('finance.text17')}}</h6>
      <div class="tab">
        <span :class="{'active': tabIndex === 0}" @click="changeTab(0)">{{$t('chongzhiTixian.text45')}}</span>
        <span :class="{'active': tabIndex === 1}" @click="changeTab(1)">{{$t('chongzhiTixian.text47')}}</span>
      </div>
      <table class="shareTableList">
        <tr>
          <td style="flex: 2">{{$t('finance.text24')}}</td>
          <td style="flex: 2.4">{{$t('chongzhiTixian.text5')}}</td>
          <td style="flex: 2.8">{{$t('bill.text25')}}</td>
          <td style="flex: 2">{{$t('chongzhiTixian.text35')}}</td>
          <td style="flex: 2">{{$t('orderStatus.text0')}}</td>
          <td style="flex: 1.9">{{$t('bill.text8')}}</td>
        </tr>
        <v-loading v-show="loadingShow"></v-loading>
        <div class="no-result" v-show="noResult">
          <div class="load-more-box">
            <div class="loading-img">
              <img src="../../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('myAccount.text1')}}</p>
          </div>
        </div>
        <tr @click="viewDetail(item.id, item.orderState, item.payState)" v-for="(item, index) in cashValueList" :key="index">
          <td style="flex: 2">{{item.id}}</td>
          <td style="flex: 2.4">{{$changeDate(item.createAt)}}</td>
          <td style="flex: 2.8">{{item.amount | formattingMoney}}{{item.currency}}</td>
          <td style="flex: 2" v-if="item.bossNick === '未选择共享者'">{{$t('orderStatus.text10')}}</td>
          <td style="flex: 2" v-else>{{item.bossNick}}</td>
          <td style="flex: 2">{{$orderTipMsg(item.tipMsg, item.typeTitle, tabIndex, item)}}</td>
          <td style="flex: 1.9" class="red-color">{{$t('bill.text9')}}</td>
        </tr>
      </table>
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
      <!--<div class="page"><span @click="toPage('pre')">上一页</span><i>{{pageIndex}}</i><span @click="toPage('next')">下一页</span></div>-->
    </div>
    <!--转出弹窗-->
    <div class="pop-box" v-if="outFlag">
      <div class="dialogBox">
        <h5>{{$t('finance.text18')}}</h5>
        <div class="content">
          <p><input type="text" :placeholder="$t('finance.text19')"><i>π</i></p>
          <span>{{$t('finance.text20')}}<i>50000π</i></span>
        </div>
        <div class="btn">{{$t('chongzhiTixian.text24')}}</div>
      </div>
    </div>
    <!--转入弹窗-->
    <div class="pop-box" v-if="transferFlag">
      <div class="dialogBox">
        <h5>{{$t('finance.text21')}}</h5>
        <div class="content">
          <p><input type="text" :placeholder="$t('finance.text22')"><i>π</i></p>
          <span>{{$t('finance.text20')}}<i>50000π</i>,{{$t('finance.text23')}}</span>
        </div>
        <div class="btn">{{$t('chongzhiTixian.text24')}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      loadingShow: true,
      noResult: false,
      totalPage: 0,
      outFlag: false, // 转出弹窗
      transferFlag: false,
      tabIndex: 0,
      pageIndex: 1,
      pageSize: 10,
      cashValueList: []
    }
  },
  mounted () {
    this.queryMyDepositOrderList()
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  methods: {
    ...mapActions([
      'getUserBalance'
    ]),
    parentTurnPage (page) { // 页码
      this.pageIndex = page
      if (this.tabIndex === 0) {
        this.queryMyDepositOrderList()
      } else {
        this.queryMyOrderList()
      }
    },
    // tab切换
    changeTab (index) {
      this.tabIndex = index
      this.pageIndex = 1
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      if (index === 1) {
        this.queryMyOrderList()
      } else {
        this.queryMyDepositOrderList()
      }
    },
    // 派钱包App 》 充值提现 》 1.82 查询提现记录 /draw/queryMyOrderList
    queryMyOrderList () {
      let url = `${this.$api2}draw/queryMyOrderList?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.cashValueList = res.data.data.list
          this.totalPage = res.data.data.totalPage
          if (this.cashValueList.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
//          if (res.data.data.list.length === 0 && this.pageIndex > 1) {
//            this.pageIndex = this.pageIndex - 1
//            this.queryMyOrderList()
//          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 派钱包App 》 充值提现 》 1.83 查询充值记录 /deposit/queryMyOrderList
    queryMyDepositOrderList () {
      let url = `${this.$api2}deposit/queryMyOrderList?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          this.cashValueList = res.data.data.list
          this.totalPage = res.data.data.totalPage
          if (this.cashValueList.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
//          if (res.data.data.list.length === 0 && this.pageIndex > 1) {
//            this.pageIndex = this.pageIndex - 1
//            this.queryMyDepositOrderList()
//          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查看详情
    viewDetail (id, status, payState) {
      // 跳转到提现
      if (this.tabIndex === 1) {
        this.$router.push({
          path: '/account/orderCashValue/tiXianOrderDetail',
          query: {
            id: id,
            isChongzhi: this.tabIndex
          }
        })
      } else {
        // 跳转到充值
        this.$router.push({
          path: '/account/orderCashValue/rechargeOrderDetail',
          query: {
            id: id,
            isChongzhi: this.tabIndex
          }
        })
      }
    },
    toPage (type) {
      if (type === 'pre') {
        if (this.pageIndex > 1) {
          this.pageIndex--
          if (this.tabIndex === 0) {
            this.queryMyDepositOrderList()
          } else {
            this.queryMyOrderList()
          }
        }
      } else if (type === 'next') {
        this.pageIndex++
        if (this.tabIndex === 0) {
          this.queryMyDepositOrderList()
        } else {
           this.queryMyOrderList()
        }
      }
    },
    formatMoney (value, tag = ',') {
      if (!value) {
        return '0.0000'
      } else {
        if (!isNaN(value) && value !== null) {
          if (value < 0) {
            value = Math.abs(value)
            let f = Math.floor(value * 100) * 100 / 10000
            let _value = f.toString()
            let rs = _value.indexOf('.')
            if (rs < 0) {
              rs = _value.length
              _value += '.'
            }
            while (_value.length <= rs + 4) {
              _value += '0'
            }
            let newStr = _value.split('.')
            if (newStr[0].length <= 3) {
              return newStr[0] + '.' + newStr[1]
            }
            let r = newStr[0].length % 3
            _value = r > 0 ? newStr[0].slice(0, r) + tag + newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag) : newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag)
            _value = _value + '.' + newStr[1]
            return '-' + _value
          } else {
            let f = Math.floor(value * 100) * 100 / 10000
            let _value = f.toString()
            let rs = _value.indexOf('.')
            if (rs < 0) {
              rs = _value.length
              _value += '.'
            }
            while (_value.length <= rs + 4) {
              _value += '0'
            }
            let newStr = _value.split('.')
            if (newStr[0].length <= 3) {
              return newStr[0] + '.' + newStr[1]
            }
            let r = newStr[0].length % 3
            _value = r > 0 ? newStr[0].slice(0, r) + tag + newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag) : newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag)
            _value = _value + '.' + newStr[1]
            return _value
          }
        }
      }
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .paiWallet{
    background-color: #fafafc;
    width: 100%;
    padding: 60px;
    h3{
      font-size: 34px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 60px;
    }
    .userInfo{
      width: 750px;
      background-color: #fff;
      border: 1px solid #e7e8ec;
      border-radius: 4px;
      padding: 20px 30px;
      margin-bottom: 60px;
      .info-top{
        display: flex;
        margin-bottom: 20px;
        i{
          display: block;
          width: 34px;
          height: 34px;
          background-color: #ccc;
          border-radius: 50%;
          margin-right: 20px;
        }
        span{
          color: #1a1a1a;
          font-size: 20px;
        }
      }
      .info-center{
        margin-bottom: 45px;
        text-align: left;
        span{
          color: #1a1a1a;
          font-size: 30px;
        }
        i{
          color: #ffba14;
          font-size: 20px;
        }
        b{
          font-size: 20px;
          color: #1a1a1a;
        }
      }
      .info-bottom{
        display: flex;
        justify-content: space-between;
        span{
          width: 210px;
          height: 50px;
          border: 1px solid transparent;
          border-radius: 4px;
          display: block;
          text-align: center;
          line-height: 50px;
          color: #fff;
          cursor: pointer;
          user-select: none;
          &:active{
            opacity: 0.4;
          }
          &:nth-child(1) {
            background-color: #e93a3a;
          }
          &:nth-child(2) {
            background-color: #36ce88;
          }
          &:nth-child(3) {
            background-color: transparent;
            color: #1a1a1a;
            border: 1px solid #ffba14;
          }
        }
      }
    }
  }
  .record{
    width: 100%;
    .tab{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ffba14;
      span{
        width: 200px;
        height: 45px;
        display: inline-block;
        text-align: center;
        color: #1a1a1a;
        line-height: 45px;
        cursor: pointer;
        user-select: none;
        &.active{
          background-color: #ffba14;
          color: #fff;
        }
      }
    }
    h6{
      font-size: 20px;
      color: #1a1a1a;
      font-weight:bold;
      line-height: 50px;
      height: 50px;
      margin-bottom: 10px;
    }
    table{
      width: 100%;
      tr{
        cursor: pointer;
      }
    }

  }
</style>
