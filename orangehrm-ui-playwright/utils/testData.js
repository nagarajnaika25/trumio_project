exports.buildEmployee = function () {
  const stamp = Date.now();
  return {
    firstName: `Auto${stamp}`,
    middleName: 'QA',
    lastName: `User${stamp}`,
    nickName: `Nick${stamp}`,
    otherId: `OID-${stamp}`
  };
};