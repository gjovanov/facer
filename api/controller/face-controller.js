const express = require('express')
const { writeFileSync } = require('fs')
const { join } = require('path')
const modelRoutes = express.Router()


//folders & model file
const rootFolder = join(__dirname, '../../')
const dataFolder = join(rootFolder, 'data')
const facesFileName = 'faces.json'

modelRoutes.get("/getAll", (req, res) => {
  res.header("Content-Type", "application/json")
  const facesFile = join(dataFolder, facesFileName)
  console.log(facesFile)
  delete require.cache[facesFile]
  const result = require(facesFile)
  res.send(result);
})

modelRoutes.post("/save", async(req, res) => {
  res.header("Content-Type", "application/json")
  const content = JSON.stringify(req.body.faces)
  writeFileSync(join(dataFolder, facesFileName), content)
  res.send('ok')
})

module.exports = modelRoutes
