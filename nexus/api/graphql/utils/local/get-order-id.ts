import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

export const getOrderId = async (prisma: PrismaClient, orderDate: Date) => format(orderDate, "yyyyMMdd") + (await prisma.$queryRaw(`select lpad(nextval(order_seq),6,'0') id`))[0].id;