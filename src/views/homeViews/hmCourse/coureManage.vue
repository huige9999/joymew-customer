<template>
  <sub-page>
    <main-card>
      <div class="add">
        <el-button type="primary" @click="add">新建课程</el-button>
      </div>

      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <el-table-column prop="album_title" label="课程名称" header-align="center" align="center" min-width="80"> </el-table-column>

          <el-table-column prop="purchase_price" label="课程价格" header-align="center" align="center" min-width="80"> </el-table-column>
          <!-- <el-table-column prop="view" label="播放量" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <el-table-column prop="album_desc" label="课程简介" header-align="center" align="center" min-width="80"> </el-table-column>
          <!-- <el-table-column prop="status" label="课程状态" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <!-- <el-table-column prop="status" label="课程状态" header-align="center" align="center" min-width="80"> </el-table-column> -->
          <el-table-column fixed="right" label="封面图">
            <template slot-scope="scope">
              <img :src="scope.row.album_cover_urlalbum" alt="" class="cover" draggable="false" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="优惠券">
            <template slot-scope="scope">
              <div style="color:#eb133c">{{scope.row.coupon?(scope.row.coupon.coupon_price+'元'):''}}</div>
              <el-button v-if="!scope.row.coupon" type="text" size="small" @click="setCouponInfo(scope.row)">添加优惠券</el-button>
              <el-button v-if="scope.row.coupon" type="text" size="small" @click="setCouponInfo(scope.row)">编辑优惠券</el-button>
              <el-popconfirm
                v-if="scope.row.coupon"
                style="margin-left: 20px"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定删除 《${scope.row.album_title} 》的 ${scope.row.coupon.coupon_price}元 优惠券 吗？`"
                @confirm="deleteCoupon(scope.row)"
                @onConfirm="deleteCoupon(scope.row)"
                @cancel="() => {}"
              >
                <el-button type="text" size="small" slot="reference">删除优惠券</el-button>
                <!-- <el-button slot="reference">删除</el-button> -->
              </el-popconfirm>
              <!-- <el-button type="text" size="small" @click="deleteCoupon(scope.row.album_id)">删除优惠券</el-button> -->
            </template>
          </el-table-column>

          <el-table-column fixed="right" label=" 上架状态">
            <template slot-scope="scope">
              <!-- {{scope.row.kind}} -->
              <span style="color: grey;">{{ scope.row.kind === '0' ? '未上架' : '' }}</span>
              <span style="color: #3bcacd;">{{ scope.row.kind === 'good' ? '已上架' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="toVideoList(scope.row)" type="text" size="small" style="margin-left: 20px">查看</el-button>
              <el-button type="text" size="small" @click="handleClick(scope.row, 'edit')" style="margin-left: 20px">编辑</el-button>
              <el-popconfirm
                style="margin-left: 20px"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="'确定删除《' + scope.row.album_title + '》吗？'"
                @confirm="deleteTheCourse(scope.row.album_id)"
                @onConfirm="deleteTheCourse(scope.row.album_id)"
                @cancel="() => {}"
              >
                <el-button type="text" size="small" slot="reference">删除</el-button>
                <!-- <el-button slot="reference">删除</el-button> -->
              </el-popconfirm>

              <el-popconfirm
                style="margin-left: 20px"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定${scope.row.kind === '0' ? '上架' : '下架'}《'${scope.row.album_title}》吗？`"
                @confirm="changeTheCourse(scope.row.album_id, scope.row.kind)"
                @onConfirm="changeTheCourse(scope.row.album_id, scope.row.kind)"
                @cancel="() => {}"
              >
                <el-button type="text" size="small" slot="reference">{{ scope.row.kind === '0' ? '上架' : '下架' }}</el-button>
                <!-- <el-button slot="reference">删除</el-button> -->
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </my-table>
    </main-card>

    <el-dialog title="提示" :visible.sync="couponVisible" width="40%" center>
      <div class="coupon">
        <div class="coupon-icon"></div>
        <span>{{ coupon.action }}优惠券</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-form ref="chapter" :rules="rules" :model="coupon" label-width="120px" class="chapter" :show-message="true">
          <el-form-item label="课程名称" prop="title">
            <el-input v-model="coupon.title" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="money">
            <el-input v-model="coupon.money" type="number" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="优惠券" prop="discount">
            <el-input v-model="coupon.discount" type="number" placeholder="请输入优惠券价格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetCoupon">取 消</el-button>
            <el-button type="primary" @click="addOrSaveCoupon">确 定</el-button>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';
import {
  getMyCourseList, deleteCourse, changeCourse, editCoupon, addCoupon, deleteCoupon,
} from '@/api/app/course';

export default {
  components: {
    SubPage,
    MainCard,
    MyTable,
  },
  data() {
    return {
      couponVisible: false,
      activeAlbumId: null,
      coupon: {
        id: null,
        action: '',
        title: '',
        money: 0,
        discount: 0,
      },
      tableData: [
        // {
        //   title: '如何上传视频',
        //   price: '88.8',
        //   view: '300',
        //   brief: '上传视频简介',
        //   status: '已上架',
        //   id: 1,
        // },
      ],
      rules: {
        discount: [{ required: true, message: '请输入优惠券价格', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.initMyCourseList();
  },
  methods: {
    add() {
      this.$router.push({
        path: 'addCourse',
        query: {
          id: null,
          type: 'add',
        },
      });
    },
    handleClick(row, type) {
      // console.log(row);
      this.$router.push({
        path: 'addCourse',
        query: {
          id: row.album_id,
          type: type || 'edit',
        },
      });
    },
    toVideoList(row) {
      this.$router.push({
        path: 'upVideoList',
        query: {
          id: row.album_id,
          // type: 'add',
        },
      });
    },
    initMyCourseList() {
      getMyCourseList()
        .then((res) => {
          if (res.data && res.data.list) {
            const format = res.data.list.map((item) => {
              if (item.album_desc && item.album_desc.length > 20) {
                // item.album_des = `${item?.album_des.substr(0, 20)}...`;
                item.album_desc = `${item.album_desc.substr(0, 20)}...`;
              }
              return item;
            });
            this.tableData = format;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTheCourse(album_id, status) {
      let op = null; // '0' 下架操作 '1' 上架操作 null 不操作
      switch (status) {
        case 'good':
          op = '0';
          break;
        case '1':
          op = '0';
          break;
        case '0':
          op = '1';
          break;
        default:
          break;
      }
      if (op === null) {
        this.$message.warning('操作异常');
        return;
      }
      changeCourse({
        album_id,
        kind: op,
      })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.initMyCourseList();
            this.$message.success('操作成功');
          } else {
            this.$message.error('操作失败');
          }
        })
        .catch((err) => {
          this.$message.error('操作失败');
          console.log(err);
        });
    },
    deleteTheCourse(album_id) {
      console.log(album_id);
      deleteCourse({
        album_id,
      })
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            this.initMyCourseList();
            this.$message.success('删除成功');
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => {
          this.$message.error('删除失败');
          console.log(err);
        });
    },
    /**
     * addCoupon
     * 添加优惠券
     */
    addCoupon() {
      // this.couponVisible = true;
      addCoupon({
        coupon_price: `${this.coupon.discount}`,
        album_id: String(this.activeAlbumId),
      })
        .then((res) => {
          this.$message.success('添加优惠券成功');
          this.initMyCourseList();
          this.resetCoupon();
          console.log(res);
          this.couponVisible = false;
        })
        .catch((err) => {
          this.$message.error('添加优惠券失败');

          console.log(err);
        });
    },
    setCouponInfo(album) {
      this.activeAlbumId = album.album_id;
      this.coupon = {
        id: album.coupon ? album.coupon.coupon_id : null,
        action: album?.coupon?.coupon_id ? '编辑' : '添加',
        title: album.album_title,
        money: album.purchase_price,
        discount: album.coupon ? album.coupon.coupon_price : 0,
      };
      this.couponVisible = true;
    },
    addOrSaveCoupon() {
      if (!this.coupon.discount) {
        this.$message.error('请输入大于零的金额');
        return;
      }
      if (this.coupon.id) {
        this.editCoupon();
      } else {
        this.addCoupon();
      }
    },
    /**
     * 删除优惠券
     */
    deleteCoupon(row) {
      const { coupon_id } = row.coupon;
      deleteCoupon({
        coupon_id,
      })
        .then((res) => {
          this.$message.success('删除优惠券成功');
          this.initMyCourseList();
          this.resetCoupon();
          console.log(res);
          // this.couponVisible = false;
        })
        .catch((err) => {
          this.$message.error('删除优惠券失败');

          console.log(err);
        });
    },
    /**
     * 编辑优惠券
     */
    editCoupon() {
      editCoupon({
        coupon_id: `${this.coupon.id}`,
        coupon_price: `${this.coupon.discount}`,
      })
        .then((res) => {
          this.$message.success('修改优惠券成功');
          this.initMyCourseList();
          this.resetCoupon();
          console.log(res);
          this.couponVisible = false;
        })
        .catch((err) => {
          this.$message.error('修改优惠券失败');

          console.log(err);
        });
    },
    resetCoupon() {
      this.couponVisible = false;
      this.activeAlbumId = null;
      this.coupon = {
        id: null,
        action: '',
        title: '',
        money: 0,
        discount: 0,
      };
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
.my-table {
  .cover {
    width: 130px;
    height: 125px;
    user-select: none;
  }
}
.coupon{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .coupon-icon{
    margin: 0 10px;
    width:24px;
    height: 24px;
    background-size: 100% 100%;
    background-image: url(~@/assets/image/coupon.png)
  }
}
</style>
