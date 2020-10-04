const TestHelper = require('./TestHelper');
const fs = require('fs');

const createTestFunc = (helper) => {
  return async(cfd, testName, req, isError) => {
    let resp;
    if (testName == 'GetMnemonicWordList') {
      resp = cfd.GetMnemonicWordlist(req);
    } else {
      throw new Error('unknown name: ' + testName);
    }
    return await helper.getResponse(resp);
  };
};

const createCheckFunc = (helper) => {
  return (resp, exp, isError) => {
    if (isError) {
      expect(exp.json).toEqual(resp);
      return
    }
    const expWords = JSON.parse(fs.readFileSync(
        `${__dirname}/data/${exp.file}`, 'utf8'));
    expect(resp.wordlist.length).toEqual(expWords.length);
    // for (const [index, word] of resp.wordlist.entries()) {
    //   expect(resp.wordlist[index]).toEqual(expWords[index]);
    // }
    expect(resp.wordlist.join(',')).toEqual(expWords.join(','));
  };
};

TestHelper.doTest('GetMnemonicWordList', 'hdwallet_test', createTestFunc, createCheckFunc);
