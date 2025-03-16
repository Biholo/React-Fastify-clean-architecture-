FROM node:22.14-slim as base

RUN apt update -y && \
    apt install -y openssl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as builder

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 8000

CMD ["pnpm", "run", "dev"]