const Purchase = require('./Purchase');
const Data = require('./data');


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

order = function () {
    readline.question('Please enter details of order ', inputData => {
        if(inputData === 'exit') {
            console.log('Thank you for visiting');
            return readline.close()
        }
        inputData = inputData.split(':');
        let stock = JSON.parse(Data.STOCK);
        const purchaseDetails = extractDetailsFromInput(inputData);
        let salePrice = 0;
        const orderedCountryStock = stock.find(p => p.countryName === purchaseDetails.countryName);
        const otherCountryStock = stock.find(p => p.countryName !== purchaseDetails.countryName);

        let extraCountFromOtherCountry = 0;
        let  isOutOfStock = false;
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
                if(orderedCountryItem.remainingCount >= item.count) {
                    salePrice += item.count*orderedCountryItem.salePrice;
                    orderedCountryItem.remainingCount -= item.count;
                    item.count = 0;
                } else {
                    salePrice += orderedCountryItem.remainingCount*orderedCountryItem.salePrice;
                    item.count -= orderedCountryItem.remainingCount;
                    orderedCountryItem.remainingCount = 0;
                    extraCountFromOtherCountry += item.count;
                    if(otherCountryItem.remainingCount >= item.count) {
                        let transportCharge1 = Math.ceil(item.count/10)*transportCharge;
                        salePrice += (item.count*otherCountryItem.salePrice + transportCharge1);
                        otherCountryItem.remainingCount -= item.count;
                        item.count = 0;
                    } else {
                        isOutOfStock = true;
                        stock = JSON.parse(Data.STOCK);
                    }
                }
            }
        });

        console.log((isOutOfStock ? 'OUT_OF_STOCK' : salePrice) + ':' + stock.map(p => p.items.find(i => i.name === 'Mask').remainingCount).join(':') + ':' +
            stock.map(p => p.items.find(i => i.name === 'Gloves').remainingCount).join(':'));

        order();
    })

}

order();




function extractDetailsFromInput(inputData) {
    let indexRange = 0;
    if(inputData.length === 3 || inputData.length === 5) {
        indexRange = 1;
    } else if(inputData.length === 4 || inputData.length === 6) {
        indexRange = 2;
    }
    let userCountry = indexRange === 2 ? getUserCountry(inputData[1]) : null;
    return new Purchase(inputData[0], inputData.slice(indexRange), indexRange === 2 ? inputData[1] : null, userCountry);
}

function getUserCountry(passportNumber) {
    if(new RegExp(Data.GERMANY_PASSPORT_NUMBER_FORMAT).test(passportNumber)) {
        return 'Germany';
    } else if(new RegExp(Data.UK_PASSPORT_NUMBER_FORMAT).test(passportNumber)) {
        return 'UK';
    } else {
        throw new Error('Passport number is not valid');
    }
}

