<template>
  <div
    v-show="show"
    class="vue-pageloading"
  >
    <div class="vue-pageloading-box">
      <div class="vue-pageloading-dot vue-pageloading-dot--before" />
      <div class="vue-pageloading-dot" />
      <div class="vue-pageloading-dot vue-pageloading-dot--after" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePageLoading',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
.vue-pageloading {
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  &-box {
    z-index: 10000;
    top: 50%;
    left: 50%;
    width: 110px;
    height: 32px;
    position: fixed;
    margin-top: -16px;
    margin-left: -55px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    animation: pageloadingplay 1.8s ease-in-out infinite;
  }
  &-dot--before {
    margin-right: 8px;
    animation-delay: -0.16s;
  }
  &-dot--after {
    margin-left: 8px;
    animation-delay: 0.16s;
  }
}
@keyframes pageloadingplay {
  0%,
  80%,
  100% {
    box-shadow: 0 32px 0 -32px #fff;
  }
  40% {
    box-shadow: 0 32px 0 0 #fff;
  }
}

</style>
