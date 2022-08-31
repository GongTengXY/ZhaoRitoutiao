<template>
    <div class="user-profile">
        <!-- 导航栏 -->
        <van-nav-bar
            @click-left="onClickLeft"
        >
        <div slot="title" style="color : #fff">个人信息</div>
        <van-icon name="arrow-left" slot="left" size="18px" />
        </van-nav-bar>

        <input type="file" hidden ref="file" @change="onFileChange">

        <!-- 信息栏 -->
        <van-cell class="Userphoto" title="头像" is-link @click="$refs.file.click()">
            <van-image
                class="avatar"
                fit="cover"
                round
                :src="UserProfiles.photo"
            />
        </van-cell>
        <van-cell title="昵称" :value="UserProfiles.name" is-link @click="nickShow = true"/>
        <van-cell title="性别" :value="UserProfiles.gender === 0 ? '男' : '女'" is-link @click="sexShow = true"></van-cell>
        <van-cell title="生日" :value="UserProfiles.birthday" is-link @click="birthdayShow = true"></van-cell>

        <!-- 编辑昵称 -->
        <van-popup class="popup-wrap" v-model="nickShow" position="bottom" :style="{ height: '75%' }">
            <NickName v-if="nickShow" v-model="UserProfiles.name" @close="nickShow = false"></NickName>
        </van-popup>

        <!-- 编辑性别 -->
        <van-popup v-model="sexShow" position="bottom" :style="{ height: '50%' }">
            <EditSex @close="sexShow = false" v-model="UserProfiles.gender"></EditSex>
        </van-popup>

        <!-- 编辑生日 -->
        <van-popup v-model="birthdayShow" position="bottom" :style="{ height: '50%' }">
            <EditBirthday v-if="birthdayShow" @close="birthdayShow = false" v-model="UserProfiles.birthday"></EditBirthday>
        </van-popup>

        <!-- 编辑头像 -->
        <van-popup v-model="photoShow" position="bottom" :style="{ height: '100%' }">
            <PreviewPhoto v-if="photoShow" :img="img" @close="photoShow = false" @updatePhoto="UserProfiles.photo = $event"></PreviewPhoto>
        </van-popup>
    </div>
</template>

<script>
import {getUserProfile} from '@/api/user'
import NickName from './components/nickname.vue'
import EditSex from './components/editSex.vue'
import EditBirthday from './components/editBirthday.vue'
import PreviewPhoto from './components/previewPhoto.vue'

export default {
    name : 'UserProfile',
    data () {
        return {
            UserProfiles : {},   //用户的个人信息
            nickShow : false,      //编辑昵称的弹出层状态
            sexShow : false,     //编辑性别的弹出层状态
            birthdayShow : false,   //编辑生日的弹出层状态
            photoShow : false,     //头像预览的弹出层状态
            img : null,        //预览的图片
        }
    },
    created () {
        this.UserProfile()
    },
    methods: {
        onClickLeft () {
            this.$router.back()
        },
        async UserProfile () {
            try {
                const {data} = await getUserProfile()
                this.UserProfiles = data.data
            } catch (err) {
                console.log('获取失败', err.message)
            }
        },
        onFileChange () {
            //获取文件对象
            const file = this.$refs.file.files[0]
            //基于文章对象获取 blob 数据
            this.img = window.URL.createObjectURL(file)
            // console.log(data)
            this.photoShow = true

            //file-input 如果选了同一个文件不会触发 change 事件
            //解决办法：每次使用完毕，就把它的value清空
            this.$refs.file.value = ""
        }
    },
    components: {
        NickName,
        EditSex,
        EditBirthday,
        PreviewPhoto
    }

}
</script>

<style lang="less" scoped>
.user-profile {
    .van-nav-bar {
        background-color: #3296fa;
        .van-nav-bar__title {
            color: #fff;
            letter-spacing: 2px;
        }
        .van-icon {
            color: #fff;
        }
    }

    .avatar {
        width: 60px;
        height: 60px;
    }

    .popup-wrap {
        background-color: #f5f5f9;
    }

    .Userphoto {
        padding-bottom: 0;
    }
}
</style> 