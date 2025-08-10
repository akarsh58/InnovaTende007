FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY users.json ./
ENV PORT=3000 \
    JWT_SECRET=change-me-in-prod \
    AUTH_DISABLED=false
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:'+process.env.PORT).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
