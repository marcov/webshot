################################################################################
#
# webshot container
#
FROM ubuntu:18.04

RUN apt-get -y update; \
    \
    DEBIAN_FRONTEND=noninteractive apt-get -yq install \
      bash \
      curl

RUN \
    curl -O -fL https://github.com/fg2it/phantomjs-on-raspberry/raw/master/rpi-2-3/wheezy-jessie/v2.1.1/phantomjs_2.1.1_armhf.deb \
    ; \
    curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN DEBIAN_FRONTEND=noninteractive apt-get -yq install \
      ./phantomjs_2.1.1_armhf.deb \
      nodejs \
      ; \
    apt-get clean\
    ; \
    rm -rf /var/lib/apt/lists ./phantomjs_2.1.1_armhf.deb

COPY . /webshot

RUN cd /webshot; npm install
