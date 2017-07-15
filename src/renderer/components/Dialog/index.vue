<template>
  <transition name="dialog"
              @after-enter="$emit('visible')"
              @after-leave="$emit('hidden')">
    <div class="Dialog"
         v-if="showDialog">
      <div class="dialog-mask"
           @click="maskClickClose && (showDialog = false)"></div>
      <div class="dialog-content"
           :style="{ width: `${width}px`, height: `${+height + (title ? 30 : 0)}px` }">
        <div class="dialog-title"
             v-if="title">
          <div class="dialog-title-content">
            {{ title }}
            <div class="close-btn"
                 @click="showDialog = false">×</div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './index.scss';
</style>
