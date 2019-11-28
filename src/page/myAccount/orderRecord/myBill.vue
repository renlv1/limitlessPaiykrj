<template>
  <div class="myaccount-bill">
    <!--我的账单-->
    <h3 class="my-title">{{$t('bill.text1')}}</h3>
    <div class="flex-form">
      <span class="bold">{{$t('bill.text2')}}</span>
      <div class="input-box">
        <el-date-picker
          v-model="startTime"
          :picker-options="pickerBeginDateBefore"
          format="yyyy-MM-dd"
          type="date"
          :placeholder="$t('bill.text3')">
        </el-date-picker>
      </div>
      <span class="text-l">{{$t('bill.text4')}}</span>
      <div class="input-box">
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="pickerBeginDateAfter"
          format="yyyy-MM-dd"
          :placeholder="$t('bill.text3')">
        </el-date-picker>
      </div>
      <div class="line"></div>
      <span class="bold">{{$t('chongzhiTixian.text34')}}</span>
      <div class="select-w">
        <div class="select-box" @click="isSelectBox = !isSelectBox">
          <div>{{currentStatus}}</div>
          <div class="icon" :class="{'rotate-icon': isSelectBox}"></div>
        </div>
        <ul class="select-uls" :class="{'maxheight-box2': isSelectBox}">
          <li class="select-list" v-for="(item, index) in statusArr" :key="index" @click="checkOne(item, index)">{{item}}</li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="send-cha" @click="sendPageOne()">{{$t('bill.text5')}}</div>
    </div>
    <div class="table-wrapper">
      <ul class="table-uls">
        <li class="table-list">{{$t('bill.text35')}}</li>
        <li class="table-list">{{$t('bill.text2')}}</li>
        <li class="table-list">{{$t('chongzhiTixian.text34')}}</li>
        <li class="table-list">{{$t('bill.text6')}}</li>
        <li class="table-list">{{$t('bill.text7')}}</li>
        <li class="table-list">{{$t('bill.text8')}}</li>
      </ul>
      <v-loading v-show="loadingShow"></v-loading>
      <ul class="table-uls cursor" v-for="(item, index) in orderData" :key="index" @click="gotoDetails(item, paymentTypeOrder(item.paymentType, item.orderType), plusOrMin(item.receiveAddress))">
        <li class="table-list">{{item.id}}</li>
        <li class="table-list">{{$changeDate(item.createAt)}}</li>
        <li class="table-list">{{paymentTypeOrder(item.paymentType, item.orderType, item.remark)}}</li>
        <li class="table-list">{{plusOrMin(item.receiveAddress)}}{{item.amount | fourNumber}} <span v-if="item.currency === 'PAI'">π</span><span v-else>{{item.currency}}</span></li>
        <li class="table-list">{{orderState(item.state)}}</li>
        <li class="table-list point-info red-color">{{$t('bill.text9')}}</li>
      </ul>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('bill.text10')}}!</p>
        </div>
      </div>
    </div>
    <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      totalPage: 0,
      pend: false,
      current_page: 1,
      loadingShow: true,
      noResult: false,
      currentStatus: this.$t('bill.text11'),
      isSelectBox: false,
      //        日期控件
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endTime
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.startTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      orderStatus: 0,
      statusArr: this.$t('billStatus.statusArr'), // 1 转账 2：交易 3：充值提现 4：埋包 5：寻宝
      orderData: [],
      startTime: '',
      endTime: '',
      pages: ''
    }
  },
  created () {
    this.gotoPage(1)
    /*
    *  receiveAddress !=  userAddress 变化金额为 - 否则 为 +
    *
    * orderType(1),TRADE(2),MONEY_BOSS(3),MINE_GAME(4),SCAN_MINE(5),HEROCARD(6),REDENVELOPE(7),PRODUCT(8),
      // 13 申请连环派 14 用户地块拍出交易
      SHOPMINE(9),STOCK(10),WORLD_MAP(11),WORLD_MAP_PROFITASSIGN(12),ApplyGiveArLink(13),WORLD_MAP_TRADE(14),
      //15 AR夺宝 16 余额宝 17 基金交易  18 第三方商城交易   20派运之星提成 22 派誉之星订单
      ARGAME(15),YUEBAO(16),FUND_TRADE(17),THIRD_TRADE(18),PAI_TO_DISCOVERY(19),LUCKSTARUNIT(20),OPENPLATFORM_TRADE(21),TRUST_ORDER(22),
      //23 商家保证金 24 生态餐券  26 服务中心补贴  27 连锁商家订单
      MERCHANT_BAIL(23),VOUCHER_ENTRUST(24),VOUCHER_TRADE(25),SUBSIDY_ORDER(26),CHAIN_ORDER(27),
      //27 广告位竞拍  28 数字交易委托  29 数字交易  30 第三方付款码 31 红包功能
      ADVERTISE_BID(27),COIN_ENTRUST(28),COIN_TRADE(29),THIRD_CODE(30),LUCK_MONEY(31),
      //32 第三方平台转账   33 ICO认购发行 34 微博钱包 35 区块链投票箱
      OPEN_TO_DISCOVERY(32),ICO_BUY_ISSUE(33),WEIBO_PURSE(34),BLOCK_CHAIN_VOTE(35),
      // 36 开通AI机器人 37团购订单 38无限竞派
      OPEN_AI_ROBOT(36),GROUP_SHOP(37),INFINITE(38);
    * */
  },
  methods: {
    sendPageOne () {
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.gotoPage(1)
    },
    parentTurnPage (page) { // 页码
      this.current_page = page
      this.gotoPage(page)
    },
    gotoDetails (item, leixing, zhengfu) {
      let data = {
        leixing: leixing,
        id: item.id,
        amount: item.amount,
        time: item.createAt,
        currency: item.currency,
        zhengfu: zhengfu,
        orderId: item.id
      }
      this.$router.push({
        path: '/account/myBill/billDetail',
        query: {
          dataInfo: JSON.stringify(data)
        }
      })
    },
    // 获取订单列表
    gotoPage (page) {
      this.current_page = page
      let dataObj = {
        page: page,
        pageSize: '20'
      }
      if (this.startTime) {
        dataObj.startDate = this.$changeDate(this.startTime, '-')
      }
      if (this.endTime) {
        dataObj.endDate = this.$changeDate(this.endTime, '-', 3)
      }
      if (this.orderStatus !== 0 && this.orderStatus !== 6) {
        dataObj.orderType = this.orderStatus
      }
      if (this.orderStatus === 6) {
        dataObj.orderType = 38
      }
      this.$postAxios.post(`${this.$api}tx/transactionlist`, dataObj).then(res => {
        this.loadingShow = false
        if (res.data.success === true) {
          this.orderData = res.data.data
          this.totalPage = res.data.mapData.totalPage
          if (this.orderData.length < 20) {
            this.pend = true
          } else {
            this.pend = false
          }
          if (this.orderData.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
        }
      })
    },
    checkOne (item, index) {
      this.orderStatus = index
      this.currentStatus = item
      this.isSelectBox = false
    },
    // 变化金额 + -
    plusOrMin (type) {
      if (type === this.userData.address) {
        return '+'
      } else {
        return '-'
      }
    },
    // 状态
    orderState (state) {
      if (state === 0) {
        return this.$t('bill.text12')
      }
      if (state === 2) {
        return this.$t('bill.text13')
      }
      if (state === 4) {
        return this.$t('bill.text14')
      }
    },
    // 类型
    paymentTypeOrder (status, orderType, remark) {
      if (status === 1 && orderType === 3) {
        if (remark) {
          if (remark.indexOf('充值') > -1) {
            return this.$t('bill.text36')
          }
          if (remark.indexOf('提现') > -1) {
            return this.$t('bill.text37')
          }
        } else {
          return this.$t('bill.text38') // 充值提现订单
        }
      }
      if (status === 1) {
        return this.$t('billStatus.text1') // 转账
      }
      if (status === 2 && orderType === 3) {
        return this.$t('billStatus.text01') // 订单退款
      }
      if (status === 2) {
        return this.$t('billStatus.text2') // 收款
      }
      if (status === 4 && orderType === 3) {
        return this.$t('billStatus.text02') // 申请共享者
      }
      if (status === 11) {
        return this.$t('billStatus.text3') // 藏宝支付
      }
      if (status === 12) {
        return this.$t('billStatus.text4') // 合并藏宝图
      }
      if (status === 13) {
        return this.$t('billStatus.text5') // 更换藏宝图
      }
      if (status === 14) {
        return this.$t('billStatus.text6') // 获得藏宝宝藏
      }
      if (status === 15) {
        return this.$t('billStatus.text7') // 发布英雄帖
      }
      if (status === 16) {
        return this.$t('billStatus.text8') // 获得英雄帖金额
      }
      if (status === 17) {
        return this.$t('billStatus.text9') // 已过期英雄帖退款
      }
      if (status === 18) {
        return this.$t('billStatus.text10') // 领取红包
      }
      if (status === 19) {
        return this.$t('billStatus.text11') // 连环派红包奖励
      }
      if (status === 21) {
        return this.$t('billStatus.text12') // 老板支付充值保证金
      }
      if (status === 22) {
        return this.$t('billStatus.text13') // 系统收到老板保证金成功
      }
      if (status === 23) {
        return this.$t('billStatus.text14') // 充值成功系统给用户打款
      }
      if (status === 24) {
        return this.$t('billStatus.text15') // 充值成功用户收到钱
      }
      if (status === 25) {
        return this.$t('billStatus.text16') // 充值失败系统给退款
      }
      if (status === 26) {
        return this.$t('billStatus.text17') // 充值失败老板收到退款
      }
      if (status === 27) {
        return this.$t('billStatus.text18') // 充值失败，用户冲裁收到退款
      }
      if (status === 31) {
        return this.$t('billStatus.text19') // 提现用户支付保证金
      }
      if (status === 32) {
        return this.$t('billStatus.text20') // 系统收到用户保证金
      }
      if (status === 33) {
        return this.$t('billStatus.text21') // 提现成功系统给老板打款
      }
      if (status === 34) {
        return this.$t('billStatus.text22') // 提现成功老板收到款
      }
      if (status === 35) {
        return this.$t('billStatus.text23') // 提现失败系统给用户转款
      }
      if (status === 36) {
        return this.$t('billStatus.text24') // 提现失败用户收到退款
      }
      if (status === 37) {
        return this.$t('billStatus.text25') // 提现失败
      }
      if (status === 40) {
        return this.$t('billStatus.text26') // 买入委托
      }
      if (status === 41) {
        return this.$t('billStatus.text27') // 卖出委托
      }
      if (status === 42) {
        return this.$t('billStatus.text28') // 取消买委托
      }
      if (status === 43) {
        return this.$t('billStatus.text29') // 取消卖委托
      }
      if (status === 44) {
        return this.$t('billStatus.text30') // 买成交记录
      }
      if (status === 45) {
        return this.$t('billStatus.text31') // 卖成交记录
      }
      if (status === 73) {
        return this.$t('billStatus.text32') // 效率卡购买
      }
      if (status === 74) {
        return this.$t('billStatus.text33') // 发放红包
      }
      if (status === 75) {
        return this.$t('billStatus.text34') // 发送红包撤单退款
      }
      if (status === 76) {
        return this.$t('billStatus.text35') // AR宝箱失效退款
      }
      if (status === 77) {
        return this.$t('billStatus.text36') // 商家收款
      }
      if (status === 78) {
        return this.$t('billStatus.text37') // 退单或退货
      }
      if (status === 79) {
        return this.$t('billStatus.text38') // π付支出
      }
      if (status === 81) {
        return this.$t('billStatus.text39') // 派付线上订单支付
      }
      if (status === 82) {
        return this.$t('billStatus.text40') // 派付线上订单支付后退款
      }
      if (status === 83) {
        return this.$t('billStatus.text51') // 申请连环派
      }
      if (status === 84) {
        return this.$t('billStatus.text52') // 申请连环派退款
      }
      if (status === 110) {
        return this.$t('billStatus.text53') // 购买地块
      }
      if (status === 111) {
        return this.$t('billStatus.text54') // 世界地图收益
      }
      if (status === 112) {
        return this.$t('billStatus.text55') // 世界地图派别收益
      }
      if (status === 113) {
        return this.$t('billStatus.text56') // 支付宝扫码充值
      }
      if (status === 114) {
        return this.$t('billStatus.text57') // 微信扫码充值
      }
      if (status === 115) {
        return this.$t('billStatus.text58') // 拍地收款
      }
      if (status === 123) {
        return this.$t('billStatus.text59') // 转入余额宝
      }
      if (status === 124) {
        return this.$t('billStatus.text60') // 转出余额宝
      }
      if (status === 126) {
        return this.$t('billStatus.text61') // 买入委托
      }
      if (status === 127) {
        return this.$t('billStatus.text62') // 卖出委托
      }
      if (status === 128) {
        return this.$t('billStatus.text63') // 取消买委托
      }
      if (status === 129) {
        return this.$t('billStatus.text64') // 取消卖委托
      }
      if (status === 130) {
        return this.$t('billStatus.text65') // 买成交记录
      }
      if (status === 131) {
        return this.$t('billStatus.text66') // 卖成交记录
      }
      if (status === 132) {
        return this.$t('billStatus.text67') // 第三方商城买家付款
      }
      if (status === 133) {
        return this.$t('billStatus.text68') // 第三方商城确认收货
      }
      if (status === 134) {
        return this.$t('billStatus.text69') // 第三方商城入住商户退款
      }
      if (status === 135) {
        return this.$t('billStatus.text70') // 中间商户退款
      }
      if (status === 137) {
        return this.$t('billStatus.text070') // discovery转账到派钱包
      }
      if (status === 235) {
        return this.$t('billStatus.text71') // 手续费退款
      }
      if (status === 140) {
        return this.$t('billStatus.text72') // 派运之星提成
      }
      if (status === 151) {
        return this.$t('billStatus.text73') // 第三方买家付款
      }
      if (status === 152) {
        return this.$t('billStatus.text74') // 第三方确认收货
      }
      if (status === 153) {
        return this.$t('billStatus.text75') // 第三方入住商户退款
      }
      if (status === 154) {
        return this.$t('billStatus.text76') // 第三方退款
      }
      if (status === 156) {
        return this.$t('billStatus.text77') // 购买派誉之星付款
      }
      if (status === 157) {
        return this.$t('billStatus.text78') // 派誉之星奖励支出
      }
      if (status === 158) {
        return this.$t('billStatus.text79') // 派誉之星奖励退款
      }
      if (status === 159) {
        return this.$t('billStatus.text80') // 商家支付保证金
      }
      if (status === 160) {
        return this.$t('billStatus.text81') // 商家赔付用户保证金
      }
      if (status === 161) {
        return this.$t('billStatus.text82') // 商家保证金退款
      }
      if (status === 162) {
        return this.$t('billStatus.text83') // 餐券买入委托
      }
      if (status === 163) {
        return this.$t('billStatus.text84') // 餐券卖出委托
      }
      if (status === 164) {
        return this.$t('billStatus.text85') // 取消餐券买委托
      }
      if (status === 165) {
        return this.$t('billStatus.text86') // 取消餐券卖委托
      }
      if (status === 166) {
        return this.$t('billStatus.text87') // 餐券买成交记录
      }
      if (status === 167) {
        return this.$t('billStatus.text88') // 餐券卖成交记录
      }
      if (status === 171) {
        return this.$t('billStatus.text89') // 服务中心补贴
      }
      if (status === 172) {
        return this.$t('billStatus.text90') // 连锁商家PV预扣
      }
      if (status === 173) {
        return this.$t('billStatus.text91') // 连锁商家PV返还
      }
      if (status === 174) {
        return this.$t('billStatus.text92') // 连锁商家生态奖励发放
      }
      if (status === 175) {
        return this.$t('billStatus.text93') // 连锁商家补贴发放
      }
      if (status === 176) {
        return this.$t('billStatus.text94') // 连锁商家佣金发放
      }
      if (status === 177) {
        return this.$t('billStatus.text95') // 广告位竞拍成交
      }
      if (status === 178) {
        return this.$t('billStatus.text96') // 数字交易买入委托
      }
      if (status === 179) {
        return this.$t('billStatus.text97') // 数字交易卖出委托
      }
      if (status === 180) {
        return this.$t('billStatus.text98') // 数字交易取消买委托
      }
      if (status === 181) {
        return this.$t('billStatus.text99') // 数字交易取消卖委托
      }
      if (status === 182) {
        return this.$t('billStatus.text100') // 数字交易买成交记录
      }
      if (status === 183) {
        return this.$t('billStatus.text101') // 数字交易卖成交记录
      }
      if (status === 184) {
        return this.$t('billStatus.text102') // 第三方付款码支付
      }
      if (status === 185) {
        return this.$t('billStatus.text103') // 数字交易手续费
      }
      if (status === 186) {
        return this.$t('billStatus.text104') // 红包发放
      }
      if (status === 187) {
        return this.$t('billStatus.text105') // 红包获得
      }
      if (status === 188) {
        return this.$t('billStatus.text106') // 红包退款
      }
      if (status === 195) {
        return this.$t('billStatus.text107') // ICO认购支出
      }
      if (status === 196) {
        return this.$t('billStatus.text108') // 获得商家代币
      }
      if (status === 197) {
        return this.$t('billStatus.text109') // ICO认购收入
      }
      if (status === 198) {
        return this.$t('billStatus.text110') // 认购代币退回
      }
      if (status === 201) {
        return this.$t('billStatus.text111') // 微博打赏
      }
      if (status === 202) {
        return this.$t('billStatus.text112') // 微博钱包提现
      }
      if (status === 203) {
        return this.$t('billStatus.text113') // 虚拟币充值(币币充值)
      }
      if (status === 204) {
        return this.$t('billStatus.text114') // 区块链投票冻结用户π
      }
      if (status === 205) {
        return this.$t('billStatus.text115') // 区块链投票退回用户π
      }
      if (status === 206) {
        return this.$t('billStatus.text116') // 开通ai机器人
      }
      if (status === 207) {
        return this.$t('billStatus.text117') // 团购订单支付
      }
      if (status === 208) {
        return this.$t('billStatus.text118') // 团购订单退款
      }
      if (status === 209) {
        return this.$t('billStatus.text119') // 团购订单打款给商家
      }
      if (status === 210) {
        return this.$t('billStatus.text120') // 无限竞派竞价成功扣款
      }
      if (status === 211) {
        return this.$t('billStatus.text121') // 无限竞派抢购支付
      }
      if (status === 212) {
        return this.$t('billStatus.text122') // 无限竞派奖励
      }
      if (status === 213) {
        return this.$t('billStatus.text123') // 无限竞派打款给商家
      }
      if (orderType === 15) {
        return this.$t('billStatus.text124') // AR夺宝
      }
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  }
}
</script>
