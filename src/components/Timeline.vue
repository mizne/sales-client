<template>
	<div class="vux-timeline">
		<ul>
			<slot></slot>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'timeline',
  props: {
    color: String,
    current: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      isWechat: false
    }
  },
  watch: {
    current(v) {
      if (typeof v === 'number') {
        this.setChildProps()
      }
    }
  },
  methods: {
    setChildProps () {
      if (!this.$children) return
      const len = this.$children.length
      this.$children.forEach((child, index) => {
        child.isLast = index === len - 1
        child.isFirst = index === 0

        child.past = (index < this.current)
        child.current = (index === this.current )
        child.future = (index > this.current)
      })
    }
  },
  created() {
    console.log(`is wechat: ${this.$browser.isWechat}`)
    this.isWechat = this.$browser.isWechat
  }
}
</script>

<style lang="scss">
@import '../assets/css/main.scss';

.vux-timeline {
  padding: 1rem;
}

.vux-timeline > ul > li {
  list-style: none;
}

.vux-timeline {
  &-item {
    position:relative;
  }

  &-item-content {
    padding:0 0 1.5rem 1.2rem;
  }

  &-item-head, &-item-head-first {
    position:absolute;
    content:'';
    z-index:99;
    border-radius:99px;
  }

  &-item-head {
    width:10px;
    height:10px;
    left:1px;
    top:24px;
  }

  &-item-head-first {
    width:20px;
    height:20px;
    left:-4px;top:16px;
  }

  &-item-tail {
    position:absolute;
    content:'';
    height:130%;
    width:2px;
    left:5px;
    top:14px;
    background-color: $themeColor;
  }

  &-item-checked {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;

    &.weui-icon-success-no-circle::before {
      font-size: 14px;
      position: absolute;
      left: 3px;
      top: 3px;
      margin: 0 !important;
      color: #FFF;
    }

    &.weui-icon-success-no-circle.is-wechat-browser::before {
      font-size: 14px;
      position: absolute;
      left: 5px;
      top: 5px;
      margin: 0 !important;
      color: #FFF;
    }
  }
}

.vux-timeline-item-color {
	background-color: $themeColor;
}
</style>
