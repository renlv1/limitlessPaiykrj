<template>
  <div class="goodsParticular">
    <div class="goodsParticular-box">
      <div class="goodsParticular-content">
        <div class="goodsParticular-title">
          <h6><router-link to="/home" class="property">{{$t('home.text1')}} >  </router-link> <span> {{$t('home.text15')}}</span></h6>
        </div>
        <div class="goods-box">
          <div class="goods-lt">
            <div class="goods-picture">
              <ul class="big-picture">
                <li>
                  <img :src="imgUrl" alt="" id="goodsImg" v-show="imgShow">
                  <!--<div class="picture-title">{{item.text}}</div>-->
                </li>
              </ul>
            </div>
            <ul class="small-picture">
              <li v-for="(item,index) in imgArr" :key="index" @click="toGoodsPicture(item,index)" :class="{activeImg: isActiveImg === index}">
                <img :src="item" alt="">
              </li>
            </ul>
          </div>
          <div class="goods-rt">
            <p>{{productName}}</p>
            <div class="kucun-box">
              <div class="kucun"><span>{{$t('home.text12')}}: </span><i>{{saleNum}} </i></div>
              <div class="shop-name"><span>{{$t('home.text16')}}: </span><i>{{merchantName}}</i></div>
            </div>
            <!--确认出价-->
            <div class="time-content" v-if="status === 6">
              <div class="time-box">
                <div class="time-icon"><div class="icon"></div></div>
                <div class="time-title">{{$t('home.text17')}}</div>
                <div class="countDown-box">
                  <span class="hour">{{hour}}</span>
                  <span class="colon">:</span>
                  <span class="min">{{min}}</span>
                  <span class="colon">:</span>
                  <span class="seconds">{{sec}}</span>
                </div>
              </div>
              <div class="price-box">
                <div class="now-price"><span>{{$t('home.text9')}} </span><i>{{nowBidPrice}} π</i></div>
                <div class="price-name"><span>{{$t('home.text18')}}: </span><i v-if="productUserName">{{productUserName}}</i><i v-else>{{$t('home.text19')}}</i></div>
              </div>
              <div class="line"></div>
              <div class="begin-price">
                <span>{{$t('home.text13')}}</span><i>{{mineSalePrice | fourNumber}} π</i>
              </div>
              <div class="calculate-box">
                <div class="calculate">
                  <div class="minus" @click="btnMinus"><div class="minus-icon"></div></div>
                  <div class="money-input usernone">
                    <input type="text" v-model.trim="inputPrice" @input="checkInput('inputPrice')" @focus="focusInput()" onpaste="return false">
                    <p class="pai">π</p>
                  </div>
                  <div class="add" @click="btnAdd"><div class="add-icon"></div></div>
                </div>
                <div class="add-price" v-show="addPriceType === 1">{{$t('home.text20')}}: <span>{{addPriceRate}}%</span><i v-show="addPriceMode === 1">（{{$t('home.text21')}}）</i><i v-show="addPriceMode === 2">（{{$t('home.text22')}}）</i></div>
                <div class="add-price" v-show="addPriceType === 2">{{$t('home.text20')}}: <span>{{addPriceRate}} π</span></div>
              </div>
              <div class="account-money"><span>{{$t('home.text23')}}: </span><i>{{account.piBalance | fourNumber}} π</i></div>
              <div class="btn-box">
                <div class="btn-confirm" @click="btnConfirm()">{{$t('home.text24')}}</div>
                <p class="tip-title">{{$t('home.text25')}}</p>
              </div>
              <p class="errTip">{{errTipShow}}</p>
            </div>
            <!--开拍时间-->
            <div class="time-content" v-if="status === 2">
              <p><span>{{$t('home.text26')}}</span><i>{{nowBidPrice | fourNumber}} π</i></p>
              <div class="btn-begin"><span>{{$t('home.text27')}}</span><i>{{$changeDate(startSaleDate, '.')}}</i></div>
            </div>
            <!--竞拍结束-->
            <div class="time-content" v-if="status === 4 || status === 5">
              <p><span>{{$t('home.text28')}}</span><i>{{nowBidPrice | fourNumber}} π</i><span>{{$t('home.text29')}}:</span><span>{{productUserName}}</span></p>
              <div class="btn-begin"><span>{{$t('home.text30')}}</span></div>
            </div>
          </div>
        </div>
        <div class="goods-content">
          <ul class="order-tab">
            <li :class="{tabActive: orderTab === 1}" @click="toChoose(1)">{{$t('home.text15')}}</li>
            <li :class="{tabActive: orderTab === 2}" @click="toChoose(2)">{{$t('home.text31')}}<span v-if="totalCount">({{totalCount}})</span><span v-else>(0)</span></li>
          </ul>
        </div>
        <div class="goods-ct" v-if="orderTab === 1">
          <div class="introduce-box">
            <p><span>{{$t('home.text32')}}：</span>{{productContent}}</p>
          </div>
          <div class="line"></div>
          <div class="introduce-pt">
            <ul>
              <li v-for="(item,index) in contentImg" :key="index">
                <img :src="item" alt="">
              </li>
            </ul>
          </div>
        </div>
        <table class="commonTableList" v-if="orderTab === 2" >
          <thead>
          <tr>
            <td class="kong"></td>
            <td class="status">{{$t('home.text33')}}</td>
            <td class="auction">{{$t('home.text34')}}</td>
            <td class="price">{{$t('home.text35')}}</td>
            <td class="time">{{$t('home.text36')}}</td>
            <td class="kong"></td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in ProductOfBidRecordList" :key="index">
            <td class="kong"></td>
            <td class="status">{{recordStatus(item.status)}}</td>
            <td class="auction">{{(item.userName)}}</td>
            <td class="price">{{item.bidPrice | fourNumber}}π</td>
            <td class="time">{{$changeDate(item.createAt, '.', 8)}}</td>
            <td class="kong"></td>
          </tr>
          </tbody>
          <div class="load-more-box" v-show="ProductOfBidRecordList.length === 0">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="ProductOfBidRecordList.length !== 0" :propsPage="recordTotal" @recordTrun="recordTurnPage"></v-turnPage>
        </table>
      </div>
    </div>
    <!--确定弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('dialog.text1')}}</h3>
          <p class="pay-price">{{inputPrice}}π</p>
          <h5 class="trade-password">{{$t('dialog.text2')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword"  value="" :placeholder="$t('dialog.text3')">
          <!--<ul class="verifier-tab">-->
            <!--<li :class="{activeVerify:!isgogoleDuanxin}" @click="toVerify(1)" v-if="userData.openGoogleCode === 2">谷歌验证</li>-->
            <!--<li :class="{activeVerify:isgogoleDuanxin}" @click="toVerify(2)" v-if="userData.openMobileCode === 2">短信验证</li>-->
          <!--</ul>-->
          <!-- 短信-->
          <!--<div class="shortMsg" v-show="isgogoleDuanxin">-->
            <!--<div class="payMsg-box">-->
              <!--<input class="payMsg tradingCenter-input" v-model.trim="payCode"  placeholder="请输入短信验证码" type="text" value="">-->
              <!--<button class="sendMsg" @click="getCode()" ref="sendMsg" :class="{'disable': isDisabled}">{{sendBtnValue}}</button>-->
            <!--</div>-->
          <!--</div>-->
          <h5 class="trade-password">{{$t('dialog.text4')}}</h5>
          <!--谷歌-->
          <div class="shortMsg" v-show="!isgogoleDuanxin">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode"   :placeholder="$t('dialog.text5')" type="number" value="">
            </div>
          </div>
          <div class="errmsg-tips">{{payFailTip}}</div>
          <div class="pay-box">
            <button class="pay-btn" @click="closeIcon()">{{$t('dialog.text6')}}</button>
            <button class="tradingCenter-btn" @click="confirmPay()">{{$t('dialog.text7')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!--完成弹窗-->
    <div class="myPopup" v-show="confirmShow">
      <div class="myPopup-box">
        <a class="close" @click="closeIcon"><img src="../../assets/images/home/Shutdown.png" alt=""></a>
        <!--支付成功弹窗-->
        <div v-show="isSuccess">
          <h3 class="title">{{$t('dialog.text8')}}</h3>
          <button class="tradingCenter-btn" @click="successPay">{{$t('dialog.text9')}}</button>
        </div>
        <!--支付失败弹窗-->
        <div v-show="!isSuccess" class="isFailed">
          <span class="title">{{$t('dialog.text10')}}:</span>
          <span class="failed-errinMsg">{{errinMsgText}}</span>
          <button class="tradingCenter-btn" @click="failedDialog">{{$t('dialog.text9')}}</button>
        </div>
      </div>
    </div>
    <!-- 未设置验证码-->
    <div class="myPopup" v-if="setSafeVerific">
      <div class="myPopup-box" >
        <div class="close" @click="setSafeVerific = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('dialog.text11')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('dialog.text6')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('dialog.text12')}}</button>
        </div>
      </div>
    </div>
    <!--请先绑定手机号码-->
    <div class="myPopup" v-show="noBindPhoneShow">
      <div class="myPopup-box">
        <div class="close" @click="oBindPhoneShow = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>
        <h3 class="error-text">{{$t('dialog.text13')}}</h3>
        <button class="tradingCenter-btn" @click="noBindPhoneShow = false">{{$t('dialog.text14')}}</button>
      </div>
    </div>
    <!--申请共享者-->
    <!--<div class="myPopup" v-show="sharerShow">-->
      <!--<div class="myPopup-box">-->
        <!--<div class="close" @click="sharerShow = false"><img src="../../assets/images/home/Shutdown.png" alt=""></div>-->
        <!--<h3 class="tip-title">仅共享者能参与代理商竞拍,请您先申请共享者</h3>-->
        <!--<ul class="toShare">-->
          <!--<li class="tradingCenter-btn" @click="sharerShow = false">取消</li>-->
          <!--<li class="tradingCenter-btn" @click="$router.push('/becomeSharer')">去申请</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      id: this.$route.query.id,
      productName: '', // 商品名称
      saleNum: '', // 库存
      merchantName: '', // 商家店名
      nowBidPrice: '', // 当前价
      productUserName: '', // 出价人
      mineSalePrice: '', // 初始价
      imgArr: [], // 小的预览图
      productContent: '', // 产品介绍
      startSaleDate: '', // 开拍时间
      imgShow: false,
      hour: '',
      min: '',
      sec: '',
      addPriceType: '', // 加价方式
      addPriceRate: '', // 加价幅度
      addPriceMode: '', // 百分比加价计算方式
      status: '', // 2.开拍时间 4、5.竞拍结束 6.竞价中
      ProductOfBidRecordList: [], // 记录列表
      pageSize: 20,
      isActiveImg: 0,
      orderTab: 1,
      isLoadMore: true,
      inputPrice: '', // 出价金额
      errTipShow: '', // 错误提示
      payPopupShow: false, // 确定弹窗
      isgogoleDuanxin: true, // 判断短信还是谷歌 默认谷歌
      confirmShow: false, // 完成弹窗
      setSafeVerific: false, // 未设置安全验证弹窗
      isSuccess: true,
      payFailTip: '', // 确认支付提示
      errinMsgText: '', // 支付失败提示
      noBindPhoneShow: false, // 未绑定手机弹窗
      sharerShow: false, // 申请共享着弹窗
      payPassword: '', // 安全码
      payCode: '', // 验证码
      codeType: '', // 验证码类型（谷歌验证码。手机验证码）
      sendBtnValue: '获取验证码',
      sendBtnTimes: 60,
      timer: null,
      timer2: null,
      isDisabled: false,
      maxInput: 0,
      recordTotal: 1, // 竞拍记录页数
      recordPage: '', // 竞拍记录分页
      totalCount: '', // 竞拍记录总条数
      activeVerifier: true,
      imgUrl: '', // 预览图
      variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
      timer4: null,
      bottomPrice: '', // 最低价
      chushiPrice: '', // 初始价
      contentImg: [] // 介绍图
    }
  },
  computed: {
    ...mapGetters([
      'account',
      'userData'
    ])
  },
  created () {
    this.getProductDetail()
    this.getProductOfBidRecordList(1)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    // clearInterval(this.timer2)
    clearInterval(this.timer4)
  },
  components: {
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  methods: {
    // 1.4 竞价产品详情
    getProductDetail () {
      let url = `${this.$api2}infinite/infiniteProductDetail?productId=${this.id}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.productName = res.data.data.productName
          this.saleNum = res.data.data.saleNum
          this.merchantName = res.data.data.merchantName
          this.chushiPrice = res.data.data.nowBidPrice
          this.nowBidPrice = this.$toFixedNumber(res.data.data.nowBidPrice)
          this.mineSalePrice = res.data.data.mineSalePrice
          // this.inputPrice = this.nowBidPrice
          this.addPriceType = res.data.data.addPriceType
          this.addPriceRate = res.data.data.addPriceRate
          this.addPriceMode = res.data.data.addPriceMode
          if (this.addPriceType === 1) {
            if (this.addPriceMode === 1) {
              this.inputPrice = (Number(this.nowBidPrice) + Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
              this.bottomPrice = (Number(this.nowBidPrice) + Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
              this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
              this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
            } else {
              this.inputPrice = (Number(this.nowBidPrice) + Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
              this.bottomPrice = (Number(this.nowBidPrice) + Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
              this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
              this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
            }
          } else {
            this.inputPrice = Number(this.nowBidPrice) + Number(this.addPriceRate)
            this.bottomPrice = Number(this.nowBidPrice) + Number(this.addPriceRate)
            this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
            this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
          }
          let imgUrl
          if (res.data.data.coverImg.split(',')[0].indexOf('http') > -1) {
            imgUrl = res.data.data.coverImg.split(',')[0]
            // this.isActiveImg = 0
          } else {
            imgUrl = this.variable + res.data.data.coverImg.split(',')[0]
            // this.isActiveImg = 0
        }
          this.imgUrl = imgUrl
          this.imgArr = []
          this.contentImg = []
          let coverImg = res.data.data.coverImg.split(',')
          for (let i = 0; i < coverImg.length; i++) {
            if (coverImg[i].indexOf('http') > -1) {
              this.imgArr.push(coverImg[i])
            } else {
              this.imgArr.push(this.variable + coverImg[i])
            }
          }
          if (res.data.data.contentImg) {
            let contentIMG = res.data.data.contentImg.split(',')
            for (let j = 0; j < contentIMG.length; j++) {
              if (contentIMG[j].indexOf('http') > -1) {
                this.contentImg.push(contentIMG[j])
              } else {
                this.contentImg.push(this.variable + contentIMG[j])
              }
            }
          }
          this.status = res.data.data.status
          this.productContent = res.data.data.productContent
          this.startSaleDate = res.data.data.startSaleDate
          if (res.data.data.productUserName) {
            this.productUserName = res.data.data.productUserName
          }
          let bidLastTime = res.data.data.bidLastTime // 剩余出价时间（秒数）
          this.timer2 = setInterval(() => {
            bidLastTime--
            if (bidLastTime <= 0) {
              this.hour = '00'
              this.min = '00'
              this.sec = '00'
              clearInterval(this.timer2)
            } else {
              this.hour = parseInt(Number(bidLastTime) / 60 / 60 % 24)
              if (Number(this.hour) === 0) {
                this.hour = '00'
              } else if (Number(this.hour) < 10) {
                this.hour = '0' + this.hour
              } else {
                this.hour = this.hour
              }
              this.min = parseInt(Number(bidLastTime) / 60 % 60)
              if (Number(this.min) === 0) {
                this.min = '00'
              } else if (Number(this.min) < 10) {
                this.min = '0' + this.min
              } else {
                this.min = this.min
              }
              this.sec = parseInt(Number(bidLastTime) % 60)
              if (Number(this.sec) === 0) {
                this.sec = '00'
              } else if (Number(this.sec) < 10) {
                this.sec = '0' + this.sec
              } else {
                this.sec = this.sec
              }
            }
          }, 1000)
          setTimeout(() => {
            if ($('#goodsImg').outerWidth() > $('#goodsImg').outerHeight()) {
              $('#goodsImg').css('width', '100%')
              this.imgShow = true
            } else {
              $('#goodsImg').css('height', '100%')
              this.imgShow = true
            }
          }, 100)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 竞拍记录列表
    getProductOfBidRecordList (page) {
      let url = `${this.$api2}infinite/queryProductOfBidRecordList?productId=${this.id}&pageIndex=${page}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.ProductOfBidRecordList = res.data.data.infiniteBidList
          this.recordTotal = res.data.data.totalPage
          this.totalCount = res.data.data.totalCount
        }
      })
    },
    toGoodsPicture (item, index) {
      this.imgUrl = item
      this.isActiveImg = index
    },
    toChoose (num) {
      if (num === 1) {
        this.orderTab = 1
        // this.getProductDetail()
      } else if (num === 2) {
        this.orderTab = 2
        this.getProductOfBidRecordList(1)
      }
    },
    // 记录状态
    recordStatus (status) {
      if (status === 1 || status === 3) {
        return this.$t('home.text37')
      } else if (status === 2) {
        return this.$t('home.text38')
      } else if (status === 4) {
        return this.$t('home.text39')
      }
    },
    // 减
    btnMinus () {
      this.errTipShow = ''
      if (this.inputPrice > 0) {
        if (this.addPriceType === 1) {
          if (this.addPriceMode === 1) {
            if (this.inputPrice < (Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100))) {
              this.inputPrice = 0
            } else {
              // this.inputPrice = (Number(this.inputPrice) - Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)).toFixed(4)
              let addRate = Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)
              let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
              this.inputPrice = (Number(this.inputPrice) - Number(addPrice)).toFixed(4)
            }
          } else {
            if (this.inputPrice < (Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100))) {
              this.inputPrice = 0
            } else {
              // this.inputPrice = (Number(this.inputPrice) - Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)).toFixed(4)
              let addRate = Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)
              let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
              this.inputPrice = (Number(this.inputPrice) - Number(addPrice)).toFixed(4)
            }
          }
        } else {
          if (this.inputPrice < (Number(this.addPriceRate))) {
            this.inputPrice = 0
          } else {
            let addPrice = (Number(this.inputPrice) - (Number(this.addPriceRate))).toFixed(4)
            this.inputPrice = (Number(addPrice * 10000) / 10000).toFixed(4)
          }
        }
      } else {
        this.inputPrice = 0
      }
    },
    // 加
    btnAdd () {
      this.errTipShow = ''
      if (this.inputPrice >= 0) {
        if (this.addPriceType === 1) {
          if (this.addPriceMode === 1) {
            // this.inputPrice = (Number(this.inputPrice) + Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)).toFixed(4)
            let addRate = Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)
            let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
            this.inputPrice = (Number(this.inputPrice) + Number(addPrice)).toFixed(4)
          } else {
            // this.inputPrice = (Number(this.inputPrice) + Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)).toFixed(4)
            let addRate = Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)
            let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
            this.inputPrice = (Number(this.inputPrice) + Number(addPrice)).toFixed(4)
          }
        } else {
          let addPrice = (Number(this.inputPrice) + (Number(this.addPriceRate)))
          this.inputPrice = (Number(addPrice * 10000) / 10000).toFixed(4)
        }
      } else {
        this.inputPrice = 0
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
    focusInput () {
    },
    // 确认出价按钮
    btnConfirm () {
      this.errTipShow = ''
      if (this.addPriceType === 1) {
        if (this.addPriceMode === 1) {
          let lowPrice = (Number(this.nowBidPrice) + Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
          this.bottomPrice = (Number(lowPrice * 10000) / 10000).toFixed(4)
          if (Number(this.inputPrice) < Number(this.bottomPrice)) {
            this.errTipShow = this.$t('home.text40') + this.bottomPrice
            return false
          }
        } else {
          let lowPrice = (Number(this.nowBidPrice) + Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)) * 100 / 100
          this.bottomPrice = (Number(lowPrice * 10000) / 10000).toFixed(4)
          if (Number(this.inputPrice) < Number(this.bottomPrice)) {
            this.errTipShow = this.$t('home.text40') + this.bottomPrice
            return false
          }
        }
      } else {
        this.bottomPrice = Number(this.nowBidPrice) + Number(this.addPriceRate)
        // this.bottomPrice = (parseInt(this.bottomPrice * 10000) / 10000).toFixed(4)
        if (Number(this.inputPrice) < Number(this.bottomPrice)) {
          this.errTipShow = this.$t('home.text40') + this.bottomPrice
          return false
        }
      }
      if (this.inputPrice > this.account.piBalance) {
        this.errTipShow = this.$t('home.text108')
        return false
      }
      // if (this.addPriceType === 1) {
      //   if (this.addPriceMode === 1) {
      //     var currentPrice = this.nowBidPrice + Number(this.mineSalePrice) * (Number(this.addPriceRate) / 100)
      //     if (currentPrice < Number(this.mineSalePrice)) {
      //       if (this.inputPrice <= currentPrice) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice <= Number(this.mineSalePrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     } else {
      //       if (this.inputPrice <= Number(this.mineSalePrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice <= currentPrice) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     }
      //   } else {
      //     var nowaday = this.nowBidPrice + Number(this.nowBidPrice) * (Number(this.addPriceRate) / 100)
      //     if (nowaday > Number(this.mineSalePrice)) {
      //       if (this.inputPrice <= Number(this.mineSalePrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice <= nowaday) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     } else {
      //       if (this.inputPrice <= nowaday) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice <= Number(this.mineSalePrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     }
      //   }
      // } else {
      //   var fixedPrice = this.nowBidPrice + (Number(this.addPriceRate))
      //   if (this.inputPrice <= fixedPrice) {
      //     this.errTipShow = '出价金额不可低于当前价'
      //     return false
      //   } else if (this.inputPrice <= Number(this.mineSalePrice)) {
      //     this.errTipShow = '出价金额不可低于初始价'
      //     return false
      //   }
      // }
      // if (this.inputPrice < this.nowBidPrice) {
      //   this.errTipShow = '出价金额不可低于当前价'
      //   return false
      // } else if (this.inputPrice > this.account.piBalance) {
      //   this.errTipShow = '出价金额大于账户余额'
      //   return false
      // }
      this.payPassword = ''
      this.payCode = ''
      if (this.inputPrice !== '' && this.inputPrice <= this.account.piBalance) {
        if (this.userData.openGoogleCode !== 2) {
          this.setSafeVerific = true
        } else {
          this.payPopupShow = true
          // 有谷歌
          if (this.userData.openGoogleCode === 2) {
            this.isgogoleDuanxin = false
            this.codeType = '1'
            // 如果只有短信
          }
          // else if (this.userData.openMobileCode === 2 && this.userData.openGoogleCode !== 2) {
          //   this.isgogoleDuanxin = true
          //   this.codeType = '2'
          // }
        }
      }
    },
    // toVerify (index) {
    //   this.codeType = index
    //   if (this.userData.openMobileCode === 2 && this.userData.openGoogleCode === 2) {
    //     this.isgogoleDuanxin = !this.isgogoleDuanxin
    //   }
    // },
    // 支付确定按钮
    confirmPay () {
      this.errinMsgText = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('dialog.text3')
        return false
      } else if (this.payCode === '') {
        this.payFailTip = this.$t('dialog.text15')
        return false
      }
      let fmData = new FormData()
      fmData.append('tradePwd', this.payPassword)
      fmData.append('mobileCode', this.payCode)
      fmData.append('codeType', this.codeType)
      this.$http.post(`${this.$api}tx/unlock`, fmData).then(res => {
        if (res.data.success) {
          let formData = new FormData()
          formData.append('productId', this.id)
          formData.append('userBidPrice', this.inputPrice)
          this.$http.post(`${this.$api2}infinite/bidInfiniteProduct`, formData).then(res => {
            if (res.data.status === 'success') {
              this.getProductDetail()
              this.getProductOfBidRecordList(1)
              this.noBindPhoneShow = false
              this.payPopupShow = false
              this.confirmShow = true
              this.isSuccess = true
              // this.timer4 = setTimeout(() => {
              //   this.$store.dispatch('getUserBalance')
              // }, 5000)
            } else {
              this.errinMsgText = res.data.msg
              this.noBindPhoneShow = false
              this.payPopupShow = false
              this.confirmShow = true
              this.isSuccess = false
            }
          }).catch(err => {
            console.log(err)
            this.payPopupShow = false
            this.confirmShow = true
            this.isSuccess = false
            this.errinMsgText = this.$t('dialog.text16')
          })
        } else {
          this.payFailTip = res.data.msg
          // this.noBindPhoneShow = false
          // this.payPopupShow = false
          // this.confirmShow = true
          // this.isSuccess = false
        }
      }).catch(err => {
        console.log(err)
        this.payPopupShow = false
        this.confirmShow = true
        this.isSuccess = false
        this.errinMsgText = this.$t('dialog.text16')
      })
    },
    // 发送短信按钮
    getCode () {
      if (this.sendBtnValue === '获取验证码') {
        this.countDown()
        let formData2 = new FormData()
        formData2.append('json', JSON.stringify({'type': 'code'}))
        this.isDisabled = true
        this.$http.post(this.$api + '/user/sendSmsCode', formData2).then(res => {
          if (res.data.success) {
            this.payFailTip = ''
          } else {
            if (res.data.msg) {
              this.payFailTip = res.data.msg
              this.isDisabled = false
              this.sendBtnValue = '获取验证码'
              this.sendBtnTimes = 60
              clearTimeout(this.timer)
            } else {
              this.payFailTip = '网络错误'
              this.sendBtnValue = '获取验证码'
              this.sendBtnTimes = 60
            }
          }
        }).catch(err => {
          console.log(err)
          this.isDisabled = false
          clearTimeout(this.timer)
          this.sendBtnValue = '获取验证码'
          this.sendBtnTimes = 60
          this.payFailTip = '网络错误'
        })
      }
    },
    // 短信倒计时
    countDown () {
      if (this.sendBtnValue === 0) {
        this.sendBtnValue = '获取验证码'
        this.sendBtnTimes = 60
        this.isDisabled = false
        clearTimeout(this.timer)
      } else {
        this.sendBtnTimes--
        this.sendBtnValue = this.sendBtnTimes
        this.isDisabled = true
        this.timer = setTimeout(() => this.countDown(), 1000)
      }
    },
    // 关闭图标
    closeIcon () {
      this.payPopupShow = false
      this.payFailTip = ''
      this.setSafeVerific = false
      this.confirmShow = false
      // this.bottomPrice = (parseInt(this.bottomPrice * 10000) / 10000).toFixed(4)
      this.inputPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
    },
    // 支付成功按钮
    successPay () {
      this.payPassword = ''
      this.payCode = ''
      this.payFailTip = ''
      this.confirmShow = false
      this.inputPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
    },
    // 支付失败按钮
    failedDialog () {
      this.payPassword = ''
      this.payCode = ''
      this.payFailTip = ''
      this.confirmShow = false
      this.inputPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
    },
    recordTurnPage (page) {
      this.recordPage = page
      this.getProductOfBidRecordList(page)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
