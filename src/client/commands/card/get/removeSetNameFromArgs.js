const removeSetNameFromArgs = (args, setName) => {
  if (setName === null) {
    return args;
  }

  const indexOfSet = args.indexOf(`--set=${setName}`);

  if (indexOfSet == -1) {
    return args;
  }
  return args.splice(indexOfSet, 1);
};

module.exports = removeSetNameFromArgs;
