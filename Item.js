'use strict';
class Item {
    constructor(name, count){
        this.name = name ;
        this.count = count ;
        this.salePrice = null;
        this.remainingCount = null;
    }
}
module.exports = Item;
