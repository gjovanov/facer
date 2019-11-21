<template>
  <v-layout row
            align-center
            justify-center
            wrap
  >
    <v-flex>
      <h1>Recognize</h1>
    </v-flex>
    <v-flex xs12>
      <v-progress-circular
        v-if="isProgressActive"
        :rotate="360"
        :size="100"
        :width="15"
        :value="progress"
        color="teal"
      >
        Loading...
      </v-progress-circular>
    </v-flex>
    <v-flex v-if="!isProgressActive" xs12>
      <v-card>
        <p>
          <span>
            Make some facial expressions that demonstrate emotions like
            <v-icon>sentiment_satisfied_alt</v-icon>
            <v-icon>sentiment_very_dissatisfied</v-icon>
          </span>
        </p>
        <v-card-actions class="justify-center">
          <v-btn-toggle v-model="withOptions" multiple>
            <v-btn>
              <v-icon>check_box_outline_blank</v-icon>
              <span>Detection</span>
            </v-btn>
            <v-btn>
              <v-icon>face</v-icon>
              <span>Landmarks</span>
            </v-btn>
            <v-btn>
              <v-icon>how_to_reg</v-icon>
              <span>Recognition</span>
            </v-btn>
            <v-btn>
              <v-icon>insert_emoticon</v-icon>
              <span>Emotion</span>
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
        <v-slider v-model="fps"
                  :max="60"
                  :min="1"
                  :step="1"
                  label="Desired FPS"
                  prepend-icon="local_movies"
                  thumb-label="always"
                  ticks
        />
        <p>
          <v-chip label color="orange" text-color="white">
            <v-icon left>
              local_movies
            </v-icon> Real FPS: {{ realFps }}
          </v-chip>
          <v-chip label color="orange" text-color="white">
            <v-icon left>
              timer
            </v-icon> Duration: {{ duration }} ms
          </v-chip>
        </p>
      </v-card>
    </v-flex>
    <v-flex xs12 md6>
      <video
        id="live-video"
        width="320"
        height="247"
        autoplay
      />
    </v-flex>
    <v-flex xs12 md6>
      <canvas
        id="live-canvas"
        width="320"
        height="247"
      />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      interval: null,
      fps: 15,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: '',
      withOptions: [0, 1, 2, 3]
    }
  },

  computed: {
    models () {
      return this.$store.state.model.list
    }
  },

  watch: {
    fps (newFps) {
      const videoDiv = document.getElementById('live-video')
      const canvasDiv = document.getElementById('live-canvas')
      const canvasCtx = canvasDiv.getContext('2d')
      this.start(videoDiv, canvasDiv, canvasCtx, newFps)
    }
  },

  async beforeMount () {
    const self = this
    await self.$store.dispatch('face/getAll')
      .then(() => self.$store.dispatch('face/getFaceMatcher'))
  },

  async mounted () {
    await this.recognize()
  },

  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.$store.dispatch('camera/stopCamera')
  },

  methods: {
    start (videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      self.interval = setInterval(async () => {
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 320, 247)
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        }
        const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: canvasDiv, options })
        if (detections.length) {
          if (self.isProgressActive) {
            self.increaseProgress()
            self.isProgressActive = false
          }
          detections.forEach(async (detection) => {
            detection.recognition = await self.$store.dispatch('face/recognize', {
              descriptor: detection.descriptor,
              options
            })
            self.$store.dispatch('face/draw',
              {
                canvasDiv,
                canvasCtx,
                detection,
                options
              })
          })
        }
        const t1 = performance.now()
        self.duration = (t1 - t0).toFixed(2)
        self.realFps = (1000 / (t1 - t0)).toFixed(2)
      }, 1000 / fps)
    },
    async recognize () {
      const self = this
      self.increaseProgress()
      await self.$store.dispatch('camera/startCamera')
        .then((stream) => {
          const videoDiv = document.getElementById('live-video')
          const canvasDiv = document.getElementById('live-canvas')
          const canvasCtx = canvasDiv.getContext('2d')
          videoDiv.srcObject = stream

          self.increaseProgress()
          self.start(videoDiv, canvasDiv, canvasCtx, self.fps)
        })
    },

    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    }
  }
}
</script>
