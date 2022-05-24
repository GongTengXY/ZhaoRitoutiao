<template>
  <div class="search-suggestion">
      <van-cell 
      icon="search" 
      v-for="(item, index) in searchMessage" 
      :key="index"
      @click="$emit('changeSearch', item)"
      >
      <div v-html="highlight(item)" slot="title"></div>
      </van-cell>
      <!-- v-html可以渲染带有html标签的字符串 -->
      <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
//按需加载可以只会使用到的成员函数打包到结果中
import { debounce } from 'lodash'

export default {
    props: {
        searchValue : {       //搜做框输入的值
            type : String,
            required : true
        }
    },
    data () {
        return {
            searchMessage : [],  //保存提示搜索
            htmlStr : 'Hello <span style="color: red">World</span>'
        }
    },
    watch: {
        searchValue : {
            immediate: true,
            //当 searchValue发生改变的时候，就会调用handler 函数
            // handler (value) {
            //     this.loadSearchSuggestion(value)
            // }
            
            //debounce 函数
            //参数1 ：一个函数
            //参数2 ：延迟的时间，单位是毫秒
            //返回值 ： 防抖之后的函数
            handler : debounce(function (value) {
                this.loadSearchSuggestion(value)
            }, 1000)
        }
    },
    methods: {
        async loadSearchSuggestion (message) {
            try {
                const {data} = await getSearchSuggestion(message)
                // console.log(data)
                this.searchMessage = data.data.options
            } catch (err) {
                this.$toast('请求失败')
                // console.log(err)
            }
        },
        highlight (text) {
            const highLightStr =  `<span style="color : #3296fa;">${this.searchValue}</span>`
            const reg = new RegExp(this.searchValue, 'gi')
            return text.replace(reg, highLightStr) 
        }
    }
}
</script>

<style lang="less" scoped>

</style>