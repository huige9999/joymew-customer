<template>
  <sub-page>
    <main-card>
      <card-top-info title="投票"></card-top-info>
      <!-- 设置投票内容 -->
      <div class="moduleWrap rowGap">
        <div class="header">
          设置投票内容：
          <span>(您需要填写的投票标题和投票选项)</span>
        </div>
        <my-table class="myTable">
          <el-table :data="voteList">
            <el-table-column type="index" label="序号" width="120" align="center" header-align="center"></el-table-column>
            <el-table-column prop="title" label="投票标题" min-width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <div class="titleInfo">
                  <img :src="scope.row.headimg" v-show="scope.row.headimg" />
                  <span>{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="投票选项" min-width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <div class="description" v-html="scope.row.description"></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" header-align="center">
              <template slot-scope="scope">
                <div class="operate-group">
                  <el-link type="primary" @click="showVoteDialog(scope.row)">编辑</el-link>
                  <el-link type="success" @click="showVoteSizeDialog(scope.row)">加票</el-link>
                  <el-link type="danger" @click="deleteVoteItem(scope.row.id)">删除</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </my-table>
        <div class="add-wrap">
          <el-button type="primary" size="mini" @click="showVoteDialog">添加投票内容</el-button>
        </div>
      </div>
      <!-- 设置投票形式 -->
      <div class="moduleWrap" v-loading="loading">
        <div class="header publicVCenter">设置投票形式：</div>
        <div class="myForm">
          <div class="formItem">
            <ul>
              <li>
                <el-radio v-model="voteMode.type" label="1">单选</el-radio>
                <div class="tip" v-show="voteMode.type === '1'">
                  *每个用户每个选项仅投一票
                </div>
              </li>
              <li class="multi">
                <el-radio v-model="voteMode.type" label="2">多选</el-radio>
                <div class="limit" v-show="voteMode.type === '2'">
                  <div class="limitItem">
                    最多选：
                    <el-input-number
                      v-model="voteMode.max_limit"
                      controls-position="right"
                      :min="1"
                      :max="100"
                      size="mini"
                      class="limitInput"
                    ></el-input-number>
                    项
                  </div>
                  <div class="limitItem">
                    最少选：
                    <el-input-number
                      v-model="voteMode.min_limit"
                      controls-position="right"
                      :min="1"
                      :max="100"
                      size="mini"
                      class="limitInput"
                    ></el-input-number>
                    项
                  </div>
                  <div class="tip">*可以给多个投票项投票, 每个投票项一票</div>
                </div>
              </li>
              <li class="vCenter">
                <el-radio v-model="voteMode.type" label="3">自由投票</el-radio>
                <div class="voteNum" v-show="voteMode.type === '3'">
                  每人共
                  <el-input-number size="mini" v-model="voteMode.voteSize" class="voteNumInput" :max="100"></el-input-number>
                  票
                </div>
                <div class="limit" v-show="voteMode.type === '3'">
                  <div class="tip">*只限制投票数量,不限制投票形式</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="formItem">
            <el-button type="primary" size="mini" @click="confirmVoteMode">确认</el-button>
            <el-button size="mini" @click="resetVoteMode">取消</el-button>
          </div>
        </div>
      </div>
    </main-card>
    <main-card v-show="voteDataStatisticsVisible">
      <card-top-info title="投票数据统计"></card-top-info>
      <div class="moduleWrap">
        <div class="title rowGap">投票标题：{{ voteTitle }}</div>
        <div class="btn-group">
          <el-button size="mini" type="danger" @click="confirmClearVoteData">清空投票数据</el-button>
          <el-button size="mini" type="success" @click="exportVoteData">导出投票数据</el-button>
        </div>
        <my-table class="myTable">
          <el-table :data="voteList">
            <el-table-column type="index" label="序号" width="120" align="center" header-align="center"></el-table-column>
            <el-table-column prop="title" label="投票标题" min-width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <div class="titleInfo">
                  <img :src="scope.row.headimg" v-show="scope.row.headimg" />
                  <span>{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="投票选项" min-width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <div class="description" v-html="scope.row.description"></div>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="票数" width="120" align="center" header-align="center"></el-table-column>
            <el-table-column prop="add_size" label="加票数" width="120" align="center" header-align="center"></el-table-column>
            <el-table-column prop="total_count" label="总票数 " width="120" align="center" header-align="center"></el-table-column>
          </el-table>
        </my-table>
      </div>
    </main-card>
    <!-- 弹窗(新增/更新投票、更新票数) -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" v-loading="loading">
      <!-- 新增/更新投票表单 -->
      <el-form :model="voteForm" :rules="voteRules" ref="voteForm" label-width="120px" v-show="dialogType === 'vote'">
        <el-form-item label="选项头图：" prop="headimg" class="headImgWrap">
          <el-upload action="" :http-request="handleImgFileAdd" :show-file-list="false" class="head-upload">
            <img v-if="voteForm.headimg" :src="voteForm.headimg" class="preview" />
            <div class="no-img" v-else>
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
          <div class="introduce-box">
            <i class="el-icon-question question-icon"></i>
            <div class="tip">查看尺寸规范</div>
            <div class="para">
              <div class="paramItem">
                <span>推荐尺寸：</span>
                300*300(1:1)
              </div>
              <div class="paramItem">
                <span>大小：</span>
                小于2M
              </div>
              <div class="paramItem">
                <span>格式：</span>
                png/jpg/jpeg
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="投票标题：" prop="title">
          <el-input v-model="voteForm.title" :disabled="!!voteTitle"></el-input>
        </el-form-item>
        <el-form-item label="投票选项：" prop="description">
          <el-input type="textarea" v-model="voteForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmVoteForm">确定</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 更新票数 -->
      <el-form :model="voteSizeForm" label-width="120px" v-show="dialogType === 'voteSize'">
        <el-form-item label="投票选项："><div v-html="voteDescriptionCurrent"></div></el-form-item>
        <el-form-item label="目前票数(真实)：">{{ voteSizeCurrent }}票</el-form-item>
        <el-form-item label="添加票数：">
          <el-input-number v-model="voteSizeForm.add_size_val" controls-position="right" :min="0" :max="1000" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="添加后总票数：">{{ voteSizeAfter }}票</el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmVoteSizeForm">确定</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </sub-page>
</template>
<script>
import {
  addVoteSize,
  clearVoteData,
  removeVote,
  reqGetActivityDetail,
  saveVote,
  updateVote,
  updateVoteMode,
  voteList,
} from '@/api/setting/setting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';
import request from '@/utils/request';

const BASEURL = 'https://www.hudongmiao.com';
export default {
  name: 'vote',
  data() {
    return {
      voteList: [],
      // 默认值
      voteMode: {
        type: '1', // type: 1单选,2多选,3自由投票
        max_limit: 1, // 仅多选模式下有效 默认值1
        min_limit: 1, // 仅多选模式下有效 默认值1
        voteSize: 1, // 仅自由投票模式下有效 默认值1
      },
      // 新增和更新共用
      voteForm: {
        id: '',
        title: '',
        description: '',
        headimg: '',
      },
      voteRules: {
        title: [
          {
            required: true,
            message: '请输入投票标题',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '投票标题不能超过20个字符',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '请输入投票选项',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '投票选项不能超过20个字符',
            trigger: 'blur',
          },
        ],
      },
      // 更新
      voteSizeCurrent: 0,
      voteDescriptionCurrent: '',
      voteSizeForm: {
        id: '',
        add_size_val: 1,
      },
      dialogType: '', // 弹窗类型(取值vote、voteSize)
      dialogVisible: false, // 弹窗显示
      imgFile: null, // 暂存即将上传的文件
      loading: false,
    };
  },
  computed: {
    voteDataStatisticsVisible() {
      return this.voteList.length > 0;
    },
    voteTitle() {
      return this.voteList.length > 0 ? this.voteList[0].title : '';
    },
    dialogTitle() {
      let title = '新增投票';
      if (this.dialogType === 'voteSize') {
        title = '添加票数';
      } else if (this.voteForm.id) {
        title = '编辑投票';
      }
      return title;
    },
    voteSizeAfter() {
      return this.voteSizeCurrent + this.voteSizeForm.add_size_val * 1;
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.dialogType = '';
      }
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
  },
  created() {
    this.initData();
  },
  methods: {
    // type取值：list、json、undefined(都要初始化)
    initData(type) {
      let hasErrorTip = false;
      const errorHandler = (err) => {
        console.log(err);
        if (!hasErrorTip) {
          hasErrorTip = true;
          this.$message.error('获取信息失败');
        }
      };
      if (type === 'list' || !type) {
        // 初始化列表数据
        voteList({ splid: this.$store.state.liveId })
          .then((res) => {
            console.log('投票列表：', res);
            const { varList } = res.data;
            if (varList?.length > 0) {
              this.voteList = varList;
            }
          })
          .catch(errorHandler);
      }
      if (type === 'json' || !type) {
        // 初始化配置数据
        reqGetActivityDetail('vote_json')
          .then((res) => {
            console.log('投票形式：', res);
            const { vote_json } = res.data;
            if (vote_json) {
              const { type, min_limit, max_limit, voteSize } = JSON.parse(vote_json);
              this.voteMode = {
                type,
                min_limit: Number(min_limit),
                max_limit: Number(max_limit),
                voteSize,
              };
            }
          })
          .catch(errorHandler);
      }
    },
    handleImgFileAdd(e) {
      const { file } = e;
      console.log(file);
      // 判断文件类型只能是png/jpg/jpeg
      const fileType = file.type;
      const imgTypeList = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!imgTypeList.includes(fileType)) {
        this.$message.error('图片类型必须是png/jpg/jpeg');
        return;
      }
      // 判断文件大小不得大于2M
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('图片大小不得大于2M');
        return;
      }
      // file转dataurl
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const { result } = e.target;
        // 设置表单头像
        this.voteForm.headimg = result;
        // 暂存file(用于表单提交时的文件上传)
        this.imgFile = file;
      };
      // 处理失败的情况
      reader.onerror = (error) => {
        console.log('图片读取失败：', error);
        this.$message.error('图片读取失败');
      };
    },
    showDialog(type) {
      this.dialogType = type;
      this.dialogVisible = true;
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    // 打开新增/更新投票弹窗(默认新增)
    showVoteDialog(currentVote) {
      if (currentVote) {
        // 读取当前需要编辑的投票项
        const { id, title, description, headimg } = currentVote;
        // 初始化表单信息
        this.voteForm = { id, title, description, headimg };
      } else {
        // 初始化表单信息
        this.voteForm = {
          id: '',
          title: '',
          description: '',
          headimg: '',
        };
      }
      // 初始化暂存的头像文件
      this.imgFile = null;
      // 标题已经确定了
      if (this.voteTitle) {
        this.voteForm.title = this.voteTitle;
      }
      // 显示表单弹窗
      this.showDialog('vote');
    },
    // 打开加票弹窗
    showVoteSizeDialog(currentVote) {
      // 读取当前需要编辑的投票项
      const { id, count, description, add_size } = currentVote;
      // 初始化表单信息
      this.voteSizeCurrent = count;
      this.voteDescriptionCurrent = description;
      this.voteSizeForm = {
        id,
        add_size_val: parseInt(add_size, 10),
      };
      // 显示表单弹窗
      this.showDialog('voteSize');
    },
    // 请求上传文件到云服务器
    reqUploadFile(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        request
          .post('/beiJing/shangchuanTomcat', formData)
          .then((res) => {
            resolve(res.data.filePath);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    confirmVoteForm() {
      if (this.loading) {
        return;
      }
      this.$refs.voteForm.validate((validate) => {
        let result = false;
        if (validate) {
          // 表单验证通过，提交表单
          console.log('表单验证通过，提交表单：', this.voteForm);
          this.loading = true;
          // 将数据保存到服务端
          this.saveVoteFormToServer((isError) => {
            // 关闭loading
            this.loading = false;
            // 给出提示
            if (isError) {
              this.$message.error('保存失败!');
            } else {
              this.$message.success('保存成功!');
            }
            // 关闭弹窗
            this.hideDialog();
            // 初始化列表数据
            this.initData('list');
          });
          result = true;
        }
        return result;
      });
    },
    saveVoteFormToServer(cb) {
      // 1、文件上传七牛云(如果有的话)
      this.reqUploadFile(this.imgFile)
        .then((filePath) => {
          // 2、更新表单headimg值
          if (filePath) {
            this.voteForm.headimg = filePath;
          }
          // 3、替换表单descripion中的换行符
          this.voteForm.description = this.voteForm.description.replace(/(\r\n|\n|\r)/gm, '<br/>');
          // 4、提交表单到服务端
          const { id, title, description, headimg } = this.voteForm;
          let reqTask = null;
          if (this.voteForm.id) {
            reqTask = updateVote({
              id,
              title,
              description,
              headimg,
            });
          } else {
            reqTask = saveVote({
              splid: this.$store.state.liveId,
              title,
              description,
              headimg,
            });
          }
          return reqTask;
        })
        .then((res) => {
          console.log(res);
          if (cb) {
            cb();
          }
        })
        .catch((err) => {
          console.log(err);
          if (cb) {
            cb('error');
          }
        });
    },
    confirmVoteSizeForm() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const { id, add_size_val } = this.voteSizeForm;
      const callback = (isError) => {
        // 关闭loading
        this.loading = false;
        if (isError) {
          // 给出提示
          this.$message.error('加票失败!');
        } else {
          // 给出提示
          this.$message.success('加票成功!');
          // 初始化列表数据
          this.initData('list');
        }
        // 关闭弹窗
        this.hideDialog();
      };
      addVoteSize({
        splid: this.$store.state.liveId,
        id,
        add_size_val: String(add_size_val),
      })
        .then((res) => {
          console.log(res);
          callback();
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },
    deleteVoteItem(id) {
      this.$confirm('删除当前投票项?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return removeVote({
            splid: this.$store.state.liveId,
            id,
          });
        })
        .then((res) => {
          console.log(res);
          this.$message.success('删除成功!');
          this.initData('list');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    confirmVoteMode() {
      if (this.loading) {
        return;
      }
      const checkResult = this.checkLimit();
      if (!checkResult) {
        return;
      }
      this.loading = true;
      const vote_json = JSON.stringify({
        ...this.voteMode,
        max_limit: String(this.voteMode.max_limit),
        min_limit: String(this.voteMode.min_limit),
      });
      updateVoteMode({
        splid: this.$store.state.liveId,
        vote_json,
      })
        .then((res) => {
          console.log(res);
          this.$message.success('设置成功!');
          this.initData('json');
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$message.error('设置失败!');
        });
    },
    resetVoteMode() {
      if (this.loading) {
        return;
      }
      this.voteMode = {
        type: '1',
        max_limit: 1,
        min_limit: 1,
        voteSize: 1,
      };
      this.loading = true;
      updateVoteMode({
        splid: this.$store.state.liveId,
        vote_json: '',
      })
        .then((res) => {
          console.log(res);
          this.$message.success('重置成功!');
          this.initData('json');
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$message.error('重置失败!');
        });
    },
    checkLimit() {
      if (this.voteMode.max_limit < this.voteMode.min_limit) {
        this.$message.error('最大值不能小于最小值!');
        return false;
      }
      return true;
    },
    confirmClearVoteData() {
      this.$confirm('清空投票数据?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return clearVoteData();
        })
        .then((res) => {
          console.log(res);
          this.$message.success('清空成功!');
          this.initData('list');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清空',
          });
        });
    },
    exportVoteData() {
      if (this.voteList.length === 0) {
        this.$message.error('没有投票数据!');
        return;
      }
      window.open(`${BASEURL}/reportFormsHm/findReportInfo?splid=${this.$store.state.liveId}&report_type=vote_report`);
    },
  },
};
</script>
<style lang="less" scoped>
.rowGap {
  margin-bottom: 20px;
}
.moduleWrap {
  padding: 0 20px;
  .header {
    font-size: 18px;
    font-weight: 500;
    color: #3b3c3d;
    span {
      font-size: 13px;
      font-weight: 400;
      color: rgb(141, 161, 180);
      margin-left: 10px;
    }
  }
  .myTable {
    .titleInfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
      span {
        font-size: 12px;
        color: #606266;
        font-weight: 400;
      }
    }
    .operate-group {
      display: flex;
      justify-content: space-around;
    }
  }
  .add-wrap {
    display: flex;
    justify-content: center;
  }
  .myForm {
    padding: 18px 36px;
    .formItem {
      ul {
        list-style: none;
        li {
          margin-bottom: 40px;
          display: flex;
          font-size: 13px;
          font-weight: 400;
          color: #8da1b4;
          .tip {
            color: red;
          }
          .limit {
            position: relative;
            .limitItem {
              margin-bottom: 20px;
              .limitInput {
                margin: 0 5px;
              }
            }
          }
          .voteNum {
            margin-right: 20px;
            .voteNumInput {
              margin: 0 5px;
            }
          }
          &.vCenter {
            align-items: center;
          }
          &.multi {
            .tip {
              position: absolute;
              right: 0;
              white-space: nowrap;
              right: -120%;
              top: 30px;
            }
          }
        }
      }
    }
  }
}

.head-upload {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .preview {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
  .no-img {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
}

.headImgWrap {
  position: relative;
  .introduce-box {
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
    left: -80px;
    top: 28px;
    .question-icon {
      color: #1890ff;
    }
    .tip {
      font-size: 13px;
      font-weight: 400;
      color: #8da1b4;
    }
    .para {
      width: 165px;
      padding: 10px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
      font-size: 11px;
      border: 1px solid #ebeef5;
      color: #606266;
      position: absolute;
      top: -42px;
      left: 0px;
      line-height: 1.8;
      z-index: 9999;
      display: none;
      .paraItem {
        color: #8da1b4;
        span {
          font-weight: 500;
          color: #000;
        }
      }
    }
    &:hover {
      .para {
        display: block;
      }
    }
  }
}
</style>
