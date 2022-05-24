<template>
  <div class="search-history">
    <van-cell title="搜索历史">
        <span class="allDetele" v-if="isDeteleShow" @click="$emit('clearHistory')">全部删除</span>
        <span v-if="isDeteleShow" @click="isDeteleShow = false">完成</span>
        <van-icon name="delete-o" slot="default" v-else @click="isDeteleShow = true" />
    </van-cell>
    <van-cell 
        :title="item"
        v-for="(item, index) in historyValue" 
        :key="index"
        @click="onSearchItem(item, index)" 
    >
        <van-icon name="close" v-show="isDeteleShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
    props: {
        // prop数据
        // 如果是普通数据绝对不能修改，即便改了也不会传到给父组件
        // 如果是引用类型数据 （对象、数组）
        //   可以修改；例如 push、splice等方法给数据进行修改
        //   不能重新赋值；  例如 Array = [] 这样是不行的
        historyValue : {
            type : Array,
            required : true,
        }        
    },
    data () {
        return {
            isDeteleShow : false,  //控制删除历史记录的显示状态
        }
    },
    methods: {
        onSearchItem (item, index) {
            if (this.isDeteleShow) {
                //删除状态，删除历史记录
                this.historyValue.splice(index, 1)
            } else  {
                //非删除状态，直接搜索框搜索
                this.$emit('search', item)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search-history {
    .van-cell {
        .van-cell__value {
            span {
                margin-right: 5px;
            }
        }
    }
}
</style>