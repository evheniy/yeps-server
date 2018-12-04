const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const pem = require('pem');
const server = require('..');

chai.use(chaiHttp);

const { expect, request } = chai;

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

  const stopServer = srv => new Promise(r => srv.close(r));

  it('should test http server', async () => {
    let isTestFinished = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const srv = server.createHttpServer(app);

    await request(srv)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    await stopServer(srv);

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

    await request(srv)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    await stopServer(srv);

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

    process.emit('SIGTERM');

    await stopServer(srv);

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

      request(srv)
        .get('/')
        .send()
        .end((e, res) => {
          expect(e).to.be.null;
          expect(res).to.have.status(200);

          isTestFinished = true;

          expect(isTestFinished).is.true;

          srv.close(() => done());
        });
    });
  });
});
