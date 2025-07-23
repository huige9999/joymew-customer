<!--提现记录-->
<template>
  <div class="withDrawRecord">
    <my-table>
      <el-table :data="dataList" header-row-class-name="table-header" height="100%" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="name" label="姓名" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="money" label="提现金额" align="center" min-width="120"> </el-table-column>
        <el-table-column prop="account" label="支付宝账号" align="center" min-width="110"> </el-table-column>
        <el-table-column prop="date" label="申请提现时间" align="center" min-width="140"> </el-table-column>
        <el-table-column prop="status" label="提现状态" align="center"> </el-table-column>
        <el-table-column prop="result" label="原因" align="center" min-width="140"> </el-table-column>
        <el-table-column prop="edit" label="编辑" align="center" min-width="100">
          <template slot-scope="scope">
            <span class="blue-text" v-show="scope.row.status === '审核中'" @click="showEditDialog(scope.row)">
              编辑
            </span>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changePage"
      :page-size="showCount"
      :total="totalCount"
      class="my-pagination"
    />
    <!--  编辑按钮弹窗-->
    <el-dialog :visible.sync="showDialog" title="编辑">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="支付宝姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账户" prop="account">
          <el-input v-model="editForm.account" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyTable from '@/components/myTable';
import setTableData from '@/mixins/setTableData';

import { formatFullDate } from '@/utils/format';
import messageMixin from '@/mixins/messageMixin';
import { alipayWithDrawList, alipayEditWithDraw } from '@/api/app/account';

export default {
  mixins: [setTableData, messageMixin],
  name: 'withDrawRecord',
  components: { MyTable },
  data() {
    return {
      dataList: [],
      tableLoading: true,
      showCount: 10,
      totalCount: 1,
      currentPage: 1,
      showDialog: false,
      editId: null,
      editForm: {
        name: '',
        account: '',
      },
      rules: {
        name: [{ required: true, message: '该内容不能为空！', trigger: 'blur' }],
        account: [{ required: true, message: '该内容不能为空！', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 点击编辑按钮
    showEditDialog(rowData) {
      // 自动填充
      this.editForm.name = rowData.name;
      this.editForm.account = rowData.account;
      // 显示弹窗
      this.showDialog = true;
      // 设置id
      this.editId = rowData.id;
    },
    // 编辑
    submitEdit(formName) {
      this.showDialog = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          const form = this[formName];
          this.alipayEditWithDraw_axios({
            name: form.name,
            account: form.account,
            id: this.editId,
          });
        }
      });
    },
    setTableInfo(data) {
      this.dataList.push({
        name: data.user_name,
        money: data.withdraw_fee,
        account: data.ali_account,
        date: formatFullDate(data.create_time),
        status: this.formatStatus(data.audit_status),
        result: data.fail_reason || '无',
        id: data.id,
      });
    },
    formatData(res) {
      return res.withdraw_list;
    },
    // 解析提现状态
    formatStatus(status) {
      status = status || '';
      switch (status) {
        case '0':
          return '审核中';
        case '1':
          return '已通过';
        case '2':
          return '未通过';
        default:
          return '';
      }
    },
    // 支付宝提现列表
    alipayWithDrawList_axios() {
      return alipayWithDrawList({
        showCount: this.showCount,
        currentPage: this.currentPage,
        request_from_page: 'app/myAccount/profitWithdraw-alipay',
      })
        .then((response) => {
          if (response.code === 200) {
            return response.data;
          }
          throw new Error();
        })
        .catch(() => {
          this.alertError('请求错误！');
        });
    },
    alipayEditWithDraw_axios({ name, account, id }) {
      alipayEditWithDraw({
        user_name: name,
        ali_account: account,
        id,
        request_from_page: 'app/myAccount/profitWithdraw-alipay',

      })
        .then((response) => {
          if (response.code === 200) {
            this.alertSuccess(response.msg);
            try {
              this.refresh();
            } catch (err) {
              console.log('刷新失败');
            }
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          this.alertError('修改失败！');
        });
    },
  },
  created() {
    // 必须设置相应函数名称
    this.init({
      getTableDataFuncName: 'alipayWithDrawList_axios', // axios函数名
      setTableDataFuncName: 'setTableInfo', // 填入表格的函数名
      tableLoadingVar: 'tableLoading', // v-loading变量名
      // firstLoadFuncName: 'firstLoad', // 首次请求回调函数名
      dataListName: 'dataList', // 表格数据名
      formatDataFuncName: 'formatData', // data -> datalist 映射函数
    });
  },
};
</script>

<style lang="less" scoped>
.withDrawRecord {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  .my-table {
    margin: 0;
    margin-top: 18px;
  }
  .my-pagination {
    margin-bottom: 0;
  }
}
</style>
