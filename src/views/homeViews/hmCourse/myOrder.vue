<template>
  <sub-page>
    <main-card>
      <my-table class="my-table" style="height: 100%">
        <el-table :data="tableData" header-row-class-name="table-header" style="width: 100%">
          <el-table-column label="订单号" header-align="center" align="center" min-width="80" class-name="column-header">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="课程名称" header-align="center" align="center" min-width="80">
            <!-- <template slot-scope="scope"> -->
              <!-- <el-avatar :size="22" :src="scope.row.avatar"></el-avatar> -->
              <!-- <span>{{ scope.row.name }}</span> -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column prop="author" label="讲师" header-align="center" align="center" min-width="80"> </el-table-column>
          <el-table-column prop="price" header-align="center" align="center" label="价格"> </el-table-column>
          <el-table-column prop="date" header-align="center" align="center" label="购买时间" min-width="130"> </el-table-column>
          <!-- <el-table-column prop="shares" header-align="center" align="center" label="持股数"> </el-table-column> -->
          <el-table-column prop="coureLink" header-align="center" align="center" label="课程链接"> </el-table-column>
        </el-table>
      </my-table>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import MyTable from '@/components/myTable';

export default {
  components: {
    SubPage,
    MainCard,
    MyTable,
  },
  data() {
    return {
      tableData: [],
    };
  },
};
</script>

<style></style>
