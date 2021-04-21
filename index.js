const Purchase = require('./Purchase');
const Data = require('./data');

const inputData = process.argv.slice(2)[0].split(':');
const stock = JSON.parse(Data.STOCK);
const purchaseDetails = extractDetailsFromInput(inputData);
let salePrice = 0;
const orderedCountryStock = stock.find(p => p.countryName === purchaseDetails.countryName);
const otherCountryStock = stock.find(p => p.countryName !== purchaseDetails.countryName);

let extraCountFromOtherCountry = 0;

purchaseDetails.items.forEach(function (item) {
    let orderedCountryItem = orderedCountryStock.items.find(i => i.name === item.name);
    let otherCountryItem = otherCountryStock.items.find(i => i.name === item.name);

    let orderedCountryPriceForTenUnits = orderedCountryItem.salePrice*Data.ITEMS_SHIPPING_COST;
    let otherCountryPriceForTenUnits = otherCountryItem.salePrice*Data.ITEMS_SHIPPING_COST;

    let transportCharge = Data.SHIPPING_COST;
    if(purchaseDetails.userCountry === otherCountryStock.countryName) {
        transportCharge = transportCharge - transportCharge*(Data.DISCOUNT_FOR_SAME_COUNTRY/100);
    }
    otherCountryPriceForTenUnits += transportCharge;

    if(orderedCountryPriceForTenUnits > otherCountryPriceForTenUnits) {

        let noOfSetsCanOrder = Math.floor(otherCountryItem.remainingCount / 10);
        console.log('NoOfse', noOfSetsCanOrder);

        if(noOfSetsCanOrder >= Math.floor(item.count/10)) {
            salePrice += otherCountryPriceForTenUnits*(Math.floor(item.count/10));
            otherCountryItem.remainingCount -= Math.floor(item.count/10)*10;
            item.count -= Math.floor(item.count/10)*10;
        } else {
            salePrice += noOfSetsCanOrder*10*(Math.floor(item.count/10));
            otherCountryItem.remainingCount -= noOfSetsCanOrder*10;
            item.count -= noOfSetsCanOrder*10;
        }
    }
    if(item.count > 0) {
        let noOfSetsCanOrderFromOrderedCountry = Math.floor(orderedCountryItem.remainingCount / 10);
        let noOfItemsCanOrder = 0;
        if((item.count % 10) > 0) {
            noOfSetsCanOrderFromOrderedCountry -= 1;
            noOfItemsCanOrder += item.count % 10;
        }
        noOfItemsCanOrder += noOfSetsCanOrderFromOrderedCountry*10;
        if(noOfItemsCanOrder >= item.count) {
            salePrice += item.count*orderedCountryItem.salePrice;
            orderedCountryItem.remainingCount -= item.count;
            item.count = 0;
        } else {
            salePrice += noOfItemsCanOrder*orderedCountryItem.salePrice;
            orderedCountryItem.remainingCount -= noOfItemsCanOrder;
            item.count -= noOfItemsCanOrder;
            extraCountFromOtherCountry += item.count;
            if(item.count % 10 === 0 && Math.floor(otherCountryItem.remainingCount/10) >= Math.floor(item.count/10)) {
                salePrice += Math.floor(item.count/10)*otherCountryPriceForTenUnits ;
                otherCountryItem.remainingCount -= item.count;
                item.count = 0;
            } else {
                throw new Error('Order cannot be placed.because out of stock');
            }
        }
    }
});

console.log(salePrice + ':' + stock.map(p => p.items.find(i => i.name === 'Mask').remainingCount).join(':') + ':' +
    stock.map(p => p.items.find(i => i.name === 'Gloves').remainingCount).join(':'));


function extractDetailsFromInput(inputData) {
    let indexRange = 0;
    if(inputData.length === 3 || inputData.length === 5) {
        indexRange = 1;
    } else if(inputData.length === 4 || inputData.length === 6) {
        indexRange = 2;
    }
    let userCountry = indexRange === 2 ? GetUserCountry(inputData[1]) : null;
    return new Purchase(inputData[0], inputData.slice(indexRange), indexRange === 2 ? inputData[1] : null, userCountry);
}

function GetUserCountry(passportNumber) {
    if(new RegExp(Data.GERMANY_PASSPORT_NUMBER_FORMAT).test(passportNumber)) {
        return 'Germany';
    } else if(new RegExp(Data.UK_PASSPORT_NUMBER_FORMAT).test(passportNumber)) {
        return 'UK';
    } else {
        throw new Error('Passport number is not valid');
    }
}

function calculatePriceForTenUnits(countryName, isOtherCountry, stock) {
    let transportCharge = 0;
    if(purchaseDetails.userCountry !== purchaseDetails.countryName) {
        transportCharge = (transportCharge - transportCharge*(Data.DISCOUNT_FOR_SAME_COUNTRY/100));
    }
}
