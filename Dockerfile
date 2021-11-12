  
FROM node:15.12.0-alpine3.10
ARG NODE_PORT=3000
ENV NODE_PORT=${NODE_PORT}
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
EXPOSE ${NODE_PORT}
CMD ["npm", "start"]