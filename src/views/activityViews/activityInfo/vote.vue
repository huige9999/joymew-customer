<template>
  <sub-page>
    <div class="vote-container">
      <main-card>
        <card-top-info title="投票"></card-top-info>
        <div class="tipWarp">
          <p>
            设置投票内容
            <span>（您需要填写的标题和相关描述）</span>
          </p>
        </div>
        <div class="mainContent">
          <div class="tableWarp">
            <el-table :data="voteList" border style="width: 100%">
              <el-table-column prop="num" type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="title" label="标题" align="center"></el-table-column>
              <el-table-column prop="description" label="描述" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- <template slot-scope="scope">
                  <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="deleteVote(scope.row)" />
                </template> -->
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteVote(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="btnWarp">
          <el-button type="primary" @click="add">添加投票内容</el-button>
        </div>
        <div class="tipWarp">
          <p>
            设置投票次数
            <span>（设置每个人拥有的投票次数）</span>
          </p>
        </div>
        <div class="mainContent">
          <label>投票次数</label>
          <el-select v-model="voteNum" placeholder="请选择">
            <el-option v-for="item in voteOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="btnWarp">
          <el-button type="primary" @click="voteNumEdit">确认保存</el-button>
        </div>
      </main-card>
      <el-dialog :title="dialogText" :visible.sync="addDialogShow" width="400px">
        <div class="block" v-show="voteList.length == 0 && dialogType === 'add'">
          <span class="label" style="text-align: right">标题</span>
          <el-input style="width: 200px" v-model="title"></el-input>
        </div>
        <div class="block">
          <span class="label" style="text-align: right">描述</span>
          <el-input style="width: 200px" v-model="description"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addVote">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { voteList, removeVote, saveVote, editVote, editVoteContent } from '@/api/setting/setting';

export default {
  name: 'vote',
  data() {
    return {
      voteList: [],
      voteOptions: [
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '4',
          label: '4',
        },
        {
          value: '5',
          label: '5',
        },
        {
          value: '6',
          label: '6',
        },
        {
          value: '7',
          label: '7',
        },
        {
          value: '8',
          label: '8',
        },
        {
          value: '9',
          label: '9',
        },
        {
          value: '10',
          label: '10',
        },
      ],
      voteNum: '1',
      addDialogShow: false,
      title: '',
      editId: '',
      description: '',
      dialogType: 'add',
    };
  },
  computed: {
    dialogText() {
      return this.dialogType === 'add' ? '添加投票' : '编辑投票';
    },
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  created() {
    this.requestVoteList();
  },
  methods: {
    requestVoteList() {
      voteList({ splid: this.$store.state.liveId })
        .then((res) => {
          console.log(res, 'vote list -----');
          for (let i = 0; i < res.data.varList.length; i++) {
            res.data.varList[i].num = i + 1;
          }
          this.voteList = res.data.varList;
          this.voteNum = res.data.voteSize;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('获取数据失败!');
        });
    },
    deleteVote(obj) {
      const params = {
        splid: this.$store.state.liveId,
        id: obj.id,
      };
      removeVote(params).then((res) => {
        console.log(res, 'removeVote----');
        if (res.code === 200) {
          this.$message.success('投票删除成功');
          this.requestVoteList();
        }
      });
    },
    closeDialog() {
      this.addDialogShow = false;
      this.editId = '';
      this.description = '';
    },
    add() {
      this.addDialogShow = true;
      this.dialogType = 'add';
    },
    edit(rowData) {
      const { id, description } = rowData;
      this.addDialogShow = true;
      this.dialogType = 'edit';
      this.editId = id;
      this.description = description;
    },
    editVoteDetail() {
      editVoteContent({
        description: this.description,
        id: this.editId,
      })
        .then((res) => {
          console.log(res);
          this.$message.success('修改成功!');
          this.closeDialog();
          this.requestVoteList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('修改失败!');
        });
    },
    addVote() {
      if (this.dialogType === 'edit') {
        this.editVoteDetail();
        return;
      }
      if (this.voteList.length >= 1) {
        this.title = this.voteList[0].title;
      }
      if (this.title && this.description) {
        const params = {
          splid: this.$store.state.liveId,
          title: this.title,
          description: this.description,
        };
        saveVote(params)
          .then((res) => {
            console.log(res, 'addVote-----');
            this.addDialogShow = false;
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '投票添加成功',
              });
              this.requestVoteList();
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('添加失败!');
          });
      } else {
        this.$message.error('请完善投票信息!');
      }
    },
    voteNumEdit() {
      const params = {
        // liveId: this.$store.state.liveId,
        // voteSize: this.voteNum,
        splid: this.$store.state.liveId,
        voteSize: this.voteNum,
      };
      editVote(params)
        .then((res) => {
          console.log(res, 'editVote -----');
          this.addDialogShow = false;
          this.requestVoteList();
          if (res.code === 200) {
            this.$message.success('投票次数设置成功');
          } else {
            this.$message.error('投票次数设置失败');
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('修改失败!');
        });
    },
  },
};
</script>
<style lang="less" scoped>
.deleteIcon {
  width: 22px;
  height: 22px;
}
.tipWarp {
  line-height: 24px;
  padding-left: 40px;
  p {
    font-size: 16px;
    color: #000;
    span {
      color: #999999;
    }
  }
}
.mainContent {
  padding-top: 34px;
  padding-left: 40px;
  margin-bottom: 24px;
  label {
    margin-right: 12px;
    font-size: 16px;
    color: #000;
  }
  .tableWarp {
    width: 638px;
  }
}
.btnWarp {
  padding-top: 30px;
  padding-bottom: 30px;
  width: 525px;
  display: flex;
  justify-content: center;
}
.block {
  margin-top: 30px;
  display: flex;
  align-items: center;
  .label {
    font-size: 15px;
    width: 100px;
    margin-right: 10px;
    &::after {
      content: ':';
      margin-left: 5px;
    }
  }
}
</style>
