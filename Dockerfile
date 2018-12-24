FROM gjovanov/node-alpine-edge
LABEL maintainer="Goran Jovanov <goran.jovanov@gmail.com>"

# Environment variables
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000

# Volumes and workdir
WORKDIR /facer
VOLUME /facer/data


# Install packages & git clone source code and build the application
RUN apk add --update --no-cache --virtual .build-deps \
  gcc g++ make libc6-compat git openssh-client && \
  apk add --no-cache vips-dev fftw-dev build-base python \
  --repository http://nl.alpinelinux.org/alpine/edge/testing/ \
  --repository http://nl.alpinelinux.org/alpine/edge/main && \
  cat /etc/alpine-release && \
  git clone https://github.com/gjovanov/facer.git \
  node -v && \
  npm i pm2 -g \
  npm i --production && \
  npm run build && \
  apk del .build-deps && \
  rm -rf /var/cache/apk/*

EXPOSE 3000

# Define the Run command
CMD ["npm", "run", "start"]
