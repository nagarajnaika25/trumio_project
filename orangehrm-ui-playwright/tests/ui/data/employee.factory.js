function unique(prefix = 'Auto') {
  return `${prefix}${Date.now()}`;
}

function buildEmployee() {
  const firstName = unique('Auto');
  const lastName = unique('User');
  return {
    firstName,
    middleName: 'QA',
    lastName,
    nickName: unique('Nick'),
    otherId: String(Math.floor(1000 + Math.random() * 9000)),
    jobTitle: 'QA Engineer',
  };
}

module.exports = { buildEmployee };