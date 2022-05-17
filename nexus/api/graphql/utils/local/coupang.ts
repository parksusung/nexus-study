import { ICErrorResponse } from "../../coupang_api_types";


export function checkIsCoupangError(object: any): object is ICErrorResponse {
    const test = object as ICErrorResponse | undefined;
    if (!test) return false;
    else if (test.code && typeof test.code === "string" && test.code === "ERROR") return true;
    return false;
}