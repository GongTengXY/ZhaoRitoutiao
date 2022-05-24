<template>
  <div>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        show-toolbar
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        />
  </div>
</template>

<script>
import {editUserProfile} from '@/api/profile'
import dayjs, { Dayjs } from 'dayjs'

export default {
    props: {
        value : {
            type : String,
            required : true
        }
    },
    data() {
        return {
            minDate: new Date(1950, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value)
        };
    },
    methods: {
        async onConfirm() {
            this.$toast.loading({
                message : '保存中...',
                forbidClick : true,   //禁止背景点击
                duration : 0,        //持续展示
            })
            try {
                await editUserProfile({
                    birthday : dayjs(this.currentDate).format('YYYY-MM-DD')
                })
                //更新视图
                this.$emit('input', dayjs(this.currentDate).format('YYYY-MM-DD'))
                //关闭弹层
                this.$emit('close')
                //提示
                this.$toast.success('修改成功')
            } catch (err) {
                this.$toast.fail('修改失败')
            }
        }
    }
}
</script>

<style>

</style>