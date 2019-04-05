const { transliterate } = require('transliteration');
const requireDir = require('require-dir');
const { AW, EaW, LEG, RIV, SoR, TPG, WotF, AtG, CONV, AoN } = requireDir('../../../../../node_modules/swdestinydb-json-data/set');

function getCard(cardArg) {
  var allDestinyCardsArray = AW.concat(EaW, LEG, RIV, SoR, TPG, WotF, AtG, CONV, AoN);
  let result;

  return allDestinyCardsArray.filter(function (card) {
    const normalizedCardName = transliterate(card.name).toLowerCase();
    const normalizedCardNameArg = transliterate(cardArg.card_name).toLowerCase();

    if (cardArg.set_name_code !== null){
      result = normalizedCardName === normalizedCardNameArg && card.set_code.toLowerCase() === cardArg.set_name_code.toLowerCase();
    }else {
      result = normalizedCardName === normalizedCardNameArg;
    }

    return (result);
  });
}

module.exports = getCard;
