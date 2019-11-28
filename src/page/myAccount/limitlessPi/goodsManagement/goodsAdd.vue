<template>
  <div class="goods-details">
    <!--新增竞派商品  不要-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/myBill')">竞拍商品管理</span>
      <span class="icon">》</span>
      <span>新增竞拍商品</span>
    </div>
    <h3 class="title-text">新增竞拍商品</h3>
    <div class="goods-w">
      <div class="form-item">
        <label class="label">商品名称</label>
        <div class="input-box">
          <input type="text" placeholder="请输入商品名称" class="input">
          <div class="red-color">请输入商品名称</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">商品库存</label>
        <div class="input-box">
          <input type="text" placeholder="请输入商品库存" class="input">
          <div class="red-color">请输入商品库存</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">起拍价</label>
        <div class="input-box">
          <div class="input-w">
            <input type="text" placeholder="请输入起拍价" class="input">
            <span class="money">π</span>
          </div>
          <div class="red-color">本轮所有商品的拍卖价格</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">加价方式</label>
        <div class="input-sel">
          <el-select v-model="addPriceType"  placeholder="百分比">
            <el-option
              v-for="item in addPriceTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label class="label">加价计算方式</label>
        <div class="input-sel">
          <el-select v-model="calcPrice"  placeholder="根据初始价格计算">
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
        <label class="label">加价幅度（%）</label>
        <div class="input-box">
          <input type="text" placeholder="请输入加价幅度" class="input">
          <div class="red-color">请输入加价幅度</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">开拍日期</label>
        <div class="input-sel">
          <el-date-picker
            v-model="startDate"
            type="datetime"
            :picker-options="pickerOptions"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="checkTime"
            placeholder="请选择抢购时间">
          </el-date-picker>
          <div class="date-msg">若审核时间超过开拍时间，将在审核成功后立即开拍</div>
          <span class="error-tips" ref="startDate" :class="{active: startDateTips}">{{startDateTips}}</span>
        </div>
      </div>
      <div class="form-item">
        <label class="label">商品封面图</label>
        <div class="input-box">
          <div class="input-w">
            <div  class="upload-wrapper">
              <div class="img-lis" v-for="(item, index) in imgDataObj" :key="index">
                <img :src="item" alt="" @error="errorImg(item, index)">
                <div class="delete" @click.stop.prevent="deleteIndex(index)">
                  <span class="icon icon1"></span>
                  <span class="icon icon2"></span>
                </div>
              </div>
              <div  class="img-loading-box" v-show="isLoading">
                <img  src="../../../../assets/images/commons/loading.gif" alt="" class="img-loading">
              </div>
              <div  class="img-box" v-show="isMaxLoading">
                <input @change="fileChange()" ref="uploadFile" accept="image/*" placeholder="" type="file" id="upload_file"/>
                <div  class="text"><img class="upload_add" src="../../../../assets/images/commons/upload_add.svg" alt=""></div>
              </div>
            </div>
          </div>
          <div class="text-msg">请上传分辨率为750*300的图片</div>
        </div>
      </div>
      <div class="form-item">
        <label class="label">商品说明</label>
        <div class="input-box">
          <div class="shensu-text-box">
            <textarea class="textarea" v-model="problemContent" @input="textareaVal"></textarea>
            <div class="warm-num"><span class="text-count">{{descNum}}</span>/<span>500</span></div>
          </div>
          <div class="red-color">请输入商品说明</div>
        </div>
      </div>
      <div class="good-msg">
        <div  class="upload-wrapper">
          <div class="img-lis" v-for="(item, index) in imgDataObj" :key="index">
            <img :src="item" alt="" @error="errorImg(item, index)">
            <div class="delete" @click.stop.prevent="deleteIndex(index)">
              <span class="icon icon1"></span>
              <span class="icon icon2"></span>
            </div>
          </div>
          <div  class="img-loading-box" v-show="isLoading">
            <img  src="../../../../assets/images/commons/loading.gif" alt="" class="img-loading">
          </div>
          <div  class="img-box" v-show="isMaxLoading">
            <input @change="fileChange()" ref="uploadFile" accept="image/*" placeholder="" type="file" id="upload_file"/>
            <div  class="text"><img class="upload_add" src="../../../../assets/images/commons/upload_add.svg" alt=""></div>
          </div>
        </div>
      </div>
      <div class="btn-send">提交</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {compress, dataURItoBlob} from '@/assets/js/upload'
export default {
  data() {
    return {
      descNum: 0,
      problemContent: '',
      isLoading: true,
      isMaxLoading: true,
      imgDataObj: [],
      startDateTips: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 禁选当前以前的日期
        }
      },
      startDate: '', // 抢购开始时间
      calcPrice: 1,
      calcPriceOption: [{ // 加价计算方式
        label: '根据初始价格计算',
        value: 1
      }, {
        label: '根据最新价格计算',
        value: 2
      }],
      addPriceType: 1, // 加价方式
      addPriceTypeOption: [{ // 加价方式选项
        label: '百分比',
        value: 1
      }, {
        label: '固定金额',
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
  methods: {
    textareaVal () {},
    errorImg (item, index) {
      this.num = -1
      this.isMaxLoading = true
      this.imgDataObj.splice(index, 1)
      this.imagesArr.splice(index, 1)
    },
    async fileChange (e) {
      this.noneImg = ''
      let imgVal = this.$refs.uploadFile
      let imgObj = imgVal.files[0]
      if (imgObj) {
        let isLt2M = imgObj.size / 1024 / 1024 <= 5
        let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
        if (!(isLt2M && isType)) {
          this.noneImg = '图片格式只支持jpg、png,且大小不超过5M'
          imgVal.value = ''
          return
        }
      } else {
        return
      }
      if (this.imgDataObj.length > 4) {
        this.noneImg = '最多上传5张'
        imgVal.value = ''
        return
      }
      this.isLoading = true
      if (this.imgDataObj.length > 3) {
        this.num = 5
        this.isMaxLoading = false
      } else {
        this.num = -1
        this.isMaxLoading = true
      }
      let reader = new FileReader()
      let self = this
      reader.readAsDataURL(imgObj)
      reader.onloadend = function () {
        let result = this.result
        let img = new Image()
        img.src = result
        img.onload = function () {
          let formData = new FormData()
          let data = compress(img)
          self.imgUrl = result
          let blob = dataURItoBlob(data)
          let reader2 = new FileReader()
          reader2.readAsArrayBuffer(blob)
          reader2.onloadend = function () {
            let f = new File([this.result], imgObj.name)
            formData.append('myfile', f)
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
              self.noneImg = '上传失败'
            })
          }
        }
      }
    },
    deleteIndex (index) {
      this.num = -1
      this.isMaxLoading = true
      this.imgDataObj.splice(index, 1)
      this.imagesArr.splice(index, 1)
    },
    checkTime () {
      if (new Date(this.startDate).getTime() < Date.now()) {
        this.startDateTips = '抢购时间不能小于当前时间'
      } else {
        this.startDateTips = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
</style>
