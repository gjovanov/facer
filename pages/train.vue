<template>
  <v-layout row
            wrap
  >
    <v-flex xs6>
      <v-btn @click="train()" color="primary">
        Train
      </v-btn>
    </v-flex>
    <v-flex xs6>
      <v-progress-circular
        v-if="isProgressActive"
        :rotate="360"
        :size="100"
        :width="15"
        :value="progress"
        color="teal"
      >
        Training...
      </v-progress-circular>
    </v-flex>
    <v-flex v-for="user in users" :key="user.name" xs12>
      <v-card>
        <v-card-title>
          <strong class="headline">{{ user.name }}</strong>
          <v-btn :to="{ path: `/users/${user.name}`}" fab dark small color="primary">
            <v-icon dark>
              add_a_photo
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-layout row
                  wrap
        >
          <v-flex v-for="(photo, index) in user.photos"
                  :key="photo"
                  xs12 md6 lg4
          >
            <v-card flat tile class="d-flex">
              <img :id="user.name + index" :src="photo">
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data () {
    return {
      step: 1,
      counter: 0,
      progress: 0,
      isProgressActive: false
    }
  },
  computed: {
    users () {
      return this.$store.state.user.list
    }
  },

  async fetch ({ store }) {
    const self = this
    await store.dispatch('user/getAll')
      .then((users) => {
        self.step += users.length
      })
  },

  methods: {
    async train () {
      const self = this
      self.resetProgress()
      const faces = []
      await Promise.all(self.users.map(async (user) => {
        const descriptors = []
        await Promise.all(user.photos.map(async (photo, index) => {
          const photoId = `${user.name}${index}`
          const img = document.getElementById(photoId)
          const options = {
            detectionsEnabled: true,
            landmarksEnabled: true,
            descriptorsEnabled: true,
            expressionsEnabled: false
          }
          const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: img, options })
          detections.forEach((d) => {
            descriptors.push({
              path: photo,
              descriptor: d.descriptor
            })
          })
          self.increaseProgress()
        }))
        faces.push({
          user: user.name,
          descriptors
        })
      }))
      await self.$store.dispatch('face/save', faces)
        .then(() => {
          self.increaseProgress()
          self.isProgressActive = false
        })
        .catch((e) => {
          self.isProgressActive = false
          console.error(e)
        })
    },
    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
    resetProgress () {
      const self = this
      self.progress = self.counter = 0
      self.isProgressActive = true
    }
  }
}
</script>
