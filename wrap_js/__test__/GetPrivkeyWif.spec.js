const TestHelper = require('./TestHelper');

const hasExecTest = (testName) => {
  switch (testName) {
    case 'Privkey.AddTweak':
    case 'Privkey.MulTweak':
    case 'Privkey.Negate':
      return false;
    default:
      return true;
  }
};

const createTestFunc = (helper) => {
  return async(cfd, testName, req, isError) => {
    let resp;
    switch (testName) {
      case 'Privkey':
        if (req.wif) {
          resp = cfd.GetPrivkeyFromWif(req);
          resp = await helper.getResponse(resp);
          resp = {...req, ...resp};
        } else {
          const reqData = req;
          reqData['isCompressed'] = req.is_compressed;
          resp = cfd.GetPrivkeyWif(reqData);
          resp = await helper.getResponse(resp);
          resp = {...req, ...resp};
        }
        break;
      case 'Privkey.CalculateEcSignature':
        const reqData = {
          sighash: req.sighash,
          privkeyData: {
            privkey: req.hex,
            wif: false,
          },
          isGrindR: req.grind_r,
        };
        resp = cfd.CalculateEcSignature(reqData);
        resp = await helper.getResponse(resp);
        resp = {...req, ...resp};
        break;
      case 'Privkey.AddTweak':
      case 'Privkey.MulTweak':
      case 'Privkey.Negate':
        break;
      default:
        throw new Error('unknown name: ' + testName);
    }
    return resp;
  };
};

const createCheckFunc = (helper) => {
  return (resp, exp, isError) => {
    if (isError) {
      expect(exp.json).toEqual(resp);
      return
    }
    if (exp.wif) expect(resp.wif).toEqual(exp.wif);
    if (exp.hex) expect(resp.hex).toEqual(exp.hex);
    if (exp.network) expect(resp.network).toEqual(exp.network);
    if (exp.is_compressed) expect(resp.isCompressed).toEqual(exp.is_compressed);
    if (exp.signature) expect(resp.signature).toEqual(exp.signature);
  };
};

TestHelper.doTest('Privkey', 'key_test', createTestFunc, createCheckFunc, hasExecTest);
