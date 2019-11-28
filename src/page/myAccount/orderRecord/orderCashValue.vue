<template>
  <div class="myaccount-bill">
    <!--订单 充值、提现-->
    <h3 class="my-title">{{$t('bill.text24')}}</h3>
    <div class="flex-form">
      <span class="bold">{{$t('chongzhiTixian.text16')}}</span>
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
        <ul class="select-uls" :class="{'maxheight-box': isSelectBox}">
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
        <li class="table-list">{{$t('bill.text25')}}</li>
        <li class="table-list">{{$t('chongzhiTixian.text35')}}</li>
        <li class="table-list">{{$t('bill.text7')}}</li>
        <li class="table-list">{{$t('bill.text8')}}</li>
      </ul>
      <v-loading v-show="loadingShow"></v-loading>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('myAccount.text1')}}</p>
        </div>
      </div>
      <ul class="table-uls cursor" v-for="(item, index) in orderData" :key="index" @click="gotoInfo(item.id, item.orderState, item.payState)">
        <li class="table-list">{{item.id}}</li>
        <li class="table-list">{{$changeDate(item.createAt)}}</li>
        <li class="table-list">{{isChongzhi(chongzhiStatus)}}</li>
        <li class="table-list">{{item.amount | fourNumber}} {{item.currency}}</li>
        <li class="table-list" v-if="item.bossNick === '未选择共享者'">{{$t('orderStatus.text10')}}</li>
        <li class="table-list" v-else>{{item.bossNick}}</li>
        <li class="table-list">{{$orderTipMsg(item.tipMsg, item.typeTitle, chongzhiStatus, item)}}</li>
        <li class="table-list red-color">{{$t('bill.text9')}}</li>
      </ul>
    </div>
    <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      totalPage: 0,
      noResult: false,
      loadingShow: true,
      pend: false,
      current_page: 0,
      chongzhiStatus: 0,
      chongzhiStatus2: 0,
      currentStatus: this.$t('chongzhiTixian.text45'),
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
      statusArr: [this.$t('chongzhiTixian.text45'), this.$t('chongzhiTixian.text47')],
      startTime: '',
      endTime: '',
      orderData: []
    }
  },
  created () {
    this.gotoPage(1)
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
    // 下拉框选择
    checkOne (item, index) {
      this.currentStatus = item
      this.isSelectBox = false
      this.chongzhiStatus2 = index
    },
    // 获取订单列表
    gotoPage (page) {
      this.chongzhiStatus = this.chongzhiStatus2
      this.current_page = page
      let dataObj = {
        pageIndex: page,
        pageSize: '20'
      }
      if (this.startTime) {
        dataObj.startDate = this.$changeDate(this.startTime, '-')
      }
      if (this.endTime) {
        dataObj.endDate = this.$changeDate(this.endTime, '-', 3)
      }
      // 提现的列表
      if (this.chongzhiStatus === 1) {
        this.$postAxios.post(`${this.$api2}draw/queryMyOrderList`, dataObj).then(res => {
          this.loadingShow = false
          if (res.data.status === 'success') {
            this.orderData = res.data.data.list
            this.totalPage = res.data.data.totalPage
            if (this.orderData.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          }
        })
      } else { // 充值的列表
        this.$postAxios.post(`${this.$api2}deposit/queryMyOrderList`, dataObj).then(res => {
          this.loadingShow = false
          if (res.data.status === 'success') {
            this.orderData = res.data.data.list
            this.totalPage = res.data.data.totalPage
            if (this.orderData.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          }
        })
      }
    },
    // 查看详情
    gotoInfo (id, status, payState) {
      // 跳转到提现
      if (this.chongzhiStatus === 1) {
        this.$router.push({
          path: '/account/orderCashValue/tiXianOrderDetail',
          query: {
            id: id,
            isChongzhi: this.chongzhiStatus
          }
        })
      } else if (this.chongzhiStatus === 0) {
        // 跳转到充值
        this.$router.push({
          path: '/account/orderCashValue/rechargeOrderDetail',
          query: {
            id: id,
            isChongzhi: this.chongzhiStatus
          }
        })
      }
    },
    // 充值or提现
    isChongzhi (status) {
      if (status === 0) {
        return this.$t('chongzhiTixian.text45')
      } else {
        return this.$t('chongzhiTixian.text47')
      }
    }
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  }
}
</script>
