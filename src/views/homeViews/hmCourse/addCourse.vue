<template>
  <sub-page>
    <main-card>
      <card-top-info title="基本信息"> </card-top-info>
      <el-form ref="course" :rules="rules" :model="course" label-width="140px" class="course" :show-message="true">
        <el-form-item label="课程标题" prop="album_title">
          <el-input v-model="course.album_title"></el-input>
        </el-form-item>
        <!-- <el-form-item label="课程价格">
          <el-input v-model="course.title"></el-input>
        </el-form-item> -->
        <el-form-item label="封面图" prop="album_cover_urlalbum">
          <!-- <el-input v-model="course.album_cover_urlalbum"></el-input> -->
          <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
            <div class="img-wrap">
              <div class="uploadImg-btn">
                <el-button type="primary" size="small" icon="el-icon-circle-plus">选择图片</el-button>
                <div class="tips">建议尺寸：260*250</div>
              </div>
              <img :src="pre_file_pic" alt="封面图" class="coverImg" v-show="pre_file_pic"/>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程价格(元)" prop="purchase_price">
          <el-input-number v-model="course.purchase_price" :precision="2" :step="1" :min="0">
            <!-- <template slot="append">元</template> -->
          </el-input-number>
          <!-- <el-input v-model="course.purchase_price" oninput="value=value.replace(/[^0-9.]/g,'')" type="text"> -->
          <template slot="append">元</template>
          <!-- </el-input> -->
        </el-form-item>
        <el-form-item label="课程分成比例(%)" prop="inviter_rate">
          <el-input-number v-model="course.inviter_rate" :precision="0" :step="1" :min="0" :max="100">
            <!-- <template slot="append">元</template> -->
          </el-input-number>
          <!-- <el-input v-model="course.purchase_price" oninput="value=value.replace(/[^0-9.]/g,'')" type="text"> -->
          <!-- <template slot="append">%</template> -->
          <!-- </el-input> -->
        </el-form-item>
        <el-form-item label="课程简介" prop="album_desc">
          <el-input v-model="course.album_desc" type="textarea" :rows="4"></el-input>
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
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
// import MyTable from '@/components/myTable';
import CardTopInfo from '@/components/cardTopInfo';
import {
  saveCourse, editCourse, getCourse, upLoadFile,
} from '@/api/app/course';
// album_title, album_desc, album_cover_urlalbum, purchase_price
export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    // MyTable,
  },
  data() {
    return {
      pre_file_pic: '',
      course: {
        album_title: '',
        album_desc: '',
        album_cover_urlalbum: '',
        purchase_price: '',
        inviter_rate: 25,
      },
      album_id: null,
      rules: {
        album_title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        album_desc: [{ required: true, message: '请输入课程简介', trigger: 'blur' }],
        purchase_price: [{ required: true, message: '请输入课程价格', trigger: 'blur' }],
        inviter_rate: [{ required: true, message: '请输入分成比例', trigger: 'blur' }],
        album_cover_urlalbum: [{ required: true, message: '请上传课程封面', trigger: 'blur' }],
      },
    };
  },
  created() {
    console.log(`this.$route${this.$route.query.id}`);
    console.log(this.$route.query.id);
    if (this.$route.query.id) {
      this.album_id = this.$route.query.id;
    }
    if (this.album_id) {
      this.getCourseInfo();
    }
  },
  methods: {
    getCourseInfo() {
      getCourse({
        album_id: this.album_id,
      })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.course.album_desc = res.data.album_desc || '';
            this.album_id = res.data.album_id || null;
            this.course.album_cover_urlalbum = res.data.album_cover_urlalbum || '';
            this.pre_file_pic = this.course.album_cover_urlalbum || '';
            this.course.purchase_price = res.data.purchase_price || '';
            this.course.inviter_rate = Number(res.data.inviter_rate || 0.25) * 100;
            this.course.album_title = res.data.album_title || '';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveCourseInfo() {
      const params = {
        // album_id: this.album_id,
        album_title: this.course.album_title,
        album_desc: this.course.album_desc,
        album_cover_urlalbum: this.course.album_cover_urlalbum,
        purchase_price: this.course.purchase_price,
        inviter_rate: String(this.course.inviter_rate / 100),
      };
      saveCourse(params)
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
    editCourseInfo() {
      const params = {
        album_id: this.album_id,
        album_title: this.course.album_title,
        album_desc: this.course.album_desc,
        album_cover_urlalbum: this.course.album_cover_urlalbum,
        purchase_price: this.course.purchase_price,
        inviter_rate: String(this.course.inviter_rate / 100),
      };
      editCourse(params)
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
      // this.$router.push('addCourse');
      const params = {
        album_id: this.album_id,
        album_title: this.course.album_title,
        album_desc: this.course.album_desc,
        album_cover_urlalbum: this.course.album_cover_urlalbum,
        purchase_price: this.course.purchase_price,
      };
      const formName = 'course';
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          console.log(params);
          if (this.album_id) {
            this.editCourseInfo();
          } else {
            this.saveCourseInfo();
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
        .catch(() => {});
    },
    handleFile(e) {
      // 处理文件
      //  console.log(e)
      // 压缩一下文件

      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.pre_file_pic = freader.result;
        this.requestUploadFile();
      };
    },
    /* base 64 转换成file  这里对base64 进行压缩 */
    requestUploadFile() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.pre_file_pic;
      // const that = this;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');
        // const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);
        upLoadFile(formData)
          .then((res) => {
            console.log(res);
            this.course.album_cover_urlalbum = res.data.filePath;
            this.$message.success('图片上传成功');
          })
          .catch((err) => {
            console.log(err);
            this.pre_file_pic = this.course.album_cover_urlalbum;
            this.$message.error('图片上传失败');
          });
      };
    },
  },
};
</script>

<style lang="less" scoped>
.course {
  width: 60%;
  // height: 80px;
  padding: 36px;
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
}
.img-wrap {
  display: flex;
  .coverImg {
    margin-left: 40px;
    width: 260px;
    height: 250px;
  }
}
</style>
