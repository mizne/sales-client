<template>
  <div class="wait-order-container">
    <div class="timeout-order" v-if="timeout">
      订单已超时
    </div>
  
    <div class="wait-order" v-else>
      <div class="icon-area">
        <i class="icon-time"></i>
      </div>
      <div class="description">
        <div class="title">
          <div class="label">等待接单</div>
          <div class="rest-time">{{restTimeSeconds | timeRest}}</div>
        </div>
        <div class="content">
          {{duration}}分钟内商家未接单, 将自动取消订单.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fecha from 'fecha'
import { fillZero } from '@/util/index'

export default {
  name: 'WaitOrder',
  props: {
    duration: {
      type: Number,
      default: 5
    },
    orderTime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeId: null,
      restTimeSeconds: 0,
      timeout: false
    }
  },
  filters: {
    timeRest(v) {
      const minutes = Math.floor(v / 60)
      const seconds = v % 60
      return `${fillZero(minutes)}:${fillZero(seconds)}`
    }
  },
  watch: {
    timeout(v) {
      if (v) {
        console.log(v)
        this.$emit('timeout')
      }
    }
  },
  methods: {
    initRestTime() {
      const orderTimeSeconds = Math.round(fecha.parse(this.orderTime, 'YYYY-MM-DD HH:mm:ss').getTime() / 1e3)
      const nowSecondes = Math.round(new Date().getTime() / 1e3)
      const restTimeSeconds = orderTimeSeconds + this.duration * 60 - nowSecondes

      if (restTimeSeconds <= 0) {
        this.timeout = true
        return
      }

      this.restTimeSeconds = restTimeSeconds
    },
    timeInterval() {
      this.timeId = window.setInterval(() => {
        if (this.restTimeSeconds <= 0) {
          this.timeout = true
          this.clearTimeInterval()
          return 
        }
        this.restTimeSeconds -= 1
      }, 1e3)
    },
    clearTimeInterval() {
      if (this.timeId) {
        window.clearInterval(this.timeId)
      }
    }
  },
  created() {
    this.initRestTime()
    if (!this.timeout) {
      this.timeInterval()
    }
  },
  beforeDestroy() {
    this.clearTimeInterval()
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.wait-order-container {

  .wait-order {
    @include flexboxCenter;
    .icon-area {
      @include flexboxCenter;
      flex: 1;
      color: $greyText;
    }
    .description {
      flex: 5;
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: $warnColor;
        .label {}
        .rest-time {
          margin-left: 10px
        }
      }

      .content {
        color: $greyText;
      }
    }
  }

  .timeout-order {
    @include flexboxCenter;
    color: $warnColor;
  }
}
</style>


