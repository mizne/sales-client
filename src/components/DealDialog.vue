<template>
  <div class="deal-dialog-container">
  
    <template v-if="maskEnterActive">
      <transition :enter-active-class="maskEnter" :leave-active-class="maskLeave">
        <div class="deal-mask" @click="showDialog = false" v-show="showDialog"></div>
      </transition>
    </template>
    <template v-else>
      <transition :name="maskTran">
        <div class="deal-mask" @click="showDialog = false" v-show="showDialog"></div>
      </transition>
    </template>


    <template v-if="dialogEnterActive">
      <transition :enter-active-class="dialogEnter" :leave-active-class="dialogLeave">
        <div class="deal-dialog" v-show="showDialog" :style="dialogStyle">
          <slot></slot>
        </div>
      </transition>
    </template>
    <template v-else>
      <transition :name="dialogTran">
        <div class="deal-dialog" v-show="showDialog" :style="dialogStyle">
          <slot></slot>
        </div>
      </transition>
    </template>
  
  </div>
</template>
<script>
export default {
  name: 'DealDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    maskEnterActive: String,
    maskLeaveActive: String,
    maskTransition: {
      type: String,
      default: 'deal-mask'
    },
    dialogEnterActive: String,
    dialogLeaveActive: String,
    dialogTransition: {
      type: String,
      default: 'deal-dialog'
    },
    dialogStyle: Object
  },
  watch: {
    value(v) {
      this.showDialog = v
    },
    showDialog(v) {
      this.$emit('input', v)
    }
  },
  data() {
    return {
      showDialog: false,
      maskTran: '',
      dialogTran: '',
      maskEnter: undefined,
      maskLeave: undefined,
      dialogEnter: undefined,
      dialogLeave: undefined
    }
  },
  created() {
    if (this.maskEnterActive && this.maskLeaveActive) {
      this.maskEnter = this.maskEnterActive
      this.maskLeave = this.maskLeaveActive
    } else {
      this.maskTran = this.maskTransition
    }

    if (this.dialogEnterActive && this.dialogLeaveActive) {
      this.dialogEnter = this.dialogEnterActive
      this.dialogLeave = this.dialogLeaveActive
    } else {
      this.dialogTran = this.dialogTransition
    }
  }
}
</script>  
<style lang="scss">
.deal-dialog-container {
  .deal-mask {
    position: fixed;
    z-index: 1000;
    top: 40px;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .deal-dialog {
    position: fixed;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: #fff;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>