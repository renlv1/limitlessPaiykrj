<template>
  <div class="paiWallet">
    <h3>{{$t('finance.text25')}}</h3>
    <div class="userInfo">
      <div class="info-top">
        <span>{{$t('finance.text26')}}</span>
      </div>
      <div class="info-center">
        <span>{{formatMoney(account.paiPurseBalance).split('.')[0]}}.</span><b>{{formatMoney(account.paiPurseBalance).split('.')[1]}}</b><i>π</i>
      </div>
      <div class="info-bottom">
        <span class="active" @click="shiftTo()">{{$t('finance.text27')}}</span>
        <span @click="rollOut()">{{$t('finance.text28')}}</span>
      </div>
    </div>
    <div class="record">
      <h6>{{$t('finance.text29')}}</h6>
      <table class="shareTableList">
        <tr class="heade-tr">
          <td style="flex: 2">{{$t('bill.text35')}}</td>
          <td style="flex: 3">{{$t('chongzhiTixian.text34')}}</td>
          <td style="flex: 3.4">{{$t('bill.text2')}}</td>
          <td style="flex: 3.4">{{$t('finance.text30')}}</td>
          <td style="flex: 3.7">{{$t('bill.text8')}}</td>
        </tr>
        <v-loading v-show="loadingShow"></v-loading>
        <tr @click="$router.push({path: 'paiwalletDetail', query: {id: item.id}})" v-for="(item, index) in userPaiPurseList" :key="index">
          <td style="flex: 2">{{item.id}}</td>
          <td style="flex: 3">{{parseChangeType(item.changeType)}}</td>
          <td style="flex: 3.4">{{$changeDate(item.createAt)}}</td>
          <!--changeAmount-->
          <td style="flex: 3.4">{{item.changeAmount | formattingMoney}} π</td>
          <td style="flex: 3.7" class="red-color">{{$t('bill.text9')}}</td>
        </tr>
      </table>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('myAccount.text1')}}</p>
        </div>
      </div>
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
      <!--<div class="page"><span @click="toPage('pre')" :class="{'disabled': pageIndex <= 1}">上一页</span><i>{{pageIndex}}</i><span @click="toPage('next')" :class="{'disabled': pageIndex >= totalPage}">下一页</span></div>-->
    </div>
    <!--转出弹窗-->
    <div class="pop-box" v-if="outFlag">
      <div class="dialogBox">
        <h5>{{$t('finance.text18')}}</h5>
        <div class="content">
          <p><input type="number" :placeholder="$t('finance.text19')" v-model="outputTotal" @input="checkAmount(1)"><i>π</i></p>
          <span>{{$t('finance.text31')}}<i>{{purseQuota.outputQuota}}π</i></span>
        </div>
        <div class="errmsg" style="color: #e60000;" v-if="errmsg1">
          {{errmsg1}}
        </div>
        <div class="btn" @click="sureRollOut()" :class="{'hui-class': purseQuota.outputQuota === 0}">{{$t('chongzhiTixian.text24')}}</div>
        <i @click="outFlag = false"></i>
      </div>
    </div>
    <!--转入弹窗-->
    <div class="pop-box" v-if="transferFlag">
      <div class="dialogBox">
        <h5>{{$t('finance.text21')}}</h5>
        <div class="content">
          <p><input type="number" :placeholder="$t('finance.text22')" v-model="inputTotal" @input="checkAmount(0)"><i>π</i></p>
          <span>{{$t('finance.text20')}}<i>{{purseQuota.inputQuota}}π</i>,{{$t('finance.text23')}}</span>
        </div>
        <div class="errmsg" style="color: #e60000;" v-if="errmsg2">
          {{errmsg2}}
        </div>
        <div class="btn" @click="sureShiftTo()" :class="{'hui-class': purseQuota.inputQuota === 0}">{{$t('chongzhiTixian.text24')}}</div>
        <i @click="transferFlag = false"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      noResult: false,
      loadingShow: true,
      outFlag: false, // 转出弹窗
      transferFlag: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      userPaiPurseList: [],
      outputTotal: '', // 转出金额
      inputTotal: '', // 转入金额
      errmsg1: '',
      errmsg2: '',
      pend: false
    }
  },
  created () {
    this.$store.dispatch('getUserBalance')
  },
  mounted () {
    this.getPaiPurseRecordList()
    this.getPurseQuota()
    // this.getUserBalance()
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  computed: {
    ...mapGetters([
      'account',
      'purseQuota'
    ]),
    pstart () {
      return this.pageIndex === 1
    }
  },
  methods: {
    ...mapActions([
      'getUserBalance',
      'getPurseQuota'
    ]),
    parentTurnPage (page) {
      this.pageIndex = page
      this.getPaiPurseRecordList()
    },
    // 转入
    shiftTo () {
      this.transferFlag = true
    },
    // 确认转入
    sureShiftTo () {
      if (this.inputTotal === '') {
        this.errmsg2 = this.$t('finance.text32')
      } else if (this.inputTotal > this.purseQuota.inputQuota) {
        this.errmsg2 = this.$t('finance.text33')
      } else {
        this.errmsg2 = ''
        let url = `${this.$api}purse/inputPaiPurse?inputTotal=${this.inputTotal}`
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            this.transferFlag = false
            Dialog({
              title: '',
              content: this.$t('finance.text34')
            })
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
    },
    checkAmount (type) {
      if (type === 1) {
        if (!/^\d+(\.\d{0,4})?$/.test(this.outputTotal)) {
          this.outputTotal = this.outputTotal.substring(0, this.outputTotal.length - 1)
        }
        if (this.outputTotal > this.purseQuota.outputQuota) {
          this.outputTotal = this.purseQuota.outputQuota
        }
      } else {
        if (!/^\d+(\.\d{0,4})?$/.test(this.inputTotal)) {
          this.inputTotal = this.inputTotal.substring(0, this.inputTotal.length - 1)
        }
        if (this.inputTotal > this.purseQuota.inputQuota) {
          this.inputTotal = this.purseQuota.inputQuota
        }
      }
    },

    // 转出
    rollOut () {
      this.outFlag = true
    },
    // 确认转出
    sureRollOut () {
      if (this.outputTotal === '') {
        this.errmsg1 = this.$t('finance.text35')
      } else if (this.outputTotal > this.purseQuota.outputQuota) {
        this.errmsg1 = this.$t('finance.text36')
      } else {
        this.errmsg1 = ''
        let url = `${this.$api}purse/outputPaiPurse?outputTotal=${this.outputTotal}`
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            this.pageIndex = 1
            this.getPaiPurseRecordList()
            this.outFlag = false
            Dialog({
              title: '',
              content: this.$t('finance.text37')
            })
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
    },
    toPage (type) {
      if (type === 'pre') {
        if (this.pageIndex > 1) {
          this.pageIndex--
          this.getPaiPurseRecordList()
        }
      } else if (type === 'next') {
        if (this.pageIndex < this.totalPage) {
          this.pageIndex++
          this.getPaiPurseRecordList()
        }
      }
    },
    // 派付 》 6.01 帐户余额变化记录
    getPaiPurseRecordList () {
      let url = `${this.$api}purse/getPaiPurseRecordList?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          this.userPaiPurseList = res.data.data.userPaiPurseList
          this.totalPage = res.data.data.totalPage
          if (this.userPaiPurseList.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 解析changeType Integer 变动类型 1:余额转入 2:余额转出 3:派付消费 4:寻宝奖励 5:上级购买 6:卖给下级 7:派付退款 查询所有无需传递该参数
    parseChangeType (type) {
      switch (type) {
        case 1 :
          return this.$t('finance.text38')
        case 2 :
          return this.$t('finance.text39')
        case 3 :
          return this.$t('finance.text40')
        case 4 :
          return this.$t('finance.text41')
        case 5 :
          return this.$t('finance.text42')
        case 6 :
          return this.$t('finance.text43')
        case 7 :
          return this.$t('finance.text44')
        default:
          return '--'
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
              return '-' + newStr[0] + '.' + newStr[1]
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
    width: 510px;
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
      text-align: center;
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
        border: 1px solid #ffba14;
        border-radius: 4px;
        display: block;
        text-align: center;
        line-height: 50px;
        color: #1a1a1a;
        cursor: pointer;
        user-select: none;
        &.active{
          background-color: #ffba14;
          color: #fff;
        }
        &:active{
          opacity: 0.4;
        }
      }
    }
  }
}
.record{
  width: 100%;
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
