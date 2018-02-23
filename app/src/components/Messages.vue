<template>
  <div class="messages">
    <el-table
      v-loading="loading"
      :data="messagesData"
      border
      style="width: 100%">
      <el-table-column
        prop="sender.member.name"
        label="作者"
        width="100">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="80">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="发布时间"
        :formatter="formatDate"
        width="150">
      </el-table-column>
      <el-table-column
        label="信息">
        <template slot-scope="scope">
          <div v-if="scope.row.text">{{ scope.row.text }}</div>
          <div v-else-if="scope.row.in_reply_to">Reply to {{ scope.row.in_reply_to.message.sender.member.name }}: 
            <strong>{{ scope.row.in_reply_to.message.text }}</strong>
          </div>
          <div v-else-if="scope.row.image">
            <a :href="scope.row.image.full.url" target="_blank">
              <img :src="scope.row.image.full.url" width="300px"/>
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="语音信息">
        <el-table-column label="时长" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.audio" class="duration">{{ mstoMinutes(scope.row.audio.duration) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="播放语音">
          <template slot-scope="scope">
            <audio v-if="scope.row.audio" :src="scope.row.audio.url" controls preload="none"></audio>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[30, 50, 100, 150, 200]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import zh_cn from "date-fns/locale/zh_cn";

export default {
  name: "Messages",
  data() {
    return {
      messages: [],
      pagesize: 30,
      currentPage: 1,
      loading: true
    };
  },
  created() {
    this.getMessages(this.$route.params.id);
  },
  computed: {
    totalCount() {
      return this.messages.length;
    },
    messagesData() {
      return this.messages.slice(
        (this.currentPage - 1) * this.pagesize,
        this.pagesize * this.currentPage
      );
    }
  },
  methods: {
    getMessages(id) {
      this.axios.get(`api/${id}/messages`).then(res => {
        this.messages = res.data.messages;
        this.loading = false;
      });
    },
    formatDate(row) {
      return format(row.created_at * 1000, "YY年MM月DD日 HH:mm", {
        locale: zh_cn
      });
    },
    mstoMinutes(time) {
      const seconds = Math.floor(time / 1000);
      const minute = Math.floor(seconds / 60);
      const second = seconds % 60 < 10 ? "0" + seconds % 60 : seconds % 60;
      return `${minute}:${second}`;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
