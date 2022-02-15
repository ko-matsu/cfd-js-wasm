const Helper = require('../example_helper').default;
const GetResponse = Helper.getResponse;
const {
  SetCustomPrefix,
  ClearCustomPrefix,
  GetPrivkeyWif,
  CreateExtkeyFromSeed,
  CreateExtPubkey,
  CreateAddress,
} = Helper.getCfdjs();

const PRIVKEY = 'd21c625759280111907a06df050cccbc875b11a50bdafa71dae5d1e8695ba82e';
const SEED = 'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04';
const ADDR_PK = '02d21c625759280111907a06df050cccbc875b11a50bdafa71dae5d1e8695ba82e';

const example = async function() {
  console.log('\n===== customize key prefix =====');

  try {
    // TODO(k-matsuzawa): Since this setting is kept in global memory, the test should not be parallelized.
    await GetResponse(SetCustomPrefix({
      keyJsonDatas: [
        {
          IsMainnet: 'true',
          wif: '40',
          bip32xpub: '0473e78d',
          bip32xprv: '0473e354',
        }, {
          IsMainnet: 'false',
          wif: '60',
          bip32xpub: '0420bd3a',
          bip32xprv: '0420b900',
        },
      ],
      addressJsonDatas: [
        {
          nettype: 'mainnet',
          p2pkh: '72',
          p2sh: '84',
          bech32: 'elrg',
        },
        {
          nettype: 'regtest',
          p2pkh: '64',
          p2sh: '22',
          bech32: 'cs',
        },
      ],
    }));

    const testDataList = [{
      network: 'mainnet',
      wif: 'Ab9nRQnDi6iACMeL1qffHY83npHTEGvmJgxBDDykXuzBfZpWFyBQ',
      xprv: 'wprvikzVDokm6P1KtKfqXgTJv8XpWZcukZYCFsmaRemcFvKZakza93Zwuo15JHekgFrn6ZZai45KS6AitFzNGo2sTf17aiPR86dWi9Tq82Qgo1r',
      xpub: 'wpubWgH9tQnJckSFRpnyr5rjEzmB3bmxQ9nzR21zjuYXxKb8VsQ6bjNrpu2Aph61HVbgR9UFxZuRKe5FMHkZncoGNGUF1zjL8eyQSoacUbLMX4F',
      p2pkhAddress: 'o7WPAG3N5XxhUR1b4uWJvVFigMiEVvS5uz',
      p2shAddress: 'vDCWYEd3kN7JVeRUp9cbswSwpcL6rmcj6j',
      p2wpkhAddress: 'elrg1qn98wsxje7xk68axrn979fuzqrd04880svgjkzc',
    }, {
      network: 'regtest',
      wif: 'FKhxiaK1K22ZNv4uiGJEm79dkiiKwfc2WptM7m4nFE6xgACzMbkJ',
      xprv: 'sprv8Erh3X3hFeKuoD653knTvhJHkiKLxbhym6yyMYfKJ9kPXc3AnztLtmAyv29tc6yQn95qGE6e6TmYRokeKRMdyBXuyXTihmcpwoqJJPtTyAy',
      xpub: 'spub4Tr3T2ab61tD1hAY9nKUHqF2Jk9qN4Rq8Kua9w4vrVHNQQNKLYCbSZVTmHWGjUHEXBze8DprMkvK8ATi6tdKxBBjwmLdjVtuMKo4yLfkDWR',
      p2pkhAddress: 'hUmwNjsL91US2M4Nj2qr8jShsJ72UUPcgp',
      p2shAddress: 'En5Q3bQpAghSMAkzR2yNMemr9B5fD4c6Wi',
      p2wpkhAddress: 'cs1qn98wsxje7xk68axrn979fuzqrd04880ssz7cnm',
    }];

    for (const testData of testDataList) {
      if (!testData) continue;
      console.log(`\n*** network: ${testData.network} ***`);

      const privkeyWif = await GetResponse(GetPrivkeyWif({
        hex: PRIVKEY,
        network: testData.network,
        isCompressed: true,
      }));
      console.log(`\n*** privkey wif ***\n`, privkeyWif);
      if (privkeyWif.wif != testData.wif) {
        throw Error('unmatch wif');
      }

      const extPrivkey = await GetResponse(CreateExtkeyFromSeed({
        seed: SEED,
        network: testData.network,
        extkeyType: 'extPrivkey',
        bip32FormatType: 'bip32',
      }));
      console.log(`\n*** extended privkey ***\n`, extPrivkey);
      if (extPrivkey.extkey != testData.xprv) {
        throw Error('unmatch xprv');
      }

      const extPubkey = await GetResponse(CreateExtPubkey({
        extkey: extPrivkey.extkey,
        network: testData.network,
      }));
      console.log(`\n*** extended pubkey ***\n`, extPubkey);
      if (extPubkey.extkey != testData.xpub) {
        throw Error('unmatch xpub');
      }

      const p2pkhAddr = await GetResponse(CreateAddress({
        keyData: {
          hex: ADDR_PK,
          type: 'pubkey',
        },
        network: testData.network,
        hashType: 'p2pkh',
      }));
      console.log(`\n*** p2pkh address ***\n`, p2pkhAddr);
      if (p2pkhAddr.address != testData.p2pkhAddress) {
        throw Error('unmatch p2pkh address');
      }

      const p2shAddr = await GetResponse(CreateAddress({
        keyData: {
          hex: p2pkhAddr.lockingScript,
          type: 'redeem_script',
        },
        network: testData.network,
        hashType: 'p2sh',
      }));
      console.log(`\n*** p2sh address ***\n`, p2shAddr);
      if (p2shAddr.address != testData.p2shAddress) {
        throw Error('unmatch p2sh address');
      }

      const p2wpkhAddr = await GetResponse(CreateAddress({
        keyData: {
          hex: ADDR_PK,
          type: 'pubkey',
        },
        network: testData.network,
        hashType: 'p2wpkh',
      }));
      console.log(`\n*** p2wpkh address ***\n`, p2wpkhAddr);
      if (p2wpkhAddr.address != testData.p2wpkhAddress) {
        throw Error('unmatch p2wpkh address');
      }
    }

    // cleanup
    await GetResponse(ClearCustomPrefix());
  } catch (e) {
    await GetResponse(ClearCustomPrefix());
    throw e;
  }
};

module.exports = example;

if ((process.argv.length > 1) && (process.argv[1].indexOf('example.js') == -1)) {
  example();
}
