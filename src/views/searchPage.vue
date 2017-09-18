<template>
  <div class="search-page">
    <div class="search-page-header">
      <i @click="backMainPage" class="icon-back back-home-page"></i>
      <search
        class="search-frame"
        :results="results"
        v-model="value"
        @on-change="getResult"
        @result-click="resultClick"
        ref="search"
        >
      </search>
    </div>
    <div class="hot-search">
      <h3>热门搜索</h3>
      <span></span>
    </div>
  </div>
</template>
<script>
import { Search } from 'vux'
import axios from 'axios'
export default{
  components: {
    Search
  },
  data() {
      return {
        results: [{title:'第一'},{title:'第二'}],
        value: '',
      }
  },
  created(){

  },
  methods: {
    backMainPage() {
        this.$router.push('/multi-tenant-home')
    },
    getResult(val) {

    },
    resultClick(item) {

    }
  }
}
</script>
<style lang="scss">
.search-page{
  .search-page-header{
     /*border-bottom:1px solid #D7D6DC;*/
    .back-home-page{
      position:absolute;
      z-index:1000;
      height:44px;
      width:10%;
      text-align:center;
      line-height:44px;
      /*margin-left:15px;*/
      border-bottom:1px solid #D7D6DC;
    }
    .weui-search-bar__form{
      width:240px !important;
      border-radius:5px;
    }
    .vux-search-box{
      width:90% !important;
      margin-left:38px;
      box-sizing:border-box !important;

    }
    .weui-search-bar{
      background-color:#fff;
      border-bottom:1px solid #D7D6DC;
    }
    .weui-search-bar__label{
      background-color:#fff;

    }
    .weui-search-bar:after{
      border:0;
    }
  }
  .hot-search{
    position:absolute;
    top:44px;
    h3{
      font-size:12px;
      color:#9B9B9B;
      margin-top:8px;
      margin-left:8px;
    }
  }
}

</style>

