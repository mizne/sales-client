<<template>
  <div class="no-coupon">
    <div class="logo"></div>
    <div class="description">还没有优惠券呢, 还不快去扫码领取 ^_^</div>
  </div>
</template>
<script>
export default {
  name: 'NoCoupon'
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.no-coupon {
  @include flexboxCenter;
  flex-direction: column;
  position: relative;
  top: 15%;

  .logo {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background: url(../assets/images/f778738c-e4f8-4870-b634-56703b4acafe.gif);
    background-size: 100% 100%;
  }

  .description {
    margin-top: 10px;
    color: #888;
  }
}
</style>


