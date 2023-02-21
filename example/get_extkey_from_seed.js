const updateField = async function(event) {
  const seed = document.getElementById("inputData").value.trim();
  const decoded = document.getElementById("decoded");
  const networkObj = document.getElementById("network");
  const bip32typeObj = document.getElementById("bip32type");
  const selectedNetworkIdx = networkObj.selectedIndex;
  const selectedBip32TypeIdx = bip32typeObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let bip32typeValue = bip32typeObj.options[selectedBip32TypeIdx].value;

  const data = {};

  try {
    const req = {
      seed,
      network: networkValue,
      extkeyType: 'extPrivkey',
      bip32FormatType: bip32typeValue,
    };
    const respPriv = await callJsonApi(Module, 'CreateExtkeyFromSeed', req);
    const req2 = {
      seed,
      network: networkValue,
      extkeyType: 'extPubkey',
      bip32FormatType: bip32typeValue,
    };
    const respPub = await callJsonApi(Module, 'CreateExtkeyFromSeed', req2);
    data['extpriv'] = respPriv.extkey;
    data['extpub'] = respPub.extkey;
    decoded.value = JSON.stringify(data, null, '  ');
  } catch (e) {
    console.log(e);
    decoded.value = 'Invalid input format';
    return;
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
