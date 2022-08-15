# A Newsmax caption scraper using TVKitchen

To run this you need Node 16.x and Docker installed locally.

## Developing

If you want to run this locally you can do so:

1. Clone the repository
2. `yarn install`
3. `yarn start:kafka`
4. `yarn start` 

## Setup

You need to populate some environment variables in order for S3 uploading to work:

```
cp .env.template .env
edit .env
```

AWS authentication should be provided using one of the methods [described in the AWS documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)

## Using Docker

Alternatively you can run the entire application within Docker using [Docker Compose](https://docs.docker.com/compose/).

1. Clone the repository
2. `docker-compose up`

This will create zookeeper, kafka, and newsmax docker images.
