# vamoslac-react-app

Previous: install react native enviroment https://reactnative.dev/

1. `git clone https://github.com/fundhuesped/vamoslac-react-app`

2. `cd vamoslac-react-app`

3. Install the specified Node version in `.nvmrc` file manually or using nvm
	`nvm install`

4.install dependencies
	`npm i`

5. `npm install --save-dev jetifier`

6. `npx jetify`

For testing app

open a simulator or connect your usb device

* open a console and run `npm start`

* open another console and run `npm run android`


For build a release apk

* run `cd android && ./gradlew assembleRelease -x bundleReleaseJsAndAssets`|

