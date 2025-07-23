export default {
  methods: {
    alertInfo(msg) {
      this.$message(msg);
    },
    alertError(msg) {
      this.$message.error(msg);
    },
    alertSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success',
      });
    },
    alertWarning(msg) {
      this.$message({
        message: msg,
        type: 'warning',
      });
    },
  },
};
