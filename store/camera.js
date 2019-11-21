export const state = () => ({
  videoStream: null
})

export const mutations = {
  start (state, video) {
    state.videoStream = video
  },
  stop (state) {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => track.stop())
      state.videoStream = null
    }
  }
}

export const actions = {
  async startCamera ({ commit, state }) {
    if (!state.videoStream &&
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        .catch((e) => {
          console.log(e)
          throw new Error(e)
        })
      commit('start', stream)
      return stream
    } else {
      throw new Error('This browser doesn\'t support WebRTC')
    }
  },
  stopCamera ({ commit }) {
    commit('stop')
  }
}

export const getters = {
  isCameraStarted: (state) => {
    return !!state.videoStream
  }
}
