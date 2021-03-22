Project ..
Web configuration 
## Table of Contents
- [Updating to New Releases](#updating-to-new-releases)
- [Folder Structure](#folder-structure)
 - [Node](#node)
  - [npm start](#npm-start)
  - [Tools and technologies](#tools and technologies)
    - [](#tools and technologies)
- [Supported Browsers](#supported-browsers)
- [Installing a Dependency](#installing-a-dependency)
- 

## `Folder Structure`
```
REACT_BOILERPLATE/
  android/
  ios/
  README.md
  node_modules/
  package.json
  .babelrs
  .buckconfig
  .flowconfig
  public/
    index.html
    favicon.ico
  src/
    assets/
    configs/
    flux/
    actions/
    ui/
      components/
        mobile/
        web/
      containers/
        mobile/
        web/
      navigator/
      styles/
        mobile/
        web/
      theme/
        mobile/
        web/
    index.js
    registerServiceWorker.js
    web.history.js
    web.routes.js
  App.js
  App.json
  index.js
  
```
### `Requirements`
For development, you will only need Node.js installed on your environement. And please use the appropriate Editorconfig plugin for your Editor (not mandatory).

### `node`

Node is really easy to install & now include NPM. You should be able to run the following command after the installation procedure below.

$ node --version
v8.11.3

### `npm start`
$ npm install
$npm start
$ npm --version
5.6.0
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


 
### `Tools and technologies`


This project acts as a template for front-end application's using React and Redux, along with several other tools and technologies.

It embodies a rather extensive amount of research into this style of architecture and attempts to create an opinionated structure for building on. 

What's Being Used?

React for managing the presentation logic of your application.
(https://reactjs.org/)
react version 16.4

Redux for generating and managing your state model.
(https://redux.js.org/)
 version: "^5.0.7"
Portals for making AJAX calls to a server.

Babel for compiling ES2015+ down to ES5 compatible code. Additionally, this project is set up to support type checking using Flow syntax.
"version": "7.0.0-beta.51"


### `Material-UI`
Material-UI is available as an npm package.

With the components from the Material-UI library we used  Material Design elements in our React web aaplication.
By using the following command we’re making sure that the Material-UI library is installed:
$ npm install @material-ui/core 
The library’s website can be found at: https://material-ui.com
version : "^0.20.1"


### `new component`

create a new component on src folder and then route that folder to web.route.jsx file for routing components.

creating a new component by 
import new folder from src/components/ui/web/new folder
and then route the path  to  web.routes.jsx 
and import the component to web.route.jsx







