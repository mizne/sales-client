<template>
  <div class="ordering-container">
    <deal-header title="正在下单">
      <span class="empty" slot="left" style="width: 40px;">
      </span>
    </deal-header>
    
    <deal-content>
      <process-bar @end="end"></process-bar>
      <div class="text">
        订单正在飞向厨房, 客官请耐心等待 ：)
      </div>
    </deal-content>
  </div>
</template>
<script>
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import ProcessBar from '@/components/ProcessBar'

import { mapGetters } from 'vuex'
export default {
  name: 'Ordering',
  components: {
    DealHeader,
    DealContent,
    ProcessBar
  },
  data() {
    return {
      animationEnd: false,
      isBack: false
    }
  },
  computed: {
    ...mapGetters(['orderingSuccess'])
  },
  watch: {
    orderingSuccess(v) {
      if (v && this.animationEnd) {
        if (!this.isBack) {
          this.$router.push({ name: 'OrderSuccess' })
        }
      }
    }
  },
  methods: {
    end() {
      this.animationEnd = true
      if (this.orderingSuccess) {
        if (!this.isBack) {
          this.$router.push({ name: 'OrderSuccess' })
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    
    next((vm) => {
      if (from.name === 'OrderSuccess') {
        vm.isBack = true
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.ordering-container {
  .deal-header-container {
    .placeholder {
      width: 44px;
    }
  }

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;

    .process-bar-container {
      margin: 50px 0;
    }
    .text {
      text-align: center;
      font-size: 1.2rem;
      color: $primaryColor;
    }
  }
}
</style>


