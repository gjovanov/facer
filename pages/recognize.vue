<template>
  <v-layout row
            wrap>
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
    <v-flex xs12 md6>
      <video
        id="live-video"
        width="320"
        height="247"
        autoplay/>
    </v-flex>
    <v-flex xs12 md6>
      <canvas
        id="live-canvas"
        width="320"
        height="247"/>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data(){
    return {
      interval: null,
      fps: 60,
      step: 2,
      counter: 0,
      progress: 0,
      isProgressActive: true,
      recognition: ''
    }
  },

  computed: {
    models() {
      return this.$store.state.model.list;
    },
  },

  async beforeMount() {
    let self = this;
    await self.$store.dispatch('face/getAll')
      .then(() => self.$store.dispatch('face/getFaceMatcher'))
  },

  async mounted () {
    await this.recognize()
  },

  beforeDestroy() {
    if (this.interval){
      clearInterval(this.interval)
    }
    this.$store.dispatch('camera/stopCamera')
  },

  methods: {
    async recognize(){
      let self = this;
      self.increaseProgress()
      await self.$store.dispatch('camera/startCamera')
        .then(stream => {
          const videoDiv = document.getElementById("live-video")
          const canvasDiv = document.getElementById("live-canvas")
          const canvasCtx = canvasDiv.getContext("2d")
          videoDiv.srcObject = stream

          self.increaseProgress()

          self.interval = setInterval(async () => {
            canvasCtx.drawImage(videoDiv, 0, 0, 320, 247)
            const detections = await self.$store.dispatch('face/getFaceDetections', canvasDiv)
            if (detections.length) {
              if (self.isProgressActive) {
                self.increaseProgress()
                self.isProgressActive = false
              }
              detections.forEach(async item => {
                const shifted = item.forSize(canvasDiv.width, canvasDiv.height)
                self.$store.dispatch('face/drawLandmarks', { canvasDiv, landmarks: shifted._unshiftedLandmarks } )
                const bestMatch = await self.$store.dispatch('face/recognize', shifted.descriptor)
                self.recognition = `${bestMatch.toString()}!`
                self.$store.dispatch('face/drawDetection', { canvasDiv, detection: shifted._detection, recognition: self.recognition } )
                // console.log(self.recognition)
              })
            } else {
              self.recognition = ''
            }
          }, self.fps / 1000)
        })
    },

    increaseProgress(){
      let self = this;
      self.progress = (100 / self.step) * ++self.counter
    }
  }
}
</script>
