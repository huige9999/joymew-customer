<template>
  <sub-page>
    <main-card>
      <div class="add">
        <el-button type="primary" @click="add('video')">添加视频小节</el-button>
        <el-button type="primary" @click="add('audio')">添加音频小节</el-button>
      </div>

      <my-table class="my-table" style="height: 100%" align="center">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <el-table-column prop="album_info_title" label="小节名称" header-align="center" align="center" min-width="80"> </el-table-column>

          <!-- <el-table-column prop="price" label="课程价格" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <el-table-column prop="sort" label="集数" header-align="center" align="center" min-width="80"> </el-table-column>
          <!-- <el-table-column prop="brief" label="课程简介" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <!-- <el-table-column prop="status" label="课程状态" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <!-- <el-table-column prop="status" label="课程状态" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <el-table-column label="课件">
            <template slot-scope="scope">
              <div v-if="scope.row.video_address">
                <video :src="scope.row.video_address" controls class="inline-video"></video>
              </div>
              <div v-else-if="scope.row.audio_address">
                <audio :src="scope.row.audio_address" controls="controls"></audio>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收费或试看">
            <template slot-scope="scope">
              <div>
                {{ scope.row.is_need_pay === '1' ? '收费' : '试看' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <!-- <el-button @click="handleClick(scope.row, 'view')" type="text" size="small">查看</el-button> -->
              <el-button type="text" size="small" @click="handleClick(scope.row, 'edit')" style="margin-right: 20px">编辑</el-button>

              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="'确定删除《' + scope.row.album_info_title + '》吗？'"
                @confirm="deleteChapter(scope.row)"
                @onConfirm="deleteChapter(scope.row)"
                @cancel="() => {}"
                style="margin-left: 20px"
              >
                <el-button type="text" size="small" slot="reference">删除</el-button>
                <!-- <el-button slot="reference">删除</el-button> -->
              </el-popconfirm>
              <!-- <el-button type="text" size="small" @click="deleteChapter(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          :hide-on-single-page="true"
          layout="prev, pager, next"
          @current-change="changePage"
          :page-size="showCount"
          :total="totalResult"
          class="my-pagination"
        />
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import { getChapterList, deleteChapterDetail } from '@/api/app/course';
//  = ({ album_id, currentPage, showCount})
export default {
  components: {
    SubPage,
    MainCard,
    MyTable,
  },
  data() {
    return {
      album_id: null,
      currentPage: 1,
      showCount: 10,
      tableData: [
        // {
        //   title: '如何上传视频',
        //   price: '88.8',
        //   view: '300',
        //   brief: '上传视频简介',
        //   status: '已上架',
        //   id: 1,
        //   url: 'https://ustatic.joymew.com/haimiao-kp/lirui/lrshikan2.mp4',
        // },
      ],
      totalResult: 0,
      totalPage: 1,
      loading: false,
    };
  },
  created() {
    console.log(`this.$route${this.$route.query.id}`);
    console.log(this.$route.query.id);
    if (!this.$route.query.id) {
      this.$message('id异常 ，请退出重进');
    } else {
      this.album_id = this.$route.query.id;
      this.initChapterList();
    }
  },
  methods: {
    changePage(val) {
      console.log(val);
      // 显示加载图标
      // this.loading = true;
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      this.initChapterList();
    },
    initChapterList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      getChapterList({
        album_id: this.album_id,
        showCount: this.showCount,
        currentPage: this.currentPage,
      })
        .then((res) => {
          console.log(res);

          if (res.data && res.data.list) {
            this.$message.success('获取小节成功');
            this.tableData = res.data.list;
            this.totalPage = res.data.totalPage;
            this.totalResult = res.data.totalResult;
          } else {
            this.$message.error('获取小节失败');
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('获取小节失败');
          this.loading = false;
        });
    },
    add(media) {
      this.$router.push({
        path: 'addVideo',
        query: {
          album_id: this.album_id,
          id: null,
          type: 'add',
          media,
        },
      });
    },
    handleClick(row, type) {
      console.log(row);
      let media = '';
      if (row.video_address) {
        media = 'video';
      } else {
        media = 'audio';
      }
      this.$router.push({
        path: 'addVideo',
        query: {
          album_id: this.album_id,
          id: row.album_info_id,
          type: type || 'edit',
          media,
        },
      });
    },
    deleteChapter(row) {
      console.log(row);
      deleteChapterDetail({
        album_info_id: row.album_info_id,
      })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.initChapterList();
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('删除失败');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.add {
  width: 100%;
  height: 80px;
  padding: 36px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.inline-video {
  margin: 0 5px;
  width: 300px;
  height: 120px;
  // height: auto;
}
</style>
