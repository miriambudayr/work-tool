const User = require('../../models/User');
const Item = require('../../models/Item');

async function getItems(lists) {
  try {
    let listsArray = await Promise.all(
      [...lists].map(async function(list) {
        let { itemsOrder } = list;
        let items = [];
        for (var i = 0; i < itemsOrder.length; i++) {
          let item = await Item.findOne({ _id: itemsOrder[i] });
          items.push(item);
        }

        const { _id, title, board, boardTitle, archived } = list;

        const listFields = { _id, title, board, boardTitle, archived };
        return {
          ...listFields,
          itemsArray: items
        };
      })
    );

    return listsArray;
  } catch (e) {
    console.error(e.message);
  }
}

async function getMembers(members) {
  const membersArray = await Promise.all(
    members.map(async id => {
      let user = await User.findOne({ _id: id }).select('-password');
      return user;
    })
  );

  return membersArray;
}

module.exports = { getMembers, getItems };
