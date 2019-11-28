<template>
  <div class="tab-container">
    <div class="tab-hd">
      <div class="tab-hd-item"
        v-for="(item, index) in tabMenu"
        :key="item"
        @click="changeTab(index)"
        :class="{active: tabIndex === index}"
      >
        {{item}}
      </div>
    </div>
    <div class="tab-bd">
      <div
        v-for="(item, index) in tabMenu"
        v-show="index === tabIndex"
        :key="index"
      >
        <slot :name="`slot${index + 1}`"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    tabMenu: {
      type: Array
    },
    tabIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeTab (index) {
      this.$emit('changeTab', index)
    }
  }
}
</script>

<style lang="less">
  .tab-hd{
    display: flex;
    border-bottom: 1px solid #ffba14;
    margin-bottom: 10px;
    &-item{
      width: 300px;
      line-height: 46px;
      text-align: center;
      font-size: 20px;
      border-radius:4px 4px 0 0;
      cursor: pointer;
      &.active{
        color: #ffffff;
        background: #ffba14;
      }
    }
  }
</style>
