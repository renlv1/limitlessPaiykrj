<template>
  <div class="wrapper-account">
    <div class="top-wrapper">
      <h2>{{this.$route.query.currency}} {{$t('setSharePay.text33')}}</h2>
      <button class="add" @click="addAccount">{{$t('addAccount.text2')}}</button>
    </div>
    <div class="Info-box">
      <div class="" v-loading.lock="fullscreenLoading" :element-loading-text="$t('dialog.text19')"></div>
      <div class="null-data" v-show="noBankData">
        {{$t('setSharePay.text35')}}{{this.$route.query.currency}}{{$t('setSharePay.text33')}}
      </div>
      <ul>
        <li v-for="(item,index) in bankList" :key="index" :class="{activeInfo: isActiveInfo === index}">
          <div class="li-left">
            <div class="Info-icon">
              <!--<img :src="picAddress" alt="">-->
              <i :style="{backgroundImage:'url('+ picAddress +')'}"></i>
              <span class="name">{{item.bankName}}</span>
            </div>
            <div class="account-type">{{item.accountNumber}}</div>
          </div>
          <div class="li-right isClick" @click="openDialog(index, item.id)">
            <img width="20" height="20" src="../../../assets/images/bank/delete.png" :alt="$t('setSharePay.text22')">
          </div>
        </li>
      </ul>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>{{$t('addAccount.text27')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button width="10%" @click="centerDialogVisible = false">{{$t('addAccount.text28')}}</el-button>
        <el-button width="10%" @click="deleteAccount">{{$t('addAccount.text24')}}</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <div class="block" v-show="hasPagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[9, 15, 21, 27]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        centerDialogVisible: false, // 默认不显示dialog
        fullscreenLoading: true, // 默认加载
        noBankData: false, // 银行列表为0
        hasPagination: false, // 默认不能有分页
        isDialog: false,
        isActiveInfo: 0,
        currentIndex: '',
        currentId: '',
        picAddress: '',
        variable: 'http://ofjn5cjui.bkt.clouddn.com/', // 拼接字符串需要的变量
        bankList: [], // 获得银行列表
        accountType: '',
        pageIndex: 1,
        pageSize: 9,
        currentPage: 1,
        totalCount: 0 // 获取当前数据的总条数
      }
    },
    created() {
      // this.getBankList(1)
    },
    mounted() {
      setTimeout(() => {
        this.chooseDiffentBankList()
      }, 30)
    },
    methods: {
      // 翻页
      handleSizeChange(val) {
        this.pageSize = val
        this.getBankList(1)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getBankList(val)
      },
      addAccount() {
        this.$router.push({path: '/account/addAccount', query: {currency: this.$route.query.currency}})
      },
      openDialog(index, id) {
        this.centerDialogVisible = true
        this.currentIndex = index
        this.currentId = id
      },
      chooseDiffentBankList() {
        let currency = this.$route.query.currency
        if (currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW') {
          this.accountType = 1
        } else if (currency === 'BTC') {
          this.accountType = 6
        }
        this.getBankList(1)
      },
      getBankList(page) {
        this.$http.post(`${this.$api2}/account/list?currency=${this.$route.query.currency}&country=''&accountType=${this.accountType}&pageIndex=${page}&pageSize=${this.pageSize}`).then((res) => {
          if (res.data.status === 'success') {
            this.fullscreenLoading = false
            this.bankList = res.data.data.list
            this.totalCount = res.data.data.totalCount
            if (res.data.data.list.length !== 0) {
              this.hasPagination = true
              for (let i = 0; i < this.bankList.length; i++) {
                this.picAddress = this.variable + this.bankList[i].coinImg
              }
            } else {
              this.noBankData = true
            }
          }
        })
      },
      deleteAccount() {
        this.$http.post(`${this.$api2}/account/delete?id=${this.currentId}`).then((res) => {
          if (res.data.status === 'success') {
            this.bankList.splice(this.currentIndex, 1)
            this.centerDialogVisible = false
          }
          this.chooseDiffentBankList()
          if (this.bankList.length === 0) {
            this.hasPagination = false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrapper-account
    width 100%
    position relative
    .top-wrapper
      width 100%
      height auto
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      margin-bottom 60px
      h2
        font-weight bold
      .add
        padding 15px 0
        width 200px
        background #ffba14
        border-radius 4px
        border 1px solid #ffba14
        cursor pointer
        user-select none
        font-size 18px
        font-weight 800
        letter-spacing 2px
        color #fff
    .Info-box
      width 100%
      text-align center
      ul
        display flex
        flex-wrap wrap
        justify-content left
        margin 10px 30px
        li
          float left
          margin 10px
          padding 0 30px 0 20px
          width 450px
          height 160px
          border 1px solid #e7e8ec
          background-color #fff
          display flex
          justify-content space-between
          align-items center
          @media screen and (max-width: 1700px)
            width 350px
            height 130px
          .li-left
            .Info-icon
              display flex
              align-items center
              margin-bottom 15px
              i
                width 50px
                height 50px
                display inline-block
                background-repeat: no-repeat;
                background-size: cover;
              .name
                margin-left 10px
            .account-type
              text-align left
</style>
