<template>
  <div class="live">
    <Messages />
  </div>
</template>

<script>
// @ is an alias to /src
import Messages from "@/components/Messages.vue";

export default {
  name: "home",
  components: {
    Messages
  }
};
</script>
