<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card>
        <card-top-info title="开心答题设置"></card-top-info>
        <div class="qaListWrap">
          <my-table style="height: auto">
            <el-table :data="questions" highlight-current-row style="width: 100%" header-row-class-name="table-header">
              <el-table-column type="index" width="120" align="center" header-align="center" label="序号"></el-table-column>
              <el-table-column prop="questionText" width="120" align="center" header-align="center" label="题目"></el-table-column>
              <el-table-column prop="A" width="120" align="center" header-align="center" label="选项A"></el-table-column>
              <el-table-column prop="B" width="120" align="center" header-align="center" label="选项B"></el-table-column>
              <el-table-column prop="C" width="120" align="center" header-align="center" label="选项C"></el-table-column>
              <el-table-column prop="D" width="120" align="center" header-align="center" label="选项D"></el-table-column>
              <el-table-column prop="questionAnswer" width="120" align="center" header-align="center" label="正确答案"></el-table-column>
              <el-table-column label="操作" min-width="100" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.questionId)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </my-table>
          <div class="addQuestionBtn" @click="showDialog('add')">
            <span class="el-icon-plus" style="margin-right: 10px"></span>
            新增题目
          </div>
        </div>
        <!-- 新增题目弹窗 -->
        <my-dialog :show="dialogVisbile">
          <div class="dialogTitle" slot="title">
            <div class="title-text">{{ dialogTitle }}:</div>
          </div>
          <div class="addform-container">
            <div class="form-item">
              <div class="title">题目:</div>
              <div class="input"><el-input v-model="formData.questionText" placeholder="请输入题目"></el-input></div>
            </div>
            <div class="form-item">
              <div class="title">选项A:</div>
              <div class="input"><el-input v-model="formData.A" placeholder="请输入内容" maxlength="15"></el-input></div>
            </div>
            <div class="form-item">
              <div class="title">选项B:</div>
              <div class="input"><el-input v-model="formData.B" placeholder="请输入内容" maxlength="15"></el-input></div>
            </div>
            <div class="form-item">
              <div class="title">选项C:</div>
              <div class="input"><el-input v-model="formData.C" placeholder="请输入内容" maxlength="15"></el-input></div>
            </div>
            <div class="form-item">
              <div class="title">选项D:</div>
              <div class="input"><el-input v-model="formData.D" placeholder="请输入内容" maxlength="15"></el-input></div>
            </div>
            <div class="form-item">
              <div class="title">正确答案:</div>
              <div class="input">
                <el-select v-model="formData.questionAnswer" placeholder="请设置答案">
                  <el-option v-for="item in answerOptions" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="btn-group">
            <el-button type="primary" class="save-btn" @click="confirmSubmit" v-loading="isLoading">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelSubmit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </my-dialog>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { guessStarAdd, guessStarDelete, guessStarEdit, guessStarList } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import MyTable from '@/components/myTable';
import SubPage from '@/components/subPage';

/**
 * 将表单数据格式转换成服务器需要的数据格式
 * @param {object} formData  数据格式：{questionAnswer, questionText,A,B,C,D}
 * @returns {object} 数据格式：{star_option,star_type: 'happy', star_answer}
 * 转换说明：
 *      1、questionAnswer -> star_answer
 *      2、将questionText,A,B,C,D拼接成json字符串 -> star_option
 *      json格式：{questionText,options: {A,B,C,D}}
 *
 */
const convertFormDataToServerNeedData = (formData) => {
  const { questionAnswer, questionText, A, B, C, D } = formData;
  const star_option = JSON.stringify({ questionText, options: { A, B, C, D } });
  const star_answer = questionAnswer;
  return { star_option, star_type: 'happy', star_answer };
};

/**
 * 将服务器传过来的数组转换成页面表格需要的数组格式
 * @param {array} serverDataList 数据项格式: {star_answer,star_id,star_option}
 * @returns {array} 数据项格式:{questionId,questionText,questionAnswer,A,B,C,D}
 * 转换说明：
 *     1、star_answer->questionAnswer
 *     2、star_id->questionId
 *     3、star_option是个json字符串 格式为：{questionText,options: {A,B,C,D}}
 *        将json字符串转换成对象，并将其中的属性赋值给“待return"的对象的对应的属性
 */

const convertServerDataListToTableData = (serverDataList) => {
  return serverDataList.map((serverData) => {
    const { star_answer, star_id, star_option } = serverData;
    const { questionText, options } = JSON.parse(star_option);
    const { A, B, C, D } = options;

    return {
      questionId: star_id,
      questionText,
      questionAnswer: star_answer,
      A,
      B,
      C,
      D,
    };
  });
};

export default {
  name: 'happyQASetting',
  data() {
    return {
      questions: [], // 题目列表
      dialogVisbile: false,
      dialogTypeCurrent: '',
      formData: {
        questionText: '',
        questionAnswer: '',
        A: '',
        B: '',
        C: '',
        D: '',
      },
      answerOptions: ['A', 'B', 'C', 'D'],
      isLoading: false,
      editId: '', // 当前需要编辑的题目
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogTypeCurrent === 'add' ? '新增题目' : '编辑题目';
    },
  },
  created() {
    this.requestQuestions();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
  },
  methods: {
    /**
     * 打开弹窗
     * @param {string} type 弹窗类型 取值：add/edit
     *
     */
    showDialog(type) {
      this.dialogTypeCurrent = type;
      this.dialogVisbile = true;
    },
    confirmSubmit() {
      if (!this.validateForm()) {
        this.$message.error('请完善表单信息');
        return;
      }
      const serverNeedData = convertFormDataToServerNeedData(this.formData);
      console.log(serverNeedData);
      this.isLoading = true;
      // 新增题目
      if (this.dialogTypeCurrent === 'add') {
        guessStarAdd({
          ...serverNeedData,
          splid: this.$store.state.liveId,
        })
          .then((res) => {
            console.log(res);
            this.isLoading = false;
            // 关闭弹窗
            this.cancelSubmit();
            this.requestQuestions();
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      } else {
        // 编辑题目
        guessStarEdit({
          ...serverNeedData,
          star_id: this.editId,
          splid: this.$store.state.liveId,
        })
          .then((res) => {
            console.log(res);
            this.isLoading = false;
            // 关闭弹窗
            this.cancelSubmit();
            this.requestQuestions();
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }
    },
    cancelSubmit() {
      this.dialogVisbile = false;
      this.dialogTypeCurrent = '';
      this.resetForm();
    },
    resetForm() {
      this.formData.questionText = '';
      this.formData.questionAnswer = '';
      this.formData.A = '';
      this.formData.B = '';
      this.formData.C = '';
      this.formData.D = '';
      this.editId = '';
    },
    /**
     * 验证表单
     * 作用：表单数据提交给服务端前验证数据是否符合要求
     * 要求：每个数据项不为空
     * @return {boolean}
     *
     */
    validateForm() {
      let tmpFlag = true;
      const { questionText, questionAnswer, A, B, C, D } = this.formData;
      // 验证每个数据项是否为空
      if (!questionText || !questionAnswer || !A || !B || !C || !D) {
        tmpFlag = false;
      }
      return tmpFlag;
    },
    requestQuestions() {
      guessStarList({
        star_type: 'happy',
        splid: this.$store.state.liveId,
      })
        .then((res) => {
          console.log(res);
          this.questions = convertServerDataListToTableData(res.data.varList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 请求接口删除当前题目
          return guessStarDelete({
            star_id: id,
            splid: this.$store.state.liveId,
          });
        })
        .then((res) => {
          console.log(res);
          this.requestQuestions();
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // * @returns {array} 数据项格式:{questionId,questionText,questionAnswer,A,B,C,D}
    handleEdit(question) {
      this.editId = question.questionId;
      this.formData.questionText = question.questionText;
      this.formData.questionAnswer = question.questionAnswer;
      this.formData.A = question.A;
      this.formData.B = question.B;
      this.formData.C = question.C;
      this.formData.D = question.D;
      this.showDialog('edit');
    },
  },
};
</script>
<style lang="less" scoped>
.dialogTitle {
  display: flex;
  .title-text {
    font-size: 18px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}

.qaListWrap {
  color: #1e87f0;
  .addQuestionBtn {
    width: 96%;
    margin: 30px auto;
    height: 29px;
    border: 1px dashed #1e87f0;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
  }
}

.addform-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .form-item {
    display: flex;
    align-items: center;
    margin-top: 30px;
    .title {
      font-size: 15px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
      width: 80px;
    }
  }
}

.btn-group {
  padding-left: 143px;
  margin-top: 30px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  .save-btn,
  .cancel-btn {
    padding: 10px 40px;
  }
  .cancel-btn {
    margin-left: 30px;
  }
}
</style>
