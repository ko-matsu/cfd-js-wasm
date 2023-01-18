const updateField = async function(event) {
  const signature = document.getElementById("signature").value;
  const pubkey = document.getElementById("key").value;
  const message = document.getElementById("message").value;

  try {
    const req = {
      message,
      isHashed: true,
      signature,
      pubkey,
    };
    const resp = await callJsonApi(Module, 'VerifySignatureWithPubkey', req);
    if (resp.success) {
      decoded.value = 'verify success!';
      return;
    } else if (pubkey.length !== 130) {
      decoded.value = 'verify fail. invalid signature.';
      return;
    }
  } catch (e) {
    decoded.value = 'Invalid format';
    return;
  }

  // Retry with compressed public key
  try {
    const resp1 = await callJsonApi(Module, 'GetCompressedPubkey', {pubkey});
    const req = {
      message,
      isHashed: true,
      signature,
      pubkey: resp1.pubkey,
    };
    const resp = await callJsonApi(Module, 'VerifySignatureWithPubkey', req);
    if (resp.success) {
      decoded.value = 'verify success! (Retry with compressed public key)';
    } else {
      decoded.value = 'verify fail. invalid signature.';
    }
  } catch (e) {
    decoded.value = 'Invalid format';
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
