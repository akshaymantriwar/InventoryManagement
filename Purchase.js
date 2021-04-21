'use strict';
const Item = require("./Item");

class Purchase {
    constructor(countryName, items, passportNumber, userCountry){
        this.countryName = countryName ;
        this.passport = passportNumber;
        this.userCountry = userCountry;
        let index = 0;
        this.items = items.slice(0,items.length / 2).map((i) => {
            let item = new Item(items[index], +items[++index]);
            index++;
            return item;
        });

    }
}
module.exports = Purchase;
