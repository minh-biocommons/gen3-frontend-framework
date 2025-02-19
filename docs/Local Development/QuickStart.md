# Gen3.2 Frontend Quickstart

This guide will get you up to speed on configuring a Gen3 Frontend Applications. There are other tutorial on running it locally (for example: (Local Development)[]).

## Getting Started
Gen3 Data Commons using the Gen3 Frontend Framework is a matter of the following:

* create a clone of [Gen3 Data Commons Application](https://github.com/uc-cdis/commons-frontend-app/)

* Configure the commons by editing the configuration files in the ```config``` directory.

* Add your pages and content

* Deploy via helm charts or Docker.

Changes to the Gen3 Data Commons Application can be pulled from the Common Frontend Repository. You need configure git to pull from the Common Frontend Repository.
```bash
git remote add upstream https://github.com/uc-cdis/commons-frontend-app.git
```
or
```bash
git remote add upstream git@github.com:uc-cdis/commons-frontend-app.git
```

changes to ```main``` can be pulled from the Common Frontend Repository by running:
```bash
git pull upstream main
```

Please see [Styling and Theming](https://github.com/uc-cdis/gen3-frontend-framework/blob/develop/docs/Local%20Development/Styling%20and%20Theming.md) and [Local Development with Helm Charts](https://github.com/uc-cdis/gen3-frontend-framework/blob/develop/docs/Local%20Development/Using%20Helm%20Charts/Local%20Development%20with%20Helm%20Charts.md)
for more information on setting up and configuring the Gen3 Data Commons Application.
This documentation is currently less complete than we would like, but we will be adding to it as development progresses.

## Installation

The minimum node version is set to v20.11.0 only from an LTS perspective.
Node can be downloaded from the official Node.js site. You may also consider using a [Node version manager](https://docs.npmjs.com/cli/v7/configuring-npm/install#using-a-node-version-manager-to-install-nodejs-and-npm).
Your version of Node may not ship with npm v10. To install it, run:

```bash
npm install npm@10.2.4 -g
```

Note: if you see this error:
```
npm ERR! code ENOWORKSPACES
npm ERR! This command does not support workspaces.
```
you can run ```npx next telemetry disable```

Alternatively, you can use `nvm` to install the correct version of npm:
```bash
nvm install 20.11.0
```

### Install Dependencies

From the root of the project, install dependencies by running:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Docker

You build a Docker image by:

```bash
docker build .
```
## Configuration

In the root of the app's source code there are .env files:

```.env.development``` and ```.env.production```.  The format is:
```
GEN3_COMMONS_NAME=gen3
NEXT_PUBLIC_GEN3_API=https://localhost:3010
```

These set what config directory is used ```GEN3_COMMONS_NAME``` and where the endpoints are running. The defaults are ```gen3``` and https://localhost. If you are running in helm charts the only value to set is ```GEN3_COMMONS_NAME```.

The site is configured in the directory ```config/$GEN3_COMMONS_NAME```. There is a .json file for each of the Gen3 pages. For example the Discovery page is configure in ```discovery.json```. Note that currently the file must exist if the page will be used. You can disable a page by removing the associated file.
