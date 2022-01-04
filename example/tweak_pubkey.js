const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const tweak = document.getElementById("tweak").value;
  const decoded = document.getElementById("decoded");

  const pubkeyInfo = {};
  try {
    if (inputData.value.length == 64) {
      pubkeyInfo['schnorrPubkey'] = inputData.value;
      pubkeyInfo['Tweak'] = tweak;
      const req = {
        pubkey: inputData.value,
        tweak,
      };
      const resp = await callJsonApi(Module, 'TweakAddSchnorrPubkeyFromPubkey', req);
      pubkeyInfo['TweakAddSchnorrPubkey'] = resp;
    } else if (inputData.value.length == 66) {
      const req = {
        pubkey: inputData.value,
        tweak,
      };
      pubkeyInfo['compressedPubkey'] = inputData.value;
      pubkeyInfo['tweak'] = tweak;
      const resp = await callJsonApi(Module, 'TweakAddPubkey', req);
      pubkeyInfo['tweakAddPubkey'] = resp.pubkey;
      const resp2 = await callJsonApi(Module, 'TweakMulPubkey', req);
      pubkeyInfo['tweakMulPubkey'] = resp2.pubkey;
    } else if (inputData.value.length == 130) {
      const req1 = {
        pubkey: inputData.value,
      };
      const resp1 = await callJsonApi(Module, 'GetCompressedPubkey', req1);
      pubkeyInfo['compressedPubkey'] = resp1.pubkey;
      pubkeyInfo['uncompressedPubkey'] = inputData.value;
      pubkeyInfo['tweak'] = tweak;
      const req = {
        pubkey: resp1.pubkey,
        tweak,
      };
      const resp = await callJsonApi(Module, 'TweakAddPubkey', req);
      pubkeyInfo['tweakAddPubkey'] = resp.pubkey;
      const resp2 = await callJsonApi(Module, 'TweakMulPubkey', req);
      pubkeyInfo['tweakMulPubkey'] = resp2.pubkey;
      const req2 = {
        pubkey: resp1.pubkey,
      };
      const resp3 = await callJsonApi(Module, 'GetSchnorrPubkeyFromPubkey', req2);
      pubkeyInfo['schnorrPubkey'] = resp3.pubkey;
    }
    decoded.value = JSON.stringify(pubkeyInfo, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid pubkey format';
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
