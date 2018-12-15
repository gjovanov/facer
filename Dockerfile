FROM node:alpine

LABEL maintainer="Goran Jovanov <goran.jovanov@gmail.com>"

# Environment variables
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000

# Add app code and deployment scripts (install & run)
ADD ./ /app

# Volumes and workdir
WORKDIR /app
VOLUME /app/data


# Install packages
RUN apk add --update --no-cache --virtual .build-deps \
  gcc g++ make libc6-compat && \
  apk add --no-cache vips-dev fftw-dev build-base python \
  --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/ \
  --repository https://alpine.global.ssl.fastly.net/alpine/edge/main && \
  cat /etc/alpine-release && \
  node -v && \
  npm i --production && \
  npm run build && \
  apk del .build-deps && \
  rm -rf /var/cache/apk/*

EXPOSE 3000

# Define the Run command
CMD ["npm", "run", "start"]
