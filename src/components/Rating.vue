<template>
  <div class="rating-container">
    <div class="title">{{title}}</div>
    <div class="content">
      <i class="icon-star" v-for="(item, index) in 5" :key="item.$index" :class="{'on': index <= selectedIndex}"
       @click="choose(index)">

      </i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Rating',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number
    }
  },
  watch: {
    value(v) {
      if (v != null) {
        this._initIndex()
      }
    }
  },
  data() {
    return {
      selectedIndex: -1
    }
  },
  methods: {
    choose(index) {
      this.selectedIndex = index
      this.$emit('input', index + 1)
    },
    _initIndex() {
      this.selectedIndex = this.value - 1
    }
  },
  created() {
    if (this.value != null) {
      this._initIndex()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.rating-container {
  height: 40px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .title {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }

  .content {
    flex: 3;
    display: flex;
    justify-content: space-around;
    .icon-star {
      transform: scale(2);
      color: #aaa;

      &.on {
        color: $primaryColor;
      }
      
    }
  }
}
</style>