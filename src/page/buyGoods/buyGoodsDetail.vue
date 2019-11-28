<template>
  <div class="goodsParticular">
    <div class="goodsParticular-box">
      <div class="goodsParticular-content">
        <div class="goodsParticular-title">
          <h6><router-link :to="{path:'/buyGoods',query: {id:id}}" class="property">{{$t('home.text41')}} >  </router-link> <span> {{$t('home.text65')}}</span></h6>
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
            <div class="kucun-box" v-if="status === 1">
              <div class="kucun" v-show="shareUserName"><span>{{$t('home.text42')}}： </span><i>{{shareUserName}}</i></div>
              <!--<div class="shop-name"><span>店铺名称: </span><i>{{merchantName}}</i></div>-->
            </div>
            <!--确认出价-->
            <div class="time-content"  v-if="status === 1">
              <div class="time-box">
                <div class="finishTime-box">
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
                <div class="addTime-box">
                  <div class="add-tip">{{$t('home.text66')}}</div>
                  <div class="add-time">
                    <span class="hour">{{addHour}}</span>
                    <span class="colon">:</span>
                    <span class="min">{{addMin}}</span>
                    <span class="colon">:</span>
                    <span class="seconds">{{addSec}}</span>
                  </div>
                </div>
              </div>
              <div class="price-box">
                <div class="now-price"><span>{{$t('home.text49')}} </span><i>{{panicPrice | fourNumber}} π</i></div>
                <div class="price-name"><span>{{$t('home.text18')}}： </span><i v-if="nowPanicUserName">{{nowPanicUserName}}</i><i v-else>{{$t('home.text19')}}</i></div>
              </div>
              <div class="pools-box">
                <span>{{$t('home.text67')}}: </span><i>{{rewardPool | fourNumber}} π</i>
              </div>
              <div class="line"></div>
              <div class="begin-price">
                <span>{{$t('home.text13')}}</span><i>{{startPanicPrice| fourNumber}} π</i>
              </div>
              <div class="calculate-box">
                <div class="calculate">
                  <div class="minus" @click="btnMinus"><div class="minus-icon"></div></div>
                  <div class="money-input usernone">
                    <input type="text" v-model.trim="inputPrice" @input="checkInput('inputPrice')" onpaste="return false">
                    <p class="pai">π</p>
                  </div>
                  <div class="add" @click="btnAdd"><div class="add-icon"></div></div>
                </div>
                <div class="add-price" v-show="ruleAddPriceType === 1">{{$t('home.text20')}}: <span>{{rulePriceRate}}%</span><i v-show="ruleAddPriceMode === 1">（{{$t('home.text21')}}）</i><i v-show="ruleAddPriceMode === 2">（{{$t('home.text22')}}）</i></div>
                <div class="add-price" v-show="ruleAddPriceType === 2">{{$t('home.text20')}}: <span>{{rulePriceRate}} π</span></div>
              </div>
              <div class="account-money"><span>{{$t('home.text23')}}: </span><i>{{piBalance | fourNumber}} π</i></div>
              <ul class="btn-box">
                <li class="btn-confirm" @click="btnConfirm()">{{$t('home.text68')}}</li>
                <li class="btn-invite btn-confirm" @click="showQrPopup()">{{$t('home.text57')}}</li>
              </ul>
              <p class="errTip">{{errTipShow}}</p>
            </div>
            <!--开拍时间-->
            <div class="time-content" v-if="status === 4">
              <p><span>{{$t('home.text62')}}</span><i>{{startPanicPrice | fourNumber}} π</i></p>
              <div class="btn-begin" v-show="startDate"><span>{{$t('home.text70')}}</span><i>{{$changeDate(startDate, '.', 8)}}</i></div>
            </div>
            <!--竞拍结束-->
            <div class="time-content" v-if="status === 2">
              <p><span>{{$t('home.text71')}}：</span><i>{{panicPrice | fourNumber}} π</i><span>{{$t('home.text18')}}：</span><span>{{nowPanicUserName}}</span></p>
              <div class="btn-begin"><span>{{$t('home.text72')}}</span></div>
            </div>
            <!--交易失败-->
            <div class="time-content" v-if="status === 3">
              <p><span>{{$t('home.text71')}}</span><i>{{panicPrice | fourNumber}} π</i><span>{{$t('home.text18')}}:</span><span>{{nowPanicUserName}}</span></p>
              <div class="btn-begin"><span>{{$t('home.text73')}}</span></div>
            </div>
          </div>
        </div>
        <div class="goods-content">
          <ul class="order-tab">
            <li :class="{tabActive: orderTab === 1}" @click="toChoose(1)">{{$t('home.text74')}}</li>
            <li :class="{tabActive: orderTab === 2}" @click="toChoose(2)">{{$t('home.text75')}}<span v-if="totalCount">({{totalCount}})</span><span v-else>(0)</span></li>
            <li :class="{tabActive: orderTab === 3}" @click="toChoose(3)">{{$t('home.text76')}}</li>
          </ul>
        </div>
        <!--抢购详情-->
        <div class="goods-ct" v-if="orderTab === 1">
          <ul class="buy-box">
            <li class="li-first">
              <h3>{{$t('home.text77')}}</h3>
              <ul class="rule-box">
                <li class="price">
                  <h5>{{$t('home.text78')}}</h5>
                  <span>{{startPanicPrice | fourNumber}}π</span>
                </li>
                <li v-show="ruleAddPriceType ===1">
                  <h5>{{$t('home.text20')}}</h5>
                  <span>{{rulePriceRate}} %</span>
                </li>
                <li v-show="ruleAddPriceType ===1">
                  <h5 class="add-method">{{$t('home.text107')}}</h5>
                  <span v-show="ruleAddPriceMode === 1">{{$t('home.text21')}}</span>
                  <span v-show="ruleAddPriceMode === 2">{{$t('home.text22')}}</span>
                </li>
                <li v-show="ruleAddPriceType ===2">
                  <h5>{{$t('home.text20')}}</h5>
                  <span>{{rulePriceRate}} π</span>
                </li>
                <li>
                  <div class="add-hour">
                    <h5 class="add-price">{{$t('home.text79')}}</h5>
                    <p>({{$t('home.text80')}})</p>
                  </div>
                  <span>{{topHourTime}}</span>
                </li>
                <li>
                  <div class="add-minute">
                    <h5 class="add-price">{{$t('home.text81')}}</h5>
                    <p>{{$t('home.text82')}}</p>
                  </div>
                  <span>{{ruleAddTime}}</span>
                </li>
                <li>
                  <h5>{{$t('home.text83')}}</h5>
                  <span v-show="startDate">{{$changeDate(startDate, '-', 8)}}</span>
                </li>
              </ul>
            </li>
            <li class="award">
              <h3 class="tall-award">{{$t('home.text84')}}</h3>
              <div class="right-award">
                <p class="reward-ratio">{{$t('home.text85')}}：</p>
                <span>{{panicMoreRate}}%</span>
              </div>
            </li>
            <li class="award">
              <h3 class="agent-award">{{$t('home.text86')}}</h3>
              <div class="right-award">
                <p class="reward-ratio">{{$t('home.text85')}}：</p>
                <span>{{daiLiRate}}%</span>
              </div>
            </li>
            <li class="award tree">
              <div class="tree-award">
                <h3>{{$t('home.text87')}}</h3>
                <p><span>{{$t('home.text88')}} ：</span><i v-if="treeTotal"> {{treeTotal}}%</i><i v-else> 0%</i></p>
              </div>
              <table class="TableList">
                <thead>
                <tr>
                  <td>{{$t('home.text89')}}</td>
                  <td>{{$t('home.text85')}} (%)</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in parentList" :key="index">
                  <td>{{$t('home.text90')}}{{item.index}}{{$t('home.text91')}}</td>
                  <td>{{item.rate}}%</td>
                </tr>
                </tbody>
              </table>
            </li>
            <li class="award duilie-award">
              <div class="tree-award">
                <h3>{{$t('home.text92')}}</h3>
                <p><span>{{$t('home.text88')}} ：</span><i v-if="rewardTotal"> {{rewardTotal}}%</i><i v-else> 0%</i></p>
              </div>
              <table class="TableList">
                <thead>
                <tr>
                  <td>{{$t('home.text93')}}</td>
                  <td>{{$t('home.text85')}} (%)</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in roundList" :key="index">
                  <td>{{$t('home.text94')}}{{item.index}}{{$t('home.text95')}}</td>
                  <td>{{item.rate}}%</td>
                </tr>
                </tbody>
              </table>
            </li>
          </ul>
        </div>
        <!--抢购记录-->
        <table class="commonTableList" v-if="orderTab === 2" >
          <thead>
          <tr>
            <td class="duilie">{{$t('home.text93')}}</td>
            <td class="status">{{$t('home.text96')}}</td>
            <td class="auction">{{$t('home.text97')}}</td>
            <td class="price">{{$t('home.text98')}}</td>
            <td class="time">{{$t('home.text99')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in infinitePanicPlayerList" :key="index" :class="{'topstatus': item.playerStatus === 2}">
            <td class="duilie">{{item.playerIndex}}</td>
            <td class="status">{{infiniteStatus(item.playerStatus)}}</td>
            <td class="auction">{{item.playerAmount | fourNumber}}π</td>
            <td class="price">{{item.userName}}</td>
            <td class="time">{{$changeDate(item.createAt, '.', 8)}}</td>
          </tr>
          </tbody>
          <div class="load-more-box" v-show="emptyData">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="infinitePanicPlayerList.length !== 0" :propsPage="infinitePanicTotal" @agentTrun="infinitePanicTurnPage" ref="panicTurnPage"></v-turnPage>
        </table>
        <!--奖励发放记录-->
        <div class="reward-record" v-if="orderTab === 3">
          <ul>
            <li @click="toChange(2)">
              <div class="agent" :class="{changeActive: changeTab === 2}">
                <i>{{$t('home.text87')}}</i>
                <span v-if="rewardAmount1">（{{rewardAmount1}}π）</span>
                <span v-else>（0 π）</span>
              </div>
            </li>
            <li @click="toChange(3)">
              <div class="agent" :class="{changeActive: changeTab === 3}">
                <i>{{$t('home.text92')}}</i>
                <span v-if="rewardAmount3">（{{rewardAmount3}}π）</span>
                <span v-else>（0 π）</span>
              </div>
            </li>
            <li @click="toChange(4)">
              <div class="agent" :class="{changeActive: changeTab === 4}">
                <i>{{$t('home.text100')}}</i>
                <span v-if="rewardAmount2">（{{rewardAmount2}}π）</span>
                <span v-else>（0 π）</span>
              </div>
            </li>
            <li @click="toChange(1)">
              <div class="agent" :class="{changeActive: changeTab === 1}">
                <i>{{$t('home.text86')}}</i>
                <span v-if="rewardAmount4">（{{rewardAmount4}}π）</span>
                <span v-else>（0 π）</span>
              </div>
            </li>
            <li></li>
          </ul>
          <!--代理商奖励-->
          <div class="user-agent" v-if="changeTab === 1">{{$t('home.text109')}}</div>
          <table class="commonTableList" v-if="changeTab === 1" >
            <thead>
            <tr>
              <td class="duilie">{{$t('home.text101')}}</td>
              <td class="status">{{$t('home.text102')}}</td>
              <td class="auction">{{$t('home.text103')}}</td>
              <td class="price">{{$t('home.text97')}}</td>
              <td class="time">{{$t('home.text104')}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in agentList" :key="index">
              <td class="duilie">{{item.id}}</td>
              <td class="status">{{item.rewardAmount| fourNumber}}π</td>
              <td class="auction">{{item.playerUserName}}</td>
              <td class="price">{{item.playerAmount | fourNumber}}π</td>
              <td class="time">{{$changeDate(item.updateAt, '.', 8)}}</td>
            </tr>
            </tbody>
            <div class="load-more-box" v-show="emptyAgentList">
              <div class="loading-img">
                <img src="../../assets/images/home/nodata.png" alt="">
              </div>
              <p class="desc">{{$t('home.text11')}}</p>
            </div>
            <v-turnPage v-show="agentList.length !== 0" :propsPage="agentTotal" @agentTrun="agentTurnPage" ref="turnPage1"></v-turnPage>
          </table>
          <!--树形奖励-->
          <table class="commonTableList" v-if="changeTab === 2" >
            <thead>
            <tr>
              <td class="duilie">{{$t('home.text101')}}</td>
              <td class="status">{{$t('home.text102')}}</td>
              <td class="status">{{$t('home.text105')}}</td>
              <td class="auction">{{$t('home.text103')}}</td>
              <td class="price">{{$t('home.text97')}}</td>
              <td class="time">{{$t('home.text104')}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in treeList" :key="index">
              <td class="duilie">{{item.id}}</td>
              <td class="status">{{item.rewardAmount | fourNumber}}π</td>
              <td class="status">{{item.userName}}</td>
              <td class="auction">{{item.playerUserName}}</td>
              <td class="price">{{item.playerAmount | fourNumber}}π</td>
              <td class="time">{{$changeDate(item.updateAt, '.', 8)}}</td>
            </tr>
            </tbody>
            <div class="load-more-box" v-show="emptyTreeList">
              <div class="loading-img">
                <img src="../../assets/images/home/nodata.png" alt="">
              </div>
              <p class="desc">{{$t('home.text11')}}</p>
            </div>
            <v-turnPage v-show="treeList.length !== 0" :propsPage="treeRewardTotal" @agentTrun="treeTurnPage" ref="turnPage1"></v-turnPage>
          </table>
          <!--队列奖励-->
          <table class="commonTableList" v-if="changeTab === 3" >
            <thead>
            <tr>
              <td class="duilie">{{$t('home.text101')}}</td>
              <td class="status">{{$t('home.text102')}}</td>
              <td class="status">{{$t('home.text105')}}</td>
              <td class="status">{{$t('home.text106')}}</td>
              <td class="status">{{$t('home.text103')}}</td>
              <td class="price">{{$t('home.text97')}}</td>
              <td class="time">{{$t('home.text104')}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in queueList" :key="index">
              <td class="duilie">{{item.id}}</td>
              <td class="status">{{item.rewardAmount | fourNumber}}π</td>
              <td class="status">{{item.userName}}</td>
              <td class="status">{{item.playerIndex}}</td>
              <td class="status">{{item.playerUserName}}</td>
              <td class="price">{{item.playerAmount | fourNumber}}π</td>
              <td class="time">{{$changeDate(item.updateAt, '.', 8)}}</td>
            </tr>
            </tbody>
            <div class="load-more-box" v-show="emptyQueueList">
              <div class="loading-img">
                <img src="../../assets/images/home/nodata.png" alt="">
              </div>
              <p class="desc">{{$t('home.text11')}}</p>
            </div>
            <v-turnPage v-show="queueList.length !== 0" :propsPage="queueTotal" @agentTrun="queueTurnPage" ref="turnPage1"></v-turnPage>
          </table>
          <!--最高出价奖励-->
          <table class="commonTableList" v-if="changeTab === 4" >
            <thead>
            <tr>
              <td class="duilie">{{$t('home.text101')}}</td>
              <td class="status">{{$t('home.text102')}}</td>
              <td class="auction">{{$t('home.text103')}}</td>
              <td class="time">{{$t('home.text104')}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in bidAwardList" :key="index">
              <td class="duilie">{{item.id}}</td>
              <td class="status">{{item.rewardAmount| fourNumber}}π</td>
              <td class="auction">{{item.userName}}</td>
              <td class="time">{{$changeDate(item.updateAt, '.', 8)}}</td>
            </tr>
            </tbody>
            <div class="load-more-box" v-show="emptyResult">
              <div class="loading-img">
                <img src="../../assets/images/home/nodata.png" alt="">
              </div>
              <p class="desc">{{$t('home.text11')}}</p>
            </div>
            <v-turnPage v-show="bidAwardList.length !== 0" :propsPage="bidAwardTotal" @awardTrun="awardTurnPage" ref="turnPage1"></v-turnPage>
          </table>
        </div>
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
              <input class="payMsg tradingCenter-input" v-model.trim="payCode"   :placeholder="$t('dialog.text5')" type="text" value="">
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
        <div v-show="isSuccess" class="isFailed">
          <h3 class="title">{{$t('dialog.text17')}}</h3>
          <button class="tradingCenter-btn" @click="successPay">{{$t('dialog.text9')}}</button>
        </div>
        <!--支付失败弹窗-->
        <div v-show="!isSuccess" class="isFailed">
          <span class="title">{{$t('dialog.text18')}}:</span>
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
          <!--<li class="tradingCenter-btn" @click="sharerShow = false">去申请</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->
    <!--邀请链接弹窗-->
    <div class="myInvitePopup" v-show="qrPopupShow">
      <div class="myPopup-box">
        <a class="close" @click="closeInvite()"><img src="../../assets/images/home/Shutdown.png" alt=""></a>
        <div class="myPopup-tip">
          <div class="img-box"><img :src="imgUrl" alt=""></div>
          <p class="qrCode-p">{{productName}}</p>
        </div>
        <!--<div id="qrcodeBox"></div>-->
        <a class="link" id="userLink" :href="inviteLink2" target="_blank">{{inviteLink}}</a>
        <button class="secret-btn" ref="addressCopy" @click="closeQrPopup()" data-clipboard-action="copy" data-clipboard-target="#userLink">{{$t('home.text57')}}</button>
        <p class="share-text">{{$t('home.text58')}}</p>
      </div>
    </div>
    <!--<div class="myInvitePopup" v-show="purchaseShow">-->
      <!--<div class="myPopup-box">-->
        <!--<p class="share-text" style="margin-bottom: 20px">加入抢购失败</p>-->
        <!--<button class="secret-btn" @click="$router.push('/home')">确定</button>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
// import '../../assets/js/jquery.qrcode.min'
import Dialog from '@/components/dialog/dialog'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      id: '',
      purchaseId: Number(this.$route.query.purchaseId), // 轮次记录ID
      shareUserName: '',
      status: '', // 1活动中 2交易成功,已结束 3交易失败 4待抢购
      imgArr: [], // 小的预览图
      productName: '', // 商品名称
      saleNum: '', // 库存
      merchantName: '', // 商家店名
      nowPanicUserName: '', // 出价人
      mineSalePrice: '', // 初始价
      panicPrice: '', // 当前价
      rewardPool: '', // 资金池总金额
      addPriceType: '', // 加价方式
      addPriceRate: '', // 加价幅度
      addPriceMode: '', // 百分比加价计算方式
      hour: '',
      min: '',
      sec: '',
      addHour: '', // 出价增加小时
      addMin: '', // 出价增加分钟
      addSec: '', // 出价增加秒
      isActiveImg: 0,
      orderTab: 1,
      changeTab: 2,
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
      sendBtnValue: '获取验证码',
      codeType: '', // 验证码类型（谷歌验证码。手机验证码）
      sendBtnTimes: 60,
      timer: null,
      timer2: null,
      isDisabled: false,
      maxInput: 0,
      activeVerifier: true,
      qrPopupShow: false, // 二维码弹窗
      imgGoods: '', // 二维码商品图片
      copyBtn: null,
      pageSize: 20,
      shareCode: '', // 二维码
      url2: '', // 二维码地址
      imgUrl: '', // 大的预览图
      purchaseShow: false,
      falg: true,
      sign: 1,
      startPanicPrice: '', // 抢购规则初始价格
      rulePriceRate: '', // 抢购规则加价幅度
      ruleAddPriceMode: '', // 抢购规则百分比加价计算方式
      ruleAddPriceType: '', // 抢购规则加价方式
      topHourTime: '', // 有效时间上限
      ruleAddTime: '', // 抢购增加时间（分钟）
      startDate: '', // 抢购开始时间
      panicMoreRate: '', // 奖励给出资最多的人的比例
      daiLiRate: '', // 代理商奖励比例
      parentList: [], // 上级(树形)奖励json
      roundList: [], // 轮循(队列)奖励json
      treeTotal: '', // 树形总计
      rewardTotal: '', // 队列总计
      infinitePanicPlayerList: [], // 抢购记录列表
      agentList: [], // 代理商列表
      treeList: [], // 树形列表
      queueList: [], // 队列奖励
      bidAwardList: [], // 最高出价奖励
      infinitePanicTotal: 1, // 抢购记录页数
      infinitePanicPage: '', // 抢购记录分页
      queryType: 4, // 奖励类型 1树形奖励 2最高投注奖励 3队列奖励 4代理商奖励
      newRewardCountList: '', // 奖励发放记录
      rewardAmount4: '', // 代理商奖励统计
      rewardAmount1: '', // 树形奖励统计
      rewardAmount2: '', // 最高投注奖励
      rewardAmount3: '', // 队列奖励
      infinitePanicRewardList: [], // 抢购奖励记录
      agentTotal: 1, // 代理商奖励页数
      agentPage: '', // 抢购记录分页
      treeRewardTotal: 1, // 树形奖励页数
      treePage: '', // 树形奖励分页
      queueTotal: 1, // 树形奖励页数
      queuePage: '', // 队列奖励分页
      bidAwardTotal: 1, // 最高出价奖励页数
      bidAwardPage: '', // 最高出价奖励分页
      totalCount: '', // 抢购记录总条数
      timer3: null,
      timer4: null,
      bidLastTime: '', // 剩余时间
      flag: false, // 判断是否要轮询
      panicFlag: true,
      currentPanicPrice: '',
      newPiBalance: '',
      bottomPrice: '', // 最低价
      chushiPrice: '',
      emptyData: false,
      emptyResult: false,
      emptyTreeList: false,
      emptyQueueList: false,
      emptyAgentList: false,
      imgShow: false,
      inviteLink: '', // 邀请链接
      inviteLink2: ''
    }
  },
  mounted () {
    this.copyBtn = new this.Clipboard(this.$refs.addressCopy)
    // this.$store.dispatch('getUserBalance')
    // setTimeout(() => {
    //   console.log(this.$store.getters, this.$store.getters.piBalance)
    // }, 5000)
  },
  computed: {
    ...mapGetters([
      'account',
      'userData',
      'piBalance'
    ])
  },
  created () {
    this.isNoLoginFag()
    if (this.$route.query.shareCode) {
      this.shareCode = this.$route.query.shareCode
      this.makeInfiniteTree()
    } else {
      this.getPanicRoundPlayerList(this.flag, 1)
      this.getAgentList(1)
    }
    // 判断是否要轮询
    setTimeout(() => {
      if (this.status === 1) {
        this.timer3 = setInterval(() => {
          this.getPanicRoundPlayerList(this.flag, 1)
        }, 5000)
      }
    }, 1000)
    // this.getTreeList(1)
    // this.getQueueList(1)
    // this.getBidAward(1)
    // this.makeInfiniteTree()
    // if (!this.loginFlag) {
    //   this.shareCode = this.$route.query.shareCode
    //   this.$router.push({path: '/login', query: {purchaseId: this.purchaseId, shareCode: this.shareCode}})
    // }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
    clearInterval(this.timer4)
  },
  components: {
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  methods: {
    isNoLoginFag () {
      this.$http.get(`${this.$api}user/balance`).then((res) => {
        if (res.data.success === true) {
        } else {
          this.shareCode = this.$route.query.shareCode
          this.$router.push({path: '/login', query: {purchaseId: this.purchaseId, shareCode: this.shareCode}})
        }
      })
    },
    // 4.5 商品轮次抢购记录-抢购详情中
    getPanicRoundPlayerList (flag, page) {
      let url = `${this.$api2}infinite/panicRoundPlayerList?roundId=${this.purchaseId}&pageIndex=${page}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          let productDetail = res.data.data.infinitePanicRound.infiniteSaleProduct // 产品信息
          if (res.data.data.infinitePanicRound.parentUserName) {
            this.shareUserName = res.data.data.infinitePanicRound.parentUserName
          }
          setTimeout(() => {
            if ($('#goodsImg').outerWidth() > $('#goodsImg').outerHeight()) {
              $('#goodsImg').css('width', '100%')
              this.imgShow = true
            } else {
              $('#goodsImg').css('height', '100%')
              this.imgShow = true
            }
          }, 100)
          this.imgArr = []
          let coverImg = productDetail.coverImg.split(',')
          // this.imgArr = productDetail.coverImg.split(',')
          for (let i = 0; i < coverImg.length; i++) {
            if (coverImg[i].indexOf('http') > -1) {
              this.imgArr.push(coverImg[i])
            } else {
              this.imgArr.push(this.variable + coverImg[i])
            }
          }
          this.productName = productDetail.productName
          this.merchantName = productDetail.merchantName
          this.saleNum = productDetail.saleNum
          // this.nowBidPrice = productDetail.nowBidPrice
          // this.productUserName = productDetail.productUserName
          this.nowPanicUserName = res.data.data.infinitePanicRound.nowPanicUserName
          this.id = res.data.data.infinitePanicRound.infiniteRecordId
          let infinitePaniceSet = res.data.data.infinitePanicRound.infinitePaniceSet
          this.chushiPrice = res.data.data.infinitePanicRound.panicPrice
          if (res.data.data.infinitePanicRound.panicPrice === 0) {
            this.panicPrice = infinitePaniceSet.startPanicPrice
          } else {
            this.panicPrice = res.data.data.infinitePanicRound.panicPrice
          }
          this.status = res.data.data.infinitePanicRound.roundStatus
          // this.inputPrice = this.panicPrice
          this.rewardPool = res.data.data.infinitePanicRound.rewardPool
          this.startPanicPrice = infinitePaniceSet.startPanicPrice
          this.rulePriceRate = infinitePaniceSet.priceRate
          this.ruleAddPriceMode = infinitePaniceSet.addPriceMode
          this.ruleAddPriceType = infinitePaniceSet.addPriceType
          this.mineSalePrice = productDetail.mineSalePrice
          // this.addPriceType = infinitePaniceSet.addPriceType
          // this.addPriceRate = productDetail.addPriceRate
          // this.addPriceMode = infinitePaniceSet.addPriceMode
          if (flag === true || this.currentPanicPrice !== this.panicPrice) {
            this.flag = false
            this.currentPanicPrice = this.panicPrice
            if (productDetail.coverImg.split(',')[0].indexOf('http') > -1) {
              this.imgUrl = productDetail.coverImg.split(',')[0]
              this.isActiveImg = 0
            } else {
              this.imgUrl = this.variable + productDetail.coverImg.split(',')[0]
              this.isActiveImg = 0
            }
           if (this.ruleAddPriceType === 1) {
              if (this.ruleAddPriceMode === 1) {
                this.inputPrice = (Number(this.panicPrice) + this.startPanicPrice * (Number(this.rulePriceRate) / 100)) * 100 / 100
                this.bottomPrice = (Number(this.panicPrice) + this.startPanicPrice * (Number(this.rulePriceRate) / 100)) * 100 / 100
                this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
                this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
              } else {
                this.inputPrice = (Number(this.panicPrice) + Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)) * 100 / 100
                this.bottomPrice = (Number(this.panicPrice) + Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)) * 100 / 100
                this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
                this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
              }
            } else {
              this.inputPrice = Number(this.panicPrice) + Number(this.rulePriceRate)
              this.bottomPrice = Number(this.panicPrice) + Number(this.rulePriceRate)
              this.inputPrice = (Number(this.inputPrice * 10000) / 10000).toFixed(4)
              this.bottomPrice = (Number(this.bottomPrice * 10000) / 10000).toFixed(4)
            }
          }
          // if (res.data.data.infinitePanicRound.shareCode && !this.$route.query.shareCode) {
          //   this.getInfiniteTree()
          // }
          this.shareCode = res.data.data.infinitePanicRound.shareCode
          // this.inviteLink = window.location.host + '/#' + this.$route.path + '?id=' + this.id + '&purchaseId=' + this.purchaseId + '&shareCode=' + this.shareCode
          this.inviteLink = window.location.host + '/#' + this.$route.path + '?purchaseId=' + this.purchaseId + '&shareCode=' + this.shareCode
          this.inviteLink2 = '/#' + this.$route.path + '?purchaseId=' + this.purchaseId + '&shareCode=' + this.shareCode
          let addTime = res.data.data.infinitePanicRound.infinitePaniceSet.addTime
          let increaseTime = addTime * 60
          // 出价后时间
          if (increaseTime <= 0) {
            this.addHour = '00'
            this.addMin = '00'
            this.addSec = '00'
          } else {
            this.addHour = parseInt(Number(increaseTime) / 60 / 60 % 24)
            if (Number(this.addHour) === 0) {
              this.addHour = '00'
            } else if (Number(this.addHour) < 10) {
              this.addHour = '0' + this.addHour
            } else {
              this.addHour = this.addHour
            }
            this.addMin = parseInt(Number(increaseTime) / 60 % 60)
            if (Number(this.addMin) === 0) {
              this.addMin = '00'
            } else if (Number(this.addMin) < 10) {
              this.addMin = '0' + this.addMin
            } else {
              this.addMin = this.addMin
            }
            this.addSec = parseInt(Number(increaseTime) % 60)
            if (Number(this.addSec) === 0) {
              this.addSec = '00'
            } else if (Number(this.addSec) < 10) {
              this.addSec = '0' + this.addSec
            } else {
              this.addSec = this.addSec
            }
          }

          // let bidLastTime = ''
          // bidLastTime = res.data.data.infinitePanicRound.bidLastTime
          this.bidLastTime = res.data.data.infinitePanicRound.bidLastTime // 剩余抢购时间（秒数）
          clearTimeout(this.timer2)
          this.getCountDown()
          // console.log(this.bidLastTime)
          // 距离结束时间
          // this.timer2 = setInterval(() => {
          //   if (!bidLastTime) {
          //     this.hour = '00'
          //     this.min = '00'
          //     this.sec = '00'
          //     // clearInterval(this.timer2)
          //   } else {
          //     bidLastTime--
          //     this.hour = parseInt(Number(bidLastTime) / 60 / 60 % 24)
          //     if (Number(this.hour) === 0) {
          //       this.hour = '00'
          //     } else if (Number(this.hour) < 10) {
          //       this.hour = '0' + this.hour
          //     } else {
          //       this.hour = this.hour
          //     }
          //     this.min = parseInt(Number(bidLastTime) / 60 % 60)
          //     if (Number(this.min) === 0) {
          //       this.min = '00'
          //     } else if (Number(this.min) < 10) {
          //       this.min = '0' + this.min
          //     } else {
          //       this.min = this.min
          //     }
          //     this.sec = parseInt(Number(bidLastTime) % 60)
          //     if (Number(this.sec) === 0) {
          //       this.sec = '00'
          //     } else if (Number(this.sec) < 10) {
          //       this.sec = '0' + this.sec
          //     } else {
          //       this.sec = this.sec
          //     }
          //   }
          // }, 1000)
          // 抢购规则信息
          this.topHourTime = infinitePaniceSet.topHourTime
          this.ruleAddTime = infinitePaniceSet.addTime
          this.startDate = infinitePaniceSet.startDate
          this.panicMoreRate = infinitePaniceSet.panicMoreRate
          this.daiLiRate = infinitePaniceSet.daiLiRate
          if (infinitePaniceSet.parentJson) {
            this.parentList = JSON.parse(infinitePaniceSet.parentJson)
            let sumTotal = 0
            this.parentList.forEach(item => {
              sumTotal += Number(item.rate)
            })
            this.treeTotal = sumTotal
          }
          if (infinitePaniceSet.roundJson) {
            this.roundList = JSON.parse(infinitePaniceSet.roundJson)
            let roundSum = 0
            this.roundList.forEach(item => {
              roundSum += Number(item.rate)
            })
            this.rewardTotal = roundSum
          }
          // 抢购记录列表
          if (this.$refs.panicTurnPage) {
            this.$refs.panicTurnPage.resetPage(page)
          }
          this.infinitePanicPlayerList = res.data.data.infinitePanicPlayerList
          this.infinitePanicTotal = res.data.data.totalPage
          this.totalCount = res.data.data.totalCount
          if (this.infinitePanicPlayerList.length === 0) {
            this.emptyData = true
          } else {
            this.emptyData = false
          }
          // console.log(JSON.parse(treeList))
        } else {
          // this.shareCode = this.$route.query.shareCode
          // this.$router.push({path: '/login', query: {id: this.id, purchaseId: this.purchaseId, shareCode: this.shareCode}})
          // this.$router.push({path: '/login', query: {purchaseId: this.purchaseId, shareCode: this.shareCode}})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCountDown() { // 将时间戳分割成时分秒
      //  console.log(TimeStamp)
      if (this.bidLastTime <= 0) {
        this.hour = '00'
        this.min = '00'
        this.sec = '00'
        clearTimeout(this.timer2)
      } else {
        this.bidLastTime--
        // let days = parseInt(TimeStamp / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
        let timingHour = parseInt(this.bidLastTime / 60 / 60 % 24) // 计算剩余的小时
        let timingMin = parseInt(this.bidLastTime / 60 % 60) // 计算剩余的分钟
        let timingSce = parseInt(this.bidLastTime % 60) // 计算剩余的秒数
        let newTimeArr = []
        newTimeArr.push(timingHour, timingMin, timingSce)
        this.timer2 = setTimeout(() => this.getCountDown(), 1000)
        this.hour = newTimeArr[0]
        if (Number(this.hour) === 0) {
          this.hour = '00'
        } else if (Number(this.hour) < 10) {
          this.hour = '0' + this.hour
        } else {
          this.hour = this.hour
        }
        this.min = newTimeArr[1]
        if (Number(this.min) === 0) {
          this.min = '00'
        } else if (Number(this.min) < 10) {
          this.min = '0' + this.min
        } else {
          this.min = this.min
        }
        this.sec = newTimeArr[2]
        if (Number(this.sec) === 0) {
          this.sec = '00'
        } else if (Number(this.sec) < 10) {
          this.sec = '0' + this.sec
        } else {
          this.sec = this.sec
        }
      }
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    infiniteStatus(status) {
      if (status === 1) {
        return this.$t('home.text38')
      } else if (status === 2) {
        return this.$t('home.text37')
      }
    },
    // 4.6 商品轮次奖励记录-抢购详情中
    getAgentList (page) { // 代理商奖励
      let url = `${this.$api2}infinite/panicRoundRewardList?roundId=${this.purchaseId}&pageIndex=${page}&pageSize=${this.pageSize}&queryType=${this.queryType}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.agentList = res.data.data.infinitePanicRewardList
          this.agentTotal = res.data.data.totalPage
          this.rewardCountList = res.data.data.rewardCountList
          if (this.rewardCountList.length === 0) {
            this.emptyAgentList = true
          } else {
            this.emptyAgentList = false
          }
          this.rewardCountList.forEach(item => {
            if (item.rewardType === 4) {
              this.rewardAmount4 = item.rewardAmount
            } else if (item.rewardType === 1) {
              this.rewardAmount1 = item.rewardAmount
            } else if (item.rewardType === 2) {
              this.rewardAmount2 = item.rewardAmount
            } else if (item.rewardType === 3) {
              this.rewardAmount3 = item.rewardAmount
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTreeList (page) { // 树形奖励
      let url = `${this.$api2}infinite/panicRoundRewardList?roundId=${this.purchaseId}&pageIndex=${page}&pageSize=${this.pageSize}&queryType=${this.queryType}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.treeList = res.data.data.infinitePanicRewardList
          this.treeRewardTotal = res.data.data.totalPage
          if (this.treeList.length === 0) {
            this.emptyTreeList = true
          } else {
            this.emptyTreeList = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getQueueList (page) { // 队列奖励
      let url = `${this.$api2}infinite/panicRoundRewardList?roundId=${this.purchaseId}&pageIndex=${page}&pageSize=${this.pageSize}&queryType=${this.queryType}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.queueList = res.data.data.infinitePanicRewardList
          this.queueTotal = res.data.data.totalPage
          if (this.queueList.length === 0) {
            this.emptyQueueList = true
          } else {
            this.emptyQueueList = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getBidAward (page) { // 最高出价奖励
      let url = `${this.$api2}infinite/panicRoundRewardList?roundId=${this.purchaseId}&pageIndex=${page}&pageSize=${this.pageSize}&queryType=${this.queryType}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.bidAwardList = res.data.data.infinitePanicRewardList
          this.bidAwardTotal = res.data.data.totalPage
          if (this.bidAwardList.length === 0) {
            this.emptyResult = true
          } else {
            this.emptyResult = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toGoodsPicture (item, index) {
      this.imgUrl = item
      this.isActiveImg = index
    },
    toChoose (num) {
      this.orderTab = num
      if (num === 1) {
      } else if (num === 2) {
        if (this.$refs.panicTurnPage) {
          this.$refs.panicTurnPage.resetPage(1)
        }
        this.panicFlag = true
        this.getPanicRoundPlayerList(this.flag, 1)
      } else if (num === 3) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.changeTab = 2
        this.queryType = 1
        this.getTreeList(1)
      }
    },
    // rewardType (index) {
    //   if (index === 4) {
    //   }
    // },
    toChange (val) {
      this.changeTab = val
      if (val === 1) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.queryType = 4
        this.getAgentList(1)
      } else if (val === 2) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.queryType = 1
        this.getTreeList(1)
      } else if (val === 3) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.queryType = 3
        this.getQueueList(1)
      } else if (val === 4) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.queryType = 2
        this.getBidAward(1)
      }
    },
    infinitePanicTurnPage (page) {
      this.infinitePanicPage = page
      this.panicFlag = true
      this.getPanicRoundPlayerList(this.flag, page)
    },
    agentTurnPage (page) {
      this.agentPage = page
      this.getAgentList(page)
    },
    treeTurnPage (page) {
      this.treePage = page
      this.getTreeList(page)
    },
    queueTurnPage (page) {
      this.queuePage = page
      this.getQueueList(page)
    },
    awardTurnPage (page) {
      this.bidAwardPage = page
      this.getBidAward(page)
    },
    // 减
    btnMinus () {
      this.errTipShow = ''
      if (this.inputPrice > 0) {
        if (this.ruleAddPriceType === 1) {
          if (this.ruleAddPriceMode === 1) {
            if (this.inputPrice < Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)) {
              this.inputPrice = 0
            } else {
              // this.inputPrice = (Number(this.inputPrice) - Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)).toFixed(4)
              let addRate = Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)
              let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
              this.inputPrice = (Number(this.inputPrice) - Number(addPrice)).toFixed(4)
            }
          } else {
            if (this.inputPrice < Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)) {
              this.inputPrice = 0
            } else {
              // this.inputPrice = (Number(this.inputPrice) - Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)).toFixed(4)
              let addRate = Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)
              let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
              this.inputPrice = (Number(this.inputPrice) - Number(addPrice)).toFixed(4)
            }
          }
        } else {
          if (this.inputPrice < (Number(this.rulePriceRate))) {
            this.inputPrice = 0
          } else {
            let addPrice = (Number(this.inputPrice) - (Number(this.rulePriceRate))).toFixed(4)
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
        if (this.ruleAddPriceType === 1) {
          if (this.ruleAddPriceMode === 1) {
            // this.inputPrice = (Number(this.inputPrice) + Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)).toFixed(4)
            let addRate = Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)
            let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
            this.inputPrice = (Number(this.inputPrice) + Number(addPrice)).toFixed(4)
          } else {
            // this.inputPrice = (Number(this.inputPrice) + Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)).toFixed(4)
            let addRate = Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)
            let addPrice = (Number(addRate * 10000) / 10000).toFixed(4)
            this.inputPrice = (Number(this.inputPrice) + Number(addPrice)).toFixed(4)
          }
        } else {
          let addPrice = (Number(this.inputPrice) + (Number(this.rulePriceRate)))
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
    makeInfiniteTree () {
      let url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
      this.$http.post(url2).then(res => {
        if (res.data.status === 'success') {
          this.falg = true
          this.shareUserName = res.data.data
          this.getPanicRoundPlayerList(this.flag, 1)
          // if (res.data.resultCode === 'NOT_LOGGEDIN') {
          //   this.$router.push({path: '/login', query: {id: this.id, shareCode: this.shareCode}})
          // }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // getInfiniteTree () {
    //   let url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
    //   this.$http.post(url2).then(res => {
    //     if (res.data.status === 'failed') {
    //       this.falg = false
    //       this.sign = 2
    //     } else {
    //       this.falg = true
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    // 关闭按钮二维码
    closeInvite () {
      this.qrPopupShow = false
      // $('#qrcodeBox').html('')
    },
    closeQrPopup () { // 关闭二维码
      this.qrPopupShow = false
      // $('#qrcodeBox').html('')
      let clipboard = this.copyBtn
      clipboard.on('success', () => {
        Dialog({
          title: this.$t('buyGoodsMenage.text16'),
          content: ''
        })
        clipboard.destroy()
        this.copyBtn = new this.Clipboard(this.$refs.addressCopy) // 复制
      })
    },
    showQrPopup () { // 显示二维码
      if (this.falg === true) {
        this.qrPopupShow = true
      }
      // if (this.shareCode) {
      //   this.falg = true
      //   if (this.falg === true && this.sign === 1) {
      //     this.qrPopupShow = true
      //   } else {
      //     this.purchaseShow = true
      //   }
      // } else {
      //   this.falg = false
      //   if (this.falg === true) {
      //     this.qrPopupShow = true
      //   } else {
      //     this.purchaseShow = true
      //   }
      // }
      // this.qrPopupShow = true
      // let downloadUrl
      // if (this.url2 !== '') {
      //   // 绘制二维码
      //   downloadUrl = this.$utf16to8(this.url2)
      // }
      // $('#qrcodeBox').qrcode({
      //   render: 'canvas', //     table方式
      //   width: 200, //            宽度
      //   height: 200, //            高度
      //   text: downloadUrl //      任意内容
      // })
    },
    // 确认出价按钮
    btnConfirm () {
      this.errTipShow = ''
       if (this.ruleAddPriceType === 1) {
        if (this.ruleAddPriceMode === 1) {
          let lowPrice = this.panicPrice + Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)
          this.bottomPrice = (Number(lowPrice * 10000) / 10000).toFixed(4)
            if (Number(this.inputPrice) < Number(this.bottomPrice)) {
              this.errTipShow = this.$t('home.text40') + this.bottomPrice
              return false
            }
        } else {
          let lowPrice = this.panicPrice + Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)
          this.bottomPrice = (Number(lowPrice * 10000) / 10000).toFixed(4)
            if (Number(this.inputPrice) < Number(this.bottomPrice)) {
              this.errTipShow = this.$t('home.text40') + this.bottomPrice
              return false
            }
        }
      } else {
        this.bottomPrice = this.panicPrice + (Number(this.rulePriceRate))
        // this.bottomPrice = (parseInt(this.bottomPrice * 10000) / 10000).toFixed(4)
        if (Number(this.inputPrice) < Number(this.bottomPrice)) {
          this.errTipShow = this.$t('home.text40') + this.bottomPrice
          return false
        }
      }
      if (this.inputPrice > this.piBalance) {
        this.errTipShow = this.$t('home.text108')
        return false
      }
      // if (this.ruleAddPriceType === 1) {
      //   if (this.ruleAddPriceMode === 1) {
      //     var currentPrice = this.panicPrice + Number(this.startPanicPrice) * (Number(this.rulePriceRate) / 100)
      //     if (currentPrice < Number(this.startPanicPrice)) {
      //       if (this.inputPrice < currentPrice) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice < Number(this.startPanicPrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     } else {
      //       if (this.inputPrice < Number(this.startPanicPrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice < currentPrice) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     }
      //   } else {
      //     var nowaday = this.panicPrice + Number(this.panicPrice) * (Number(this.rulePriceRate) / 100)
      //     if (nowaday > Number(this.startPanicPrice)) {
      //       if (this.inputPrice < Number(this.startPanicPrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice < nowaday) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     } else {
      //       if (this.inputPrice < nowaday) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       } else if (this.inputPrice < Number(this.startPanicPrice)) {
      //         this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //         return false
      //       }
      //     }
      //   }
      // } else {
      //   var fixedPrice = this.panicPrice + (Number(this.rulePriceRate))
      //   if (this.inputPrice < fixedPrice) {
      //     this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //     return false
      //   } else if (this.inputPrice < Number(this.startPanicPrice)) {
      //     this.errTipShow = '出价金额不可低于' + this.bottomPrice
      //     return false
      //   }
      // }
      // if (this.inputPrice <= this.panicPrice) {
      //   this.errTipShow = '出价金额不可低于当前价'
      //   return false
      // } else if (this.inputPrice > this.account.piBalance) {
      //   this.errTipShow = '出价金额大于账户余额'
      //   return false
      // } else if (this.inputPrice === '') {
      //   this.errTipShow = '请输入出价金额'
      //   return false
      // }
      this.payPassword = ''
      this.payCode = ''
      if (this.inputPrice !== '' && this.inputPrice <= this.piBalance) {
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
    toVerify (index) {
      this.codeType = index
      if (this.userData.openMobileCode === 2 && this.userData.openGoogleCode === 2) {
        this.isgogoleDuanxin = !this.isgogoleDuanxin
      }
    },
    // 5.3 用户对商品进行抢购
    // 接口URL: http://boss.pigamegroup.com/infinite/infinitePanicPlay
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
          formData.append('roundId', this.purchaseId)
          formData.append('price', this.inputPrice)
          this.$http.post(`${this.$api2}infinite/infinitePanicPlay`, formData).then(res => {
            if (res.data.status === 'success') {
              this.panicFlag = true
              this.getPanicRoundPlayerList(this.flag, 1)
              this.noBindPhoneShow = false
              this.payPopupShow = false
              this.confirmShow = true
              this.isSuccess = true
              this.errinMsgText = res.data.msg
              this.timer4 = setTimeout(() => {
                // this.newPiBalance = this.$store.getters.piBalance
                // console.log('111', this.$store.getters.piBalance)
                this.$store.dispatch('getUserBalance')
                // console.log(this.$store.getters.piBalance)
              }, 6000)
              // if (this.newPiBalance !== this.$store.getters.piBalance) {
              //   console.log('111')
              //   clearInterval(this.timer4)
              // }
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
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.goodsParticular
  .goodsParticular-box
    .goodsParticular-content
      .goods-box
        .goods-rt
          .time-content
            .time-box
              justify-content space-between
              .finishTime-box
                display flex
                margin-right 160px
                @media screen and (max-width 1300px)
                  margin-right 20px
              .addTime-box
                white-space:nowrap;
                display flex
                align-items center
                font-size 16px
                color #fff
                .add-time
                  display flex
                  align-items center
                  margin 5px 20px 0 10px
                  .hour, .min, .seconds
                    display flex
                    justify-content center
                    align-items center
                    height 28px
                    width 28px
                  .colon
                    color #fff
                    font-size 18px
            .pools-box
              margin-left 20px
              margin-top 20px
              span
                font-size 16px
                color #1a1a1a
      .commonTableList
        thead
          tr
            color: #666;
        tbody
          tr
            color: #1a1a1a;
          .topstatus
            color: #4b84ff;
    .goods-ct
      background-color #fcfcfc
      height auto
      .buy-box
        margin-bottom 180px
        li
          height auto
          display flex
          &.li-first
            height 380px
            padding-top 50px
            padding-left 120px
            border-bottom 1px solid #e5e5e5
          &.award
            padding 50px 0 20px 120px
            height 120px
            border-bottom 1px solid #e5e5e5
            .right-award
              display flex
              width 384px
              justify-content space-between
            &.tree
              height auto
              display block
            &.duilie-award
              height auto
              display block
            .tall-award
              /*margin-right 160px*/
            .reward-ratio
              /*margin-right 134px*/
            .agent-award
              /*margin-right 182px*/
            .tree-award
              display flex
              p
                font-size 16px
                color #1a1a1a
                /*margin-left 680px*/
                i
                  font-size 20px
                  font-weight bold
            .TableList
              max-width 580px
              display: block;
              margin 20px auto 0
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
                    flex 1
                    text-align center
                    border 1px solid #e7e8ec
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
                    flex 1
                    text-align center
                    border 1px solid #e7e8ec
          h3
            font-size 20px
            color #1a1a1a
            font-weight bold
            width 30%
          .rule-box
            li
              display flex
              align-items center
              justify-content space-between
              margin-top 30px
              &.price
                margin-top 0
              h5
                font-size 16px
                color #1a1a1a
                margin-right 142px
                &.add-price
                  margin-right 108px
                &.add-method
                  margin-right 108px
              span
                font-size 16px
                color #1a1a1a
    .reward-record
      margin-top 10px
      ul
        display flex
        background-color #fff
        height 70px
        li
          align-items center
          height 100%
          line-height 70px
          text-align center
          font-size 16px
          color #1a1a1a
          flex 1
          cursor pointer
          outline none
          user-select none
          .agent
            width 200px
            margin 0 auto
            white-space nowrap
            &.changeActive
              border-bottom 2px solid #4b84ff
              color #4b84ff
          .tall-agent
            color #999
      .user-agent
        margin-top 20px
        color #999
</style>c
