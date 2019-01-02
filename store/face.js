import * as faceapi from 'face-api.js'

export const state = () => ({
  faces: [],
  loading: false,
  loaded: false,
  faceMatcher: null,
  recognizeOptions: {
    useTiny: true
  }
})

export const mutations = {
  loading(state) {
    state.loading = true
  },

  load(state) {
    state.loading = false
    state.loaded = true
  },

  setFaces(state, faces) {
    state.faces = faces
  },

  setFaceMatcher(state, matcher) {
    state.faceMatcher = matcher
  }
}

export const actions = {
  async load({ commit, state }) {
    if (!state.loading && !state.loaded) {
      commit('loading')
      return Promise.all([
          faceapi.loadFaceRecognitionModel('/data/models'),
          faceapi.loadFaceLandmarkTinyModel('/data/models'),
          faceapi.loadTinyFaceDetectorModel('/data/models')
        ])
        .then(() => {
          commit('load')
        })
    }
  },
  async getAll({ commit, state }) {
    const data = await this.$axios.$get('/api/face/getAll')
    commit('setFaces', data)
  },
  async save({ commit }, faces) {
    const { data } = await this.$axios.$post('/api/face/save', { faces })
    commit('setFaces', data)
  },
  getFaceMatcher({ commit, state }) {
    const labeledDescriptors = []
    state.faces.forEach(face => {
      let descriptors = []
      face.descriptors.forEach(desc => {
        if (desc.descriptor) {
          let descArray = []
          for (var i in desc.descriptor) {
            descArray.push(parseFloat(desc.descriptor[i]))
          }
          descriptors.push(new Float32Array(descArray))
        }
      })
      if (descriptors.length) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(
            face.user,
            descriptors
          ))
      }
    })
    const matcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit('setFaceMatcher', matcher)
    return matcher
  },
  async getFaceDetections({ commit, state }, canvasDiv) {
    const detections = await faceapi
      .detectAllFaces(canvasDiv, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
      .withFaceLandmarks(state.recognizeOptions.useTiny)
      .withFaceDescriptors()
    return detections
  },
  async recognize({ commit, state }, faceDescriptor) {
    const bestMatch = await state.faceMatcher.findBestMatch(faceDescriptor)
    return bestMatch
  },

  drawLandmarks({ commit, state }, { canvasDiv, landmarks }) {
    faceapi.drawLandmarks(canvasDiv, landmarks, { drawLines: true })
  },

  drawDetection({ commit, state }, { canvasDiv, detection, recognition }) {
    const boxesWithText = [
        new faceapi.BoxWithText(new faceapi.Rect(detection.box.x, detection.box.y, detection.box.width, detection.box.height), recognition)
      ]
      // faceapi.drawDetection(canvasDiv, detection, { withScore: false })
    faceapi.drawDetection(canvasDiv, boxesWithText)
  },

  async createCanvas({ commit, state }, elementId) {
    const canvas = await faceapi.createCanvasFromMedia(document.getElementById(elementId))
    return canvas
  }
}
