
# Using multistage build to produce minimal size application image

#==================#
# BUILD BASE IMAGE #
#==================#

FROM node:18-alpine AS build-base

# Installing Python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN apk update && apk upgrade && \
    apk add --no-cache git build-base

RUN corepack enable && \
    corepack prepare pnpm@latest-8 --activate


#=============#
# BUILD IMAGE #
#=============#

FROM build-base AS build

WORKDIR /tmp/build

COPY ./ ./

RUN pnpm install
RUN pnpm build


#===============#
# INSTALL IMAGE #
#===============#

FROM build-base AS install

WORKDIR /tmp/install

COPY               \
  ./package.json   \
  ./pnpm-lock.yaml \
  ./

RUN pnpm install --prod


#===============#
# RUNTIME IMAGE #
#===============#

FROM node:18-alpine

WORKDIR /opt/app

# Adding application files from build image
COPY --from=build /tmp/build/dist/ ./

# Adding installed dependencies from install image
COPY --from=install /tmp/install/node_modules/ ./node_modules/

# Copying manifest file
COPY ./package.json ./

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl --fail http://127.0.0.1/health || exit 1

EXPOSE 80
ENTRYPOINT ["node", "main.js"]
