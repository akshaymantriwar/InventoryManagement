'use strict';
const STOCK = '[{"countryName":"UK","passport":"AAB123456789","items":[{"name":"Mask","count":100,"salePrice":65,"remainingCount":100},{"name":"Gloves","count":100,"salePrice":100,"remainingCount":100}]},' +
    '{"countryName":"Germany","passport":"AAB123456789","items":[{"name":"Mask","count":100,"salePrice":100,"remainingCount":100},{"name":"Gloves","count":50,"salePrice":150,"remainingCount":50}]}]\n';

const SHIPPING_COST = 400;
const ITEMS_SHIPPING_COST = 10;
const DISCOUNT_FOR_SAME_COUNTRY = 20;
const UK_PASSPORT_NUMBER_FORMAT = '[B]\\d{3}[a-zA-Z]{2}[a-zA-Z0-9]{7}';
const GERMANY_PASSPORT_NUMBER_FORMAT = '[A][a-zA-Z]{2}[a-zA-Z0-9]{9}';

module.exports = {
    STOCK,
    SHIPPING_COST,
    ITEMS_SHIPPING_COST,
    DISCOUNT_FOR_SAME_COUNTRY,
    UK_PASSPORT_NUMBER_FORMAT,
    GERMANY_PASSPORT_NUMBER_FORMAT
}


