<template>
   <div>
       <van-nav-bar
            left-text="取消"
            right-text="完成"
            @click-left="onClickLeft"
            @click-right="onClickRight"
        >
        <div slot="title" style="color : #000; font-weight: normal;">编辑昵称</div>
        </van-nav-bar>

        <div class="field-wrap">
            <van-field
            v-model.trim="localName" 
            placeholder="请输入用户昵称" 
            maxlength = "7"
            show-word-limit
            />
        </div>   
   </div>
</template>

<script>
import {editUserProfile} from '@/api/profile'

export default {
    data () {
        return {
            localName : this.value
        }
    },
    props: {
        value : {
            type : String,
            required : true
        },
    },
    methods: {
        onClickLeft () {
            this.$emit('close')
        },
        async onClickRight () {
            this.$toast.loading({
                message : '保存中...',
                forbidClick : true,   //禁止背景点击
                duration : 0,        //持续展示
            })
            try {
                if (!this.localName.length) {
                    return this.$toast('昵称不能为空')
                }
                await editUserProfile({
                    name : this.localName
                })
                // console.log(data)
                
                //更新视图
                this.$emit('input', this.localName)
                //关闭弹层
                this.$emit('close')
                //提示修改成功
                this.$toast.success('修改成功')
            } catch (err) {
                this.$toast.fail('修改失败')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.field-wrap {
    padding: 16px;
}

</style>