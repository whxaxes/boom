<template>
  <div class="Preperences">
    <div class="pre-menu">
      <div class="menu-item"
           :class="{ active: menu === item }"
           @click="menu = item"
           v-for="item in menuList"
           :key="item">{{ item }}</div>
    </div>
  
    <div class="pre-controll">
      <div class="btn"
           title="cancel and close"
           @click="close">Cancel</div>
      <div class="btn"
           title="reset config"
           @click="reset()">Reset</div>
      <div class="btn"
           title="reset to default config"
           @click="reset(true)">Default</div>
      <div class="btn"
           title="save and close"
           @click="save">Save</div>
    </div>
  
    <div class="pre-content"
         v-if="menu === menuList.core">
      <div class="pre-title">
        {{ menuList.core }} Settings
      </div>
  
      <div class="pre-item">
        <div class="item-title">
          Music Root
          <div class="sub-title">
            The directory where your music file located. not support multi url.
          </div>
        </div>
        <input type="text"
               ref="musicPath"
               @focus="$refs.musicPath.select()"
               v-model.trim="form.musicPath">
      </div>
  
      <div class="pre-item">
        <div class="item-title">
          Player Style
          <div class="sub-title">
            The style of player.
          </div>
        </div>
        <select name="playStyle"
                v-model="form.playStyle">
          <option v-for="item in styles"
                  :key="item"
                  :value="item">{{ item }}</option>
        </select>
      </div>
    </div>
  
    <div class="pre-content"
         v-if="menu === menuList.about">
      <div class="pre-title">
        {{ menuList.about }}
      </div>
  
      <div class="pre-item">
        <div class="item-title">
          Current Version: {{ version }}
          <div class="sub-title">
            This app created by
            <a @click="openUrl('https://github.com/whxaxes')">whxaxes</a>,
            click <a @click="openUrl('https://github.com/whxaxes/boom/issues')">here</a> to report bugs.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './index.scss';
</style>
