<template>
  <div class="Search">
    <!-- 搜索栏 -->
    <form action="/" class="search_fixed">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
        background="#3296fa"
        shape="round"
      />
    </form>

    <!-- 搜索结果 -->
    <searchResults 
    v-if="isResultShow"
    :searchValue="searchText"
    ></searchResults>

    <!-- 关键词搜索建议 -->
    <searchSuggestion 
    v-else-if="searchText"
    :searchValue="searchText"
    @changeSearch="onSearch"
    >
    </searchSuggestion>

    <!-- 搜索历史记录 -->
    <searchHistory 
    v-else
    :historyValue="searchHistories"
    @clearHistory="searchHistories = []"
    @search="onSearch"
    >
    </searchHistory>

  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import searchResults from './components/search-results.vue'
import searchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  data() {
    return {
      searchText : '',   //搜索文本
      isResultShow : false,  //控制搜索结果的展示
      searchHistories : getItem('TOUTIAO_SEARCH_HISTORIOS') || [],  //保存搜索的历史记录
    };
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val

      //存储搜索历史记录
      //解决不能有重复历史记录且，把最新的搜索记录放到最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // console.log(this.searchHistories)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    },
  },
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORIOS', val)
    }
  },
  components: {
    searchHistory,
    searchResults,
    searchSuggestion,
  }
}
</script>

<style lang="less" scoped>
.Search {
  padding-top: 108px;
  .search_fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }

  .van-search__content {
    width: 589px;
    height: 60px;   
    .van-cell {
      line-height: 40px;
    }
  }
  .van-search__action {
    color: #ffffff;
    font-size: 28px;
  }
}
</style>