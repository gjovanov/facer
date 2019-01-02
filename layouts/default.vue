<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" permanent fixed app>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :to="item.to" :key="i" router>
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>

      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"/>
      </v-btn>
      <v-toolbar-title v-html="title"/>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-progress-circular
          v-if="loading"
          :size="200"
          :width="20"
          color="red"
          indeterminate>
          Loading 7MB models.
          <br>
          Please be patient...
        </v-progress-circular>
        <nuxt/>
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <v-flex class="text-xs-right">
        <a href="http://gjovanov.com/" style="color: white">
          <span>gjovanov - &copy; 2018</span>
        </a>
        &nbsp;
      </v-flex>

    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: "home", title: "Welcome", to: "/" },
        { icon: "people", title: "Users", to: "/users" },
        { icon: "wallpaper", title: "Train", to: "/train" },
        { icon: "camera", title: "Recognize", to: "/recognize" }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: "face&reg; - Realtime Face Recognition"
    };
  },
  computed: {
    loading() {
      return this.$store.state.face.loading
    }
  },
  async mounted() {
    let self = this
    await self.$store.dispatch('face/load')
  }
};
</script>
