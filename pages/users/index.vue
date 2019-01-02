<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-actions>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Your full name"
              required />
            <v-spacer/>
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="register()">Register new!</v-btn>
          </v-form>
        </v-card-actions>
        <v-dialog v-model="dialog" persistent max-width="320">
          <v-card>
            <v-card-title class="headline">Warning!</v-card-title>
            <v-card-text>Are you sure you want to delete this user</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="green darken-1" flat @click="hideDialog()">Disagree</v-btn>
              <v-btn color="green darken-1" flat @click="deleteUpload()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-list two-line subheader>
        <v-list-tile v-for="user in users" :key="user.name" avatar>
          <v-list-tile-avatar>
            <v-avatar
              slot="activator"
              size="32px"
            >
              <img
                v-if="user.photos.length"
                :src="user.photos[0]"
                alt="Avatar"
              >
              <v-icon
                v-else
                color="primary">
                person
              </v-icon>
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-sub-title>
              {{ user.name }}
              <v-divider />
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn :to="'/users/' + user.name" color="primary" fab small>
              <v-icon>
                add_a_photo
              </v-icon>
            </v-btn>
            <v-divider />
          </v-list-tile-action>
          <v-list-tile-action>
            <v-btn color="primary" fab small @click="showDialog(user.name)">
              <v-icon>
                close
              </v-icon>
            </v-btn>
            <v-divider />
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data(){
    return {
      dialog: false,
      selectedUser: null,
      valid: true,
      name: null,
      nameRules: [
        v => !!v || 'Full name is required',
        v => (v && v.length > 2) || 'Name must be more than 2 characters'
      ],
    }
  },

  computed: {
    users() {
      return this.$store.state.user.list;
    }
  },

  methods: {
    async register() {
      const self = this
      if (this.$refs.form.validate()) {
        return this.$store.dispatch('user/register', this.name)
          .then(() =>{
            self.$router.push({ path: `/users/${self.name}`})
          })
      }
    },

    showDialog(name) {
      this.dialog = true
      this.selectedUser = name
    },

    hideDialog() {
      this.dialog = false
      this.selectedUser = null
    },

    async deleteUpload() {
      if (this.selectedUser) {
        await this.$store.dispatch('user/delete', this.selectedUser)
        this.selectedUser = null
        this.dialog = false
      }
    }
  },
  async fetch({ store }) {
    return store.dispatch('user/getAll');
  }
}
</script>
