const express = require('express')
const {
  lstatSync,
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFile,
  unlinkSync
} = require('fs')
const {
  join
} = require('path')
const rimraf = require('rimraf')
const sharp = require('sharp')
sharp.cache(false)
const multer = require("multer")
const userRoutes = express.Router()

//folders
const rootFolder = join(__dirname, '../../')
const dataFolder = join(rootFolder, 'data')
const usersFolder = join(dataFolder, 'users')

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, usersFolder)
  },
  filename: function(req, file, callback) {
    let fileComponents = file.originalname.split(".")
    let fileExtension = fileComponents[fileComponents.length - 1]
    let filename = `${file.originalname}_${Date.now()}.${fileExtension}`
    callback(null, filename)
  }
})

const getUserPhotos = (user) => {
  const userFolder = join(usersFolder, user)
  const isFile = source => !lstatSync(source).isDirectory()
  const getFiles = source => readdirSync(source)
    .map(name => join(source, name))
    .filter(isFile)
    .map(name => {
      let photo = name.replace(rootFolder, '').replace(/\\/g, '/')
      return !photo.startsWith('/') ? '/' + photo : photo
    })
  const result = getFiles(userFolder)
  return result;
}

userRoutes.get("/getAll", (req, res) => {
  res.header("Content-Type", "application/json")
  const isDirectory = source => lstatSync(source).isDirectory()
  const getDirectories = source => readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(name => name.replace(usersFolder, '').replace(/\\/g, '').replace(/\//g, ''))
    .map(name => {
      return {
        name: name,
        photos: getUserPhotos(name)
      }
    })
  const result = getDirectories(usersFolder)
  res.send(result);
})

userRoutes.get("/get-photos", (req, res) => {
  res.header("Content-Type", "application/json")
  const result = getUserPhotos(req.query.user)
  res.send(result);
})

userRoutes.post("/register", (req, res) => {
  res.header("Content-Type", "application/json")
  if (req.body.name) {
    const newFolder = join(usersFolder, req.body.name)
    if (!existsSync(newFolder)) {
      mkdirSync(newFolder)
      res.send('ok')
    } else {
      res.sendStatus(500)
        .send({
          error: 'User already exists'
        })
    }
  } else {
    res.sendStatus(500)
      .send({
        error: 'User name is mandatory.'
      })
  }
})

userRoutes.post("/delete", async(req, res) => {
  res.header("Content-Type", "application/json")
  if (req.body.name) {
    const oldFolder = join(usersFolder, req.body.name)
    if (existsSync(oldFolder)) {
      await deleteFolder(oldFolder)
        .then(() => res.send('ok'))
        .catch(e => res.sendStatus(500).send({
          error: e
        }))
    } else {
      res.sendStatus(500)
        .send({
          error: 'User doesn\'t exist'
        })
    }
  } else {
    res.sendStatus(500)
      .send({
        error: 'User name is required'
      })
  }
})

userRoutes.post("/upload", async(req, res) => {
  res.header("Content-Type", "application/json")
  const upload = multer({
    storage: storage
  }).array('fileUpload');
  await uploadFile(upload, req, res)
    .then(result => res.send(result))
    .catch(e => {
      console.error(e)
      res.sendStatus(500).send(e)
    })
})

userRoutes.post("/uploadBase64", async(req, res) => {
  res.header("Content-Type", "application/json")
  await uploadBase64(req.body.upload)
    .then(result => res.send(result))
    .catch(e => {
      console.error(e)
      res.sendStatus(500).send(e)
    })
})

userRoutes.post("/deletePhoto", async(req, res) => {
  res.header("Content-Type", "application/json")
  if (req.body.upload.user && req.body.upload.file) {
    const file = join(usersFolder, req.body.upload.user, req.body.upload.file)
    try {
      unlinkSync(file)
      res.send('ok')
    } catch (e) {
      res.sendStatus(500)
        .send({
          error: e
        })
    }
  } else {
    res.sendStatus(500)
      .send({
        error: 'User name is required'
      })
  }
})

async function deleteFolder(name) {
  return new Promise(async(resolve, reject) => {
    rimraf(name, (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}

async function uploadFile(upload, req, res) {
  return new Promise(async(resolve, reject) => {
    await upload(req, res, async(err) => {
      if (err) {
        reject(new Error('Error uploading file'))
        return
      }

      const result = [];
      await Promise.all(req.files.map(async file => {
        try {
          const oldPath = join(usersFolder, file.filename)
          const newPath = join(usersFolder, req.body.user, file.filename)
          const buffer = readFileSync(oldPath)

          await sharp(buffer)
            .resize(320, 247)
            .toFile(newPath)
            .then(() => {
              result.push(`/data/users/${req.body.user}/${file.filename}`)
              try {
                unlinkSync(oldPath)
              } catch (ex) {
                console.log(ex)
              }
            })
        } catch (e) {
          reject(e)
          return
        }
      }))
      resolve(result)
    })
  })
}

async function uploadBase64(upload) {
  const fileName = `${upload.user}_${Date.now()}.jpg`
  const imgPath = join(usersFolder, upload.user, fileName)
  const content = upload.content.split(',')[1]
  return new Promise(async(resolve, reject) => {
    writeFile(imgPath, content, 'base64', (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve([`/data/users/${upload.user}/${fileName}`])
    })
  })
}

module.exports = userRoutes
