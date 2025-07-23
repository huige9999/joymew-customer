<template>
  <el-dialog :visible.sync="visible" title="上传音乐" width="600px" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="音乐名：" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入音乐名" />
      </el-form-item>
      <el-form-item label="选择标签：" prop="tags" required>
        <el-checkbox-group v-model="form.tags">
          <el-checkbox v-for="tag in tagOptions" :label="tag.value" :key="tag.value">{{ tag.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传音乐：" prop="file" required>
        <el-upload
          class="upload-demo"
          action=""
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept=".mp3,.wav,.ogg,.m4a,.aac"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>
        <div v-if="form.file" style="margin-top: 8px; color: #67c23a;">
          <i class="el-icon-check"></i>
          已选择文件: {{ form.file.name }} ({{ formatFileSize(form.file.size) }})
          <el-button type="text" size="mini" style="margin-left: 8px; color: #f56c6c;" @click="clearFile">
            <i class="el-icon-delete"></i> 清除
          </el-button>
        </div>
        <div v-else style="margin-top: 8px; color: #909399; font-size: 12px;">
          支持格式: MP3、WAV、OGG、M4A、AAC，文件大小不超过10MB
        </div>
      </el-form-item>
      <el-form-item label="同步上传：">
        <el-radio-group v-model="form.syncType">
          <el-radio label="music">音乐库</el-radio>
          <el-radio label="favorite">我的收藏</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 30px;">
      <el-button type="primary" @click="handleSave" :loading="loadingSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { musicLibraryAPI } from '../api';

export default {
  name: 'UploadModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    activityId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        tags: [],
        file: null,
        syncType: 'music',
      },
      tagOptions: [],
      rules: {
        name: [{ required: true, message: '请输入音乐名', trigger: 'blur' }],
        tags: [{ required: true, message: '请选择标签', trigger: 'change' }],
        file: [{ required: true, message: '请上传音乐文件', trigger: 'change' }],
      },
      loadingSave: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadTags();
      }
    },
  },
  methods: {
    async loadTags() {
      try {
        const res = await musicLibraryAPI.getMusicTags();
        if (res && res.data && Array.isArray(res.data)) {
          this.tagOptions = res.data.map((tag) => ({ label: tag, value: tag }));
        }
      } catch (error) {
        console.error('获取音乐标签失败:', error);
        // 如果获取标签失败，可以设置一些默认标签
        this.tagOptions = [
          { label: '流行', value: '流行' },
          { label: '摇滚', value: '摇滚' },
          { label: '古典', value: '古典' },
          { label: '爵士', value: '爵士' },
          { label: '电子', value: '电子' },
          { label: '民谣', value: '民谣' },
        ];
      }
    },
    getAudioDuration(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const audio = new Audio();
        audio.src = url;
        audio.addEventListener('loadedmetadata', () => {
          const duration = Math.floor(audio.duration);
          URL.revokeObjectURL(url);
          resolve(duration);
        });
        audio.addEventListener('error', () => {
          URL.revokeObjectURL(url);
          reject(new Error('无法获取音频时长'));
        });
      });
    },
    beforeUpload(file) {
      // 检查文件类型 - 支持多种MIME类型和文件扩展名
      const allowedMimeTypes = [
        'audio/mpeg', // MP3的标准MIME类型
        'audio/mp3', // 某些浏览器的MP3 MIME类型
        'audio/wav',
        'audio/ogg',
        'audio/m4a',
        'audio/aac',
        'audio/x-m4a', // 某些系统的M4A MIME类型
        'audio/mp4', // 某些系统的MP4音频 MIME类型
      ];

      const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];

      // 检查MIME类型
      const isValidMimeType = allowedMimeTypes.includes(file.type);

      // 检查文件扩展名
      const fileName = file.name.toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValidMimeType && !isValidExtension) {
        this.$message.error('不支持的音乐文件格式，请上传 MP3、WAV、OGG、M4A 或 AAC 格式');
        return false;
      }

      // 检查文件大小 (限制为 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.$message.error('音乐文件大小不能超过 10MB，已自动移除该文件');
        // 清除已选择的文件
        this.form.file = null;
        return false;
      }

      // 替换之前的文件
      this.form.file = file;
      return false; // 阻止自动上传
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
    },
    handleExceed() {
      this.$message.warning('最多只能选择一个音乐文件');
    },
    handleSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loadingSave = true;
          try {
            // 1. 获取音频时长
            const duration = await this.getAudioDuration(this.form.file);

            // 2. 调用七牛云上传接口
            const uploadResult = await musicLibraryAPI.uploadMusicFile(this.form.file);

            if (uploadResult.success) {
              // 3. 上传成功后，调用新的上传接口保存音乐信息
              const musicData = {
                url: uploadResult.data.fileUrl, // 七牛云返回的音乐地址
                name: this.form.name,
                tags: this.form.tags.join(','), // 将标签数组转换为逗号分隔的字符串
                duration: String(duration), // 新增：音频时长（秒），转成字符串
                syncToLibrary: this.form.syncType === 'music', // 根据选择决定是否同步到音乐库
                syncToFavorites: this.form.syncType === 'favorite', // 根据选择决定是否同步到收藏
              };
              // 调用新的上传接口
              await musicLibraryAPI.uploadMusicWithSync({
                ...musicData,
                splid: this.$store.state.liveId, // 添加活动ID参数
              });

              this.$message.success('音乐上传成功！');
              this.$emit('success');
              this.handleClose();
            }
          } catch (error) {
            this.$message.error(error.message || '上传失败，请重试');
          } finally {
            this.loadingSave = false;
          }
        } else {
          console.log('表单验证失败');
        }
        return false;
      });
    },
    handleClose() {
      this.$emit('update:visible', false);
      // 重置表单
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
        this.form.file = null;
      });
    },
    clearFile() {
      this.form.file = null;
      this.$message.success('文件已清除');
    },
  },
};
</script>

<style lang="less" scoped>
.upload-demo {
  display: inline-block;
}
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}
.el-checkbox {
  min-width: 80px;
}
</style>
