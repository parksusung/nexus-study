export interface ITranslate {
    requestId: number
    callbackUrl: string
    data: ITranslateData[]
}

export interface ITranslateData {
    taobaoNumIid: string
    title: string
    optionName: ITranslateOptionName[]
    optionValue: ITranslateOptionValue[]
    video: string | null
    description: string
    isTranslated: boolean
}

export interface ITranslateOptionName {
    taobaoPid: string
    name: string
}

export interface ITranslateOptionValue {
    name: string
    taobaoVid: string
    taobaoPid: string
}
