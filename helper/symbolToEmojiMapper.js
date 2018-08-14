const symbolMapper = (value) => {
  //TODO: This is gross and needs to be cleaned up
  let newString;
  newString = value.replace('\[melee\]', ':swdmelee:');
  newString = newString.replace('\[ranged\]', ':swdranged:');
  newString = newString.replace('\[indirect\]', ':swdindirect:');
  newString = newString.replace('\[shield\]', ':swdshield:');
  newString = newString.replace('\[resource\]', ':swdresource:');
  newString = newString.replace('\[focus\]', ':swdfocus:');
  newString = newString.replace('\[disrupt\]', ':swddisrupt:');
  newString = newString.replace('\[discard\]', ':swddiscard:');
  newString = newString.replace('\[special\]', ':swdspecial:');
  newString = newString.replace('\[blank\]', ':swdblank:');

  return newString;
}

module.exports = symbolMapper;
