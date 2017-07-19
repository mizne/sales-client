<template>
  <div class="phone-verify-container">
    <deal-header title="验证手机号码">
    </deal-header>
  
    <deal-content>
      <div class="form-content">
        <div class="phone-input">
          <x-input title="手机号码" ref="phoneNumber" v-model="phoneNumber" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
        </div>
        <div class="verify-input">
  
          <x-input title="验证码" class="weui-vcode" v-model="verifyCode">
            <x-button slot="right" type="primary" mini @click.native="fetchCode" :disabled="btnDisabled" style="width: 100px;">{{btnText}}</x-button>
          </x-input>
        </div>
      </div>
    </deal-content>
  
    <deal-footer>
      <x-button type="primary" @click.native="ensure" class="button">确认</x-button>
    </deal-footer>
  </div>
</template>
<script>
import { XButton, XInput } from 'vux'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'

import storage from '@/util/storage'
import { vToast, vAlert } from '@/util/vux-wrapper'

export default {
  name: 'PhoneVerify',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    XButton,
    XInput,
  },
  data() {
    return {
      phoneNumber: '', // 输入的电话号码
      verifyCode: '', // 输入的 验证码
      btnDisabled: false, // 是否禁用 发送验证码 按钮
      btnText: '发送验证码', // 发送验证码按钮 文字
      restSeconds: 60, // 可再次发送验证码 剩余秒数
      timeId: null, // 倒数剩余秒数的 定时器
    }
  },
  methods: {
    ensure() {
      if (this.phoneNumber && this.verifyCode && this.$refs.phoneNumber.valid) {
        this.$store.dispatch('VERIFY_SMS_CODE', {
          phoneNumber: this.phoneNumber,
          verifyCode: this.verifyCode
        })
          .catch(err => {
            vAlert({
              content: err.message || '验证码未知错误'
            })
              .then(_ => {
                this.verifyCode = ''
              })
          })
      }
    },
    fetchCode() {
      if (this.phoneNumber && this.$refs.phoneNumber.valid) {
        this.btnDisabled = true

        this.timeId = window.setInterval(() => {
          this.restSeconds -= 1
          this.btnText = `${this.restSeconds} 秒`

          if (this.restSeconds === 0) {
            window.clearInterval(this.timeId)
            this.btnText = '发送验证码'
            this.btnDisabled = false
            this.restSeconds = 60
          }
        }, 1e3)

        this.$store.dispatch('FETCH_SMS_CODE', this.phoneNumber)
          .then(_ => {
            vToast({ content: '验证码已发送, 请注意查收 ^_^' })
          })
          .catch(err => {
            vAlert({
              content: err.message || '服务器异常'
            })
              .then(_ => {
                this.verifyCode = ''
              })
          })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.phone-verify-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    overflow: auto;

    .form-content {
      .phone-input {
        border-radius: 5px;
        background-color: #fff;

        input {
          width: 100%;
        }
      }

      .verify-input {
        margin-top: 20px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        background-color: white;
      }

      input {
        padding: 3px 10px;
        line-height: 2;
        box-sizing: border-box;
        transition: border-color .5s ease-out;
      }
    }
  }

  .deal-footer-container {
    .button {
      height: 100%;
    }
  }

  .deal-dialog-container {
    .deal-dialog {
      .content {
        @include flexboxCenter;
        height: 50px;
      }

      .btn-group {
        height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .ok {
          flex: 1;
          color: $primaryColor;
        }
      }
    }
  }
}
</style>


