export const calculatePrice = (cnyPrice: string | number, marginRate: number, cnyRate: number, shippingFee: number) =>
    Math.round((Math.floor(parseFloat(cnyPrice.toString()) * (100 + marginRate) * cnyRate / 100) + shippingFee) / 10) * 10;
