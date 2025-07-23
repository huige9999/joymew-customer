<template>
  <sub-page>
    <main-card>
      <card-top-info title="基本信息"></card-top-info>
      <el-form
        ref="chapter"
        :rules="rules"
        :model="chapter"
        label-width="120px"
        class="chapter"
        :show-message="true"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-form-item label="小节名称" prop="album_info_title">
          <el-input v-model="chapter.album_info_title"></el-input>
        </el-form-item>
        <el-form-item label="小节简介" prop="album_desc">
          <el-input v-model="chapter.album_desc" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="小节类型" prop="audio_address">
          <el-radio disabled v-model="media" label="audio">音频</el-radio>
          <el-radio disabled v-model="media" label="video">视频</el-radio>
        </el-form-item>

        <el-form-item label="音频" prop="audio_address" v-if="media === 'audio'">
          <el-upload
            :disabled="!!album_info_id"
            class="head-upload"
            name="testfile"
            accept="audio/flac, audio/mp3"
            :show-file-list="false"
            :http-request="handleFile"
            action
          >
            <div class="img-wrap">
              <div class="uploadImg-btn">
                <el-button type="primary" size="small" icon="el-icon-circle-plus">选择音频</el-button>
                <div class="tips">建议格式：MP3</div>
              </div>
              <audio
                :src="chapter.audio_address"
                class="cusaudio"
                ref="cusaudio"
                controls="controls"
              ></audio>
              <!-- <audio src="https://www.w3school.com.cn/i/horse.ogg" class="cusaudio"></audio> -->
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="视频" prop="video_address" v-if="media === 'video'">
          <el-upload
            class="head-upload"
            name="testfile"
            :show-file-list="false"
            :http-request="handleFile"
            action
            accept="video/mp4, video/webm"
          >
            <div class="img-wrap">
              <div class="uploadImg-btn">
                <el-button type="primary" size="small" icon="el-icon-circle-plus">选择视频</el-button>
                <div class="tips">建议格式：MP4</div>
              </div>
              <video :src="chapter.video_address" class="cusvideo" ref="cusvideo"></video>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="详情" prop="rich_content">
          <tinymce v-model="chapter.rich_content" :height="300" />
        </el-form-item>
        <el-form-item label="集数" prop="sort">
          <el-input-number v-model="chapter.sort" :min="1" label="集数"></el-input-number>
        </el-form-item>
        <el-form-item label="是否试看" prop="is_need_pay">
          <el-radio v-model="chapter.is_need_pay" label="0">试看</el-radio>
          <el-radio v-model="chapter.is_need_pay" label="1">付费</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="reBack">取消</el-button>
        </el-form-item>
      </el-form>
    </main-card>
  </sub-page>
</template>

<script>
import Tinymce from '@/components/Tinymce';

import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
// import MyTable from '@/components/myTable';
import { editChapterDetail, getChapterDetail, saveChapterDetail, upLoadMediaFile } from '@/api/app/course';
import { domain, uploadImg } from '@/api/app/qn';
import CardTopInfo from '@/components/cardTopInfo';

const chars = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
function generateMixed(an) {
  let res = '';
  for (let ia = 0; ia < an; ia++) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}
// album_title, album_desc, album_cover_urlalbum, purchase_price
export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    Tinymce,
    // MyTable,
  },
  data() {
    return {
      percent: 0,
      pre_file_auido: '',
      pre_file_video: '',
      loading: false,
      media: '',
      chapter: {
        album_info_title: '',
        album_desc: '',
        album_info_time_size: '300',
        audio_address: '',
        video_address: '',
        // audio_address: '',
        // video_address: '',
        rich_content: '',
        sort: '',
        is_need_pay: '1',
      },
      album_id: null,
      album_info_id: null,
      rules: {
        album_info_title: [{ required: true, message: '请输入小节名称', trigger: 'blur' }],
        media: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        is_need_pay: [{ required: true, message: '请选择试看类型', trigger: 'blur' }],
        sort: [{ required: true, message: '请选择集数', trigger: 'blur' }],
      },
    };
  },
  computed: {
    loadingText() {
      if (this.percent) {
        return `上传文件中， 请勿离开当前页面 当前进度 ${this.percent}%`;
      }
      return '上传文件中， 请勿离开当前页面';
    },
  },
  created() {
    console.log(`this.$route${this.$route.query.id}`);
    console.log(this.$route.query.id);
    if (this.$route.query.id) {
      this.album_info_id = this.$route.query.id;
    }
    if (this.$route.query.album_id) {
      this.album_id = this.$route.query.album_id;
    } else {
      this.$message('id异常 ，请退出重进');
    }
    if (this.$route.query.media) {
      this.media = this.$route.query.media;
    }
    if (this.album_info_id) {
      this.getChapterInfo();
    }
  },
  methods: {
    getChapterInfo() {
      getChapterDetail({
        album_info_id: this.album_info_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.chapter.album_info_play_volume = res.data.album_info_play_volume || 300;
            this.chapter.album_info_title = res.data.album_info_title || '';
            this.chapter.album_desc = res.data.album_desc || '';
            this.chapter.rich_content = res.data.rich_content || '';

            this.chapter.is_need_pay = res.data.is_need_pay || '';
            this.chapter.sort = res.data.sort || '';
            this.chapter.video_address = res.data.video_address || '';
            this.chapter.audio_address = res.data.audio_address || '';
            if (res.data.video_address) {
              this.media = 'video';
            }
            if (res.data.audio_address) {
              this.media = 'audio';
            }
          } else {
            console.log('err');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveChapterInfo() {
      // if (this.chapter.audio_address) {
      //   return;
      // }
      const params = {
        album_id: this.album_id,
        album_info_id: this.album_info_id,
        album_info_title: this.chapter.album_info_title,
        album_desc: this.chapter.album_desc,
        rich_content: this.chapter.rich_content,
        sort: this.chapter.sort,
        is_need_pay: this.chapter.is_need_pay,
      };
      if (this.media === 'video') {
        params.video_address = this.chapter.video_address;
        const { cusvideo } = this.$refs;
        this.chapter.album_info_time_size = cusvideo.duration || '0';
        params.video_address = this.chapter.video_address;
      } else {
        params.audio_address = this.chapter.audio_address;
        const { cusaudio } = this.$refs;
        this.chapter.album_info_time_size = cusaudio.duration || '';
        params.audio_address = this.chapter.audio_address;
      }
      if (this.chapter.album_info_time_size) {
        params.album_info_time_size = this.chapter.album_info_time_size;
      }
      saveChapterDetail(params)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.$message.success('新增成功');
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          } else {
            this.$message.error('新增失败');
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('新增失败');
        });
    },
    editChapterInfo() {
      const params = {
        album_info_id: this.album_info_id,
        album_info_title: this.chapter.album_info_title,
        album_desc: this.chapter.album_desc,
        rich_content: this.chapter.rich_content,
        sort: this.chapter.sort,
        is_need_pay: this.chapter.is_need_pay,
      };
      if (this.media === 'video') {
        params.video_address = this.chapter.video_address;
      } else {
        params.audio_address = this.chapter.audio_address;
      }
      if (this.chapter.album_info_time_size) {
        params.album_info_time_size = this.chapter.album_info_time_size;
      }
      editChapterDetail(params)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.$message.success('编辑成功');
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          } else {
            this.$message.error('编辑失败');
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('编辑失败');
        });
    },
    onSubmit() {
      // this.$router.push('addChapter');
      const params = {
        album_info_id: this.album_info_id,
        album_info_title: this.chapter.album_info_title,
        album_desc: this.chapter.album_desc,
        rich_content: this.chapter.rich_content,
        sort: this.chapter.sort,
        is_need_pay: this.chapter.is_need_pay,
      };
      if (this.media === 'video') {
        if (!this.chapter.video_address) {
          this.$message.error('请上传视频');
          return;
        }
        const { cusvideo } = this.$refs;
        this.chapter.album_info_time_size = cusvideo.duration || 0;
        params.video_address = this.chapter.video_address;
      } else {
        if (!this.chapter.audio_address) {
          this.$message.error('请上传音频');
          return;
        }
        const { cusaudio } = this.$refs;
        this.chapter.album_info_time_size = cusaudio.duration || '';
        params.audio_address = this.chapter.audio_address;
      }
      const formName = 'chapter';

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          console.log(params);
          console.log(this.album_info_id);
          if (this.album_info_id) {
            this.editChapterInfo();
          } else {
            this.saveChapterInfo();
          }
          return true;
        }
        this.$message('请完善信息');
        console.log('error submit!!');
        return false;
      });
    },
    reBack() {
      this.$confirm('取消后编辑内容不会保存, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => { });
    },
    handleFile(e) {
      // 处理文件
      console.log(e);
      const fileSize = e.file.size / 1024 / 1024;
      console.log(`fileSize${fileSize}`);

      if (fileSize > 1024 * 6) {
        console.log(' 大于6gb');
        this.$message.error('当前文件大小超出6GB 上传失败');
        return;
      }
      console.log(' 小于6gb');
      if (this.media === 'audio') {
        this.requestUploadAUDIOToQiniu(e.file);
      } else {
        this.requestUploadVIDEOToQiniu(e.file);
      }
    },
    /* base 64 转换成file  这里对base64 进行压缩 */
    requestUploadAUDIO(file) {
      this.percent = '';
      if (this.loading) {
        return;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append('file', file);
      upLoadMediaFile(formData)
        .then((res) => {
          console.log(res);
          this.chapter.audio_address = res.data.filePath;
          this.$message.success('音频上传成功');
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          // this.pre_file_video = this.chapter.audio_address;
          this.$message.error('音频上传失败');
        });
    },
    requestUploadVIDEO(file) {
      this.percent = '';
      if (this.loading) {
        return;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append('file', file);
      upLoadMediaFile(formData)
        .then((res) => {
          console.log(res);
          this.chapter.video_address = res.data.filePath;
          this.loading = false;
          this.$message.success('视频上传成功');
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          // this.pre_file_audio = this.chapter.audio_address;
          this.$message.error('视频上传失败');
        });
    },
    handleLoading(type, res) {
      this.percent = '';
      // console.log(type, res)
      if (type === 'next') {
        this.percent = res.total.percent.toFixed(2);
      }
    },
    requestUploadVIDEOToQiniu(file) {
      this.percent = '';
      console.log(file);
      console.log(this.$store.state.login.userInfo);

      const userId = this.$store.state.login.userInfo.id;
      const today = new Date();
      const add0 = (item) => {
        return item > 9 ? item : `0${item}`;
      };
      const todayStr = `${today.getFullYear()}${add0(today.getMonth() + 1)}${add0(today.getDate())}`;
      // const fileName = file.name;
      const fileName = generateMixed(12);

      const key = `userCourseVideo/${userId}/${todayStr}/${generateMixed(12)}/${fileName}`;
      if (this.loading) {
        return;
      }
      this.loading = true;
      uploadImg(file, key, this.handleLoading.bind(this))
        .then((res) => {
          // this.percent = 100;
          this.loading = false;

          if (res.key) {
            this.$message.success('视频上传成功');

            this.chapter.video_address = `${domain}${res.key}`;
          } else {
            this.$message.error('视频上传失败');
          }

          console.log(res);
        })
        .catch((err) => {
          console.log(err);

          this.loading = false;

          this.$message.error('视频上传失败');
        });
    },
    // file、userId、today、todayStr、key
    requestUploadAUDIOToQiniu(file) {
      this.percent = '';
      console.log(file);
      console.log(this.$store.state.login.userInfo);

      const userId = this.$store.state.login.userInfo.id;
      const today = new Date();
      const add0 = (item) => {
        return item > 9 ? item : `0${item}`;
      };
      const todayStr = `${today.getFullYear()}${add0(today.getMonth() + 1)}${add0(today.getDate())}`;
      const fileName = generateMixed(12);
      const key = `userCourseAudio/${userId}/${todayStr}/${generateMixed(12)}/${fileName}`;
      if (this.loading) {
        return;
      }
      this.loading = true;
      uploadImg(file, key, this.handleLoading.bind(this))
        .then((res) => {
          // this.percent = 100;
          this.loading = false;

          if (res.key) {
            this.chapter.audio_address = `${domain}${res.key}`;
            this.$message.success('音频上传成功');
          } else {
            this.$message.error('音频上传失败');
          }

          console.log(res);
        })
        .catch((err) => {
          console.log(err);

          this.loading = false;

          this.$message.error('音频上传失败');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.chapter {
  width: 60%;
  // height: 80px;
  padding: 36px;
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
}
.img-wrap {
  display: flex;
  .cusaudio {
    margin-left: 40px;
    width: 260px;
    height: 250px;
  }
  .cusvideo {
    margin-left: 40px;
    width: 260px;
    height: 250px;
  }
}
// .cusaudio {
//   width: 120px;
// }
// .cusvideo {
//   width: 120px;
// }
</style>
