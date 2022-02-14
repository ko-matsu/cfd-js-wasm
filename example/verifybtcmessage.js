const updateField = async function(event) {
  const signature = document.getElementById('signature').value;
  const message = document.getElementById('message').value;
  const pubkey = document.getElementById('pubkey').value;
  const decoded = document.getElementById('decoded');

  try {
    const req = {
      signature,
      pubkey,
      message,
      ignoreError: true,
    };
    const resp = await callJsonApi(Module, 'VerifyMessage', req);
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid value';
  }
};

const decodeBtnField = document.getElementById('execDecode');
decodeBtnField.addEventListener('click', updateField);

Module['onRuntimeInitialized'] = async function() {
  const decoded = document.getElementById('decoded');
  if (Module['_cfdjsJsonApi']) {
    console.log('exist cfdjsJsonApi.');
    decoded.value = '';
  } else {
    console.log('cfdjsJsonApi not found!');
    decoded.value = 'WebAssembly load fail.';
  }
};

window.onload = function() {
  const decoded = document.getElementById('decoded');
  if (Module['_cfdjsJsonApi']) {
    decoded.value = '';
  } else {
    decoded.value = 'WebAssembly loading...';
  }
};
