<template>
  <sub-page>
    <main-card v-loading="loading">
      <card-top-info title="台词模仿秀设置"></card-top-info>
      <div class="item-list">
        <checkItem
          :itemInfo="item"
          v-for="item in itemList"
          :key="item.id"
          @update="onUpdateItemChecked"
          @preview="onPreviewItem"
        />
      </div>
      <div class="operate-btns">
        <el-button @click="reset">重置</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          确认
        </el-button>
      </div>
      <el-dialog
        :visible.sync="previewDialogVisible"
        width="30vw"
        @close="previewMedia = ''"
      >
        <video
          :src="previewMedia"
          class="video-preview"
          autoplay
          controls
          v-if="previewMedia"
        ></video>
      </el-dialog>
    </main-card>
  </sub-page>
</template>

<script>
import { reqGetGuessSpeechNew, saveGuessSpeechConfigNew } from '@/api/gameSetting/index';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import checkItem from './components/checkItem';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    checkItem,
  },
  data() {
    return {
      itemList: [],
      previewDialogVisible: false,
      previewMedia: '',
      loading: false,
    };
  },
  computed: {
    // 选中的id
    checkedIds() {
      return this.itemList.filter((item) => item.checked).map((item) => item.id);
    },
  },
  created() {
    this.initData();
  },
  methods: {
    onUpdateItemChecked(item) {
      item.checked = !item.checked;
    },
    onPreviewItem(item) {
      this.previewMedia = item.previewMedia;
      this.previewDialogVisible = true;
    },
    getItemListByResAndConfig(rawList, configStr) {
      const getFormatRawList = (rawList) => {
        return rawList.map((item) => {
          const infoObj = JSON.parse(item.star_img);
          const cover = `${infoObj.img}?vframe/jpg/offset/0`;
          const previewMedia = infoObj.media;
          const answer = item.star_answer;
          return {
            id: item.star_id,
            cover,
            previewMedia,
            answer,
            checked: true,
          };
        });
      };
      const updateResultListCheckedByConfig = (resultList, configList) => {
        for (let i = 0; i < resultList.length; i++) {
          let tmpFlag = false;
          for (let j = 0; j < configList.length; j++) {
            if (resultList[i].id === configList[j]) {
              tmpFlag = true;
              break;
            }
          }
          if (!tmpFlag) {
            resultList[i].checked = false;
          }
        }
      };
      // 转换数据格式
      const resultList = getFormatRawList(rawList);
      if (!configStr) {
        return resultList;
      }
      // 根据配置数组设置checked
      const configList = JSON.parse(configStr);
      updateResultListCheckedByConfig(resultList, configList);
      return resultList;
    },
    async initData() {
      this.loading = true;
      // 获取游戏数据
      //   const res = await reqGetGuessSpeech();
      const res = await reqGetGuessSpeechNew();
      // 获取游戏配置数据
      //   const resConfig = await reqGetGuessSpeechConfig();
      //   this.itemList = this.getItemListByResAndConfig(res.list, resConfig.data?.ruleValue);
      this.itemList = this.getItemListNew(res.data);
      this.loading = false;
    },
    async reset() {
      this.itemList.forEach((item) => {
        item.checked = false;
      });
      await this.confirm('reset');
    },
    async confirm(isReset) {
      try {
        this.loading = true;
        // const valueStr = JSON.stringify(this.checkedIds);
        // const res = await saveGuessSpeechConfig(valueStr);
        const valueStr = this.checkedIds.join();
        const res = await saveGuessSpeechConfigNew(valueStr);
        this.loading = false;
        console.log('qwqwqwqwqw', res);
        if (isReset !== 'reset') {
          this.$message.success('保存成功!');
        } else {
          this.$message.success('重置成功!');
        }
        await this.initData();
      } catch (e) {
        console.log(e);
        this.loading = false;
        if (isReset !== 'reset') {
          this.$message.success('保存失败!');
        } else {
          this.$message.success('重置失败!');
        }
      }
    },
    getItemListNew(list) {
      return list.map((item) => {
        const infoObj = JSON.parse(item.star_img);
        const cover = `${infoObj.img}?vframe/jpg/offset/0`;
        const previewMedia = infoObj.media;
        return {
          id: item.star_id,
          cover,
          previewMedia,
          answer: item.star_answer,
          checked: item.status === '1',
        };
      });
    },
  },
};
</script>
<style lang="less" scoped>
.item-list {
  padding: 20px 40px;
  display: grid;
  column-gap: 20px;
  row-gap: 40px;
  grid-template-columns: repeat(5, 1fr);
}
.video-preview {
  width: 100%;
}
.operate-btns {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}
</style>
