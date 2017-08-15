<template>
	<li class="vux-timeline-item">
		<div :class="['vux-timeline-item-color', {'vux-timeline-item-head': !current,'vux-timeline-item-head-first': current }]" :style="headStyle">
			<!-- <icon v-show="current" type="success_no_circle" class="vux-timeline-item-checked"></icon> -->
		</div>
		<div class="vux-timeline-item-tail" :style="tailStyle"></div>
		<div class="vux-timeline-item-content" :class="{'past': past, 'current': current, 'future': future}">
			<slot></slot>
		</div>
	</li>
</template>

<script>
import { Icon } from 'vux'

export default {
  name: 'timeline-item',
  data () {
    return {
      isLast: true,
      past: false,
      current: false,
      future: false,
      headStyle: { backgroundColor: this.$parent.color }
    }
  },
  mounted () {
    this.$parent.setChildProps()
  },
  beforeDestroy () {
    // this will be null
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.setChildProps()
    })
  },
  components: {
    Icon
  },
  computed: {
    tailStyle () {
      return this.isLast ? { display: 'none', backgroundColor: this.$parent.color } : { display: 'block', backgroundColor: this.$parent.color }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/css/main.scss'; 

.vux-timeline-item {
  .vux-timeline-item-content {
    &.past {
      color: black;
    }
    &.current {
      color: $themeColor;
    }
    &.future {
      color: $greyText;
    }
  }
}
</style>


