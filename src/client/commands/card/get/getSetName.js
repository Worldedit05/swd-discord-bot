const getSetName = (args) => {
  const setNameArg = args.find(arg => arg.startsWith('--set='));

  if (!setNameArg) {
    return null;
  }

  const setNameIndexStart = setNameArg.lastIndexOf('=');
  return setNameArg.substring(setNameIndexStart + 1, setNameIndexStart + 5).trim();
};

module.exports = getSetName;
