FROM nginx:1.17.4-alpine
#MAINTAINER Sivaprakash<sivaprakash.ramasamy@tarento.com>
COPY ./build /usr/share/nginx/html
COPY ./env-export.sh /usr/bin/env-export.sh
RUN  chmod +x /usr/bin/env-export.sh
COPY ./nginx_fe_dev.conf /etc/nginx/conf.d/default.conf
CMD ["/bin/sh", "-c", "/usr/bin/env-export.sh && nginx -g \"daemon off;\""]