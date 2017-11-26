# YEPS server

It helps to run YEPS app as node.js server

[![NPM](https://nodei.co/npm/yeps-server.png)](https://npmjs.org/package/yeps-server)

[![npm version](https://badge.fury.io/js/yeps-server.svg)](https://badge.fury.io/js/yeps-server)
[![Build Status](https://travis-ci.org/evheniy/yeps-server.svg?branch=master)](https://travis-ci.org/evheniy/yeps-server)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-server/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-server?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-server/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-server/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-server)

[![Dependency Status](https://david-dm.org/evheniy/yeps-server.svg)](https://david-dm.org/evheniy/yeps-server)
[![devDependency Status](https://david-dm.org/evheniy/yeps-server/dev-status.svg)](https://david-dm.org/evheniy/yeps-server#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-server)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-server/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-server.svg)](https://github.com/evheniy/yeps-server/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-server.svg)](https://github.com/evheniy/yeps-server/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-server.svg)](https://github.com/evheniy/yeps-server/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-server.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-server
  

## How to use

    const App = require('yeps');
    
    const server = require('yeps-server');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    
    const app = new App();
    
    app.all([,
      error(),
      logger(),
    ]);
    
### Run server
    
    server.createHttpServer(app);
    
### Run with ssl/tls

    const options = {
        key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
        cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem'))
    };
        
    server.createHttpsServer(options, app);
    
### With pem

    npm i -S pem
    
#### app.js

    const App = require('yeps');
    const server = require('yeps-server');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    
    const pem = require('pem');
        
    const app = new App();
        
    app.all([,
        error(),
        logger(),
    ]); 
    
    const days = 1;
    const selfSigned = true;
    
    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
        if (err) {
            throw err;
        }
        server.createHttpsServer({ key, cert }, app);
    });
    

#### [YEPS documentation](http://yeps.info/)
