<!-- 点歌设置 -->
<template>
    <sub-page>
        <div class="card">
            <card-top-info title="点歌设置"></card-top-info>
            <div class="songChooseForm">
                <div class="songItem">
                    <div class="leftCt">
                        <div class="name">是否开启点歌：</div>
                        <el-switch v-model="isChooseSongFuncOn" active-value="1" inactive-value="0"
                            class="chooseSongFuncSwitch" @change="handleChooseSongFuncChange">
                        </el-switch>
                        <div class="resultVal">{{ isChooseSongFuncText }}</div>
                    </div>
                </div>
                <!-- <div class="songItem">
          <div class="leftCt">
            <div class="name">艺人分成比例：</div>
            <div class="resultVal">{{ sharePropertion }}%</div>
          </div>
        </div> -->
            </div>
            <el-dialog title="添加歌曲" :visible.sync="addDialogShow" width="400px">
                <div class="block">
                    <span class="label" style="text-align: right">歌曲名称</span>
                    <el-input style="width: 200px" v-model="songNameAdd" maxlength="20"></el-input>
                </div>
                <div class="block">
                    <span class="label" style="text-align: right">歌曲价格</span>
                    <el-input style="width: 200px" v-model="songPriceAdd"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogShow = false">取 消</el-button>
                    <el-button type="primary" @click="addSong" v-loading="isLoading">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="编辑歌曲" :visible.sync="editDialogShow" width="400px">
                <div class="block">
                    <span class="label" style="text-align: right">歌曲名称</span>
                    <el-input style="width: 200px" v-model="songNameEdit"></el-input>
                </div>
                <div class="block">
                    <span class="label" style="text-align: right">歌曲价格</span>
                    <el-input style="width: 200px" v-model="songPriceEdit"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogShow = false">取 消</el-button>
                    <el-button type="primary" @click="editSong">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="card">
            <card-top-info title="歌单设置"></card-top-info>
            <div class="songChooseForm">
                <div class="songItem">
                    <div class="leftCt">
                        <div class="name">歌单：</div>
                    </div>
                    <div class="rightCt">
                        <el-button size="small" type="primary" @click="showAddSong">添加歌曲</el-button>
                        <el-button size="small" type="primary" icon="el-icon-upload"
                            @click="showImportDialog">批量导入歌单</el-button>
                    </div>
                </div>
                <el-table :data="songSheet" border style="width: 90%; margin-bottom: 20px; margin-left: 20px">
                    <el-table-column prop="songName" label="歌曲名称"></el-table-column>
                    <el-table-column prop="songPrice" label="歌曲单价" width="120"></el-table-column>
                    <el-table-column prop="songPlayNum" label="被点次数" width="120"></el-table-column>
                    <el-table-column label="添加时间" width="180">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.createTime) | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="isInUse" label="是否启用" width="120">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.isInUse" active-value="1" inactive-value="0"
                                @change="handleSongIsInUse(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <div class="link-wrap">
                                <el-link type="primary" @click="deleteSong(scope.row)"
                                    style="margin-right: 20px">删除</el-link>
                                <el-link type="primary" @click="showEditSong(scope.row)">修改</el-link>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[15, 25, 50, 100]" :page-size="currentPageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="totals">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 批量导入歌单弹窗 -->
        <my-dialog :show="isShowImportDialog">
            <div class="import-dialog-container">
                <div class="import-title" slot="title">
                    <img src="@/assets/image/importList.png" alt="" width="34" height="29" />
                    <div class="text">导入歌单</div>
                </div>
                <div class="import-info">
                    <div class="upload-temp">
                        <div class="title">
                            下载导入模板
                            <span>(下载后请勿更改模板格式)</span>
                        </div>
                        <div class="btn">
                            <el-button icon="el-icon-download" type="warning" @click="downloadTemplate">
                                下载
                            </el-button>
                        </div>
                    </div>
                    <div class="upload-file">
                        <div class="title">
                            上传歌单文件
                            <span>(提示：重新导入模板后将覆盖原有数据)</span>
                        </div>
                        <div class="btn">
                            <el-upload name="uploadFile" :show-file-list="false" :http-request="handleFile" action
                                accept="txt">
                                <el-button type="primary" icon="el-icon-upload2">
                                    上传
                                </el-button>
                            </el-upload>
                        </div>
                    </div>
                    <div class="upload-success-text">您已成功上传：抽奖名单.xls</div>
                    <div class="btn-group">
                        <el-button type="primary" @click="confirmUpload">
                            确认导入
                        </el-button>
                        <el-button type="info" @click="cancelUpload" style="margin-left: 20px">
                            取消
                        </el-button>
                    </div>
                </div>
            </div>
        </my-dialog>
    </sub-page>
</template>
<script>
import { editMusic, editUserConfig, getMusicList, getUserConfig, saveMusic } from '@/api/setting/setting';
import CardTopInfo from '@/components/cardTopInfo';
import myDialog from '@/components/myDialog';
import SubPage from '@/components/subPage';
import { formatDate } from '@/utils/format';
import request from '@/utils/request';
// import { getMusicIncomeListData } from '@/api/setting/activityIncome/activityIncomeData';

export default {
  name: 'songChoose',
  components: {
    SubPage,
    CardTopInfo,
    myDialog,
  },
  data() {
    return {
      sharePropertion: 0,
      isChooseSongFuncOn: '0',
      songSheet: [],
      addDialogShow: false,
      editDialogShow: false,
      songNameAdd: '',
      songPriceAdd: '',
      songNameEdit: '',
      songPriceEdit: '',
      songIdEdit: '',
      currentPage: 1,
      currentPageSize: 15,
      totals: 1,
      isLoading: false,
      // 上传歌单弹窗
      isShowImportDialog: false,
      // 上传的文件
      tmpFile: '',
    };
  },
  computed: {
    isChooseSongFuncText() {
      return this.isChooseSongFuncOn === '1' ? '点歌已开启' : '点歌已关闭';
    },
  },
  watch: {},
  created() {
    this.initSongList();
    this.initBaseInfo();
    // this.initRateInfo();
  },
  methods: {
    deleteSong(deleteData) {
      // 询问是否删除歌曲名称为deleteData.music_name的歌曲
      this.$confirm(`是否删除歌曲名称为${deleteData.songName}的歌曲?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 确定删除
          editMusic({
            music_id: deleteData.id,
            is_delete: '1',
          })
            .then((res) => {
              console.log(res);
              this.$message.success('删除成功!');
              this.initSongList();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error('删除失败!');
            });
        })
        .catch(() => {
          // 取消删除
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    showEditSong(editData) {
      this.songIdEdit = editData.id;
      this.songNameEdit = editData.songName;
      this.songPriceEdit = editData.songPrice;
      this.editDialogShow = true;
    },
    showAddSong() {
      this.addDialogShow = true;
    },
    addSong() {
      if (!this.songNameAdd) {
        this.$message.error('歌曲名称不能为空!');
        return;
      }
      if (!this.songPriceAdd) {
        this.$message.error('歌曲价格不能为空!');
        return;
      }
      // 验证价格为数字
      if (!/^\d+(\.\d+)?$/.test(this.songPriceAdd)) {
        this.$message.error('歌曲价格必须为数字!');
        return;
      }
      this.isLoading = true;
      saveMusic({
        music_name: this.songNameAdd,
        music_price: this.songPriceAdd,
        kind: '1',
      })
        .then((res) => {
          console.log(res);
          this.songNameAdd = '';
          this.songPriceAdd = '';
          this.addDialogShow = false;
          this.isLoading = false;
          this.$message({
            message: '添加成功!',
            type: 'success',
          });
          this.initSongList();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('添加失败!');
        });
    },
    editSong() {
      if (!this.songNameEdit) {
        this.$message.error('歌曲名称不能为空!');
        return;
      }
      if (!this.songPriceEdit) {
        this.$message.error('歌曲价格不能为空!');
        return;
      }
      // 验证价格为数字
      if (!/^\d+(\.\d+)?$/.test(this.songPriceEdit)) {
        this.$message.error('歌曲价格必须为数字!');
        return;
      }
      this.isLoading = true;
      editMusic({
        music_name: this.songNameEdit,
        music_price: this.songPriceEdit,
        music_id: this.songIdEdit,
      })
        .then((res) => {
          console.log(res);
          this.songNameEdit = '';
          this.songPriceEdit = '';
          this.songIdEdit = '';
          this.editDialogShow = false;
          this.isLoading = false;
          this.$message({
            message: '编辑成功!',
            type: 'success',
          });
          this.initSongList();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('编辑失败!');
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initSongList();
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.initSongList();
    },
    initSongList() {
      getMusicList({
        currentPage: this.currentPage,
        showCount: this.currentPageSize,
      })
        .then((res) => {
          console.log(res);
          this.totals = res.data.totalResult;
          this.songSheet = res.data.list.map((item) => {
            return {
              songName: item.music_name,
              songPrice: item.music_price,
              songPlayNum: item.dot_size,
              isInUse: item.kind,
              createTime: item.create_time,
              id: item.music_id,
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initBaseInfo() {
      getUserConfig()
        .then((res) => {
          console.log(res);
          this.isChooseSongFuncOn = res.data.is_open_music;
          // this.sharePropertion = res.data.music_rate; TODO 待后端返回
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // initRateInfo() {
    //   getMusicIncomeListData()
    //     .then(res => {
    //       console.log('rateInfo?:', res);
    //       // this.sharePropertion = res.data.music_rate; TODO 待后端返回
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    handleChooseSongFuncChange() {
      console.log(this.isChooseSongFuncOn);
      editUserConfig(this.isChooseSongFuncOn)
        .then((res) => {
          console.log(res);
          this.$message({
            message: '编辑成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('编辑失败!');
        });
    },
    handleSongIsInUse(rowData) {
      console.log(rowData);
      editMusic({
        music_id: rowData.id,
        kind: rowData.isInUse,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '编辑成功!',
            type: 'success',
          });
          this.initSongList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('编辑失败!');
        });
    },

    showImportDialog() {
      this.isShowImportDialog = true;
    },
    downloadTemplate() {
      window.location.href = 'https://www.hudongmiao.com/reportFormsHm/findReportInfo?report_type=list_music';
    },
    /* 操作文件 */
    handleFile(e) {
      const fileName = e.file.name;
      // 类型判断
      const extName = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      console.log(extName);
      if (extName.indexOf('txt') > -1 || extName.indexOf('xlsx') > -1 || extName.indexOf('xls') > -1) {
        this.tmpFile = e.file;
        this.uploadNameSheet();
      } else {
        this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
      }
    },
    /* 上传文件请求接口 */
    uploadNameSheet() {
      const formData = new FormData();
      formData.append('file', this.tmpFile);
      formData.append('splid', this.$store.state.liveId);
      formData.append('type', '1');
      formData.append('kind', '1');
      request
        .post('/music/saveMusicFile', formData)
        .then((res) => {
          console.log(res);
          this.$message({
            message: '上传成功!',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('上传内容格式不正确,请检查更改后,重新上传!');
        });
    },
    /* 确认上传提交按钮 */
    confirmUpload() {
      this.isShowImportDialog = false;
      this.initSongList();
      this.initBaseInfo();
    },
    /* 取消上传按钮 */
    cancelUpload() {
      this.isShowImportDialog = false;
    },
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time, 'yyyy/MM/dd hh:mm:ss');
    },
  },
};
</script>
<style lang="less" scoped>
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: auto;
    margin-top: 18px;
    margin-bottom: 10px;

    .songChooseForm {
        width: 100%;

        .songItem {
            width: 90%;
            display: flex;
            // justify-content: space-between;
            padding: 0 20px;
            padding-bottom: 20px;

            .leftCt {
                display: flex;
                align-items: center;

                .name {
                    font-size: 16px;
                    width: 120px;
                    margin-right: 10px;
                    color: #000;
                }

                .resultVal {
                    color: #999999;
                    font-size: 16px;
                }

                .chooseSongFuncSwitch {
                    margin-right: 10px;
                }
            }

            .rightCt {
                display: flex;
                align-items: center;

                label {
                    color: #000;
                    font-size: 18px;
                    margin-left: 12px;
                }
            }
        }
    }

    .block {
        padding: 0 20px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .label {
            font-size: 15px;
            width: 72px;
            margin-right: 10px;

            &::after {
                content: ':';
                margin-left: 5px;
            }
        }

        .submitBtn {
            margin-left: 120px;
        }

        .tips {
            font-size: 14px;
            color: #909399;
            margin-left: 12px;
        }
    }

    .pagination-container {
        padding: 20px;
    }

    &:nth-child(2) {
        flex: 1;
    }
}

/* 导入歌单弹出框 */
.import-dialog-container {
    padding-bottom: 30px;

    .import-title {
        display: flex;
        align-items: center;

        .text {
            margin-left: 20px;
            font-size: 25px;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: #42474e;
        }
    }

    .import-info {
        position: relative;
        margin-left: 55px;

        &::after {
            position: absolute;
            width: 1px;
            height: 100px;
            background: #d8d8d8;
        }

        &>div {
            .title {
                font-size: 14px;
                line-height: 50px;
                font-family: SourceHanSansSC-Medium, SourceHanSansSC;
                font-weight: 600;
                color: #333333;

                span {
                    margin-left: 10px;
                    color: #fa3e3e;
                    font-size: 14px;
                    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
                    font-weight: 600;
                }
            }
        }

        .upload-temp {
            position: relative;
            margin-top: 20px;

            &::after {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #d8d8d8;
                border-radius: 50%;
            }
        }

        .upload-file {
            position: relative;
            margin-top: 35px;

            &::after {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #d8d8d8;
                border-radius: 50%;
            }
        }

        .upload-success-text {
            margin-top: 8px;
            font-size: 14px;
            font-family: SourceHanSansSC-Normal, SourceHanSansSC;
            font-weight: 400;
            color: #6f7682;
        }

        .btn-group {
            margin-top: 50px;
        }
    }
}
</style>
