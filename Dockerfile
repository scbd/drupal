FROM node:9.2-alpine

MAINTAINER it@cbd.int

RUN apk update && apk add dcron wget rsync ca-certificates && rm -rf /var/cache/apk/*

RUN mkdir -p /var/log/cron && mkdir -m 0644 -p /var/spool/cron/crontabs && touch /var/log/cron/cron.log && mkdir -m 0644 -p /etc/cron.d

COPY package.json ./

RUN npm install -q --only=prod

COPY ./ /
COPY /scripts/* /

ENTRYPOINT ["/docker-entry.sh"]
CMD ["/docker-cmd.sh"]
