# CasperGo Version 1.0.1

This repository is the base for the CasperGo Version of the LetsGo Mobile Wallet Platform, customized and White-labeled for Casper.

## How to install

### Make Mongo Atlas Cluster

1. Go to [MongoDB](#https://www.mongodb.com/) and create a new server cluster.

### Setup Servers

#### Coin Servers

1.  DIVI, BTC, CSPR

    1.  [Install Base Server Software](#how-to-install-server-software)
		1. Follow the instructions here: [Install Base Server Software](#how-to-install-server-software)
    	2. [Install DIVI block monitors](#how-to-install-divi-daemon)
    	3. [Install BTC block monitors](#how-to-install-btc-daemon)
    2.  [Install Base Server Software](#how-to-install-server-software)
		1. Follow the instructions here: [Install Base Server Software](#how-to-install-server-software)
    	2. [Install CSPR block monitors](#how-to-install-cspr-software)
	3. [Install Repository and Start Services](#how-to-install-repository-and-start-services)

#### Management

1.  Communication

    1.  [Install Base Server Software](#how-to-install-server-software)

### How To Install Server Software

Setup a new Ubuntu Server and follow the steps below to follow the initial installation of the services.

#### Step 1:

Change the SSH Port Number, open an SSH connection to the server and edit the following file. You need to locate the line in the file, "#Port 22" and then uncomment (By removing the leading # character) it and change the value with a private port number (for example, 2178)

##### Nano

```bash
nano /etc/ssh/sshd_config
```

##### VIM

```bash
vim /etc/ssh/sshd_config
```

#### Step 2:

Open an SSH connection to the server and run the following command which will set a server name as the localhost on the server.

Note: You must replace WEBHOST.COM with the domain name chosen for this service.

```bash
echo "WEBHOST.COM" > /etc/hostname
```

#### Step 3:

Open an SSH connection to the server and run the following command which will install base software for supporting services and reboot the server.

```bash
apt update ; apt -y upgrade ; apt -y autoremove ; apt install -y nodejs npm certbot nginx python3-certbot-nginx git ; npm install -g pm2 ; pm2 startup ; reboot
```

### How to Install DIVI Daemon

This process will allow the installation the DIVI UXTO Block Monitor base software on a Ubuntu Server.

#### Step 1: Ensure Base Software has been Installed

Follow the instructions in the How to Install Base Software here: [Install Base Server Software](#how-to-install-server-software)

#### Step 2: Install DIVI Daemon

Visit the [Divi Project Github Releases Page](https://github.com/DiviProject/Divi/releases) and dowload the most recent version. At the time of this document, the latest release version is [2.5.1](https://github.com/DiviProject/Divi/releases/tag/v2.5.1). Right-click on the divi-.......-x86_64-linux.tar.gz in the Assets section and click Copy Link Address. The link address you copy will be used in the second step, so ensure this is saved in a location to be used.

##### Step 2.a: Download Daemon

Using CURL or WGET, download the latest release of the DIVI Daemon

###### CURL

Use the download link from the process above, not the one below.

```bash
curl -o diviDaemon.tar.gz https://github.com/DiviProject/Divi/releases/download/v2.5.1/divi-2.5.1-x86_64-linux.tar.gz
```

###### WGET

Use the download link from the process above, not the one below.

```bash
wget -O diviDaemon.tar.gz https://github.com/DiviProject/Divi/releases/download/v2.5.1/divi-2.5.1-x86_64-linux.tar.gz
```

##### Step 2.b: Install Daemon

The process to install the daemon and create it as an automated service is defined in the following steps.

###### Step 2.b.i: Untar File Contents

Open an SSH connection to the server and run the following command which will untar (similar to unzipping) the file contents of the daemon.

```bash
tar xzf diviDaemon.tar.gz
```

###### Step 2.b.ii: Install to the File System

Please replace the 'divi-2.5.1' directory with the one generated from the untaring of the file in Step 2.b.i.

```bash
install -m 0755 -o root -g root -t /usr/local/bin divi-2.5.1/bin/*
```

###### Step 2.b.iii: Set RPC Credentials and Configuration Settings

The first step is to provide security in the generation of the usernames as well as the passwords used for RPC communication between the services. This SECURITY should include a chain-of-custody to endusure it's continued security.

At the time of the generation of this document a good source for generation of secure passwords should apply https://passwordsgenerator.net/ . The use of the website is NOT recommended; notwithstanding the methods employed provide a good example of user and password security generation.

Generate a SECURE Username and SECURE Password for RPC communication between the server platforms. It is preferrable to have this installed on a LAN (Local Area Network) to prevent outside interferance; however, it will work on a WAN (Wide Area Network) as well.

A divi.conf file should be created in the location where the divi configuration files will live.

In this example, the DATA DIRECTORY for Divi Services will be /divi/data whereas in individual installations, this will change.

Example File divi.conf:

```
rpcuser=diviRPC-SECUREUsername
rpcpassword=diviRPC-SECUREPassword
rpcport=diviRPC-SECUREPort
rpcallowip=127.0.0.1
rpcconnect=127.0.0.1
maxconnections=256
server=1
daemon=1
txindex=1
addressindex=1
spentindex=1
stakesplitthreshold=20000
addnode=128.199.72.142
addnode=143.110.252.126
addnode=165.227.93.88
addnode=178.128.33.249
addnode=157.245.10.156
addnode=143.110.244.228
addnode=134.209.216.10
addnode=159.89.5.207
addnode=143.110.244.244
addnode=143.110.165.51
addnode=138.197.186.68
addnode=134.209.168.71
addnode=139.59.224.202
addnode=167.71.235.210
addnode=161.35.51.136
addnode=68.183.39.1
addnode=46.101.170.109
addnode=104.131.22.187
addnode=143.110.185.236
addnode=167.172.61.49
addnode=104.131.70.164
addnode=206.189.135.132
addnode=159.65.117.221
addnode=104.131.69.16
addnode=167.71.136.38
addnode=104.131.78.66
addnode=64.225.7.91
addnode=104.131.172.252
addnode=143.110.252.33
addnode=143.110.162.43
addnode=104.131.175.18
addnode=134.209.217.25
addnode=68.183.213.114
addnode=167.172.22.183
addnode=46.101.156.85
addnode=209.97.191.198
addnode=139.59.0.221
addnode=204.48.18.130
addnode=206.189.94.56
addnode=142.93.32.236
```

Edit the file as your system is setup.

###### Nano

```bash
nano /divi/data/divi.conf
```

###### VIM

```bash
vim /divi/data/divi.conf
```

###### Step 2.b.iv: Setup to Start as a Service

To confirm that the daemon will be running after a restart as well as after a common error, we will setup the daemon to run as a system service. Editing this file to reflect the correct local location of the DIVI Data Directory will be an immediate solution for a successful install.

Example divid.service file:

```
[Unit]

Description=DIVI daemon
After=network.target

[Service]

Type=forking

ExecStart=/usr/local/bin/divid -daemon -conf=/divi/data/divi.conf -datadir=/divi/data/

ExecStop=-/usr/local/bin/divid-cli -conf=/divi/data/divi.conf -datadir=/divi/data/ stop

Restart=always
PrivateTmp=true
TimeoutStopSec=60s
TimeoutStartSec=2s
StartLimitInterval=120s
StartLimitBurst=5

[Install]

WantedBy=multi-user.target
```

You will need to install this as a service file in the systemd directory in Ubuntu. Edit the file as your system is setup.

###### Nano

```bash
nano /etc/systemd/system/divid.service
```

###### VIM

```bash
vim /etc/systemd/system/divid.service
```

After Adding the file, you will need to reload the daemon for the system and setup the daemon to automatically restart with the reboot of the Operating System.

```bash
systemctl daemon-reload
systemctl enable divid
```

###### Step 2.b.v: Reboot the Server

```bash
reboot
```

###### Step 2.b.vi: Monitor the Installation and the Syncing with the Blockchain

When the system has rebooted you can run the following commmand to see the current block count the daemon is synced to.

```bash
/usr/local/bin/divi-cli -conf=/divi/data/divi.conf -datadir=/divi/data/ getblockcount
```

### How to Install BTC Daemon

This process will allow the installation the Bitcoin UXTO Block Monitor base software on a Ubuntu Server.

#### Step 1: Ensure Base Software has been Installed

Follow the instructions in the How to Install Base Software here: [Install Base Server Software](#how-to-install-server-software)

#### Step 2: Install Bitcoin Daemon

Visit the [Bitcoin Daemon Download Page](https://bitcoin.org/en/download) and dowload the most recent version. At the time of this document, the latest release version is [22.0](https://bitcoin.org/bin/bitcoin-core-22.0/bitcoin-22.0-x86_64-linux-gnu.tar.gz). Right-click on the Linux (...linux-gnu-tar.gz) in the left column and click Copy Link Address. The link address you copy will be used in the second step, so ensure this is saved in a location to be used.

##### Step 2.a: Download Daemon

Using CURL or WGET, download the latest release of the Bitcoin Daemon

###### CURL

Use the download link from the process above, not the one below.

```bash
curl -o btcDaemon.tar.gz https://bitcoin.org/bin/bitcoin-core-22.0/bitcoin-22.0-x86_64-linux-gnu.tar.gz
```

###### WGET

Use the download link from the process above, not the one below.

```bash
wget -O btcDaemon.tar.gz https://bitcoin.org/bin/bitcoin-core-22.0/bitcoin-22.0-x86_64-linux-gnu.tar.gz
```

##### Step 2.b: Install Daemon

The process to install the daemon and create it as an automated service is defined in the following steps.

###### Step 2.b.i: Untar File Contents

Open an SSH connection to the server and run the following command which will untar (similar to unzipping) the file contents of the daemon.

```bash
tar xzf btcDaemon.tar.gz
```

###### Step 2.b.ii: Install to the File System

Please replace the 'bitcoin-22.0' directory with the one generated from the untaring of the file in Step 2.b.i.

```bash
install -m 0755 -o root -g root -t /usr/local/bin bitcoin-22.0/bin/*
```

###### Step 2.b.iii: Set RPC Credentials and Configuration Settings

The first step is to provide security in the generation of the usernames as well as the passwords used for RPC communication between the services. This SECURITY should include a chain-of-custody to endusure it's continued security.

At the time of the generation of this document a good source for generation of secure passwords should apply https://passwordsgenerator.net/ . The use of the website is NOT recommended; notwithstanding the methods employed provide a good example of user and password security generation.

Generate a SECURE Username and SECURE Password for RPC communication between the server platforms. It is preferrable to have this installed on a LAN (Local Area Network) to prevent outside interferance; however, it will work on a WAN (Wide Area Network) as well.

A bitcoin.conf file should be created in the location where the bitcoin configuration files will live.

In this example, the DATA DIRECTORY for Divi Services will be /bitcoin/data whereas in individual installations, this will change.

Example File bitcoin.conf:

```
rpcuser=btcRPC-SECUREUsername
rpcpassword=btcRPC-SECUREPassword
rpcport=btcRPC-SECUREPort
server=1
txindex=1
maxconnections=256
addresstype=legacy
changetype=legacy
deprecatedrpc=signrawtransaction
rpcallowip=127.0.0.1
rpcbind=127.0.0.1
rpcbind=127.0.0.1
```

Edit the file as your system is setup.

###### Nano

```bash
nano /bitcoin/data/bitcoin.conf
```

###### VIM

```bash
vim /bitcoin/data/bitcoin.conf
```

###### Step 2.b.iv: Setup to Start as a Service

To confirm that the daemon will be running after a restart as well as after a common error, we will setup the daemon to run as a system service. Editing this file to reflect the correct local location of the Bitcoin Data Directory will be an immediate solution for a successful install.

Example bitcoind.service file:

```
[Unit]

Description=BTC daemon
After=network.target

[Service]

Type=forking

ExecStart=/usr/local/bin/bitcoind -daemon -conf=/bitcoin/data/bitcoin.conf -datadir=/bitcoin/data/

ExecStop=-/usr/local/bin/bitcoind-cli -conf=/bitcoin/data/bitcoin.conf -datadir=/bitcoin/data/ stop

Restart=always
PrivateTmp=true
TimeoutStopSec=60s
TimeoutStartSec=2s
StartLimitInterval=120s
StartLimitBurst=5

[Install]

WantedBy=multi-user.target
```

You will need to install this as a service file in the systemd directory in Ubuntu. Edit the file as your system is setup.

###### Nano

```bash
nano /etc/systemd/system/bitcoind.service
```

###### VIM

```bash
vim /etc/systemd/system/bitcoind.service
```

After Adding the file, you will need to reload the daemon for the system and setup the daemon to automatically restart with the reboot of the Operating System.

```bash
systemctl daemon-reload
systemctl enable bitcoind
```

###### Step 2.b.v: Reboot the Server

```bash
reboot
```

###### Step 2.b.vi: Monitor the Installation and the Syncing with the Blockchain

When the system has rebooted you can run the following commmand to see the current block count the daemon is synced to.

```bash
/usr/local/bin/bitcoin-cli -conf=/bitcoin/data/bitcoin.conf -datadir=/bitcoin/data/ getblockcount
```

### How to Install CSPR Block Monitor

TBD in Milestone 2

### How to Install Repository and Start Services

To install this repository and the services completely, there are a few steps which need to be followed to ensure continuity in the platform which is self-sustaining and designed to be auto-updatable.

#### Step 1: Chose a local directory to run the service

To start the install we need a local directory to run the services as well as a public URL. Please ensure to have these two variables before continuing setup to point to the server as well as ensure the local directory is empty or the Github Clone command will not complete. The domain name will be called DOMAIN_NAME and the local directory will be called LOCAL_DIRECTORY and PRIVATE_PORT will be used to define the internal systems private port number.

#### Step 2: Generate an SSH Key and add to Github.com

Open an SSH connection to the server and run the following command which will generate an SSH Key for the repository on the server. This SSH Key cannot be repeated in GitHub.

##### Step 2.a: Pick a short name

Pick a short name to identify the SSH Key and SSH Key File. In this example we will call it caspergo

```bash
ssh-keygen -f ~/.ssh/caspergo -N "" -t ed25519 -C "caspergo"
echo -e "Host github.com-caspergo\n  Hostname github.com\n  IdentityFile=~/.ssh/caspergo\n\n" >> ~/.ssh/config
cat ~/.ssh/caspergo.pub
```

##### Step 2.b: Add SSH Public Key to Github

Using your web browser, navigate to the github.com homepage for the repository you are using clicking here [Direct Link](https://github.com/CasperGoApp/Chat-Bot-API/settings/keys) or click Settings => Deploy Keys and add the public key previously created (and printed with the cat command).

##### Step 2.c: Clone and Intall Repository from Github

Open an SSH connection to the server and run the following command which will clone the repository from Github.com and install the necessary NodeJS Dependancies.

```bash
rm -rf /LOCAL_DIRECTORY
mkdir /LOCAL_DIRECTORY/
cd /LOCAL_DIRECTORY/
git clone git@github.com-caspergo:CasperGoApp/Chat-Bot-API . ; npm i
```

##### Step 2.d: Setup the Domain Name for NGINX

Setup the NGINX Server to support the service which is installed.

Example /etc/nginx/sites-available/default (Port PRIVATE_PORT will be determined by the .env file explained in Section 2.d -> Setup Environment Variables):

```
upstream backend {
        server 127.0.0.1:PRIVATE_PORT;
}
server {
        listen 80;
        listen [::]:80;
        server_name caspergo.lg.cr;
        root /LOCAL_DIRECTORY/;
        index index.html;
        return 301 DOMAIN_NAME;
}
server {
        listen 443;
        listen [::]:443;
        ssl on;
        ssl_certificate /etc/letsencrypt/live/DOMAIN_NAME/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/DOMAIN_NAME/privkey.pem;
        server_name DOMAIN_NAME;
        root /LOCAL_DIRECTORY/html/;
        index index.html;
        location / {
                try_files $uri $uri/ @backend;
        }
        location @backend {
                proxy_pass http://backend;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```

Restart the NGINX service

```bash
systemctl restart nginx
```

##### Step 2.e: Setup the Domain Name for NGINX

Setup Certbot to provide SSL to the domain name as well as automatic SSL updates.

```bash
sudo certbot --nginx -d DOMAIN_NAME
```

### Step 2.d: Start Automated Processes

The initalization of automated processes will insure services will function as required.

#### Setup Environment Variables

Set the envirnment variables in an .env file using the following example, changing it for your implementation.

```
BTC_RPC_USER=btcRPC-SECUREUsername
BTC_RPC_PASSWORD=btcRPC-SECUREPassword
BTC_RPC_HOST=127.0.0.1
BTC_NETWORK_TYPE=main
BTC_MAX_TX=10000
DIVI_RPC_USER=diviRPC-SECUREUsername
DIVI_RPC_PASSWORD=diviRPC-SECUREPassword
DIVI_RPC_HOST=127.0.0.1
DIVI_NETWORK_TYPE=main
DIVI_MAX_TX=10000
NETWORK_NAMES=["btc", "divi"]
POST_TX_TO=https://DOMAIN_NAME/gotTX
REPO_ID=111111111
REPO_NAME=CasperGoApp/Chat-Bot-API
REPO_ROOT=/LOCAL_DIRECTORY
WALLET_ADDRESSES_TO_LOAD=20
WALLET_ADDRESSES_TO_CHECK=3
MONGO_ATLAS=true
MONGO_DBNAME=DB
MONGO_URL=URL_HERE
MONGO_USER=USER
MONGO_PASS=PASS
MONGO_TIMEOUT=20000
EMAIL_SERVER=email.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=USER
EMAIL_PASS=PASS
SERVER_PORT=80
SERVER_NAME=website.com
ALLOWED_TX_IPS=127.0.0.1,127.0.0.2
BASE_URL=https://caspergo.com/
SOURCE_NUMBER=12345
```

You will need to edit this file as specificed.

###### Nano

```bash
nano /LOCAL_DIRECTORY/.env
```

###### VIM

```bash
vim /LOCAL_DIRECTORY/.env
```

#### Step 2.e: Connect Watch Addresses

Start by adding a JSON file for the address list. Update this file then add an update to [coin name].updateAddressList to trigger a reload before processing.

```bash
echo '[]' > /LOCAL_DIRECTORY/blockMonitor/src/divi.addressList
echo '[]' > /LOCAL_DIRECTORY/blockMonitor/src/btc.addressList
```

#### Step 2.f: Start Processes in PM2

```bash
pm2 start /LOCAL_DIRECTORY/blockMonitor/src/server.js
pm2 start /LOCAL_DIRECTORY/src/server.js
pm2 save
```

#### Step 3: Reboot Server and Monitor Progress

Run the following command and monitor the progress of the system.


```bash
reboot
```

### How to Update the Block Monitor Lists in Real-Time

Updating the block monitor lists will help the system ensure you are providing real-time updates of data to users.

```bash
echo '["n23VWwBSXuhAhhZGWUmsN1LjGnQjpfcSPe","mupDDcsJ69HaBohZMEtqPoZNWo3SpK3dQJ","mzvd7Q6yTiSQ6Wq7BaadaoE5JxZUHMJiND","mx9cxF8TCtFfBEmQwjE84UewRJbQki53Gu"]' > /LOCAL_DIRECTORY/src/btc.addressList
echo '1' > /LOCAL_DIRECTORY/blockMonitor/src/btc.updateAddressList
```

##### Step 2.f: Set Webhook for Auto Deployment from Github

Using your web browser, navigate to the github.com homepage for the repository you are using clicking here [Direct Link](https://github.com/CasperGoApp/Chat-Bot-API/settings/hooks) or click Settings => Webhooks and add the URL: DOMAIN_NAME/ghUD

## How to Test

Start and run the services as specified and then run the following command to monitor output and possible issues / errors:

```bash
pm2 logs
```

## Acknowledgments

| Name | Link |
| ---- | ----- |
| node-fetch | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API |
| bip32 | https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki |
| crypto | https://node.readthedocs.io/en/latest/api/crypto/ |
| speakeasy | https://github.com/speakeasyjs/speakeasy/tree/cff2bb42cde5e74c43493a8f26b20e52960df531 |
| bitcoinjs-lib | https://github.com/bitcoinjs/bitcoinjs-lib |
| gnodejs | https://github.com/GnomeGroup/gnodejs |
| qr-image | https://github.com/alexeyten/qr-image |
| dotenv | https://github.com/motdotla/dotenv |
| mime-kind | https://github.com/strikeentco/mime-kind |
| gnome-wallet-address-validator | https://github.com/GnomeGroup/altcoin-address |
| json-as-xlsx | https://github.com/LuisEnMarroquin/json-as-xlsx |
| form-data | https://github.com/form-data/form-data |
| gmongo | https://github.com/GnomeGroup/gmongo |