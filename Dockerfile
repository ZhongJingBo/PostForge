FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16 as build-stage

WORKDIR /app

# 创建 node_modules 目录并设置权限
RUN mkdir -p node_modules && chown -R node:node /app

# 切换到 node 用户
USER node

COPY --chown=node:node package*.json ./

RUN npm config set registry https://registry.npmmirror.com/ \
    && npm install

COPY --chown=node:node . .

RUN npm run build

# production stage
FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16 as production-stage

WORKDIR /app

# 创建目录并设置权限
RUN mkdir -p node_modules && chown -R node:node /app

# 切换到 node 用户
USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=build-stage /app/dist ./dist
COPY --chown=node:node --from=build-stage /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3005

# 修正 CMD 路径
CMD ["node", "dist/main.js"]
