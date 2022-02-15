const TestHelper = require('./JsonTestHelper');

const createTestFunc = (helper) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (cfd, testName, req, isError) => {
    let resp;
    switch (testName) {
    case 'Extkey.GetExtPubkey':
      if (req.file) {
        const tests = require('./data/' + req.file)['tests'];
        const result = [];
        for (const testData of tests) {
          const request = {
            extkey: testData.chain.extPrivkey,
            network: testData.network,
          };
          resp = cfd.CreateExtPubkey(request);
          resp = await helper.getResponse(resp);
          result.push(resp);
        }
        resp = {testName, result};
      } else {
        resp = cfd.CreateExtPubkey(req);
        resp = await helper.getResponse(resp);
      }
      break;
    case 'Extkey.DerivePrivkeyFromSeed':
      if (req.file) {
        // FIXME not implements
        // resp = cfd.CreateExtkeyFromSeed(req);
      }
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.DerivePubkeyFromSeed':
      if (req.file) {
        // FIXME not implements
        // resp = cfd.DerivePubkeyFromSeed(req);
      }
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.CreateExtkeyFromParent':
      resp = cfd.CreateExtkeyFromParent(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.CreateExtkeyFromParentPath':
      resp = cfd.CreateExtkeyFromParentPath(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.GetExtkeyInfo':
      resp = cfd.GetExtkeyInfo(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.CreateExtkey':
      resp = cfd.CreateExtkey(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.CreateExtkeyFromParentKey':
      resp = cfd.CreateExtkeyFromParentKey(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.GetExtkeyPathData':
      // FIXME not implements cfd-js.
      // resp = cfd.GetExtkeyPathData(req);
      // resp = await helper.getResponse(resp);
      break;
    case 'Extkey.GetPrivkeyFromExtkey':
      resp = cfd.GetPrivkeyFromExtkey(req);
      resp = await helper.getResponse(resp);
      break;
    case 'Extkey.GetPubkeyFromExtkey':
      resp = cfd.GetPubkeyFromExtkey(req);
      resp = await helper.getResponse(resp);
      break;
    default:
      throw new Error('unknown name: ' + testName);
    }
    return resp;
  };
};

const hasExecTest = (testName) => {
  if ((testName == 'Extkey.GetExtkeyPathData') ||
      (testName == 'Extkey.DerivePubkeyFromSeed') ||
      (testName == 'Extkey.DerivePrivkeyFromSeed')) {
    return false;
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCheckFunc = (helper) => {
  return (resp, exp, errorData) => {
    if (errorData) {
      const errMsg = TestHelper.getErrorMessage(errorData);
      expect(resp).toEqual(errMsg);
      return;
    }
    if (exp.file) {
      if (resp.testName && (resp.testName == 'Extkey.GetExtPubkey')) {
        const tests = require('./data/' + exp.file)['tests'];
        for (const index in tests) {
          if (tests[index]) {
            const expData = tests[index];
            const respData = resp.result[index];
            expect(respData.extPubkey).toEqual(expData.extkey);
          }
        }
      }
      // FIXME not implement
    } else {
      expect(JSON.stringify(resp)).toEqual(JSON.stringify(exp));
    }
  };
};

TestHelper.doTest(
  'Extkey', 'hdwallet_test', createTestFunc, createCheckFunc, hasExecTest);
