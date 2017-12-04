# Introduction

Dockerfile and scripts for creating image with Cron based on node:alpine.  Inspired by
[xordiv/docker-alpine-cron](https://github.com/xordiv/docker-alpine-cron).

#### Send job to rabbitmq for processing


#### Environment variables:

CRON_STRINGS - strings with cron jobs. Use "\n" for newline (Default: undefined)   
CRON_TAIL - if defined cron log file will read to *stdout* by *tail* (Default: undefined)   
By default cron running in foreground  

#### Cron files
- /etc/cron.d - place to mount custom crontab files  

When image will run, files in */etc/cron.d* will copied to */var/spool/cron/crontab*.   
If *CRON_STRINGS* defined script creates file */var/spool/cron/crontab/CRON_STRINGS*  

#### Log files
Log file by default placed in /var/log/cron/cron.log

#### Simple usage:
```
docker run --name="alpine-cron-sample" -d \
-v /path/to/app/conf/crontabs:/etc/cron.d \
-v /path/to/app/scripts:/scripts \
xordiv/docker-alpine-cron
```

#### With scripts and CRON_STRINGS
```
docker run --name="alpine-cron-sample" -d \
-e 'CRON_STRINGS=* * * * * root /scripts/myapp-script.sh'
-v /path/to/app/scripts:/scripts \
xordiv/docker-alpine-cron
```

#### Get URL by cron every minute
```
docker run --name="alpine-cron-sample" -d \
-e 'CRON_STRINGS=* * * * * root wget https://sample.dockerhost/cron-jobs'
xordiv/docker-alpine-cron
```

#### TODO
- (read msg from cron queue / async create new every 1 sec or imidiatly) ?
- read cron endpoint, read created queue msg jobs for workers based on time.
