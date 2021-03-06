<template>
  <div class="au-elastic-panel">
    <au-toolkit
      v-if="transformative"
      class="au-elastic-panel-trigger"
      init-position="right"
      direction="vertical"
      @onclick="handleModelTriggerClick"
      title="拖拽调整位置，点击切换视图"
    >
      <slot name="toolkit">
        <au-iconfont v-if="iTransformed" type="vertical" :style="{ fontSize: '20px' }"></au-iconfont>
        <au-iconfont v-else type="horizontal" :style="{ fontSize: '20px' }"></au-iconfont>
      </slot>
    </au-toolkit>
    <div
      class="au-elastic-panel-wrapper"
      :class="`au-elastic-panel-${iTransformed ? 'horizontal' : 'vertical'} au-elastic-panel-${placement}`"
    >
      <div
        class="au-elastic-panel-search"
        :class="`au-elastic-panel-search-${placement} au-elastic-panel-search-${iCollapsed ? 'collapsed' : ''}`"
      >
        <div class="search-content">
          <slot name="form">You should provide a slot named "form"</slot>
        </div>
        <div class="search-collapsed" title="点击展开或收起" @click="handleCollapsedTriggerClick">
          <au-iconfont :type="collapsedIcon"></au-iconfont>
        </div>
      </div>
      <div class="au-elastic-panel-content">
        <slot name="data">You should provide a slot named "data"</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class ElasticPanel extends Vue {
  /**
   * 组件内部数据
   */
  iTransformed = false
  iCollapsed = false

  /**
   * 是否可转换
   */
  @Prop({
    type: Boolean,
    default: () => {
      return true
    },
  })
  readonly transformative!: boolean

  /**
   * 是否可伸缩
   */
  @Prop({
    type: Boolean,
    default: () => {
      return true
    },
  })
  readonly collapsible!: boolean

  /**
   * 是否转换
   */
  @Prop({
    type: Boolean,
    default: () => {
      return false
    },
  })
  readonly transformed!: boolean

  /**
   * 是否收起
   */
  @Prop({
    type: Boolean,
    default: () => {
      return false
    },
  })
  readonly collapsed!: boolean

  /**
   * 位置
   */
  @Prop({
    type: String,
    validator(value: any): boolean {
      return ['left', 'right'].indexOf(value) !== -1
    },
    default: () => {
      return 'left'
    },
  })
  readonly placement!: string

  @Watch('transformed')
  onTransformedChange(value: boolean) {
    this.iTransformed = value
  }

  @Watch('collapsed')
  onCollapsedChange(value: boolean) {
    this.iCollapsed = value
  }

  get collapsedIcon() {
    if (this.iTransformed) {
      if (this.placement === 'left') {
        return this.iCollapsed ? 'double-right' : 'double-left'
      } else {
        return this.iCollapsed ? 'double-left' : 'double-right'
      }
    } else {
      return this.iCollapsed ? 'double-bottom' : 'double-top'
    }
  }

  handleModelTriggerClick() {
    this.iTransformed = !this.iTransformed
    this.$emit('update:transformed', this.iTransformed)
    this.$emit('transform', this.iTransformed)
  }

  handleCollapsedTriggerClick() {
    this.iCollapsed = !this.iCollapsed
    this.$emit('update:collapsed', this.iCollapsed)
    this.$emit('collapse', this.iCollapsed)
  }

  mounted() {
    this.iTransformed = this.transformed
    this.iCollapsed = this.collapsed
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index';

.au-elastic-panel {
  width: 100%;

  .au-elastic-panel-trigger {
    height: 36px;
    width: 36px;
    border-radius: 50%;
    box-shadow: rgba(29, 35, 41, 0.05) 0 1px 4px 0;
    color: rgb(255, 255, 255);
    background-color: @primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .au-elastic-panel-wrapper {
    display: flex;

    .au-elastic-panel-search {
      flex-shrink: 0;
      position: relative;

      .search-collapsed {
        position: absolute;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.35);

        &:hover {
          color: @primary-color;
        }
      }
    }

    .au-elastic-panel-content {
      flex: 1;
    }
  }

  .au-elastic-panel-vertical {
    flex-flow: column;
    flex-direction: column;

    .au-elastic-panel-search {
      //margin: 0 8px;
      min-height: 30px;
      transition: all 0.3s;
      border-bottom: 1px solid #e8e8e8;

      &-collapsed {
        height: 0;
        min-height: 0;
        transition: all 0.3s;

        .search-content {
          display: none;
        }
      }

      .search-collapsed {
        width: 100%;
        bottom: -10px;
        left: 0;
        text-align: center;
      }
    }

    .au-elastic-panel-content {
      margin-top: 10px;
    }
  }

  .au-elastic-panel-horizontal {
    flex-flow: row;

    .au-elastic-panel-search {
      width: 20%;
      min-width: 300px;
      max-width: 500px;
    }

    .au-elastic-panel-content {
      margin: 0 10px;
    }

    &.au-elastic-panel-left {
      .au-elastic-panel-search {
        padding: 0 16px 0 6px;
        transition: all 0.3s;
        border-right: 1px solid #e8e8e8;

        .search-collapsed {
          right: -8px;
          top: 0;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &-collapsed {
          width: 0;
          min-width: 0;
          padding: 0 0 0 6px;

          .search-content {
            overflow: hidden;
          }
        }
      }
    }

    &.au-elastic-panel-right {
      flex-direction: row-reverse;

      .au-elastic-panel-search {
        padding: 0 6px 0 16px;
        transition: all 0.3s;
        border-left: 1px solid #e8e8e8;

        .search-collapsed {
          left: -8px;
          top: 0;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &-collapsed {
          width: 0;
          min-width: 0;
          padding: 0 0 0 6px;

          .search-content {
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
