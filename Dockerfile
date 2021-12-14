  
FROM node:15.12.0-alpine3.10
ARG NODE_PORT=3000
ARG CERT_PATH=/
ARG DB_URL=x
ARG DB=x
ENV NODE_PORT=${NODE_PORT}
ENV CERT_PATH=${CERT_PATH}
ENV DB_URL=${DB_URL}
ENV DB=${DB}
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN mkdir certs
RUN npm install
COPY . .
EXPOSE ${NODE_PORT}
CMD ["npm", "start"]