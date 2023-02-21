const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");

  let privkeyInfo;
  let isCompressed = true;
  try {
    const req = {
      wif: inputData.value,
    };
    const resp = await callJsonApi(Module, 'GetPrivkeyFromWif', req);
    resp['wif'] = inputData.value;
    privkeyInfo = {
      privkey: resp,
    };
    isCompressed = resp.isCompressed;
  } catch (e) {
  }

  if (!privkeyInfo) {
    try {
      const req = {
        hex: inputData.value,
        network: 'mainnet',
        isCompressed,
      };
      const resp = await callJsonApi(Module, 'GetPrivkeyWif', req);
      const req2 = {
        hex: inputData.value,
        network: 'testnet',
        isCompressed,
      };
      const resp2 = await callJsonApi(Module, 'GetPrivkeyWif', req2);
      privkeyInfo = {
        privkey: {
          hex: inputData.value,
          wif: {
            mainnet: resp.wif,
            testnet: resp2.wif,
          },
          isCompressed,
        },
      };
    } catch (e) {
      decoded.value = 'Invalid privkey format';
      return;
    }
  }

  try {
    const req = {
      privkey: privkeyInfo.privkey.hex,
      isCompressed,
    };
    const resp = await callJsonApi(Module, 'GetPubkeyFromPrivkey', req);
    privkeyInfo['pubkey'] = resp.pubkey;

    const uncompResp = await callJsonApi(Module, 'GetUncompressedPubkey', {pubkey: resp.pubkey});
    privkeyInfo['uncompressedPubkey'] = uncompResp.pubkey;

    const schnorrResp = await callJsonApi(Module, 'GetSchnorrPubkeyFromPrivkey', req);
    privkeyInfo['schnorrPubkey'] = schnorrResp;

    const negateResp = await callJsonApi(Module, 'NegatePrivkey', req);
    privkeyInfo['negatePrivkey'] = negateResp.privkey;

    decoded.value = JSON.stringify(privkeyInfo, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid privkey format';
  }
}

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);

Module['onRuntimeInitialized'] = async function(){
  const decoded = document.getElementById("decoded");
  if (Module['_cfdjsJsonApi']) {
    console.log("exist cfdjsJsonApi.");
    decoded.value = "";
  } else {
    console.log("cfdjsJsonApi not found!");
    decoded.value = "WebAssembly load fail.";
  }
}

window.onload = function() {
  const decoded = document.getElementById("decoded");
  if (Module['_cfdjsJsonApi']) {
    decoded.value = "";
  } else {
    decoded.value = "WebAssembly loading...";
  }
}
