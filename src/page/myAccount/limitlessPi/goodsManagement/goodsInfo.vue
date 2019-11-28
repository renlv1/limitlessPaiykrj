<template>
  <div class="goods-details">
    <!--竞拍商品详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/goodsManagement')">{{$t('goodsManagement.text1')}}</span>
      <span class="icon">》</span>
      <span v-if="productId">{{$t('goodsManagement.text2')}}</span>
      <span v-else>{{$t('goodsManagement.text3')}}</span>
    </div>
    <div class="flex-w-goods">
      <h3 class="title-text" v-if="productId">{{$t('goodsManagement.text2')}}</h3>
      <h3 class="title-text" v-else>{{$t('goodsManagement.text3')}}</h3>
      <div class="btn-w" v-if="productId">
        <!-- 在“审核中、审核失败、待开拍、已取消”时显示-->
        <div class="btn-item" v-if="goodsStatus === 1 || goodsStatus === 2 || goodsStatus === 3 || goodsStatus === 5 || goodsStatus === 7" @click="gotoeditorGoods">{{$t('goodsManagement.text108')}}</div>
        <div class="btn-item" v-if="goodsStatus === 1 || goodsStatus === 2" @click="cancelGoods">{{$t('goodsManagement.text5')}}</div>
      </div>
    </div>
    <div class="goods-w">
      <div class="form-item" v-if="goodsStatus">
        <label class="label" :class="{'heigth-label': productData.auditDesc}">{{$t('goodsManagement.text6')}}</label>
        <div class="flex-bet">
          <div>
            <div class="input-box progress-status" :class="{'red-color': goodsStatus === 3 || productData.auditDesc}">{{goodStatus(goodsStatus)}}</div>
            <div v-show="productData.auditDesc" class="auditDesc">{{$t('goodsManagement.text7')}}：{{productData.auditDesc}}</div>
          </div>
          <div v-if="goodsStatus === 6" class="red-color" @click="$router.push({path: '/goodsParticular', query: {id: productId}})">{{$t('goodsManagement.text8')}} >></div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text9')}}</label>
        <div class="input-box">
          <input type="text" :placeholder="$t('goodsManagement.text10')" class="input" v-model.trim="productName" disabled>
          <div class="red-color" v-show="errorShow1">{{$t('goodsManagement.text10')}}</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text11')}}</label>
        <div class="input-box">
          <input type="number" :placeholder="$t('goodsManagement.text12')" class="input" v-model.trim="saleNum" @keyup="keyInp" @blur="blurIpt" disabled>
          <div class="red-color" v-show="errorShow2">{{$t('goodsManagement.text12')}}</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text14')}}</label>
        <div class="input-box">
          <div class="input-w">
            <input type="number" :placeholder="$t('goodsManagement.text15')" class="input" v-model.trim="mineSalePrice" disabled>
            <span class="money">π</span>
          </div>
          <div class="red-color2">{{errorShow3}}</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text16')}}</label>
        <div class="input-sel">
          <el-select v-model="addPriceType"  :placeholder="$t('goodsManagement.text17')" disabled>
            <el-option
              v-for="item in addPriceTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-if="addPriceType === 1">
        <div class="form-item">
          <label class="label">{{$t('goodsManagement.text18')}}</label>
          <div class="input-sel">
            <el-select v-model="calcPrice"  :placeholder="$t('goodsManagement.text19')" disabled>
              <el-option
                v-for="item in calcPriceOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item">
          <label class="label">{{$t('goodsManagement.text20')}}（%）</label>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodsManagement.text21')" class="input" v-model.trim="addPriceRate" disabled>
            <div class="red-color" v-show="errorShow4">{{$t('goodsManagement.text21')}}</div>
          </div>
        </div>
      </div>
      <div class="form-item" v-if="addPriceType === 2">
        <label class="label">{{$t('goodsManagement.text20')}}（π）</label>
        <div class="input-box">
          <input type="text" :placeholder="$t('goodsManagement.text22')" class="input" v-model.trim="addPriceRate" disabled>
          <div class="red-color" v-show="errorShow4">{{$t('goodsManagement.text22')}}</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text23')}}</label>
        <div class="input-sel">
          <input type="text" v-model="startDate" class="input-data" disabled>
          <!--<el-date-picker-->
            <!--v-model="startDate"-->
            <!--type="datetime"-->
            <!--:picker-options="pickerOptions"-->
            <!--:default-time="defaultTime"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
            <!--@change="checkTime"-->
            <!--placeholder="请选择抢购时间">-->
          <!--</el-date-picker>-->
          <div class="date-msg">{{$t('goodsManagement.text24')}}</div>
          <span class="error-tips" ref="startDate" :class="{active: errorShow5}">{{errorShow5}}</span>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text25')}}</label>
        <div class="input-box">
          <div class="input-w">
            <div  class="upload-wrapper">
              <div class="img-lis" v-for="(item, index) in imgDataObj" :key="index" @click="showBig(item)">
                <img :src="item" alt="" @error="errorImg(item, index, 1)">
              </div>
              <div  class="img-loading-box" v-show="isLoading">
                <img  src="../../../../assets/images/commons/loading.gif" alt="" class="img-loading">
              </div>
            </div>
          </div>
          <div class="text-msg">{{noneImg}}</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">{{$t('goodsManagement.text26')}}</label>
        <div class="input-box">
          <div class="shensu-text-box">
            <textarea class="textarea" v-model.trim="problemContent" @input="textareaVal" disabled></textarea>
          </div>
          <div class="red-color" v-show="errorShow7">{{$t('goodsManagement.text27')}}</div>
        </div>
      </div>
      <div class="good-msg">
        <div class="input-w">
          <div  class="upload-wrapper">
            <div class="img-lis" v-for="(item, index) in imgDataObj2" :key="index" @click="showBig(item)">
              <img :src="item" alt="" @error="errorImg(item, index, 2)">
            </div>
          </div>
          <div class="text-msg" :class="{'err-color': noneImg2}">{{noneImg2}}</div>
        </div>
      </div>
      <div class="red-color-send">{{errSend}}</div>
    </div>
    <div class="dialog-wrapper" v-show="showDialog2" @click="showDialog2 = false">
      <div class="dialog-content img-dialog" @click.stop>
        <div class="close-confirm" @click="showDialog2 = false">
          <div class="close-icon">
            <div class="line line1"></div>
            <div class="line line2"></div>
          </div>
        </div>
        <div class="dialog-img-box">
          <img :src="bigImg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {compress, dataURItoBlob} from '@/assets/js/upload'
import Dialog from '@/components/dialog/dialog'
export default {
  data() {
    return {
      myfile2: '',
      myfile1: '',
      showDialog2: false,
      bigImg: '',
      errSend: '',
      isloadingSend: false,
      imagesArr: [],
      imagesArr2: [],
      errorShow1: false,
      errorShow2: false,
      errorShow3: this.$t('goodsManagement.text29'),
      errorShow4: false,
      errorShow5: '',
      errorShow6: this.$t('goodsManagement.text30'),
      errorShow7: false,
      addPriceRate: '',
      productName: '',
      saleNum: '',
      mineSalePrice: '',
      productData: '',
      productId: Number(this.$route.query.id),
      goodsStatus: Number(this.$route.query.status),
      descNum: 0,
      problemContent: '',
      isLoading: false,
      isLoading2: false,
      isMaxLoading: true,
      noneImg: this.$t('goodsManagement.text30'),
      noneImg2: '',
      num: -1,
      num2: -1,
      isMaxLoading2: true,
      imgDataObj: [],
      imgDataObj2: [],
      startDateTips: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 禁选当前以前的日期
        }
      },
      startDate: '', // 抢购开始时间
      calcPrice: 1,
      calcPriceOption: [{ // 加价计算方式
        label: this.$t('goodsManagement.text31'),
        value: 1
      }, {
        label: this.$t('goodsManagement.text32'),
        value: 2
      }],
      addPriceType: 1, // 加价方式
      addPriceTypeOption: [{ // 加价方式选项
        label: this.$t('goodsManagement.text17'),
        value: 1
      }, {
        label: this.$t('goodsManagement.text33'),
        value: 2
      }]
    }
  },
  computed: {
    defaultTime () {
      let d = new Date()
      let time = ''
      time = `${d.getHours()}:${d.getMinutes() + 30}:00`
      return time
    }
  },
  created () {
    if (this.productId) {
      this.getProduct()
    }
  },
  methods: {
    gotoeditorGoods () {
      this.$router.push({
        path: '/account/goodsManagement/goodsDetails',
        query: {id: this.productId, status: this.goodsStatus}
      })
    },
    showBig (item) {
      this.showDialog2 = true
      this.bigImg = item
    },
    keyInp () {
      this.saleNum = this.saleNum.replace(/[^\d]/g, '')
    },
    blurIpt () {
      if (isNaN(this.saleNum - 0) === true) {
        this.errorShow2 = true
      } else {
        this.errorShow2 = false
      }
    },
    // 添加无限竞价信息
    sendGoods () {
      this.errorShow1 = false
      this.errorShow2 = false
      this.errorShow3 = this.$t('goodsManagement.text29')
      this.errorShow4 = false
      this.errorShow5 = ''
      this.errorShow6 = this.$t('goodsManagement.text30')
      if (this.productName === '') {
        this.errorShow1 = true
      }
      if (this.saleNum === '') {
        this.errorShow2 = true
      }
      if (this.mineSalePrice === '') {
        this.errorShow3 = this.$t('goodsManagement.text15')
      }
      if (this.addPriceRate === '') {
        this.errorShow4 = true
      }
      if (this.startDate === '') {
        this.errorShow5 = this.$t('goodsManagement.text13')
      }
      if (this.imgDataObj.length === 0) {
        this.errorShow6 = this.$t('goodsManagement.text30')
      }
      if (this.problemContent === '') {
        this.errorShow7 = true
      }
      if (this.productName !== '' && this.saleNum !== '' && this.mineSalePrice !== '' && this.addPriceRate !== '' && this.startDate !== '' && this.imgDataObj.length > 0 && this.problemContent !== '') {
        this.isloadingSend = true
        let formData2 = new FormData()
        formData2.append('productName', this.productName)
        formData2.append('saleNum', this.saleNum)
        formData2.append('minSalePrice', this.mineSalePrice)
        formData2.append('addPriceRate', this.addPriceRate)
        formData2.append('productContent', this.problemContent)
        formData2.append('coverImg', this.imagesArr)
        formData2.append('contentImg', this.imagesArr2)
        formData2.append('startSaleDate', this.startDate)
        formData2.append('addPriceType', this.addPriceType)
        if (this.addPriceType === 1) {
          formData2.append('addPriceMode', this.calcPrice)
        }
        this.$http.post(`${this.$api2}infinite/addInfiniteProduct`, formData2).then(res => {
          this.isloadingSend = false
          if (res.data.status === 'success') {
            console.log(res)
            this.$router.push('/account/goodsManagement')
          } else {
            this.errSend = res.data.msg
          }
        }).catch(err => {
          console.log(err)
          this.isloadingSend = false
        })
      }
    },
    // 编辑
    editorGoods () {
      this.errorShow1 = false
      this.errorShow2 = false
      this.errorShow3 = this.$t('goodsManagement.text29')
      this.errorShow4 = false
      this.errorShow5 = ''
      this.errorShow6 = this.$t('goodsManagement.text30')
      if (this.productName === '') {
        this.errorShow1 = true
      }
      if (this.saleNum === '') {
        this.errorShow2 = true
      }
      if (this.mineSalePrice === '') {
        this.errorShow3 = this.$t('goodsManagement.text15')
      }
      if (this.addPriceRate === '') {
        this.errorShow4 = true
      }
      if (this.startDate === '') {
        this.errorShow5 = this.$t('goodsManagement.text13')
      }
      if (this.imgDataObj.length === 0) {
        this.errorShow6 = this.$t('goodsManagement.text30')
      }
      if (this.problemContent === '') {
        this.errorShow7 = true
      }
      if (this.productName !== '' && this.saleNum !== '' && this.mineSalePrice !== '' && this.addPriceRate !== '' && this.startDate !== '' && this.imgDataObj.length > 0 && this.problemContent !== '') {
        Dialog({
          title: this.$t('goodsManagement.text36'),
          content: this.$t('goodsManagement.text37'),
          okFn: () => {
            let formData3 = new FormData()
            formData3.append('productId', this.productId)
            formData3.append('productName', this.productName)
            formData3.append('saleNum', this.saleNum)
            formData3.append('minSalePrice', this.mineSalePrice)
            formData3.append('addPriceRate', this.addPriceRate)
            formData3.append('productContent', this.problemContent)
            formData3.append('coverImg', this.imagesArr)
            formData3.append('contentImg', this.imagesArr2)
            formData3.append('startSaleDate', this.$changeDate(this.startDate, '-', 8))
            formData3.append('addPriceType', this.addPriceType)
            if (this.addPriceType === 1) {
              formData3.append('addPriceMode', this.calcPrice)
            }
            this.$http.post(`${this.$api2}infinite/updateInfiniteProduct`, formData3).then(res => {
              if (res.data.status === 'success') {
                this.$router.push('/account/goodsManagement')
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
        })
      }
    },
    // 取消
    cancelGoods () {
      Dialog({
        title: this.$t('goodsManagement.text39'),
        content: this.$t('goodsManagement.text40'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}infinite/cancelInfiniteProduct`, {
            productId: this.productId,
            flag: '1'
          }).then(res => {
            if (res.data.status === 'success') {
              this.$router.push('/account/goodsManagement')
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
      })
    },
    // 1.4 竞价产品详情
    // 接口URL: http://boss.pigamegroup.com/infinite/infiniteProductDetail
    getProduct () {
      this.$postAxios.post(`${this.$api2}infinite/infiniteProductDetail`, {
        productId: this.productId
      }).then(res => {
        if (res.data.status === 'success') {
          this.productData = res.data.data
          this.addPriceRate = this.productData.addPriceRate
          this.productName = this.productData.productName
          this.saleNum = this.productData.saleNum
          this.mineSalePrice = this.productData.mineSalePrice
          this.addPriceType = this.productData.addPriceType
          this.calcPrice = this.productData.addPriceMode
          this.problemContent = this.productData.productContent
//          let newTime = new Date(this.productData.startSaleDate)
//          let day = newTime.getDate()
//          let month = newTime.getMonth() + 1
//          let year = newTime.getFullYear()
//          let hours = newTime.getHours()
//          let min = newTime.getMinutes()
//          let sec = newTime.getSeconds()
          this.startDate = this.$changeDate(this.productData.startSaleDate, '-', 8)
          this.descNum = this.problemContent.length
          if (res.data.data.coverImg) {
            let coverImg = res.data.data.coverImg.split(',')
            let img1 = []
            coverImg.forEach(item => {
              if (item.indexOf('http') > -1) {
                img1.push(item)
              } else {
                img1.push('http://ofydu65mj.bkt.clouddn.com/' + item)
              }
            })
            this.imgDataObj = img1
          }
          let img2 = []
          if (res.data.data.contentImg) {
            let coverImg2 = res.data.data.contentImg.split(',')
            coverImg2.forEach(item => {
              if (item.indexOf('http') > -1) {
                img2.push(item)
              } else {
                img2.push('http://ofydu65mj.bkt.clouddn.com/' + item)
              }
            })
            this.imgDataObj2 = img2
          }
        }
      })
    },
    textareaVal () {
      this.descNum = this.problemContent.length
      this.noneContent = ''
      if (this.problemContent.length > 500) {
        this.descNum = 500
        this.problemContent = this.problemContent.substring(0, 500)
      }
    },
    errorImg (item, index, list) {
      if (list === 1) {
        this.num = -1
        this.isMaxLoading = true
        this.imgDataObj.splice(index, 1)
        this.imagesArr.splice(index, 1)
      } else {
        this.num2 = -1
        this.isMaxLoading2 = true
        this.imgDataObj2.splice(index, 1)
        this.imagesArr2.splice(index, 1)
      }
    },
    async fileChange (e) {
      this.noneImg = ''
      let imgVal = this.$refs.uploadFile
      let imgObj = imgVal.files[0]
      if (imgObj) {
        let isLt2M = imgObj.size / 1024 / 1024 <= 5
        let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
        if (!(isLt2M && isType)) {
          this.noneImg = this.$t('goodsManagement.text42')
          imgVal.value = ''
          return
        }
      } else {
        return
      }
      if (this.imgDataObj.length > 3) {
        this.noneImg = this.$t('goodsManagement.text43')
        imgVal.value = ''
        return
      }
      this.isLoading = true
      if (this.imgDataObj.length > 2) {
        this.num = 4
        this.isMaxLoading = false
      } else {
        this.num = -1
        this.isMaxLoading = true
      }
      if (imgObj.size / 1024 > 500) {
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              this.myfile1 = new File([this.result], imgObj.name)
              this.imgReader1()
            }
          }
        }
      } else {
        this.myfile1 = imgObj
        this.imgReader1()
      }
    },
    imgReader1 () {
      let self = this
      let imgVal = this.$refs.uploadFile
      let formData = new FormData()
      formData.append('myfile', this.myfile1)
      formData.append('type', '1')
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // 不要
      self.$http.post(`${self.$api}upload/uploadimg`, formData, config).then((res) => {
        let rets = res.data
        self.isLoading = false
        if (rets.success === true && rets.status === 'success') {
          self.noneImg = ''
          let srcData = JSON.parse(rets.data)
          let src = 'http://ofydu65mj.bkt.clouddn.com/' + srcData.key
          self.imgDataObj.push(src)
          self.imagesArr.push(srcData.key)
        } else {
          self.noneImg = rets.msg
        }
        //  可上传重复的图片
        imgVal.value = ''
      }).catch((err) => {
        self.isLoading = false
        console.log(err)
        imgVal.value = ''
        self.noneImg = this.$t('goodsManagement.text44')
      })
    },
    async fileChange2 (e) {
      this.noneImg2 = ''
      let imgVal = this.$refs.uploadFile2
      let imgObj = imgVal.files[0]
      if (imgObj) {
        let isLt2M = imgObj.size / 1024 / 1024 <= 5
        let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
        if (!(isLt2M && isType)) {
          this.noneImg2 = this.$t('goodsManagement.text42')
          imgVal.value = ''
          return
        }
      } else {
        return
      }
      if (this.imgDataObj2.length > 3) {
        this.noneImg2 = this.$t('goodsManagement.text43')
        imgVal.value = ''
        return
      }
      this.isLoading2 = true
      if (this.imgDataObj2.length > 2) {
        this.num = 4
        this.isMaxLoading2 = false
      } else {
        this.num2 = -1
        this.isMaxLoading2 = true
      }
      if (imgObj.size / 1024 > 500) {
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              self.myfile2 = new File([this.result], imgObj.name)
              self.imgReader2()
            }
          }
        }
      } else {
        this.myfile2 = imgObj
        this.imgReader2()
      }
    },
    imgReader2 () {
      let imgVal = this.$refs.uploadFile2
      let self = this
      let formData = new FormData()
      formData.append('myfile', this.myfile2)
      formData.append('type', '1')
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // 不要
      self.$http.post(`${self.$api}upload/uploadimg`, formData, config).then((res) => {
        let rets = res.data
        self.isLoading2 = false
        if (rets.success === true && rets.status === 'success') {
          self.noneImg2 = ''
          let srcData = JSON.parse(rets.data)
          let src = 'http://ofydu65mj.bkt.clouddn.com/' + srcData.key
          self.imgDataObj2.push(src)
          self.imagesArr2.push(srcData.key)
        } else {
          self.noneImg2 = rets.msg
        }
        //  可上传重复的图片
        imgVal.value = ''
      }).catch((err) => {
        self.isLoading2 = false
        console.log(err)
        imgVal.value = ''
        self.noneImg2 = this.$t('goodsManagement.text44')
      })
    },
    deleteIndex (index, list) {
      if (list === 1) {
        this.num = -1
        this.isMaxLoading = true
        this.imgDataObj.splice(index, 1)
        this.imagesArr.splice(index, 1)
      } else {
        this.num2 = -1
        this.isMaxLoading2 = true
        this.imgDataObj2.splice(index, 1)
        this.imagesArr2.splice(index, 1)
      }
    },
    checkTime () {
      if (this.startDate === '') {
        if (new Date(this.startDate).getTime() < Date.now()) {
          this.errorShow5 = this.$t('goodsManagement.text45')
        } else {
          this.errorShow5 = ''
        }
      } else {
        if (this.startDate < Date.now()) {
          this.errorShow5 = this.$t('goodsManagement.text45')
        } else {
          this.errorShow5 = ''
        }
      }
    },
    goodStatus (status) { // 1待审核 2审核通过,待竞价 3审核未通过 4竞价结束 5取消竞价 6竞价中 7竞价失败
      if (status === 1) {
        return this.$t('goodsManagement.text46')
      }
      if (status === 2) {
        return this.$t('goodsManagement.text47')
      }
      if (status === 3) {
        return this.$t('goodsManagement.text48')
      }
      if (status === 4) {
        return this.$t('goodsManagement.text49')
      }
      if (status === 5) {
        return this.$t('goodsManagement.text50')
      }
      if (status === 6) {
        return this.$t('goodsManagement.text51')
      }
      if (status === 7) {
        return this.$t('goodsManagement.text52')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
</style>
