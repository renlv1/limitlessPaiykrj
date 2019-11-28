<template>
  <div class="transferAccounts">
    <h3>{{$t('billStatus.text1')}}</h3>
    <div class="transferBox">
      <div class="transfer">
        <span>{{$t('finance.text49')}}</span>
        <div class="right">
          <div class="right-box" :class="{'green': curType.tag === 2, 'blue': curType.tag === 1,'close': toggle, 'hei-color': curType.tag === 3}" @click="toggle = !toggle; toggle2 = false">
            <span>{{curType.text}}</span><i></i>
          </div>
          <ul :class="{'close': toggle}">
            <li v-for="(item, index) in trasnferType" :key="index" :class="{'active': item.tag === curType.tag}" @click="checkOne(item)">{{item.text}}</li>
          </ul>
        </div>
      </div>
      <!--收款人-->
      <div class="payee" v-if="curType.tag === 1">
        <span>{{$t('finance.text50')}}</span>
        <div class="right">
          <div class="right-box" :class="{'close': toggle2}" @click="toggle2 = !toggle2; toggle = false">
            <span v-if="curTab === 0">{{friend ? friend.username : $t('finance.text51') }}</span>
            <span v-if="curTab === 1">{{friend ? friend.nickName : $t('finance.text51') }}</span>
            <i></i>
          </div>
          <div class="friendBox" :class="{'close': toggle2}">
            <div class="tab">
              <span v-for="(item, index) in payeeTab" :key="index" @click="changeFriendTab(index)"><i :class="{'active': curTab === index}">{{item}}</i></span>
            </div>
            <ul class="payeeUl" v-if="curTab ===0">
              <li v-for="(item, index) in friendList" :key="index" style="cursor: pointer" @click="selectFriend(item)"><i :class="{'select': friend.address === item.address}"></i><span>{{item.username}}</span></li>
              <div class="no-result" v-show="noResult1">
                <div class="load-more-box">
                  <div class="loading-img">
                    <img src="../../../assets/images/home/nodata.png" alt="">
                  </div>
                  <p class="desc">{{$t('bill.text10')}}!</p>
                </div>
              </div>
            </ul>
            <ul class="payeeUl" v-if="curTab === 1">
              <li v-for="(item, index) in friendList2" :key="index" style="cursor: pointer" @click="selectFriend(item)"><i :class="{'select': friend.otherAddress === item.otherAddress}"></i><span>{{item.nickName}}</span></li>
              <div class="no-result" v-show="noResult2">
                <div class="load-more-box">
                  <div class="loading-img">
                    <img src="../../../assets/images/home/nodata.png" alt="">
                  </div>
                  <p class="desc">{{$t('bill.text10')}}!</p>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <!--用户名 -->
      <div class="phone" v-if="curType.tag === 3">
        <span>{{$t('finance.text52')}}</span>
        <div class="right">
          <input type="text" :placeholder="$t('finance.text53')" @blur="checkAccount" v-model="userName">
          <div class="errorMsg" v-if="errMsg4" >{{errMsg4}}</div>
        </div>
      </div>
      <!--收款人地址-->
      <div class="address" v-if="curType.tag === 2">
        <span>{{$t('finance.text54')}}</span>
        <div class="right">
          <input type="text" :placeholder="$t('finance.text55')"  v-model="address">
          <div class="errorMsg" v-if="errMsg1">{{errMsg1}}</div>
        </div>
      </div>
      <!--邮箱前4位 -->
      <div class="phone" v-if="curType.tag === 1 || curType.tag === 3">
        <span>{{$t('finance.text56')}}</span>
        <div class="right">
          <input type="text" :placeholder="$t('finance.text57')" @blur="checkEmail" v-model="email">
          <div class="errorMsg" v-if="errMsg2" >{{errMsg2}}</div>
        </div>
      </div>
      <!--转帐金额-->
      <div class="money">
        <span>{{$t('finance.text58')}}</span>
        <div class="right">
          <input type="text" :placeholder="$t('finance.text59')" v-model="amount" @input="changeBuyNum('amount')">
          <div class="errorMsg" v-if="errMsg3" >{{errMsg3}}</div>
        </div>
      </div>
      <div class="btn" @click="sureTransfer()">{{$t('chongzhiTixian.text24')}}</div>
    </div>
    <!--支付弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('finance.text60')}}</h3>
          <p class="pay-price">{{amount}} π</p>
          <h5 class="trade-password">{{$t('finance.text61')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword"  value="" :placeholder="$t('finance.text62')">
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
        <div class="close" @click="setSafeVerific = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="setSafeVerific = false">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      noResult1: false,
      noResult2: false,
      setSafeVerific: false,
      errMsg1: '',
      errMsg2: '',
      errMsg3: '',
      errMsg4: '',
      trasnferType: [ // 转账类型列表
        {
          text: this.$t('finance.text65'),
          tag: 1
        },
        {
          text: this.$t('finance.text66'),
          tag: 2
        },
        {
          text: this.$t('finance.text67'),
          tag: 3
        }
      ],
      curType: { // 当前转账方式
        text: this.$t('finance.text65'),
        tag: 1
      },
      toggle: false, // 转账方式下拉开关
      toggle2: false, // 收款人下拉开关
      payeeTab: [
        this.$t('finance.text63'),
        this.$t('finance.text64')
      ],
      friend: '',
      friendList: [], // 最近转账
      friendList2: [], // 好友列表2
      curTab: 0,
      friendListPage: 1,
      serverEmail: '',
      amount: '',
      address: '',
      email: '',
      payPopupShow: false, // 确定弹窗
      payPassword: '', // 交易密码
      payCode: '', // 谷歌验证码
      payFailTip: '', // 确认支付提示
      rechargeNum: '', // 转账数
      userName: ''
    }
  },
  mounted () {
    this.getAccountList()
    this.getFriendList()
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
    checkOne (item) {
      this.curType = item
      this.toggle = false
      this.email = ''
      this.amount = ''
      this.friend = ''
      this.address = ''
      this.errMsg1 = ''
      this.errMsg2 = ''
      this.errMsg3 = ''
    },
    sureTransfer () {
      this.payPassword = ''
      this.payCode = ''
      this.showError()
      if (this.validata()) {
        if (this.errMsg2 === '' && this.curType.tag === 3) {
          if (this.userData.openGoogleCode !== 2) {
            this.setSafeVerific = true
          } else {
            this.payPopupShow = true
          }
        } else if (this.curType.tag !== 3) {
          if (this.userData.openGoogleCode !== 2) {
            this.setSafeVerific = true
          } else {
            this.payPopupShow = true
          }
        }
      }
    },
    // 调用转账接口 http://wallet.pigamegroup.com/tx/payment
    confirmPay () {
      if (this.payPassword === '') {
        this.payFailTip = this.$t('finance.text62')
      } else if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      } else {
        this.payFailTip = ''
        var _desAccount
        if (this.curType.tag === 1) {
          if (this.curTab === 0) {
            _desAccount = this.friend.address
          } else {
            _desAccount = this.friend.otherAddress
          }
        } else if (this.curType.tag === 2) {
          _desAccount = this.address
        } else {
          _desAccount = this.friend.address
        }
        let url = `${this.$api}tx/payment`
        this.$postAxios.post(url, {
          currency: 'PAI',
          amount: this.amount,
          desAccount: _desAccount,
          tradePwd: this.payPassword,
          mobileCode: this.payCode,
          codeType: 1
        }).then(res => {
          if (res.data.success) {
            this.amount = ''
            this.payPassword = ''
            this.payCode = ''
            this.email = ''
            this.address = ''
            this.payPopupShow = false
            Dialog({
              title: '',
              content: this.$t('finance.text68')
            })
          } else {
            this.payPopupShow = false
            Dialog({
              title: '',
              content: res.data.msg
            })
          }
        }).catch(err => {
          this.payPopupShow = false
          console.log(err)
          Dialog({
            title: '',
            content: this.$t('finance.text69')
          })
        })
      }
    },
    showError () {
      this.email = this.email.toLowerCase()
      if (this.email.trim() === '') {
        this.errMsg2 = this.$t('transfer.text1')
      } else {
        this.errMsg2 = ''
        if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
          this.errMsg2 = this.$t('transfer.text2')
        } else {
          this.errMsg2 = ''
        }
      }
      if (this.amount.trim() === '') {
        this.errMsg3 = this.$t('transfer.text3')
      } else if (this.amount <= 0) {
        this.errMsg3 = this.$t('transfer.text4')
      } else {
        this.errMsg3 = ''
      }
      if (this.address.trim() === '') {
        this.errMsg1 = this.$t('transfer.text5')
      } else {
        this.errMsg1 = ''
      }
    },
    validata () {
      if (this.curType.tag === 1) { // 向好友转账
        if (this.email.trim() === '') {
          return false
        } else {
          if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
            return false
          }
        }
      } else if (this.curType.tag === 2) {
        if (this.address === '') {
          return false
        }
      }
      if (this.amount === '' || this.amount <= 0) {
        return false
      }
      return true
    },
    // 好友关系列表 http://wallet.pigamegroup.com/friend/list?page=1&lastUpdateAt=19991
    getFriendList () {
      let url = `${this.$api}friend/list?page=${this.friendListPage}&lastUpdateAt=`
      this.$http.get(url).then(res => {
        if (res.data.status === 'success') {
          let fendArr = []
          for (let i in res.data.data) {
            if (res.data.data[i].shipType === 1 && res.data.data[i].state === 102) {
              fendArr.push(res.data.data[i])
            }
          }
          this.friendList2 = fendArr
          if (fendArr.length === 0) {
            this.noResult2 = true
          } else {
            this.noResult2 = false
          }
        }
      })
    },
    // 最近转账记录 http://wallet.pigamegroup.com/tx/tx_accountlist
    getAccountList () {
      let url = `${this.$api}tx/tx_accountlist?count=20`
      this.$http.get(url).then(res => {
        if (res.data.status === 'success') {
          this.friendList = res.data.data
          if (this.friendList.length === 0) {
            this.noResult1 = true
          } else {
            this.noResult1 = false
          }
        }
      })
    },
    // 关闭支付弹窗
    closeIcon () {
      this.payPopupShow = false
      this.payFailTip = ''
      this.setSafeVerific = false
      this.confirmShow = false
    },
    // 检查邮箱是否正确
    checkEmail () {
      if (this.email.trim() === '') {
        this.errMsg2 = this.$t('transfer.text1')
      } else {
        this.errMsg2 = ''
        if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
          this.errMsg2 = this.$t('transfer.text2')
        } else {
          this.errMsg2 = ''
        }
      }
    },
    selectFriend (item) { // 选择朋友
      if (this.curTab === 0) {
        if (this.friend !== '') {
          if (this.friend.address === item.address) {
            this.friend = ''
          } else {
            this.friend = item
            this.checkAccount(item.address)
          }
        } else {
          this.friend = item
          this.checkAccount(item.address)
        }
      } else {
        if (this.friend !== '') {
          if (this.friend.otherAddress === item.otherAddress) {
            this.friend = ''
          } else {
            this.friend = item
            this.checkAccount(item.otherAddress)
          }
        } else {
          this.friend = item
          this.checkAccount(item.otherAddress)
        }
      }
      this.toggle2 = false
    },
    // 检查账户是否存在 http://wallet.pigamegroup.com/user/checkaccount
    checkAccount (account) {
      let url
      if (this.curType.tag !== 3) {
        url = `${this.$api}user/checkaccount?account=${account}&showFlag=10000`
      } else {
        if (this.userName) {
          url = `${this.$api}user/checkaccount?account=${this.userName}&showFlag=10000`
        }
      }
      if (url) {
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            let _res = res.data.data
            if (this.curType.tag === 3) {
              this.friend = res.data.data
            }
            if (_res.email) {
              this.serverEmail = _res.email
            } else {
              Dialog({
                title: '',
                content: this.$t('transfer.text7')
              })
              this.friend = ''
            }
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
    changeFriendTab (index) { // 切换朋友列表
//      this.friendList = []
//      this.friend = ''
      this.curTab = index
//      if (this.curTab === 0) {
//        this.getAccountList()
//      } else {
//        this.getFriendList()
//      }
//      this.friend = ''
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  }
}
</script>

<style lang="less" type="text/less" scoped>
.transferAccounts{
  padding: 60px 60px;
  h3{
    font-size: 34px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 60px;
    margin-right: 100px;
  }
  .formDiv{
    .title{
      margin-right: 0;
    }
  }
  .transferBox{
    width: 784px;
    height: auto;
    padding: 40px 160px 40px 40px;
    background-color: #fff;
    border: 1px solid #e7e8ec;
    .transfer{
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      &>span{
        color: #1a1a1a;
        font-size: 16px;
      }
      .right{
        width: 440px;
        position: relative;
        .right-box{
          display: flex;
          justify-content: space-between;
          height: 50px;
          border: 1px solid #e7e8ec;
          padding: 0 30px;
          align-items: center;
          cursor: pointer;
          span{
            font-size: 16px;
            font-weight:bold;
          }
          i{
            display: inline-block;
            width: 0;
            height: 0;
            border-right: 6px solid transparent;
            border-left: 6px solid transparent;
            transition: all 0.5s;
            transform: rotate(180deg);
          }
          &.close{
            i{
              transform: rotate(0deg);
            }
          }
          &.blue{
            span{
              color: #4B84FF;
            }
            i{
              border-bottom: 6px solid #4B84FF;
            }
          }
          &.green{
            span{
              color: #2fd265;
            }
            i{
              border-bottom: 6px solid #2fd265;
            }
          }
          &.hei-color i{
            border-bottom: 6px solid #000;
          }
        }
        ul{ // 下拉框
          position: absolute;
          top: 50px;
          left:0;
          z-index: 9;
          width: 100%;
          height: 0;
          overflow: hidden;
          transition: all 0.5s;
          box-shadow: 0px 1px 5px rgba(0,0,0,0.2);
          background-color: #fff;
          &.close{
            height: 132px;
          }
          li{
            height: 44px;
            width: 100%;
            border-bottom:1px solid #e7e8ec;
            line-height: 44px;
            text-align: center;
            cursor: pointer;
            color: #999;
            &:hover{
              color: #1a1a1a;
              font-weight:bold;
            }
            &.active{
              color: #1a1a1a;
              font-weight:bold;
            }
          }
        }
      }
    }
    .payee{
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      &>span{
        color: #1a1a1a;
        font-size: 16px;
      }
      .right{
        width: 440px;
        position: relative;
        .right-box{
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          height: 50px;
          border: 1px solid #e7e8ec;
          padding: 0 30px;
          align-items: center;
          span{
            font-size: 16px;
            color: #999;
          }
          i{
            height: 21px;
            width: 21px;
            display: inline-block;
            background-image: url('../../../assets/images/finance/user.png');
            background-size: cover;
            background-position: center;
          }
        }
        .friendBox{
          position: absolute;
          top: 50px;
          left:0;
          z-index: 9;
          width: 100%;
          height: 0px;
          overflow: hidden;
          transition: all 0.5s;
          box-shadow: 0px 1px 5px rgba(0,0,0,0.2);
          background-color: #fff;
          &.close{
            height: 320px;
            overflow-y:auto ;
            &::-webkit-scrollbar{
              width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
              height: 1px;
            }
            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 5px rgba(241,241,241,0.4);
              background: #535353;
            }
            &::-webkit-scrollbar-track {/*滚动条里面轨道*/
              -webkit-box-shadow: inset 0 0 5px rgba(193,193,193,1);
              border-radius: 5px;
              background: #EDEDED;
            }
          }
          .tab{
            border-bottom: 1px solid #e7e8ec;
            width: 100%;
            height: 50px;
            display: flex;
            span{
              display: inline-block;
              flex: 1;
              text-align: center;
              i{
                display: inline-block;
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                &.active{
                  color: #ffba14;
                  border-bottom: 2px solid #ffba14;
                }
              }
            }
          }
          ul{
            li{
              height: 44px;
              border-bottom: 1px solid #e7e8ec;
              display: flex;
              align-items: center;
              padding: 0 30px;
              i{
                display: inline-block;
                width: 18px;
                height: 18px;
                border: 1px solid #e7e8ec;
                border-radius: 50%;
                margin-right: 20px;
                &.select{
                  background-image: url("../../../assets/images/finance/complete_1.png");
                }
              }
              span{
                color: #1a1a1a;
                font-size: 16px;
              }
            }
          }
        }

      }
    }
    .address,.phone,.money{
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      &>span{
        color: #1a1a1a;
        font-size: 16px;
        width: 140px;
        display: block;
      }
      .right{
        width: 440px;
        height: 50px;
        position: relative;
        input{
          width: 100%;
          padding:0 20px;
          color: #999;
          font-size: 16px;
          height: 50px;
          border: 1px solid #e7e8ec;
        }
        .errorMsg{
          font-size: 14px;
          line-height: 30px;
          position: absolute;
          color: #F75050;
          top: 50px;
          left: 20px;
        }
      }
    }
    .btn{
      width: 200px;
      color: #fff;
      background-color: #ffba14;
      height: 50px;
      border-radius: 4px;
      margin-left: 140px;
      text-align: center;
      line-height: 50px;
      margin-top: 60px;
      cursor: pointer;
    }
  }
}
</style>
