<template>
  <div>
    <!--成为共享者-->
    <div class="sharer-wrap" v-if="isboss !== 1">
      <div class="sharer">
        <div class="catalogue">
          <span class="title">{{$t('sharer.text34')}}</span>
          <router-link to="/applySharer" tag="span" class="now-apply-for">{{$t('sharer.text35')}}</router-link>
        </div>
        <div class="tit">{{$t('sharer.text36')}}</div>
        <div class="list-box">
          <div class="list" v-for="(item,index) in $t('sharer.afqDatas')" :key="index">
            <div class="in-box">
              <div class="issue">{{item.title}}</div>
              <div class="answer">{{item.text}}</div>
            </div>
          </div>
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
      afqDatas: []
    }
  },
  created () {
    this.$store.dispatch('getUserBalance')
  },
  mounted () {},
  computed: {
    ...mapGetters([
      'isboss'
    ])
  },
  methods: {}
}
</script>

<style lang="less" scoped>
  .sharer-wrap{
    width: 100%;
    background-color: #FAFAFC;
    @media screen and(max-width: 1590px) {
      padding: 0 20px;
    }
    .sharer{
      width: 1550px;
      height: auto;
      margin: 0 auto;
      @media screen and(max-width: 1590px) {
        width: 100%;
        padding: 0 20px;
      }
      .catalogue{
        width: 100%;
        height: 50px;
        display: flex;
        padding: 60px 0;
        .title{
          height: 50px;
          font-size: 34px;
          font-weight: bold;
          color: #1a1a1a;
          padding-right: 60px;
          border-right: 1px solid #999;
        }
        .now-apply-for{
          display: inline-block;
          width: 200px;
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          background-color: #FFBA14;
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          margin-left: 60px;
          cursor: pointer;
          &:hover{
            opacity: .9;
          }
        }
      }
      .tit{
        font-size: 20px;
        color: #1a1a1a;
        font-weight: bold;
        padding: 60px 0 20px;
      }
      .list-box{
        width: 100%;
        /*column-count: 3;
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-fill: auto;
        column-gap: 30px;*/
        display: flex;
        flex-flow: wrap;
        justify-content: flex-start;
        .list{
          width: 30%;
          height: 248px;
          margin-right: 2%;
          margin-bottom: 40px;
          display: inline-block;
          border-radius: 4px;
          background-color: #fff;
          border: 1px solid rgba(235, 236, 240, .8);
          -webkit-box-shadow: 0 1px 4px rgba(235, 236, 240, .6), 0 0 60px rgba(0, 0, 0, 0.04) inset;
          -moz-box-shadow: 0 1px 4px rgba(235, 236, 240, .6), 0 0 40px rgba(0, 0, 0, 0.04) inset;
          box-shadow: 0 1px 4px rgba(235, 236, 240, .6), 0 0 40px rgba(0, 0, 0, 0.04) inset;
          // -webkit-column-break-inside: avoid;
          // break-inside: avoid; // 避免在元素内部插入分页符
          position: relative;
          &:before {
            -webkit-transform: skew(-15deg) rotate(-6deg);
            -moz-transform: skew(-15deg) rotate(-6deg);
            transform: skew(-15deg) rotate(-6deg);
            left: 15px;
          }
          &:after {
            -webkit-transform: skew(15deg) rotate(6deg);
            -moz-transform: skew(15deg) rotate(6deg);
            transform: skew(15deg) rotate(6deg);
            right: 15px;
          }
          &:after {
            width: 70%;
            height: 55%;
            display: block;
            content: ' ';
            -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            position: absolute;
            bottom: 10px;
            z-index: -1;
          }
          &:before {
            width: 70%;
            height: 55%;
            content: ' ';
            display: block;
            -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            position: absolute;
            bottom: 10px;
            z-index: -1;
          }
          @media screen and (max-width: 1200px){
            width: 44%;
            height: auto;
          }
          &.in-box{
              .answer{
                color: #999;
              }
            }
          &:hover{
            .in-box{
              .answer{
                color: #1a1a1a;
                text-shadow: 0 1px 1px rgba(153, 153, 153, .4);
              }
            }
          }
          .in-box{
            width: 100%;
            height: auto;
            padding: 30px;
            font-size: 18px;
            color: #1a1a1a;
            .issue{
              font-weight: bold;
              padding-bottom: 40px;
            }
            .answer{
              line-height: 1.5;
              color: #999;
            }
          }
        }
      }
    }
  }

</style>
