const updateField = async function(event) {
  const privkey = document.getElementById('privkey').value;
  const message = document.getElementById('message').value;
  const decoded = document.getElementById('decoded');

  try {
    const req = {
      privkey,
      message,
    };
    const resp = await callJsonApi(Module, 'SignMessage', req);
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid sign value';
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
