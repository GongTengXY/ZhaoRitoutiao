<template>
  <div>
      <van-picker
        title="修改性别"
        show-toolbar
        :columns="columns"
        :default-index="sex"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        />
  </div>
</template>

<script>
import {editUserProfile} from '@/api/profile'

export default {
    data() {
        return {
            columns: ['男', '女'],
            sex : this.value    //性别
        };
    },
    methods: {
        async onConfirm (value, index) {
            this.$toast.loading({
                message : '保存中...',
                forbidClick : true,   //禁止背景点击
                duration : 0,        //持续展示
            })

            try {
                await editUserProfile({
                    gender : index
                })
                //更新视图
                this.$emit('input', index)
                //关闭弹出层
                this.$emit('close')
                //提示修改成功
                this.$toast.success('修改成功')
            } catch (err) {
                this.$toast.fail('修改失败')
            }
        }
    },
    props: {
        value : {
            type : [Number, String],
            required : true
        }
    }
}
</script>

<style>

</style>