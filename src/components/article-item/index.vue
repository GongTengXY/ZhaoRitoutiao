<template>
    <van-cell :to="`/article/${article.art_id}`">
        <div slot="title" class="title van-multi-ellipsis--l2">{{article.title}}</div>
        <div slot="label" >
            <div v-if="article.cover.type === 3" class="cover-wrap">
                <div class="cover-item" v-for="(img,ind) in article.cover.images" :key="ind">
                    <van-image
                    class="cover-item-img"
                        slot="default"
                        fit="cover"
                        :src="img"
                    />
                </div>
            </div>
            <div class="laber-info">
                <span>{{article.aut_name}}</span>
                <span>{{article.comm_count}}条评论</span>
                <span>{{article.pubdate | relativeTime}}</span>
            </div>
        </div>
        <van-image
            v-if="article.cover.type === 1"
            slot="default"
            class="right-img"
            fit="cover"
            :src="article.cover.images[0]"
        />
    </van-cell>
    
</template>
<script>
export default {
    props: {
        article : Object,
        required : true
    }
}
</script>

<style lang="less" scoped>
.title {
    font-size: 32px;
    color: #3a3a3a;
}
.van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    margin-left: 25px;
}
.right-cover {
    width: 232px;
    height: 146px;
}
.van-cell__label span{
    font-size: 23px;
    color: #b4b4b4;
}
.cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
        flex: 1;
        height: 146px;
        &:not(:last-child) {
            padding-right: 4px;
        }
        .cover-item-img {
            width: 100%;
            height: 146px;
        }
    }
    
}
.laber-info {
    span {
        margin-right: 23px;
    }
}
</style>