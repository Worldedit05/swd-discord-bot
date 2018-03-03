const { AWset, EaWset, LEGset, RIVset, SoRset, TPGset } = require('../cardDb');

function getCard(cardArg) {
  var allDestinyCardsArray = AWset.concat(EaWset, LEGset, RIVset, SoRset, TPGset);
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
