<template>
  <div class="setSharePay">
    <div class="setSharePay-content">
      <div class="setSharePay-title">
        {{$t('setSharePay.text1')}}
      </div>
      <div class="setSharePay-box">
        <h3>{{$t('setSharePay.text2')}}</h3>
        <table class="shareTableList">
          <thead>
          <tr>
            <td class="support-type">{{$t('setSharePay.text3')}}</td>
            <td>{{$t('setSharePay.text4')}}</td>
            <td>{{$t('setSharePay.text5')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="support-type">{{$t('setSharePay.text6')}}</td>
            <td><div class="checkbox" @click="changeBox(1)" :class="{checkActive: takeOrderDeposit === 1}"></div></td>
            <td><div class="checkbox" @click="changeBox(2)" :class="{checkActive: takeOrderDraw === 1}"></div></td>
          </tr>
          </tbody>
        </table>
        <div class="fees-box withdraw-rate">
          <div class="fees-content" v-show="depositShow">
            <div class="fees">{{$t('setSharePay.text7')}}</div>
            <span>{{depositRate}}%</span>
            <div class="revise" @click="reviseBtn(1)">{{$t('setSharePay.text8')}}</div>
          </div>
          <div class="rate-box" v-show="!depositShow">
            <div class="rate">{{$t('setSharePay.text7')}}</div>
            <div class="input-box">
              <input type="text" :placeholder="$t('setSharePay.text31')"  v-model.trim="depositRate" @input="checkInput('depositRate')"  @focus="focusInput()">
              <p class="percent">%</p>
            </div>
            <div class="save-btn" @click="depositBtn()">{{$t('setSharePay.text9')}}</div>
            <div class="cancel-btn" @click="cancelBtn(1)">{{$t('setSharePay.text10')}}</div>
          </div>
          <div class="err-tip">{{errWarn}}</div>
        </div>
        <div class="withdraw-rate fees-box">
          <div class="fees-content" v-show="drawShow">
            <div class="fees">{{$t('setSharePay.text11')}}</div>
            <span>{{drawRate}}%</span>
            <div class="revise" @click="reviseBtn(2)">{{$t('setSharePay.text8')}}</div>
          </div>
          <div class="rate-box" v-show="!drawShow">
            <div class="rate">{{$t('setSharePay.text11')}}</div>
            <div class="input-box">
              <input type="text" :placeholder="$t('setSharePay.text11')"   v-model.trim="drawRate" @input="checkInput('drawRate')"  @focus="focusInput()">
              <p class="percent">%</p>
            </div>
            <div class="save-btn" @click="saveBtn()">{{$t('setSharePay.text9')}}</div>
            <div class="cancel-btn" @click="cancelBtn(2)">{{$t('setSharePay.text10')}}</div>
          </div>
        </div>
        <div class="err-tip">{{errTip}}</div>
        <div class="support-box">
          <div class="support-type">
            <div class="support-set">{{$t('setSharePay.text12')}}</div>
            <div class="account-info" @click="$router.push({path: '/accountMoney'})">{{$t('setSharePay.text13')}}</div>
          </div>
        </div>
        <table class="shareTableList">
          <thead>
          <tr>
            <td class="support-type">{{$t('setSharePay.text14')}}</td>
            <td>{{$t('setSharePay.text4')}}</td>
            <td>{{$t('setSharePay.text5')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in newCurrencyList" :key="index">
            <td class="support-type">{{item.currency}}</td>
            <td><div class="checkbox" @click="chooseCheckBox(index, item.bossCurrency.supportDepositAndDrawFlag, item.currency)" :class="{checkActive: item.bossCurrency.supportDepositAndDrawFlag === 2 || item.bossCurrency.supportDepositAndDrawFlag === 4}"></div></td>
            <td><div class="checkbox" @click="CheckDraw(index, item.bossCurrency.supportDepositAndDrawFlag, item.currency)"  :class="{checkActive: item.bossCurrency.supportDepositAndDrawFlag === 3 || item.bossCurrency.supportDepositAndDrawFlag === 4}"></div></td>
          </tr>
          </tbody>
        </table>
        <h3 class="personal-info">{{$t('setSharePay.text15')}}</h3>
        <div class="personal-box">
          <div class="personal-content">
            <div class="name">{{$t('setSharePay.text16')}}</div>
            <div class="personal-name">{{realname}}</div>
          </div>
          <div class="personal-content">
            <div class="name">{{$t('setSharePay.text17')}}</div>
            <div class="personal-name">{{contactAddress}}</div>
          </div>
        </div>
        <h3 class="contact-info">{{$t('setSharePay.text18')}}</h3>
        <table class="shareTable">
          <thead>
          <tr>
            <td class="type">{{$t('setSharePay.text19')}}</td>
            <td class="contact">{{$t('setSharePay.text20')}}</td>
            <td class="operation">{{$t('setSharePay.text21')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(newList,i) in NewContactList" :key="newList.index" v-if="NewContactList.length !==0 ">
            <td class="type">{{newList.type}}</td>
            <td class="contact">{{newList.info}}</td>
            <td class="operation"><span style="color: #e93a3a" @click="deleteContact(i, newList.type, newList.info)">{{$t('setSharePay.text22')}}</span></td>
          </tr>
          <tr v-for="(item,index) in ContactList" :key="item.info">
            <td class="type contact-way" @click="btnChoose(index)">
              <input class="transfer-input  select-input" type="text" readonly disabled  v-model="typeValue">
              <a class="discount-btn" ref="discountBtn" >
                <i class="arrowDown" :class="{arrowActive: typeShow === index}"></i>
              </a>
              <ul class="selectMenu" :class="{selectMenuActive: typeShow === index}">
                <li :class="{liActive: transferIndex === index}" v-for="(item, index) in lianxiOption" :key="item.name" @click="chooseType(item.name, item.type, index)">{{item.name}}</li>
              </ul>
            </td>
            <td class="contact"><input type="text" class="contact-input" :placeholder="$t('setSharePay.text24')" maxlength="18" v-model.trim="contactType"></td>
            <td class="operation"><span style="color: #1a1a1a;margin-right: 10px" @click="saveType(index)">{{$t('setSharePay.text9')}}</span> <i @click="cancelContact(item.index)">{{$t('setSharePay.text10')}}</i></td>
          </tr>
          <p class="errinMsg">{{errText}}</p>
          <p class="errinMsg">{{errMsg}}</p>
          <p class="errinMsg">{{errTips}}</p>
          </tbody>
        </table>
        <div class="add-contact" @click="contactBtn()">
          <span>+{{$t('setSharePay.text25')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      drawShow: true,
      depositShow: true,
      depositSaveShow: false,
      drawSaveShow: false,
      switchOne: 0,
      resultIndex: '',
      currencyList: [],
      newCurrencyList: [],
      CurrencyListTwo: [],
      lianxiOption: [
        {name: 'wechat', type: 'wechat'},
        {name: 'qq', type: 'qq'},
        {name: 'facebook', type: 'facebook'},
        {name: 'skype', type: 'skype'},
        {name: 'twitter', type: 'twitter'},
        {name: 'whatsapp', type: 'whatsapp'},
        {name: 'line', type: 'line'}
      ],
      num: 0,
      newContact: {
        type: '',
        info: '',
        operation: ''
      },
      NewContactList: [],
      ContactList: [],
      typeShow: -1,
      transferSelectShow: false,
      typeValue: 'wechat',
      transferIndex: 0,
      contactType: '', // 联系方式
      errText: '', // 保存错误提示
      errMsg: '', // 删除错误提示
      errTips: '', // 添加联系方式错误提示
      realnameTwo: '', // 真实姓名
      phoneCode: '', // 手机区号
      phoneNumber: '', // 手机号码
      contactAddressTwo: '', // 联系地址
      depositRateTwo: '', // 法币充值费率
      drawRateTwo: '', // 法币提现费率
      errTip: '',
      errWarn: '',
      drawRate: '', // 提现费率
      address: this.$route.query.address, // 用户帐户地址
      currency: '', // 币种
      depositRate: '', // 充值费率
      bossinfoid: '', // 共享者记录ID（必填）
      takeOrderDeposit: '', // 充值接单开关 1：是 2：否
      takeOrderDraw: '', // 提现接单开关 1：是 2：否
      depositFlag: '', // 充值开关 0不支持 1支持
      drawFlag: '', // 体现开关 0不支持 1支持
      realname: '', // 姓名
      contactAddress: '', // 地址
      qq: '',
      wechat: '',
      facebook: '',
      skype: '',
      twitter: '',
      whatsapp: '',
      line: '',
      wechatArr: [],
      qqArr: [],
      facebookArr: [],
      skypeArr: [],
      twitterArr: [],
      whatsappArr: [],
      lineArr: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', // 用户信息
      'loginFlag',
      'userData'
    ])
  },
  created () {
    // this.getResult()
    this.getTakeOrder()
    this.getCurrencyList()
    // this.getAddress()
    // this.getCurrencyOpen()
    // this.getCurrencyOpen()
    // this.wechat = this.contactType
  },
  methods: {
    // 1.8 得到共享者信息
    // 接口URL: http://boss.pigamegroup.com/pigame/queryByAddress
    getTakeOrder () {
      let url = `${this.$api2}pigame/queryByAddress?address=${this.address}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.bossinfoid = res.data.data.id
          this.takeOrderDeposit = res.data.data.isTakeOrderDeposit
          this.takeOrderDraw = res.data.data.isTakeOrderDraw
          // console.log(JSON.parse(res.data.data.contactWay))
          this.getAddress()
          let contactWayData = JSON.parse(res.data.data.contactWay)
          // let arr = []
          for (var key in contactWayData) { // 从后台获取联系方式存到数组里
            let contactArr = contactWayData[key].split(',')
            // console.log(contactArr)
            // if (key === 'wechat') {
            //   key = '微信'
            // }
            for (let i = 0; i < contactArr.length; i++) {
              var obj = {}
              obj.info = contactArr[i]
              obj.type = key
              // console.log(key, contactArr[i])
              this.NewContactList.push(obj)
            }
            // console.log(contactArr)
            // console.log(this.NewContactList.length)
          }
          for (let i = 0; i < this.NewContactList.length; i++) { // 分别获取各种联系方式的数据存到数组并分割成字符串
            if (this.NewContactList[i].type === 'wechat') {
              this.wechatArr.push(this.NewContactList[i].info)
              if (this.wechatArr.length === 1) {
                this.wechat = this.NewContactList[i].info
              } else {
                this.wechat = this.wechatArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'qq') {
              this.qqArr.push(this.NewContactList[i].info)
              if (this.qqArr.length === 1) {
                this.qq = this.NewContactList[i].info
              } else {
                this.qq = this.qqArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'facebook') {
              this.facebookArr = []
              this.facebookArr.push(this.NewContactList[i].info)
              if (this.facebookArr.length === 1) {
                this.facebook = this.NewContactList[i].info
              } else {
                this.facebook = this.facebookArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'skype') {
              this.skypeArr = []
              this.skypeArr.push(this.NewContactList[i].info)
              if (this.skypeArr.length === 1) {
                this.skype = this.NewContactList[i].info
              } else {
                this.skype = this.skypeArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'twitter') {
              this.twitterArr = []
              this.twitterArr.push(this.NewContactList[i].info)
              if (this.twitterArr.length === 1) {
                this.twitter = this.NewContactList[i].info
              } else {
                this.twitter = this.twitterArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'whatsapp') {
              this.whatsappArr = []
              this.whatsappArr.push(this.NewContactList[i].info)
              if (this.whatsappArr.length === 1) {
                this.whatsapp = this.NewContactList[i].info
              } else {
                this.whatsapp = this.whatsappArr.join(',')
              }
            } else if (this.NewContactList[i].type === 'line') {
              this.lineArr = []
              this.lineArr.push(this.NewContactList[i].info)
              if (this.lineArr.length === 1) {
                this.line = this.NewContactList[i].info
              } else {
                this.line = this.lineArr.join(',')
              }
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 1.4 共享者打开或关闭接单开关
    // 接口URL: http://boss.pigamegroup.com/pigame/bossTakeOrderOpen
    getAddress () {
      let url = `${this.$api2}pigame/bossTakeOrderOpen?bossinfoid=${this.bossinfoid}&takeOrderDeposit=${this.takeOrderDeposit}&takeOrderDraw=${this.takeOrderDraw}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') { // 获取充值费率和提现费率
          this.depositRate = res.data.data.depositRate
          this.drawRate = res.data.data.drawRate
          this.realname = res.data.data.realname
          this.contactAddress = res.data.data.contactAddress
          // if (res.data.data.isTakeOrderDeposit === 1) {
          //   this.takeOrderDeposit = 1
          // } else {
          //   this.takeOrderDeposit = 2
          // }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 1.5 查询共享者币种设置列表
    // 接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList
    getCurrencyList () {
      let url = `${this.$api2}pigame/queryBossSupportCurrencyList`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.currencyList = res.data.data
          this.currencyList.forEach(val => {
            val.flag = true
          })
          this.newCurrencyList = this.currencyList
          // console.log(this.newCurrencyList)
          this.newCurrencyList.forEach(item => { // 支持充值或提现标识 1未支持 2支付充值 3支付提现 4支付充值与提现
           if (item.bossCurrency.supportDepositAndDrawFlag === 1) {
             this.depositFlag = 0
             this.drawFlag = 0
           } else if (item.bossCurrency.supportDepositAndDrawFlag === 2) {
             this.depositFlag = 1
             this.drawFlag = 0
           } else if (item.bossCurrency.supportDepositAndDrawFlag === 3) {
             this.depositFlag = 0
             this.drawFlag = 1
           } else if (item.bossCurrency.supportDepositAndDrawFlag === 4) {
             this.depositFlag = 1
             this.drawFlag = 1
           }
            this.currency = item.currency
            // console.log(item.bossCurrency.supportDepositAndDrawFlag, 111)
            this.getCurrencyOpen()
        })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 1.6 共享者币种支持充值与提现开关
    // 接口URL: http://boss.pigamegroup.com/pigame/bossSupprtCurrencyOpen
    getCurrencyOpen () {
      let url = `${this.$api2}pigame/bossSupprtCurrencyOpen?currency=${this.currency}&depositFlag=${this.depositFlag}&drawFlag=${this.drawFlag}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          // console.log(this.depositFlag, this.drawFlag)
          // console.log(res.data)
          // if (this.depositFlag === 1) {
          //   this.depositFlag = 0
          // } else {
          //   this.depositFlag = 1
          // }
          // if (this.drawFlag === 1) {
          //   this.drawFlag = 0
          // } else {
          //   this.drawFlag = 1
          // }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooseCheckBox (index, supportDepositAndDrawFlag, currency) { // 设置币种充值
      if (supportDepositAndDrawFlag === 1) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 2
        this.depositFlag = 1
        this.drawFlag = 0
      } else if (supportDepositAndDrawFlag === 2) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 1
        this.depositFlag = 0
        this.drawFlag = 0
      } else if (supportDepositAndDrawFlag === 3) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 4
        this.depositFlag = 1
        this.drawFlag = 1
      } else if (supportDepositAndDrawFlag === 4) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 3
        this.depositFlag = 0
        this.drawFlag = 1
      }
      this.currency = currency
      this.getCurrencyOpen()
    },
    CheckDraw (index, supportDepositAndDrawFlag, currency) { // 设置币种提现
      if (supportDepositAndDrawFlag === 1) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 3
        this.drawFlag = 1
        this.depositFlag = 0
      } else if (supportDepositAndDrawFlag === 2) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 4
        this.drawFlag = 1
        this.depositFlag = 1
      } else if (supportDepositAndDrawFlag === 3) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 1
        this.drawFlag = 0
        this.depositFlag = 0
      } else if (supportDepositAndDrawFlag === 4) {
        this.newCurrencyList[index].bossCurrency.supportDepositAndDrawFlag = 2
        this.drawFlag = 0
        this.depositFlag = 1
      }
      this.currency = currency
      this.getCurrencyOpen()
    },
    changeBox (val) {
      if (val === 1) {
        if (this.takeOrderDeposit === 0 || this.takeOrderDeposit === 2) {
          this.takeOrderDeposit = 1
          // console.log(this.takeOrderDeposit)
          // localStorage.setItem('takeOrderDeposit', 1)
        } else {
          this.takeOrderDeposit = 2
          // console.log(this.takeOrderDeposit)
        }
      } else {
        if (this.takeOrderDraw === 0 || this.takeOrderDraw === 2) {
          this.takeOrderDraw = 1
        } else {
          this.takeOrderDraw = 2
        }
      }
      this.getAddress()
    },
    // 点击修改提现费率
    reviseBtn (index) {
      if (index === 1) {
        this.depositShow = !this.depositShow
      } else {
        this.drawShow = !this.drawShow
      }
      // if (this.$refs.inputRate.disabled) {
      //   this.forbidden = false
      //   this.$refs.inputRate.disabled = false
      //   this.errTip = ''
      // }
    },
    // 1.2 修改共享者信息
    // 接口URL: http://boss.pigamegroup.com/pigame/modifyBossinfo
    // 点击提现费率保存
    saveBtn () {
      if (!this.drawRate) {
        this.errTip = this.$t('setSharePay.text23')
      } else if (this.drawRate > 100) {
        this.errTip = this.$t('setSharePay.text26')
      } else {
        let url = `${this.$api2}pigame/modifyBossinfo?realname=${this.realnameTwo}&phoneCode=${this.phoneCode}&phoneNumber=${this.phoneNumber}&contactAddress=${this.contactAddressTwo}&depositRate=${this.depositRate}&drawRate=${this.drawRate}`
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            this.getAddress()
            this.drawShow = !this.drawShow
            this.errTip = ''
            // this.drawRate = ''
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    depositBtn () {
      if (!this.depositRate) {
        this.errWarn = this.$t('setSharePay.text31')
      } else if (this.depositRate > 100) {
        this.errWarn = this.$t('setSharePay.text27')
      } else {
        let url = `${this.$api2}pigame/modifyBossinfo?realname=${this.realnameTwo}&phoneCode=${this.phoneCode}&phoneNumber=${this.phoneNumber}&contactAddress=${this.contactAddressTwo}&depositRate=${this.depositRate}&drawRate=${this.drawRate}`
        this.$http.post(url).then(res => {
          if (res.data.status === 'success') {
            this.getAddress()
            this.depositShow = !this.depositShow
            this.errWarn = ''
            // this.drawRate = ''
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    cancelBtn (index) {
      if (index === 1) {
        this.depositRate = ''
        this.depositShow = !this.depositShow
        this.errWarn = ''
        this.getAddress()
      } else {
        this.drawRate = ''
        this.drawShow = !this.drawShow
        this.errTip = ''
        this.getAddress()
      }
    },
    checkInput(field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
    },
    // 点击新增联系方式
    contactBtn () {
      this.typeValue = 'wechat'
      if (this.NewContactList.length < 5) {
          if (this.ContactList.length <= 0) {
            this.ContactList.push({
              type: '',
              info: '',
              operation: ''
            })
          } else {
            this.errText = this.$t('setSharePay.text28')
            this.errMsg = ''
          }
        } else {
        this.errTips = this.$t('setSharePay.text29')
      }
      this.errMsg = ''
    },
    btnChoose (index) {
      if (this.typeShow !== -1) {
        this.typeShow = -1
      } else {
        this.typeShow = index
      }
    },
    // 点击下拉框
    chooseType (val, type, index) {
      this.switchOne = index
      this.typeValue = val
      this.typeShow = index
    },
    // 1.3 修改共享者联系方式
    // 接口URL: http://boss.pigamegroup.com/pigame/modifyBossContactWay
    // 新增联系方式保存
    saveType (i) {
      let index = this.switchOne
      if (this.contactType) {
        this.NewContactList = [] // 先清空联系方式的数组
        if (index === 0) {
          this.wechatArr.push(this.contactType) // 把添加的方式加到每个联系方式的数组
          if (this.wechatArr.length === 1) {
            this.wechat = this.contactType
          } else {
            this.wechat = this.wechatArr.join(',') // 把每个联系方式的数组转换成字符串
          }
          // console.log(this.wechat)
        } else if (index === 1) {
          // console.log(this.qqArr)
          this.qqArr.push(this.contactType)
          if (this.qqArr.length === 1) {
            this.qq = this.contactType
          } else {
            this.qq = this.qqArr.join(',')
          }
          // console.log(this.qq)
          // this.qq = this.contactType
        } else if (index === 2) {
          this.facebookArr.push(this.contactType)
          if (this.facebookArr.length === 1) {
            this.facebook = this.contactType
          } else {
            this.facebook = this.facebookArr.join(',')
          }
          // this.facebook = this.contactType
        } else if (index === 3) {
          this.skypeArr.push(this.contactType)
          if (this.skypeArr.length === 1) {
            this.skype = this.contactType
          } else {
            this.skype = this.skypeArr.join(',')
          }
          // this.skype = this.contactType
        } else if (index === 4) {
          this.twitterArr.push(this.contactType)
          if (this.twitterArr.length === 1) {
            this.twitter = this.contactType
          } else {
            this.twitter = this.twitterArr.join(',')
          }
          // this.twitter = this.contactType
        } else if (index === 5) {
          this.whatsappArr.push(this.contactType)
          if (this.whatsappArr.length === 1) {
            this.whatsapp = this.contactType
          } else {
            this.whatsapp = this.whatsappArr.join(',')
          }
          // this.whatsapp = this.contactType
        } else if (index === 6) {
          this.lineArr.push(this.contactType)
          if (this.lineArr.length === 1) {
            this.line = this.contactType
          } else {
            this.line = this.lineArr.join(',')
          }
          // this.line = this.contactType
        }
        let formData = new FormData()
        formData.append('qq', this.qq)
        formData.append('wechat', this.wechat)
        formData.append('facebook', this.facebook)
        formData.append('skype', this.skype)
        formData.append('twitter', this.twitter)
        formData.append('whatsapp', this.whatsapp)
        formData.append('line', this.line)
        // let url = `${this.$api2}pigame/modifyBossContactWay?qq=${this.qq}&wechat=${this.wechat}&facebook=${this.facebook}&skype=${this.skype}&twitter=${this.twitter}&whatsapp=${this.whatsapp}&line=${this.line}`
        this.$http.post(`${this.$api2}pigame/modifyBossContactWay`, formData).then(res => {
          if (res.data.status === 'success') {
            this.contactType = ''
            this.errText = ''
            this.switchOne = 0
            this.ContactList.splice(i, 1)
            let contactWayData = JSON.parse(res.data.data.contactWay)
            // console.log(contactWayData)
            for (var key in contactWayData) {
              // console.log(key, contactWayData[key])
              let contactArr = contactWayData[key].split(',')
              // if (key === 'wechat') {
              //   key = '微信'
              // }
              // console.log(contactArr)
              for (let i = 0; i < contactArr.length; i++) {
                var obj = {}
                obj.info = contactArr[i]
                obj.type = key
                // console.log(key, contactArr[i])
                this.NewContactList.push(obj)
              }
            }
          }
          // console.log(this.NewContactList)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.errText = this.$t('setSharePay.text24')
        this.errMsg = ''
      }
    },
    // 新增联系方式取消
    cancelContact (index) {
      if (this.ContactList.length >= 1) {
        this.ContactList.splice(index, 1)
      }
      this.errText = ''
      this.errMsg = ''
    },
    // 点击删除联系方式
    deleteContact (index, type) {
      this.errTips = ''
      if (this.NewContactList.length <= 1) {
        this.errMsg = this.$t('setSharePay.text30')
        this.errText = ''
        return false
      } else {
        this.NewContactList.splice(index, 1) // 删除一条联系方式的数组
      }
      // this.qqArr = []
      // this.wechatArr = []
      // this.qqArr = this.qq.split(',')
      // if (this.qqArr.length === 1) {
      //   this.qq = ''
      //   this.qqArr = []
      // } else {
      //   for (let i = 0; i < this.qqArr.length; i++) {
      //     if (this.qqArr[i] === this.NewContactList[index].info) {
      //       this.qqArr.splice(i, 1)
      //       this.qq = this.qqArr.join(',')
      //     }
      //   }
      // }
      // this.wechatArr = this.wechat.split(',')
      // if (this.wechatArr.length === 1) {
      //   this.wechat = ''
      //   this.wechatArr = []
      // } else {
      //   for (let i = 0; i < this.wechatArr.length; i++) {
      //     if (this.wechatArr[i] === this.NewContactList[index].info) {
      //       this.wechatArr.splice(i, 1)
      //       this.wechat = this.wechatArr.join(',')
      //     }
      //   }
      // }
      if (type === 'qq') {
        this.qqArr = [] // 清空每个联系方式的数组
        this.NewContactList.forEach((item) => {
          if (item.type === 'qq') {
            this.qqArr.push(item.info)
          }
        })
        this.qq = this.qqArr.join(',')
      } else if (type === 'wechat') {
        this.wechatArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'wechat') {
            this.wechatArr.push(item.info)
          }
        })
        this.wechat = this.wechatArr.join(',')
      } else if (type === 'facebook') {
        this.facebookArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'facebook') {
            this.facebookArr.push(item.info)
          }
        })
        this.facebook = this.facebookArr.join(',')
      } else if (type === 'skype') {
       this.skypeArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'skype') {
            this.skypeArr.push(item.info)
          }
        })
        this.skype = this.skypeArr.join(',')
      } else if (type === 'twitter') {
        this.twitterArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'twitter') {
            this.twitterArr.push(item.info)
          }
        })
        this.twitter = this.twitterArr.join(',')
      } else if (type === 'whatsapp') {
        this.whatsappArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'whatsapp') {
            this.whatsappArr.push(item.info)
          }
        })
        this.whatsapp = this.whatsappArr.join(',')
      } else if (type === 'line') {
        this.lineArr = []
        this.NewContactList.forEach((item) => {
          if (item.type === 'line') {
            this.lineArr.push(item.info)
          }
        })
        this.line = this.lineArr.join(',')
      }
      this.NewContactList = []
      let formData = new FormData()
      formData.append('qq', this.qq)
      formData.append('wechat', this.wechat)
      formData.append('facebook', this.facebook)
      formData.append('skype', this.skype)
      formData.append('twitter', this.twitter)
      formData.append('whatsapp', this.whatsapp)
      formData.append('line', this.line)
      // let url = `${this.$api2}pigame/modifyBossContactWay?qq=${this.qq}&wechat=${this.wechat}&facebook=${this.facebook}&skype=${this.skype}&twitter=${this.twitter}&whatsapp=${this.whatsapp}&line=${this.line}`
      this.$http.post(`${this.$api2}pigame/modifyBossContactWay`, formData).then(res => {
        if (res.data.status === 'success') {
          let contactWayData = JSON.parse(res.data.data.contactWay)
          // console.log(contactWayData)
          for (var key in contactWayData) {
            // console.log(key, contactWayData[key])
            let contactArr = contactWayData[key].split(',')
            // if (key === 'wechat') {
            //   key = '微信'
            // }
            // console.log(contactArr)
            for (let i = 0; i < contactArr.length; i++) {
              var obj = {}
              obj.info = contactArr[i]
              obj.type = key
              // console.log(key, contactArr[i])
              this.NewContactList.push(obj)
            }
            // console.log(obj)
          }
          // console.log(this.NewContactList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    focusInput () {
      this.errTip = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  input
    outline none
.setSharePay
  .setSharePay-content
    .setSharePay-title
      font-size 34px
      color #1a1a1a
      font-weight bold
    .setSharePay-box
      width 580px
      margin 0 auto
      padding-top 60px
      h3
        font-size 20px
        color #1a1a1a
        font-weight bold
        height 50px
        line-height 50px
        margin-bottom 10px
    .fees-box
      padding-top 30px
      .fees-content
        display flex
        height 44px
        align-items center
        justify-content space-between
        font-size 16px
        color #1a1a1a
        .revise
          width 10%
          color #ffba14
          cursor pointer
          outline none
          user-select none
    .err-tip
      margin-left 135px
      font-size 14px
      color #E93A3A
    .withdraw-rate
      padding-top 30px
      .rate-box
        display flex
        height 44px
        align-items center
        font-size 16px
        color #1a1a1a
        .rate
          margin-right 72px
        input
          border 1px solid #c4c6cc
          border-radius 4px
          padding 0 25px
          height 40px
          width 280px
          margin-right 20px
        .input-box
          position relative
          .disableBtn
            cursor not-allowed
          .percent
            position absolute
            right 30px
            top 12px
        .save-btn
          width 60px
          height 34px
          background-color #ffba14
          border-radius 4px
          margin-right 20px
          color #fff
          text-align center
          line-height 34px
          cursor pointer
          outline none
          user-select none
        .cancel-btn
          color #e93a3a
          cursor pointer
          outline none
          user-select none
    .support-box
      padding-top 60px
      .support-type
        display flex
        justify-content space-between
        font-size 16px
        color #1a1a1a
        .account-info
          cursor pointer
          outline none
          user-select none
          height 34px
          width 140px
          border 1px solid #ffba14
          border-radius 4px
          color #ffba14
          text-align center
          line-height 34px
        .support-set
          font-size 20px
          color #1a1a1a
          font-weight bold
    .personal-info
      padding-top 60px
    .personal-box
      font-size 16px
      color #1a1a1a
      padding-top 60px
      .personal-content
        display flex
        height 44px
        line-height 44px
        .name
          margin-right 138px
    .contact-info
      margin-top 60px
      margin-bottom 20px
    .add-contact
      margin-top 30px
      width 580px
      height 50px
      border 1px solid #ffba14
      border-radius 4px
      color #ffba14
      font-size 16px
      text-align center
      line-height 50px
      cursor pointer
      outline none
      user-select none
  .shareTable
    width 100%
    display: block;
    margin-top 20px
    thead
      display: block;
      tr
        display flex
        align-items center
        height 44px
        width 100%
        font-size 16px
        color #666
        background-color #fff
        td
          height 100%
          line-height 44px
          text-align center
          border 1px solid #e7e8ec
          &.type
            width 140px
          &.contact
            width 300px
          &.operation
            width 140px
    tbody
      width 100%
      display block
      tr
        display flex
        align-items center
        height 44px
        width 100%
        font-size 16px
        color #1a1a1a
        &:nth-child(odd)
          background-color #fcfcfc
        &:nth-child(even)
          background-color #fff
        td
          height 100%
          line-height 44px
          text-align center
          border 1px solid #e7e8ec
          &.contact-way
            user-select none
            cursor pointer
          &.type
            width 140px
            position relative
            z-index 20
            .transfer-input
              display block
              width 95%
              height 44px
              line-height 44px
              text-align center
              font-size 16px
              color #1a1a1a
              outline none
              box-sizing border-box
              transition: border-color .15s ease-in-out
              user-select none
              cursor pointer
            input::-webkit-input-placeholder{
              color:#1a1a1a
             }
            input::-moz-placeholder{   /* Mozilla Firefox 19+ */
              color:#1a1a1a
            }
            input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
              color:#1a1a1a
            }
            input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
              color:#1a1a1a
            }
            .discount-btn
              right 20px
              height 100%
              position absolute
              font-size 0
              top 2px
              display flex
              align-items center
              justify-content center
              cursor pointer
              user-select none
              .arrowDown
                background url("../../assets/images/share/down_black.png") no-repeat
                display inline-block
                width 11px
                height 6px
                background-size cover!important
                transition .2s
                &.arrowActive
                  transform rotate(180deg)
            .selectMenu
              width 140px
              height 0
              position absolute
              top 42px
              left -1px
              background-color #fff
              transition all 0.3s linear
              z-index 20
              overflow-y: auto;
              &.selectMenuActive
                height 120px
              li
                font-size 16px
                border 1px solid #e7e8ec
                height 44px
                line-height 44px
                color #999
                user-select none
                cursor pointer
                &:hover
                  color #1a1a1a
                  background-color #fcfcfc
          &.contact
            width 300px
            .contact-input
              width 100%
              height 100%
              border-radius 0
              border 0
              padding 0 20px 0 20px
              text-align center
              line-height 44px
          &.operation
            color #e93a3a
            cursor pointer
            outline none
            user-select none
            width 140px
      .errinMsg
        color #e93a3a
        font-size 14px
        margin-top 10px
</style>
