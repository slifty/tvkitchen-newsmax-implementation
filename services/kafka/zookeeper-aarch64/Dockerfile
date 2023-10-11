ARG BASE_IMG=arm64v8/amazoncorretto:8-alpine-jre
FROM $BASE_IMG

ARG BUILD_DATE
ARG VCS_REF

# modified from https://github.com/fogsy-io/dockerfiles/blob/master/zookeeper/aarch64.Dockerfile
# but using a different JRE
# and getting qemu-aarch64-static from the web

LABEL io.fogsy.build-date=$BUILD_DATE \
      io.fogsy.license="Apache 2.0" \
      io.fogsy.organization="fogsy-io" \
      io.fogsy.url="https://fogsy.io/" \
      io.fogsy.vcs-ref=$VCS_REF \
      io.fogsy.vcs-type="Git" \
      io.fogsy.vcs-url="https://github.com/fogsy-io/dockerfiles"

ENV ZK_VERSION=3.4.13
ENV ZK_HOME=/opt/zookeeper-$ZK_VERSION

#COPY qemu-aarch64-static /usr/bin
RUN wget -P /usr/bin https://github.com/multiarch/qemu-user-static/releases/download/v7.2.0-1/qemu-aarch64-static

RUN set -x && \
    apk --update add bash && \
    apk --update add --virtual build-dependencies curl && \
    curl -s https://archive.apache.org/dist/zookeeper/zookeeper-$ZK_VERSION/zookeeper-$ZK_VERSION.tar.gz | tar -xzvf - -C /opt && \
    mv $ZK_HOME/conf/zoo_sample.cfg $ZK_HOME/conf/zoo.cfg && \
    sed  -i "s|/tmp/zookeeper|$ZK_HOME/data|g" $ZK_HOME/conf/zoo.cfg && \
    mkdir -p $ZK_HOME/data && \
    apk del build-dependencies && \
    rm -rf /var/cache/apk/*

WORKDIR /opt/zookeeper-$ZK_VERSION

EXPOSE 2181 2888 3888

CMD ["bin/zkServer.sh", "start-foreground"]
