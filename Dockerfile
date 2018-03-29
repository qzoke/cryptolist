FROM node:8.11-onbuild

RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]
