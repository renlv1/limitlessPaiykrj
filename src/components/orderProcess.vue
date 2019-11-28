<template>
  <div v-show="showDialog">
    <!-- 订单进程弹窗-->
    <div class="dialog-wrapper">
      <div class="dialog-content" @click.stop>
        <div class="close-confirm" @click="showDialog = false">
          <div class="close-icon">
            <div class="line line1"></div>
            <div class="line line2"></div>
          </div>
        </div>
        <div class="dialog-box">
          <h3 class="dialog-title">{{$t('header.text11')}}</h3>
          <!-- 1 已完成 2 进行中 3 未开始-->
          <div class="process-w">
            <div class="process-left">
              <div v-for="(i, index) in stepData" :key="index">
                <div class="circle" :class="{'finish-stauts': i.status === 1, 'current-stauts': i.status === 2, 'no-status': i.status === 3}"></div>
                <div class="line" :class="{'finish-line': i.status === 1, 'none-line': i.status === 2 || i.status === 3}"></div>
              </div>
              <div class="circle" :class="{'ok-status': lastStatus === 1, 'current-stauts': lastStatus === 2, 'no-status': lastStatus === 3}"></div>
            </div>
            <div class="process-right">
              <div class="flex-item" v-for="(item, index) in orderData.stepList" :key="index">
                <span v-if="item.index === 6 || item.index === 7">{{item.title}}</span>
                <span v-else>{{item.msg}}</span>
                <!--<span class="time">{{$changeDate(item.time)}}</span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      showDialog: false
    }
  },
  props: {
    stepData: {},
    lastStatus: Number,
    orderData: ''
  },
  methods: {
    show () {
      this.showDialog = true
    }
  }
}
</script>
