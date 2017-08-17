<<template>
  <div class="prompt-container">
    <div class="logo-wrapper">
      <img src="../assets/images/loading1.gif">
    </div>

    <div class="description">{{text}}</div>
  </div>
</template>
<script>
export default {
  name: 'Prompt',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.prompt-container {
  @include flexboxCenter;
  flex-direction: column;
  position: absolute;
  bottom: 50%;
  left: 0;
  right: 0;

  .description {
    margin-top: 10px;
    color: #888;
  }

  .logo-wrapper {
    @include flexboxCenter;
  }
}
</style>


