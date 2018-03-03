function getArgs(command){
  let args;
  if (command.includes(' -')) {
    var argsArray = command.split(/[\s-]-/);
    args = {
      "card_name": argsArray[0].trim(),
      "set_name_code": argsArray[argsArray.length - 1]
    };
  }else {
    args = {
      "card_name": command,
      "set_name_code": null
    };
  }

  console.log(args);
  return args;
}

module.exports = getArgs;
