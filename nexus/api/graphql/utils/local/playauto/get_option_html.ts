import { PrismaClient, ProductOptionName, ProductOptionValue } from "@prisma/client";
import { getValidUploadImageUrl } from "../../../graphql";

export async function getOptionHeaderHtmlByProductId(prisma: PrismaClient, id: number): Promise<string> {
    const optionValues = await prisma.productOptionValue.findMany({
        where: { productOptionName: { productId: id } },
        include: { productOptionName: true },
        orderBy: [{ number: "asc" }]
    });
    return getOptionHeaderHtml(optionValues)
}


export function getOptionHeaderHtml(optionValues: (ProductOptionValue & { productOptionName: ProductOptionName })[]): string {
    const hasImageOrder = optionValues.find(v => v.image !== null)?.optionNameOrder;
    if (hasImageOrder) {
        const options = optionValues.filter(v => v.optionNameOrder === hasImageOrder);
        return options.reduce((p, c) => p + `<h1 style="text-align: center;"><span style="color: #0000ff;">${("00" + c.number).slice(-2)} ${c.name}</span></h1><p style="text-align: center;">${c.image ? "<img src=\"" + getValidUploadImageUrl(c.image) + "\" alt=\"\" width=\"600\" height=\"600\" />" : "<p>&nbsp;</p>"}</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>`, `<p><h1 style="text-align: center;"><span style="color: #0000ff;">"${options[0].productOptionName.name}"</span>옵션 설명입니다.</h1>`) + '<p><h1 style="text-align: center;">아래는 상품 설명입니다.</h1></p>'
    }
    return "<p></p>";
}