<template>
  <div class="myaccount-bill">
    <!--抢购规则模版-->
    <div class="flex-header">
      <h3 class="my-title">{{$t('buyGoodsMenage.text30')}}</h3>
      <div class="add-btn" @click="$router.push({path: '/account/regulationTemp/regulationTempDetails', query: {addFlag: 'true'}} )">{{$t('buyGoodsMenage.text67')}}</div>
    </div>
    <div class="table-wrapper">
      <ul class="table-uls">
        <li class="table-list">{{$t('buyGoodsMenage.text68')}}</li>
        <li class="table-list">{{$t('buyGoodsMenage.text69')}}</li>
        <li class="table-list">{{$t('buyGoodsMenage.text70')}}</li>
        <li class="table-list">{{$t('buyGoodsMenage.text71')}}</li>
      </ul>
      <ul class="table-uls" v-for="(item, index) in orderData" :key="index">
        <li class="table-list">{{item.id}}</li>
        <li class="table-list">{{item.panicSetName}}</li>
        <li class="table-list">{{$changeDate(item.updateAt, '-', 8)}}</li>
        <li class="table-list point-info"><span class="info" @click="gotoInfo(item.id)">{{$t('buyGoodsMenage.text72')}}</span><span class="delete" @click="deleteOne(item.id)">{{$t('buyGoodsMenage.text73')}}</span></li>
      </ul>
      <v-loading v-show="loadingShow"></v-loading>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('home.text11')}}!</p>
        </div>
      </div>
    </div>
    <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
    <!--<div class="page-w">-->
      <!--<div class="pre-page page cursor" :class="{'disabled': pstart}" @click="gotoPage(current_page - 1)">&lt; 上一页</div>-->
      <!--<div class="current-page page">{{current_page}}</div>-->
      <!--<div class="next-page page cursor" :class="{'disabled': pend}" @click="gotoPage(current_page + 1)">下一页 &gt;</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import Dialog from '@/components/dialog/dialog'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        totalPage: 0,
        pend: false,
        current_page: 1,
        loadingShow: true,
        noResult: false,
        orderData: []
      }
    },
    created () {
      this.gotoPage(1)
    },
    methods: {
      parentTurnPage (page) {
        this.gotoPage(page)
      },
      // 获取订单列表
      gotoPage (page) {
        this.noResult = false
        this.current_page = page
        this.$postAxios.post(`${this.$api2}infinite/queryInfinitePaincSetList`, {
          pageIndex: page,
          pageSize: '20'
        }).then(res => {
          this.loadingShow = false
          if (res.data.status === 'success') {
            this.orderData = res.data.data.infinitePaniceSetList
            this.totalPage = res.data.data.totalPage
            if (this.orderData.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          }
        })
      },
      deleteOne (id) {
        Dialog({
          title: this.$t('buyGoodsMenage.text74'),
          content: '',
          okFn: () => {
            this.$postAxios.post(`${this.$api2}infinite/saveInfiniteSetInfo`, {
              flag: '3',
              paincSetId: id
            }).then(res => {
              if (res.data.status === 'success') {
                this.totalPage = 0
                this.gotoPage(1)
                Dialog({
                  title: this.$t('buyGoodsMenage.text75'),
                  content: ''
                })
              } else {
                Dialog({
                  title: this.$t('buyGoodsMenage.text76'),
                  content: res.data.msg
                })
              }
            })
          }
        })
      },
      gotoInfo (id) {
        this.$router.push({path: '/account/regulationTemp/regulationTempDetails', query: {id: id}})
      }
    },
    computed: {
      pstart () {
        return this.current_page === 1
      },
      ...mapGetters([
        'userData'
      ])
    },
    components: {
      vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve),
      vLoading: resolve => require(['@/components/loading.vue'], resolve)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.flex-header
  display flex
  height: 50px
  margin-bottom: 48px
  .my-title
    padding-right: 60px
    margin-bottom: 0
    border-right: 1px solid #989898
    display: block
  .add-btn
    margin-left: 60px
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffba14;
    color: #fff;
    cursor: pointer;
    border-radius: 6px;
    font-size: 16px;
.table-list
  .info,.delete
    width: 50%
    display block
  .info
    text-align: right
    padding-right: 20px
  .delete
    text-align: left
    padding-left: 20px
    color #e93a3a
    border-left: 1px solid #e7e8ec
</style>
