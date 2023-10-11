ARG BASE_IMG=arm64v8/amazoncorretto:8-alpine-jre
FROM $BASE_IMG

ARG BUILD_DATE
ARG VCS_REF

# modified from https://github.com/fogsy-io/dockerfiles/blob/master/kafka/aarch64.Dockerfile
# but using a different JRE
# and getting qemu-aarch64-static from the web
# and with a modified fs/tmp/download-kafka to fix the download URL
# and a glibc apk fix 


LABEL io.fogsy.build-date=$BUILD_DATE \
      io.fogsy.license="Apache 2.0" \
      io.fogsy.organization="fogsy-io" \
      io.fogsy.url="https://fogsy.io/" \
      io.fogsy.vcs-ref=$VCS_REF \
      io.fogsy.vcs-type="Git" \
      io.fogsy.vcs-url="https://github.com/fogsy-io/dockerfiles"

ENV KAFKA_VERSION=2.2.2 \
    SCALA_VERSION=2.12 \
    KAFKA_HOME=/opt/kafka \
    GLIBC_VERSION=2.29-r0

ENV PATH=${PATH}:${KAFKA_HOME}/bin

# COPY qemu-aarch64-static /usr/bin
RUN wget -P /usr/bin https://github.com/multiarch/qemu-user-static/releases/download/v7.2.0-1/qemu-aarch64-static


COPY fs ./

RUN apk add --no-cache bash curl jq docker \
 && chmod a+x /tmp/*.sh \
 && mv /tmp/start-kafka.sh /tmp/broker-list.sh /tmp/create-topics.sh /tmp/versions.sh /usr/bin \
 && sync && /tmp/download-kafka.sh \
 && tar xfz /tmp/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz -C /opt \
 && rm /tmp/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz \
 && ln -s /opt/kafka_${SCALA_VERSION}-${KAFKA_VERSION} ${KAFKA_HOME} \
 && rm /tmp/* \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk \
 && apk add --force-overwrite --no-cache --allow-untrusted glibc-${GLIBC_VERSION}.apk \
 && rm glibc-${GLIBC_VERSION}.apk

VOLUME ["/kafka"]

# Use "exec" form so that it runs as PID 1 (useful for graceful shutdown)
CMD ["start-kafka.sh"]
