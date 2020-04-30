export default function() {
  const environment = {
    os: '',
    nav: ''
  }

  // let returnMessage

  const _agent = navigator.userAgent
  // console.log(_agent);

  if (_agent.includes('Linux') || _agent.includes('X11'))
    environment.os = 'unix'
  else if (_agent.includes('Mac')) environment.os = 'Mac'
  else if (_agent.includes('Android')) environment.os = 'Android'
  // else if (_agent.includes("Win") ) environment.os = "Windows";
  // BLE only supported on win 10
  else if (_agent.includes('Windows NT 10.0')) environment.os = 'Windows_10'
  // else if (_agent.includes("Windows NT 6.2") ) environment.os = "Windows 8";
  // else if (_agent.includes("Windows NT 6.1") ) environment.os = "Windows 7";
  // else if (_agent.includes("Windows NT 6.0") ) environment.os = "Windows Vista";
  // else if (_agent.includes("Windows NT 5.0") ) environment.os = "Windows 2000";
  // else if (_agent.includes("Windows NT 5.1") ) environment.os = "Windows XP";

  if (environment.os === 'unix') {
    // console.log("found " + environment.os);
    if (_agent.includes('Opera')) environment.nav = 'Opera'
    else if (_agent.includes('Chrome')) environment.nav = 'Chromium'
    else if (_agent.includes('Firefox')) environment.nav = 'Firefox'
  }

  if (environment.os === 'Windows_10') {
    // console.log("found " + environment.os);
    if (_agent.includes('Opera')) environment.nav = 'Opera'
    else if (_agent.includes('Chrome')) environment.nav = 'Chrome'
    else if (_agent.includes('Firefox')) environment.nav = 'Firefox'
  }

  if (environment.os === 'Mac') {
    // console.log("found " + environment.os);
    if (_agent.includes('Opera')) environment.nav = 'Opera'
    else if (_agent.includes('Chrom')) environment.nav = 'Chromium'
    else if (_agent.includes('Firefox')) environment.nav = 'Firefox'
  }

  if (environment.os === 'Android') {
    if (_agent.includes('Opera')) environment.nav = 'Opera'
    else if (_agent.includes('Chrom')) environment.nav = 'Chromium'
    else if (_agent.includes('Gecko')) environment.nav = 'Gecko'
  }

  return `You are using a ${environment.nav} based browser on a ${environment.os} OS`
  // if (environment.nav != "") {
  //     if (environment.os === "unix") json = $.getJSON('util/linux_codes.json'); //(with path)
  //     else if (environment.os === "Windows_10") json = $.getJSON('util/windows_codes.json'); //(with path)
  //     else if (environment.os === "Mac") json = $.getJSON('util/mac_codes.json'); //(with path)
  //     else if (environment.os === "Android") json = $.getJSON('util/android_codes.json'); //(with path)
  //     else alert("Your operating system is not currently supported!");
  // } else alert("You browser is not currently supported!");
}
