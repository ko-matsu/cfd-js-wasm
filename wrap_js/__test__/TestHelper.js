const fs = require('fs');

const sleep = (msec) => new Promise(
    (resolve) => setTimeout(resolve, msec));

class TestHelper {
  constructor() {
    this.cfdjsModule = require('../../index');
  }

  getResponse(result) {
    return Promise.resolve(result);
  };

  getCfdjs() {
    return this.cfdjsModule.getCfd();
  }

  initialized(func) {
    this.cfdjsModule.addInitializedListener(func);
  }

  hasLoadedWasm() {
    return this.cfdjsModule.hasLoadedWasm();
  }

  static doTest(keyName, fileName,
      createTestFunc = async(helper) => {},
      createCheckFunc = (helper) => {},
      hasExecTest = () => true,
      setupFunc = async() => { },
      teardownFunc = async() => { }) {
    const helper = new TestHelper();

    describe(keyName, () => {
      let cfd;
      const testTargets = [];
      const jsonObj = JSON.parse(fs.readFileSync(`${__dirname}/data/${fileName}.json`, 'utf8'));
      for (const data of jsonObj) {
        if (data && data.name) {
          if (data.name.startsWith(keyName)) {
            testTargets.push(data)
          }
        }
      }

      beforeAll(async () => {
        while (!helper.hasLoadedWasm()) { await sleep(100); }
        cfd = helper.getCfdjs();
      });

      for (const testData of testTargets) {
        if (!testData) continue;

        for (const testCase of testData.cases) {
          let testFunc = async () => { await sleep(100); };
          let testCheckFunc = () => {};
          const testCaseName = testData.name + ':' + testCase.case;

          if (!hasExecTest(testData.name)) {
            it.skip(testCaseName, () => { });
            continue;
          }

          beforeEach(async () => {
            // await Helper.waitInitialized();
            testFunc = createTestFunc(helper);
            testCheckFunc = createCheckFunc(helper);
            await setupFunc();
          });
          it(testCaseName, async () => {
            let resp;
            try {
              resp = await testFunc(cfd, testData.name, testCase.request, testCase.error);
            } catch (e) {
              if (testCase.error && e.getErrorInformation) {
                const info = e.getErrorInformation();
                resp = info.message;
              } else {
                throw e;
              }
            }
            testCheckFunc(resp, testCase.expect, testCase.error)
          });
          afterEach(async () => {
            await teardownFunc();
          });
        }
      }
    });
  }
}

module.exports = TestHelper;
