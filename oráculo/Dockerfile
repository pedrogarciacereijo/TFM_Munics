FROM python:3.8-alpine

COPY . /app
WORKDIR /app

RUN apk add gcc go git make curl wget go-ipfs

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Instala las dependencias necesarias para ejecutar el nodo en Python3
RUN pip3 install -r requirements.txt 

RUN chmod +x script.sh
CMD ./script.sh
