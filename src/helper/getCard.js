const requireDir = require('require-dir');
const { AW, EaW, LEG, RIV, SoR, TPG, WotF, AtG, CONV } = requireDir('../../node_modules/swdestinydb-json-data/set');

function getCard(cardArg) {
  var allDestinyCardsArray = AW.concat(EaW, LEG, RIV, SoR, TPG, WotF, AtG, CONV);
  let result;

  return allDestinyCardsArray.filter(function (card) {
    if (cardArg.set_name_code !== null){
      result = card.name.toLowerCase() === cardArg.card_name.toLowerCase() && card.set_code.toLowerCase() === cardArg.set_name_code.toLowerCase();
    }else {
      result = card.name.toLowerCase() === cardArg.card_name.toLowerCase();
    }

    return (result);
  });
}

module.exports = getCard;
