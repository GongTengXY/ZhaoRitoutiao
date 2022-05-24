<template>
  <div class="preview">
      <img :src="img" class="img" ref="img">

      <div class="toolbar">
          <div class="cancel" @click="$emit('close')">取消</div>
          <div class="confirm" @click="onConfirm">完成</div>
      </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import {editUserPhoto} from '@/api/profile'

export default {
    props: {
        img : {
            type : [String, Object],
            required : true
        }
    },
    data () {
        return {
            cropper : null
        }
    },
    mounted () {
        const image = this.$refs.img
        this.cropper = new Cropper(image, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1,
            // autoCropArea: 1,
            cropBoxMovable: false,
            cropBoxResizable: false,
            background: false,
            movable: true
        })
    },
    methods: {
        onConfirm () {
            // console.log(this.cropper.getCroppedCanvas())

            //纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
            this.cropper.getCroppedCanvas().toBlob(blob => {
                this.newUpated(blob)
            })
        },
        async newUpated (blob) {
            this.$toast.loading({
                message : '保存中...',
                forbidClick : true,   //禁止背景点击
                duration : 0,        //持续展示
            })
            try {
                // console.log(blob)
                // 如果接口要求 Content-Type 是 multipart/form-data
                // 则你必须传递 FormData 对象
                const formData = new FormData()
                formData.append('photo', blob)

                const {data} = await editUserPhoto (formData)
                // 如果接口要求 Content-Type 是 application/json
                // 则你必须传递 普通js对象

                //关闭弹出层
                this.$emit('close')

                //更新视图
                this.$emit('updatePhoto', data.data.photo)

                //提示成功
                this.$toast.success('修改成功')
            } catch (err) {
                this.$toast.fail('修改失败')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.preview {
    background-color: #000;
    height: 100%;
    .img {
        max-width: 100%;
        display: block;
    }
    .toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        color: #fff;
        .cancel {
            width: 90px;
            height: 90px;
            font-size: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 0 10px 20px;
        }
        .confirm {
            width: 90px;
            height: 90px;
            font-size: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 20px;
        }
    }
}
</style>