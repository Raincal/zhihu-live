<template>
  <div class="lives" >
    <el-card class="box-card">
      <div slot="header" align="center" class="clearfix">
        <span>我的 Live</span>
      </div>
      <div v-loading="loading">
        <router-link :to="live.id + '/messages'" v-for="live in lives" :key="live.id" class="live">
          <div>{{ live.subject }}</div>
          <div class="speaker">{{ speakers(live) }}</div>
          <div class="extra">
            <div v-for="tag in live.tags" :key="tag.id">
              <el-tag size="mini">{{ tag.name }}</el-tag>
            </div>
            <el-rate
              v-model="live.feedback_score"
              disabled
              text-color="#ff9900">
            </el-rate>
            <div class="seats">{{ live.seats.taken + "人参与" }}</div>
          </div>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Lives",
  data() {
    return {
      lives: [],
      loading: false
    };
  },
  created() {
    this.getLives();
  },
  methods: {
    getLives() {
      this.loading = true;
      this.axios.get("api/lives").then(res => {
        this.loading = false;
        this.lives = res.data.data;
      });
    },
    speakers(live) {
      const cospeakers = [];
      for (const speaker of live.cospeakers) {
        cospeakers.push(speaker.member.name);
      }
      return [live.speaker.member.name, ...cospeakers].join("，");
    }
  }
};
</script>

<style scoped>
.lives {
  display: flex;
  justify-content: center;
}
.box-card {
  width: 600px;
}
.live {
  padding: 8px 0;
  text-decoration: none;
  color: #282828;
  display: block;
}
.speaker {
  font-size: 14px;
}
.extra {
  display: flex;
}
.el-tag {
  margin-right: 12px;
}
.seats {
  color: #999;
  font-size: 14px;
}
</style>
