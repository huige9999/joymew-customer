import messageMixin from '@/mixins/messageMixin';

export default {
  mixins: [messageMixin],
  methods: {
    /**
     * 通用确认框
     * @param infoMsg 提示信息
     * @param type 框体类型
     */
    confirmBox(infoMsg, type) {
      return this.$confirm(infoMsg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type,
      }).catch(() => {
        this.alertWarning('已取消');
        return Promise.reject(new Error('cancel'));
      });
    },
    // option为额外参数
    openInfoBox(title, content, option = {}) {
      const defaultOption = {
        // dangerouslyUseHTMLString: true,
        showCancelButton: false,
        showConfirmButton: false,
      };
      this.$confirm(content, title, Object.assign(defaultOption, option)).catch(() => {});
    },
  },
};
