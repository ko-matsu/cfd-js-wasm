const TestHelper = require('./JsonTestHelper');

const convertToMnemonic = (mnemonic) => {
  const result = [];
  mnemonic.forEach((word) => result.push(word.normalize('NFKD')));
  return result;
};

const createTestFunc = (helper) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (cfd, testName, req, isError) => {
    let resp;
    switch (testName) {
    case 'HDWallet.GetMnemonicWordList':
      resp = cfd.GetMnemonicWordlist(req);
      resp = await helper.getResponse(resp);
      resp = {testName, wordlist: resp.wordlist};
      break;
    case 'HDWallet.GetEntropyFromMnemonic':
      if (req.file) {
        const tests = require('./data/' + req.file)[req.language];
        const result = [];
        for (const testData of tests) {
          const request = {
            strictCheck: true,
            useIdeographicSpace: testData.use_ideographic_space,
            mnemonic: convertToMnemonic(testData.mnemonic),
            passphrase: testData.passphrase,
            language: req.language,
          };
          resp = cfd.ConvertMnemonicToSeed(request);
          resp = await helper.getResponse(resp);
          result.push(resp);
        }
        resp = {testName, result};
      } else {
        resp = cfd.ConvertMnemonicToSeed(req);
        resp = await helper.getResponse(resp);
      }
      break;
    case 'HDWallet.GetMnemonicFromEntropy':
      if (req.file) {
        const tests = require('./data/' + req.file)[req.language];
        const result = [];
        for (const testData of tests) {
          const request = {
            entropy: testData.entropy,
            language: req.language,
          };
          resp = cfd.ConvertEntropyToMnemonic(request);
          resp = await helper.getResponse(resp);
          result.push(resp);
        }
        resp = {testName, result};
      } else {
        resp = cfd.ConvertEntropyToMnemonic(req);
      }
      resp = await helper.getResponse(resp);
      break;
    case 'HDWallet.GetMnemonicToSeed':
      if (req.file) {
        const tests = require('./data/' + req.file)[req.language];
        const result = [];
        for (const testData of tests) {
          const request = {
            strictCheck: true,
            useIdeographicSpace: testData.use_ideographic_space,
            mnemonic: convertToMnemonic(testData.mnemonic),
            passphrase: testData.passphrase.normalize('NFKD'),
            language: req.language,
          };
          resp = cfd.ConvertMnemonicToSeed(request);
          resp = await helper.getResponse(resp);
          result.push(resp);
        }
        resp = {testName, result};
      } else {
        resp = cfd.ConvertMnemonicToSeed(req);
        resp = await helper.getResponse(resp);
      }
      break;
    case 'HDWallet.GetExtPrivkeyFromSeed':
      if (req.file) {
        const tests = require('./data/' + req.file).tests;
        const result = [];
        for (const testData of tests) {
          const request = {
            seed: testData.seed,
            network: testData.network,
            extkeyType: req.extkeyType,
          };
          resp = cfd.CreateExtkeyFromSeed(request);
          resp = await helper.getResponse(resp);
          result.push(resp);
        }
        resp = {testName, result};
      } else {
        resp = cfd.CreateExtkeyFromSeed(req);
      }
      resp = await helper.getResponse(resp);
      break;
    default:
      throw new Error('unknown name: ' + testName);
    }
    return resp;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCheckFunc = (helper) => {
  return (resp, exp, errorData) => {
    if (errorData) {
      const errMsg = TestHelper.getErrorMessage(errorData);
      expect(resp).toEqual(errMsg);
      return;
    }
    if (exp.file && exp.language) {
      if (!resp || !resp.testName) {
        // do nothing
      } else if (resp.testName == 'HDWallet.GetEntropyFromMnemonic') {
        const tests = require('./data/' + exp.file)[exp.language];
        for (const index in tests) {
          if (tests[index]) {
            const expData = tests[index];
            const respData = resp.result[index];
            expect(respData.entropy).toEqual(expData.entropy);
          }
        }
      } else if (resp.testName == 'HDWallet.GetMnemonicToSeed') {
        const tests = require('./data/' + exp.file)[exp.language];
        for (const index in tests) {
          if (tests[index]) {
            const expData = tests[index];
            const respData = resp.result[index];
            expect(respData.seed).toEqual(expData.seed);
          }
        }
      } else if (resp.testName == 'HDWallet.GetMnemonicFromEntropy') {
        const tests = require('./data/' + exp.file)[exp.language];
        for (const index in tests) {
          if (tests[index]) {
            const expData = tests[index];
            const respData = resp.result[index];
            expect(JSON.stringify(respData.mnemonic)).toEqual(
              JSON.stringify(convertToMnemonic(expData.mnemonic)));
          }
        }
      }
    } else if (exp.file) {
      if (resp.testName == 'HDWallet.GetMnemonicWordList') {
        const wordlist = require('./data/' + exp.file);
        expect(JSON.stringify(resp.wordlist)).toEqual(JSON.stringify(wordlist));
      } else if (resp.testName == 'HDWallet.GetExtPrivkeyFromSeed') {
        const tests = require('./data/' + exp.file).tests;
        for (const index in tests) {
          if (tests[index]) {
            const expData = tests[index].chain;
            const respData = resp.result[index];
            expect(respData.extkey).toEqual(expData[exp.extkeyType]);
          }
        }
      }
    } else {
      expect(JSON.stringify(resp)).toEqual(JSON.stringify(exp));
    }
  };
};

TestHelper.doTest(
  'HDWallet', 'hdwallet_test', createTestFunc, createCheckFunc);
