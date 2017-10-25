const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const pause = require('promise-pause-timeout');
const pem = require('pem');
const server = require('..');

const { expect } = chai;

chai.use(chaiHttp);
let app;
const { exit } = process;

describe('YEPS server', async () => {
  beforeEach(() => {
    app = new App();
    app.then(error());
    Object.defineProperty(process, 'exit', {
      value: () => {
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(process, 'exit', {
      value: exit,
    });
  });

  it('should test http server', async () => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const srv = server.createHttpServer(app);

    await chai.request(srv)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    srv.close();

    expect(isTestFinished).is.true;
  });

  it('should test https server', async () => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const options = {
      key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
      cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem')),
    };
    const srv = server.createHttpsServer(options, app);

    await chai.request(srv)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    srv.close();

    expect(isTestFinished).is.true;
  });

  it('should test http server with error', async () => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    Object.defineProperty(process, 'exit', {
      value: () => {
        isTestFinished = true;
      },
    });

    const srv = server.createHttpServer(app);

    server.createHttpServer(app);

    process.emit('SIGTERM');

    srv.close();

    await pause(10);

    expect(isTestFinished).is.true;
  });

  it('should test https server with pem', (done) => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }
      const srv = server.createHttpsServer({ key, cert }, app);

      chai.request(srv)
        .get('/')
        .send()
        .end((e, res) => {
          expect(e).to.be.null;
          expect(res).to.have.status(200);

          isTestFinished = true;

          srv.close();

          expect(isTestFinished).is.true;
          done();
        });
    });
  });
});
