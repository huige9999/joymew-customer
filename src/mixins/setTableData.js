import messageMixin from '@/mixins/messageMixin';

export default {
  mixins: [messageMixin],
  data() {
    return {
      getTableDataFunc: '', // axios函数
      setTableDataFunc: '', // 填入表格函数
      tableLoadingVar: null, // element v-loading变量名
      firstLoad_: true,
      firstLoadFunc: '', // 首次加载函数
      dataListName: '', // 表格数组名称
      formatDataFunc: '', // data -> dataList 的映射函数
    };
  },
  mounted() {
    this.getSinglePageInfo();
  },
  methods: {
    init({ getTableDataFuncName, setTableDataFuncName, tableLoadingVar, firstLoadFuncName, dataListName, formatDataFuncName }) {
      this.getTableDataFunc = getTableDataFuncName;
      this.setTableDataFunc = setTableDataFuncName;
      this.tableLoadingVar = tableLoadingVar;
      this.firstLoadFunc = firstLoadFuncName;
      this.dataListName = dataListName;
      this.formatDataFunc = formatDataFuncName;
    },
    // 请求并填入单页数据
    getSinglePageInfo() {
      this[this.getTableDataFunc](this.showCount, this.currentPage)
        .then((data) => { // 加载成功
          // 清空表格
          this[this.dataListName] = [];
          // 调用首次请求回调函数
          if (this.firstLoad_ && this.firstLoadFunc) {
            this[this.firstLoadFunc](data);
            this.firstLoad_ = false;
          }
          this.totalCount = data.totalResult;// 设置总条数
          // 关闭遮罩层
          if (this.tableLoadingVar && this[this.tableLoadingVar] === true) {
            this[this.tableLoadingVar] = false;
          }
          // 向表格中填入数据
          this[this.formatDataFunc](data).forEach((item) => {
            this[this.setTableDataFunc](item);
          });
        }).catch(() => {});
    },
    changePage(val) {
      // 显示加载图标
      this.loading = true;
      // 改变当前页
      this.currentPage = val;
      // 请求数据
      this.getSinglePageInfo();
    },
    refresh() {
      this.getSinglePageInfo();
    },
  },
};
