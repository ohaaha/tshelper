<template>
  <div class="con" :class="{'color':type==0}">
    <slot name="mes"></slot>
  </div>
</template>

<script>
  export default {
    props: ['type'],
    data() {
      return {
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .con {
    position: absolute;
    height: 40px !important;
    line-height: 40px;
    font-size: 18px;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(216, 30, 6, .8);
    color: white;
    text-align: center;
    border-radius: 10px;
    animation: move 2s ease;
    top: -80px;
  }
  @keyframes move
  {
    0% {top: -80px;}
    50% {top: 80px;}
    100% {top: -80px;}
  }
  .color {
    background-color: rgba(67, 193, 88, .8);
  }
</style>
