# Facer
 Face Recognition app using:
 - [FaceApiJS](https://github.com/justadudewhohacks/face-api.js)
 - [TensorflowJS](https://github.com/tensorflow/tfjs)
 - [VueJS](https://github.com/vuejs/vue)
 - [VuetifyJS](https://github.com/vuetifyjs/vuetify)


# Install dependencies
Run `npm i` in the root folder

# Development & Production Mode

## Development mode
1. Run `npm run api` for starting the API server 
2. Run `npm run dev` for starting in development mode

## Production mode
1. Run `npm run build` for building in production mode
2. Run `npm run start` for starting in production mode

# Docker support

## Docker build
Either build your own Docker images
`docker build -t gjovanov/facer .`

## Docker pull
Or pull the one from Docker Hub
`docker pull gjovanov/facer .`

## Docker run
a) `docker run -d --name face --restart always -p 8080:3000 gjovanov/facer`
b) `docker run -d --name facer --restart always -p 8080:3000 -v C:\dev\gjovanov\facer\data:/app/data gjovanov/facer`
