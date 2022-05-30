// export const calculatePrice = (cnyPrice: string | number, marginRate: number, cnyRate: number, shippingFee: number) =>
//     Math.round((Math.floor(parseFloat(cnyPrice.toString()) * (100 + marginRate) * cnyRate / 100) + shippingFee) / 10) * 10;

export const calculatePrice: any = (cnyPrice: string | number, marginRate: number, marginUnitType: string, cnyRate: number, shippingFee: number) => {
    if (marginUnitType === "WON") {
        return Math.round((Math.floor(parseFloat(cnyPrice.toString()) * cnyRate) + shippingFee + marginRate) / 100) * 100;
    } else {
        return Math.round((Math.floor(parseFloat(cnyPrice.toString()) * cnyRate) + shippingFee) * (100 + marginRate) / 10000) * 100;
    }
}