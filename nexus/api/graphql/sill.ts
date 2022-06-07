import { enumType, extendType, inputObjectType, list, nonNull, objectType, stringArg } from "nexus"
import { errors, throwError } from "./utils/error";

export interface SiilData {
    infoCode: string
    infoName: string
    data: SiilItems[]
}

export interface SiilItems {
    description: string
    data: SiilItem[]
}

export interface SiilItem {
    name: string
    inputType: "SELECT" | "INPUT" | "YESNO"
    options: string[] | null
    code: string
}

export interface SiilSavedItem {
    code: string;
    value: string;
}

export interface SiilSavedData {
    code: string;
    data: SiilSavedItem[]
}

export interface SiilEncodedSavedItem {
    c: string;
    v: string;
}

export interface SiilEncodedSavedData {
    c: string;
    d: SiilEncodedSavedItem[]
}


export interface SiilOutputData {
    infoCode: string
    infoName: string
    infoDetail: { [key: string]: string | string[] }
}

export const t_siil_enum = enumType({
    name: "SiilItemTypeEnum",
    members: ["SELECT", "INPUT", "YESNO"]
})

export const t_SiilItem = objectType({
    name: "SiilItem",
    definition(t) {
        t.nonNull.string("name");
        t.nonNull.field("inputType", { type: "SiilItemTypeEnum" })
        t.list.nonNull.string("options");
        t.nonNull.string("code");
    }
});

export const t_SiilItems = objectType({
    name: "SiilItems",
    definition(t) {
        t.nonNull.string("description");
        t.nonNull.list.nonNull.field("data", { type: "SiilItem" });
    },
});

export const t_SiilItemInput = inputObjectType({
    name: "SiilInput",
    definition(t) {
        t.nonNull.string("code");
        t.nonNull.string("value");
    }
})
export const t_SiilSavedItem = objectType({
    name: "SiilSavedItem",
    definition(t) {
        t.nonNull.string("code");
        t.nonNull.string("value");
    }
})
export const t_SiilSavedData = objectType({
    name: "SiilSavedData",
    definition(t) {
        t.nonNull.string("code");
        t.nonNull.list.nonNull.field("data", { type: "SiilSavedItem" });
    }
})


export const getSiilDataForUpload = (siilData: SiilEncodedSavedData | string) => {
    const data = typeof siilData === 'string' ? JSON.parse(siilData) as SiilEncodedSavedData : siilData;
    const result: SiilOutputData = {
        infoCode: data.c,
        infoName: siilInfo.find(v => v.infoCode === data.c)!.infoName,
        infoDetail: data.d.reduce((p, c) => {
            const match = c.c.match(/(\d{2}\d{2})_?(\d?)/);
            if (!match)
                throw new Error("상품고시정보가 잘못되었습니다.");
            if (match[2] !== '') {
                p[match[1]] = p[match[1]] ? [...p[match[1]], c.v] : [c.v];
            }
            else {
                p[match[1]] = c.v;
            }
            return p;
        }, {} as { [key: string]: string | string[] }),
    }
    return JSON.stringify(result)
}


export const siilInfo: SiilData[] = [
    {
        infoCode: '01',
        infoName: '의류',
        data: [
            {
                description: '제품 소재 (섬유의 조성 또는 혼용률을 백분율로 표시, 기능성인 경우 성적서 또는 허가서) 예시) 폴리에스터-75%',
                data: [
                    {
                        name: '제품 소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0101_0'
                    },
                    {
                        name: '기능성 여부',
                        inputType: 'SELECT',
                        options: ['대상아님', '대상상품'],
                        code: '0101_1'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '0102'
                    }
                ]
            },
            {
                description: '치수',
                data: [
                    {
                        name: '치수',
                        inputType: 'INPUT',
                        options: null,
                        code: '0103'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0104_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0104_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0104_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0105'
                    }
                ]
            },
            {
                description: '세탁방법 및 취급시 주의사항',
                data: [
                    {
                        name: '세탁방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '0106_0'
                    },
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '0106_1'
                    }
                ]
            },
            {
                description: '제조연월 예)2012-10',
                data: [
                    {
                        name: '제조연월',
                        inputType: 'INPUT',
                        options: null,
                        code: '0107'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0108'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0109'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '02',
        infoName: '구두/신발',
        data: [
            {
                description: '제품의 주소재 (운동화인 경우에는 겉감, 안감을 구분하여 표시)',
                data: [
                    {
                        name: '제품의 주소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0201_0'
                    },
                    {
                        name: '운동화 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0201_1'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '0202'
                    }
                ]
            },
            {
                description: '치수( 발길이: 해외사이즈 표기시 국내사이즈 병행 표기(mm), 굽높이:굽 재료를 사용하는 여성화에 한함(cm) )',
                data: [
                    {
                        name: '발길이',
                        inputType: 'INPUT',
                        options: null,
                        code: '0203_0'
                    },
                    {
                        name: '굽높이',
                        inputType: 'INPUT',
                        options: null,
                        code: '0203_1'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0204_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0204_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0204_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0205'
                    }
                ]
            },
            {
                description: '취급시 주의사항',
                data: [
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '0206'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0207'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0208'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '03',
        infoName: '가방',
        data: [
            {
                description: '종류',
                data: [
                    {
                        name: '종류',
                        inputType: 'INPUT',
                        options: null,
                        code: '0301'
                    }
                ]
            },
            {
                description: '소재',
                data: [
                    {
                        name: '소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0302'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '0303'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '0304'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0305_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0305_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0305_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0306'
                    }
                ]
            },
            {
                description: '취급시 주의사항',
                data: [
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '0307'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0308'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0309'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '04',
        infoName: '패션잡화(모자/벨트/액세서리)',
        data: [
            {
                description: '종류',
                data: [
                    {
                        name: '종류',
                        inputType: 'INPUT',
                        options: null,
                        code: '0401'
                    }
                ]
            },
            {
                description: '소재',
                data: [
                    {
                        name: '소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0402'
                    }
                ]
            },
            {
                description: '치수',
                data: [
                    {
                        name: '치수',
                        inputType: 'INPUT',
                        options: null,
                        code: '0403'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0404_0'
                    },
                    {
                        name: '수입자',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0404_1'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'INPUT',
                        options: null,
                        code: '0404_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0405'
                    }
                ]
            },
            {
                description: '취급시 주의사항',
                data: [
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '0406'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0407'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0408'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '05',
        infoName: '침구류/커튼',
        data: [
            {
                description: '제품 소재 (섬유의 조성 또는 혼용률을 백분율로 표시, 기능성인 경우 성적서 또는 허가서) 예시) 폴리에스터-75%',
                data: [
                    {
                        name: '제품 소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0501_0'
                    },
                    {
                        name: '충전재 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0501_1'
                    },
                    {
                        name: '충전재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0501_2'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '0502'
                    }
                ]
            },
            {
                description: '치수',
                data: [
                    {
                        name: '치수',
                        inputType: 'INPUT',
                        options: null,
                        code: '0503'
                    }
                ]
            },
            {
                description: '제품구성',
                data: [
                    {
                        name: '제품구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '0504'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0505_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0505_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0505_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0506'
                    }
                ]
            },
            {
                description: '세탁방법 및 취급시 주의사항',
                data: [
                    {
                        name: '세탁방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '0507_0'
                    },
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '0507_1'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0508'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0509'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '06',
        infoName: '가구(침대/소파/싱크대/DIY제품)',
        data: [
            {
                description: '품명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0601'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (품질경영 및 공산품안전관리법 상 안전·품질표시대상공산품에 한함) ',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '0602_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0602_1'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '0603'
                    }
                ]
            },
            {
                description: '구성품',
                data: [
                    {
                        name: '구성품',
                        inputType: 'INPUT',
                        options: null,
                        code: '0604'
                    }
                ]
            },
            {
                description: '주요 소재',
                data: [
                    {
                        name: '주요 소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '0605'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)\n' +
                    '* 구성품별 제조자가 다른경우 각 구성품의 제조자, 수입자 입력',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0606_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0606_1'
                    },
                    {
                        name: '복수 구성품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0606_2'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0606_3'
                    }
                ]
            },
            {
                description: '제조국 (구성품별 제조자가 다른경우 각 구성품의 제조국)',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0607'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '0608'
                    }
                ]
            },
            {
                description: '배송/설치비용',
                data: [
                    {
                        name: '배송/설치비용',
                        inputType: 'INPUT',
                        options: null,
                        code: '0609'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0610'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0611'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '07',
        infoName: '영상가전(TV류)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0701_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0701_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전기용품안전관리법 상 안전인증대상전기용품, 안전확인대상전기용품, 공급자적합성확인대상전기용품에 한함)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '0702_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0702_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력, 에너지소비효율등급 (에너지이용합리화법 상 의무대상상품에 한함)',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '0703_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '0703_1'
                    },
                    {
                        name: '에너지소비효율등급여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0703_2'
                    },
                    {
                        name: '에너지소비효율등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '0703_3'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '0704'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0705_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0705_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0705_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0706'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '0707'
                    }
                ]
            },
            {
                description: '화면사양 (크기, 해상도, 화면비율 등)',
                data: [
                    {
                        name: '화면사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '0708'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0709'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0710'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '08',
        infoName: '가정용 전기제품 (냉장고/세탁기/식기세척기/전자레인지)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0801_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0801_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전기용품안전관리법 상 안전인증대상전기용품, 안전확인대상전기용품, 공급자적합성확인대상전기용품에 한함)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '0802_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0802_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력, 에너지소비효율등급 (에너지이용합리화법 상 의무대상상품에 한함)',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '0803_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '0803_1'
                    },
                    {
                        name: '에너지소비효율등급여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0803_2'
                    },
                    {
                        name: '에너지소비효율등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '0803_3'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '0804'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0805_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0805_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0805_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0806'
                    }
                ]
            },
            {
                description: '크기 (용량, 형태 포함)',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '0807_0'
                    },
                    {
                        name: '용량',
                        inputType: 'INPUT',
                        options: null,
                        code: '0807_1'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0808'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0809'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '09',
        infoName: '계절가전(에어컨/온풍기)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0901_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '0901_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전기용품안전관리법 상 안전인증대상전기용품, 안전확인대상전기용품, 공급자적합성확인대상전기용품에 한함)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '0902_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0902_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력, 에너지소비효율등급 (에너지이용합리화법 상 의무대상상품에 한함)',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '0903_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '0903_1'
                    },
                    {
                        name: '에너지소비효율등급여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0903_2'
                    },
                    {
                        name: '에너지소비효율등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '0903_3'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '0904'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0905_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '0905_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '0905_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '0906'
                    }
                ]
            },
            {
                description: '크기 (형태 및 실외기 포함)',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '0907'
                    }
                ]
            },
            {
                description: '냉난방면적(㎡)',
                data: [
                    {
                        name: '냉난방면적(㎡)',
                        inputType: 'INPUT',
                        options: null,
                        code: '0908'
                    }
                ]
            },
            {
                description: '추가설치비용',
                data: [
                    {
                        name: '추가설치비용',
                        inputType: 'INPUT',
                        options: null,
                        code: '0909'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '0910'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '0911'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '10',
        infoName: '사무용기기(컴퓨터/노트북/프린터)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1001_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1001_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전파법 상 인증대상상품에 한함, MIC 인증 필 혼용 가능)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1002_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1002_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력, 에너지소비효율등급 (에너지이용합리화법 상 의무대상상품에 한함)',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '1003_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '1003_1'
                    },
                    {
                        name: '에너지소비효율등급여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1003_2'
                    },
                    {
                        name: '에너지소비효율등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '1003_3'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1004'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1005_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1005_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1005_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1006'
                    }
                ]
            },
            {
                description: '크기, 무게 (무게는 노트북에 한함)',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1007_0'
                    },
                    {
                        name: '노트북 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1007_1'
                    },
                    {
                        name: '무게',
                        inputType: 'INPUT',
                        options: null,
                        code: '1007_2'
                    }
                ]
            },
            {
                description: '주요 사양 (컴퓨터와 노트북의 경우 성능, 용량, 운영체제 포함여부 등 / 프린터의 경우 인쇄 속도 등)',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1008'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1009'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1010'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '11',
        infoName: '광학기기(디지털카메라/캠코더)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1101_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1101_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전파법 상 인증대상상품에 한함, MIC 인증 필 혼용 가능) ',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1102_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1102_1'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1103'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1104_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1104_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1104_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1105'
                    }
                ]
            },
            {
                description: '크기, 무게',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1106_0'
                    },
                    {
                        name: '무게',
                        inputType: 'INPUT',
                        options: null,
                        code: '1106_1'
                    }
                ]
            },
            {
                description: '주요 사양',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1107'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1108'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1109'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '12',
        infoName: '소형가전(MP3/전자사전 등)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1201_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1201_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전파법 상 인증대상상품에 한함, MIC 인증 필 혼용 가능) ',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1202_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1202_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '1203_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '1203_1'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1204'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1205_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1205_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1205_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1206'
                    }
                ]
            },
            {
                description: '크기, 무게',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1207_0'
                    },
                    {
                        name: '무게',
                        inputType: 'INPUT',
                        options: null,
                        code: '1207_1'
                    }
                ]
            },
            {
                description: '주요 사양',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1208'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1209'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1210'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '13',
        infoName: '휴대폰',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1301_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1301_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전파법 상 인증대상상품에 한함, MIC 인증 필 혼용 가능) ',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1302_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1302_1'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1303'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1304_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1304_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1304_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1305'
                    }
                ]
            },
            {
                description: '크기, 무게',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1306_0'
                    },
                    {
                        name: '무게',
                        inputType: 'INPUT',
                        options: null,
                        code: '1306_1'
                    }
                ]
            },
            {
                description: '이동통신사',
                data: [
                    {
                        name: '이동통신사',
                        inputType: 'INPUT',
                        options: null,
                        code: '1307'
                    }
                ]
            },
            {
                description: '가입절차',
                data: [
                    {
                        name: '가입절차',
                        inputType: 'INPUT',
                        options: null,
                        code: '1308'
                    }
                ]
            },
            {
                description: '소비자의 추가적인 부담사항 (가입비, 유심카드 구입비 등 추가로 부담하여야 할 금액, 부가서비스, 의무사용기간, 위약금 등)',
                data: [
                    {
                        name: '부담사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '1309'
                    }
                ]
            },
            {
                description: '주요 사양',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1310'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1311'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1312'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '14',
        infoName: '내비게이션',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1401_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1401_1'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (전파법 상 인증대상상품에 한함, MIC 인증 필 혼용 가능) ',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1402_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1402_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력',
                data: [
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '1403_0'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '1403_1'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1404'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1405_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1405_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1405_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1406'
                    }
                ]
            },
            {
                description: '크기, 무게',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1407_0'
                    },
                    {
                        name: '무게',
                        inputType: 'INPUT',
                        options: null,
                        code: '1407_1'
                    }
                ]
            },
            {
                description: '주요 사양',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1408'
                    }
                ]
            },
            {
                description: '맵 업데이트 비용 및 무상기간',
                data: [
                    {
                        name: '맵 업데이트 비용',
                        inputType: 'INPUT',
                        options: null,
                        code: '1409_0'
                    },
                    {
                        name: '무상기간',
                        inputType: 'INPUT',
                        options: null,
                        code: '1409_1'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1410'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1411'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '15',
        infoName: '자동차용품(자동차부품/기타 자동차용품)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1501_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1501_1'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1502'
                    }
                ]
            },
            {
                description: 'KC 인증 필 유무 (인증 대상 자동차부품에 한함)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1503_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1503_1'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1504_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1504_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1504_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1505'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1506'
                    }
                ]
            },
            {
                description: '적용차종',
                data: [
                    {
                        name: '적용차종',
                        inputType: 'INPUT',
                        options: null,
                        code: '1507'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1508'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1509'
                    }
                ]
            },
            {
                description: '제품사용으로 인한 위험 및 유의사항 (연료절감장치에 한함)',
                data: [
                    {
                        name: '제품사용으로 인한\r\n위험 및 유의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '1510'
                    }
                ]
            },
            {
                description: '검사합격증 번호(대기환경보전법에 따른 첨가제·촉매제에 한함)',
                data: [
                    {
                        name: '검사합격증 번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1511'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '16',
        infoName: '의료기기',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1601_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1601_1'
                    }
                ]
            },
            {
                description: '의료기기법상 허가·신고 번호(허가·신고 대상 의료기기에 한함) 및 광고사전심의필 유무',
                data: [
                    {
                        name: '의료기기여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1602_0'
                    },
                    {
                        name: '허가번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1602_1'
                    },
                    {
                        name: '광고사전심의필',
                        inputType: 'SELECT',
                        options: ['무', '유'],
                        code: '1602_2'
                    }
                ]
            },
            {
                description: '전기용품안전관리법상 KC 인증 필 유무 (안전인증 또는 자율안전확인 대상 전기용품에 한함)',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '1603_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1603_1'
                    }
                ]
            },
            {
                description: '정격전압, 소비전력 (전기용품에 한함)',
                data: [
                    {
                        name: '전기용품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1604_0'
                    },
                    {
                        name: '정격전압',
                        inputType: 'INPUT',
                        options: null,
                        code: '1604_1'
                    },
                    {
                        name: '소비전력',
                        inputType: 'INPUT',
                        options: null,
                        code: '1604_2'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1605'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1606_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1606_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1606_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1607'
                    }
                ]
            },
            {
                description: '제품의 사용목적 및 사용방법',
                data: [
                    {
                        name: '사용목적',
                        inputType: 'INPUT',
                        options: null,
                        code: '1608_0'
                    },
                    {
                        name: '사용방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '1608_1'
                    }
                ]
            },
            {
                description: '취급시 주의사항',
                data: [
                    {
                        name: '취급시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '1609'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1610'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1611'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '17',
        infoName: '주방용품',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1701_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '1701_1'
                    }
                ]
            },
            {
                description: '재질',
                data: [
                    {
                        name: '재질',
                        inputType: 'INPUT',
                        options: null,
                        code: '1702'
                    }
                ]
            },
            {
                description: '구성품',
                data: [
                    {
                        name: '구성품',
                        inputType: 'INPUT',
                        options: null,
                        code: '1703'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '1704'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '1705'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1706_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1706_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1706_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1707'
                    }
                ]
            },
            {
                description: '「수입식품안전관리특별법」에 따른 수입 기구·용기의 경우 “「수입식품안전관리특별법」에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '수입식품안전관리특별법에 따른 수입신고를 필함'],
                        code: '1708'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1709'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1710'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '18',
        infoName: '화장품',
        data: [
            {
                description: '용량 또는 중량',
                data: [
                    {
                        name: '용량 또는 중량',
                        inputType: 'INPUT',
                        options: null,
                        code: '1801'
                    }
                ]
            },
            {
                description: '제품 주요 사양 (피부타입, 색상(호, 번) 등)',
                data: [
                    {
                        name: '주요 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '1802'
                    }
                ]
            },
            {
                description: '사용기한 또는 개봉 후 사용기간(개봉 후 사용기간을 기재할 경우에는 제조연월일을 병행표기)',
                data: [
                    {
                        name: '사용기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '1803'
                    }
                ]
            },
            {
                description: '사용방법',
                data: [
                    {
                        name: '사용방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '1804'
                    }
                ]
            },
            {
                description: '화장품제조업자 및 화장품책임판매업자',
                data: [
                    {
                        name: '제조업자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1805_0'
                    },
                    {
                        name: '책임판매업자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1805_1'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1806'
                    }
                ]
            },
            {
                description: '화장품법에 따라 기재, 표시하여야 하는 모든 성분',
                data: [
                    {
                        name: '모든성분',
                        inputType: 'INPUT',
                        options: null,
                        code: '1807_0'
                    },
                    {
                        name: '유기농화장품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1807_1'
                    }
                ]
            },
            {
                description: '기능성 화장품의 경우 화장품법에 따른 식품의약품안전처 심사 필 유무 (미백, 주름개선, 자외선차단 등)',
                data: [
                    {
                        name: '기능성',
                        inputType: 'SELECT',
                        options: ['대상아님', '식품의약품안전처 심사 필'],
                        code: '1808_0'
                    },
                    {
                        name: '기능성내용',
                        inputType: 'INPUT',
                        options: null,
                        code: '1808_1'
                    }
                ]
            },
            {
                description: '사용할 때 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '1809'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1810'
                    }
                ]
            },
            {
                description: '소비자상담관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1811'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '19',
        infoName: '귀금속/보석/시계류',
        data: [
            {
                description: '소재 / 순도 / 밴드재질 (시계의 경우)',
                data: [
                    {
                        name: '소재',
                        inputType: 'INPUT',
                        options: null,
                        code: '1901_0'
                    },
                    {
                        name: '순도',
                        inputType: 'INPUT',
                        options: null,
                        code: '1901_1'
                    },
                    {
                        name: '밴드재질',
                        inputType: 'INPUT',
                        options: null,
                        code: '1901_2'
                    }
                ]
            },
            {
                description: '중량',
                data: [
                    {
                        name: '중량',
                        inputType: 'INPUT',
                        options: null,
                        code: '1902'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1903_0'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '1903_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '1903_2'
                    }
                ]
            },
            {
                description: '제조국 (원산지와 가공지 등이 다를 경우 함께 표기)',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '1904'
                    }
                ]
            },
            {
                description: '치수',
                data: [
                    {
                        name: '치수',
                        inputType: 'INPUT',
                        options: null,
                        code: '1905'
                    }
                ]
            },
            {
                description: '착용 시 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '1906'
                    }
                ]
            },
            {
                description: '주요사항( (귀금속, 보석류 - 등급),(시계 - 기능,방수)등 )',
                data: [
                    {
                        name: '귀금속,보석류-등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '1907_0'
                    },
                    {
                        name: '시계 - 기능,방수',
                        inputType: 'INPUT',
                        options: null,
                        code: '1907_1'
                    }
                ]
            },
            {
                description: '보증서 제공유무',
                data: [
                    {
                        name: '보증서',
                        inputType: 'SELECT',
                        options: ['보증서 제공무', '보증서 제공유'],
                        code: '1908'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '1909'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '1910'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '20A',
        infoName: '식품(농산물)',
        data: [
            {
                description: '포장단위별 내용물의 용량(중량), 수량, 크기',
                data: [
                    {
                        name: '용량(중량)',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A01_0'
                    },
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A01_1'
                    },
                    {
                        name: '수량',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A01_2'
                    }
                ]
            },
            {
                description: '생산자, 수입품의 경우 수입자를 함께 표기',
                data: [
                    {
                        name: '생산자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A02_0'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '20A02_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A02_2'
                    }
                ]
            },
            {
                description: '농수산물의 원산지 표시에 관한 법률에 따른 원산지',
                data: [
                    {
                        name: '원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A03'
                    }
                ]
            },
            {
                description: '제조연월일(포장일 또는 생산연도) , 유통기한',
                data: [
                    {
                        name: '제조연월일',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A04_0'
                    },
                    {
                        name: '   유통기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A04_1'
                    }
                ]
            },
            {
                description: '농산물 - 농수산물품질관리법상 유전자변형농산물 표시, 지리적표시',
                data: [
                    {
                        name: '유전자변형농산물',
                        inputType: 'SELECT',
                        options: ['대상아님', '대상상품'],
                        code: '20A05_0'
                    },
                    {
                        name: '지리적표시',
                        inputType: 'SELECT',
                        options: ['대상아님', '대상상품'],
                        code: '20A05_1'
                    }
                ]
            },
            {
                description: '수입식품에 해당하는 경우 “식품위생법에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '식품위생법에 따른 수입신고를 필함'],
                        code: '20A08'
                    }
                ]
            },
            {
                description: '상품구성',
                data: [
                    {
                        name: '상품구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A09'
                    }
                ]
            },
            {
                description: '보관방법 또는 취급방법',
                data: [
                    {
                        name: '보관/취급방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A10'
                    }
                ]
            },
            {
                description: '소비자상담관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A11'
                    }
                ]
            },
            {
                description: '품목 또는 명칭',
                data: [
                    {
                        name: '품목 또는 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A12'
                    }
                ]
            },
            {
                description: '「식품 등의 표시·광고에 관한 법률」에 따른 소비자안전을 위한 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '20A13'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '20B',
        infoName: '식품(축산물)',
        data: [
            {
                description: '포장단위별 내용물의 용량(중량), 수량, 크기',
                data: [
                    {
                        name: '용량(중량)',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B01_0'
                    },
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B01_1'
                    },
                    {
                        name: '수량',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B01_2'
                    }
                ]
            },
            {
                description: '생산자, 수입품의 경우 수입자를 함께 표기',
                data: [
                    {
                        name: '생산자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B02_0'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '20B02_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B02_2'
                    }
                ]
            },
            {
                description: '농수산물의 원산지 표시에 관한 법률에 따른 원산지',
                data: [
                    {
                        name: '원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B03'
                    }
                ]
            },
            {
                description: '제조연월일(포장일 또는 생산연도) , 유통기한',
                data: [
                    {
                        name: '제조연월일',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B04_0'
                    },
                    {
                        name: '유통기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B04_1'
                    }
                ]
            },
            {
                description: '축산물 - 축산법에 따른 등급 표시, 「축산물이력법」에 따른 이력관리대상축산물 유무',
                data: [
                    {
                        name: '축산법에 등급표시',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B06_0'
                    },
                    {
                        name: '「축산물이력법」에 따른 이력관리대상축산물 유무',
                        inputType: 'SELECT',
                        options: ['무', '유'],
                        code: '20B06_1'
                    }
                ]
            },
            {
                description: '수입식품에 해당하는 경우 “「수입식품안전관리특별법」에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '수입식품안전관리특별법에 따른 수입신고를 필함'],
                        code: '20B08'
                    }
                ]
            },
            {
                description: '상품구성',
                data: [
                    {
                        name: '상품구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B09'
                    }
                ]
            },
            {
                description: '보관방법 또는 취급방법',
                data: [
                    {
                        name: '보관/취급방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B10'
                    }
                ]
            },
            {
                description: '소비자상담관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B11'
                    }
                ]
            },
            {
                description: '품목 또는 명칭',
                data: [
                    {
                        name: '품목 또는 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B12'
                    }
                ]
            },
            {
                description: '「식품 등의 표시·광고에 관한 법률」에 따른 소비자안전을 위한 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '20B13'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '20C',
        infoName: '식품(수산물)',
        data: [
            {
                description: '포장단위별 내용물의 용량(중량), 수량, 크기',
                data: [
                    {
                        name: '용량(중량)',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C01_0'
                    },
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C01_1'
                    },
                    {
                        name: '수량',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C01_2'
                    }
                ]
            },
            {
                description: '생산자, 수입품의 경우 수입자를 함께 표기',
                data: [
                    {
                        name: '생산자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C02_0'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '20C02_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C02_2'
                    }
                ]
            },
            {
                description: '농수산물의 원산지 표시에 관한 법률에 따른 원산지',
                data: [
                    {
                        name: '원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C03'
                    }
                ]
            },
            {
                description: '제조연월일(포장일 또는 생산연도), 유통기한',
                data: [
                    {
                        name: '제조연월일',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C04_0'
                    },
                    {
                        name: '유통기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C04_1'
                    }
                ]
            },
            {
                description: '수산물 - 농수산물품질관리법상 유전자변형수산물 표시, 지리적표시',
                data: [
                    {
                        name: '유전자변형수산물',
                        inputType: 'SELECT',
                        options: ['대상아님', '대상상품'],
                        code: '20C07_0'
                    },
                    {
                        name: '지리적표시',
                        inputType: 'SELECT',
                        options: ['대상아님', '대상상품'],
                        code: '20C07_1'
                    }
                ]
            },
            {
                description: '수입식품에 해당하는 경우 “「수입식품안전관리특별법」에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '수입식품안전관리특별법에 따른 수입신고를 필함'],
                        code: '20C08'
                    }
                ]
            },
            {
                description: '상품구성',
                data: [
                    {
                        name: '상품구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C09'
                    }
                ]
            },
            {
                description: '보관방법 또는 취급방법',
                data: [
                    {
                        name: '보관/취급방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C10'
                    }
                ]
            },
            {
                description: '소비자상담관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C11'
                    }
                ]
            },
            {
                description: '품목 또는 명칭',
                data: [
                    {
                        name: '품목 또는 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C12'
                    }
                ]
            },
            {
                description: '「식품 등의 표시·광고에 관한 법률」에 따른 소비자안전을 위한 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '20C13'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '21',
        infoName: '가공식품',
        data: [
            {
                description: '식품의 유형',
                data: [
                    {
                        name: '식품의 유형',
                        inputType: 'INPUT',
                        options: null,
                        code: '2101'
                    }
                ]
            },
            {
                description: '생산자 및 소재지, 수입품의 경우 생산자, 수입자 및 제조국',
                data: [
                    {
                        name: '생산자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2102_0'
                    },
                    {
                        name: '소재지',
                        inputType: 'INPUT',
                        options: null,
                        code: '2102_1'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2102_2'
                    },
                    {
                        name: '수입자 및 제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '2102_3'
                    }
                ]
            },
            {
                description: '제조연월일, 유통기한',
                data: [
                    {
                        name: '제조연월일',
                        inputType: 'INPUT',
                        options: null,
                        code: '2103_0'
                    },
                    {
                        name: '유통기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '2103_1'
                    }
                ]
            },
            {
                description: '포장단위별 내용물의 용량(중량), 수량',
                data: [
                    {
                        name: '포장단위별 용량(중량)',
                        inputType: 'INPUT',
                        options: null,
                        code: '2104_0'
                    },
                    {
                        name: '포장단위별 수량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2104_1'
                    }
                ]
            },
            {
                description: '원재료명 및 함량(농수산물의 원산지 표시에 관한 법률에 따른 원산지 표시 포함)',
                data: [
                    {
                        name: '원재료명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2105_0'
                    },
                    {
                        name: '함량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2105_1'
                    },
                    {
                        name: '원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '2105_2'
                    }
                ]
            },
            {
                description: '영양성분(「식품 등의 표시·광고에 관한 법률」에 따른 영양성분 표시대상 식품에 한함)',
                data: [
                    {
                        name: '영양성분',
                        inputType: 'INPUT',
                        options: null,
                        code: '2106'
                    }
                ]
            },
            {
                description: '유전자변형식품에 해당하는 경우의 표시',
                data: [
                    {
                        name: '유전자변형식품여부',
                        inputType: 'SELECT',
                        options: ['대상아님', '유전자변형식품임'],
                        code: '2107'
                    }
                ]
            },
            {
                description: '영유아식 또는 체중조절식품 등에 해당하는 경우 표시광고 사전심의필여부 [* 전자상거래법 개정으로 인하여 삭제 예정]',
                data: [
                    {
                        name: '사전심의필여부',
                        inputType: 'SELECT',
                        options: ['대상아님', '사전심의필'],
                        code: '2108'
                    }
                ]
            },
            {
                description: '수입식품에 해당하는 경우 “「수입식품안전관리특별법」에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '수입식품안전관리특별법에 따른 수입신고를 필함'],
                        code: '2109'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2110'
                    }
                ]
            },
            {
                description: '부작용 발생 가능성 (Y or N)',
                data: [
                    {
                        name: '가능성 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2111_0'
                    },
                    {
                        name: '부작용 발생 가능성',
                        inputType: 'INPUT',
                        options: null,
                        code: '2111_1'
                    }
                ]
            },
            {
                description: '제품명',
                data: [
                    {
                        name: '제품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2112'
                    }
                ]
            },
            {
                description: '소비자안전을 위한 주의사항',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2113'
                    }
                ]
            },
            {
                description: '「식품 등의 표시·광고에 관한 법률」에 따른 표시사항',
                data: [
                    {
                        name: '표시사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2114'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '22',
        infoName: '건강기능식품',
        data: [
            {
                description: '식품의 유형',
                data: [
                    {
                        name: '식품의 유형',
                        inputType: 'INPUT',
                        options: null,
                        code: '2201'
                    }
                ]
            },
            {
                description: '생산자 및 소재지, 수입품의 경우 생산자, 수입자 및 제조국',
                data: [
                    {
                        name: '생산자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2202_0'
                    },
                    {
                        name: '소재지',
                        inputType: 'INPUT',
                        options: null,
                        code: '2202_1'
                    },
                    {
                        name: '수입품여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2202_2'
                    },
                    {
                        name: '수입자 및 제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '2202_3'
                    }
                ]
            },
            {
                description: '제조연월일(포장일 또는 생산연도) , 유통기한 또는 품질유지기한',
                data: [
                    {
                        name: '제조연월일',
                        inputType: 'INPUT',
                        options: null,
                        code: '2203_0'
                    },
                    {
                        name: '  유통기한 및\r\n품질유지기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '2203_1'
                    }
                ]
            },
            {
                description: '포장단위별 내용물의 용량(중량), 수량',
                data: [
                    {
                        name: '포장단위별 용량(중량)',
                        inputType: 'INPUT',
                        options: null,
                        code: '2204_0'
                    },
                    {
                        name: '포장단위별 수량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2204_1'
                    }
                ]
            },
            {
                description: '원재료명 및 함량(농수산물의 원산지 표시에 관한 법률에 따른 원산지 표시 포함)',
                data: [
                    {
                        name: '원재료명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2205_0'
                    },
                    {
                        name: '함량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2205_1'
                    },
                    {
                        name: '원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '2205_2'
                    }
                ]
            },
            {
                description: '영양성분',
                data: [
                    {
                        name: '영양성분',
                        inputType: 'INPUT',
                        options: null,
                        code: '2206'
                    }
                ]
            },
            {
                description: '기능정보',
                data: [
                    {
                        name: '기능정보',
                        inputType: 'INPUT',
                        options: null,
                        code: '2207'
                    }
                ]
            },
            {
                description: '섭취량, 섭취방법 및 섭취 시 주의사항',
                data: [
                    {
                        name: '섭취량,섭취방법\r\n섭취 시 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2208'
                    }
                ]
            },
            {
                description: '질병의 예방 및 치료를 위한 의약품이 아니라는 내용의 표현',
                data: [
                    {
                        name: '내용 표기',
                        inputType: 'INPUT',
                        options: null,
                        code: '2209'
                    }
                ]
            },
            {
                description: '유전자변형건강기능식품여부',
                data: [
                    {
                        name: '유전자',
                        inputType: 'SELECT',
                        options: ['대상아님', '유전자변형건강기능식품임'],
                        code: '2210'
                    }
                ]
            },
            {
                description: '표시광고 사전심의필',
                data: [
                    {
                        name: '표시광고',
                        inputType: 'SELECT',
                        options: ['대상아님', '사전심의필'],
                        code: '2211'
                    }
                ]
            },
            {
                description: '수입식품에 해당하는 경우 “「수입식품안전관리특별법」에 따른 수입신고를 필함”의 문구',
                data: [
                    {
                        name: '수입품',
                        inputType: 'SELECT',
                        options: ['대상아님', '수입식품안전관리특별법에 따른 수입신고를 필함'],
                        code: '2212'
                    }
                ]
            },
            {
                description: '소비자상담관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2213'
                    }
                ]
            },
            {
                description: '부작용 발생 가능성 (Y or N)',
                data: [
                    {
                        name: '가능성 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2214_0'
                    },
                    {
                        name: '부작용 발생 가능성',
                        inputType: 'INPUT',
                        options: null,
                        code: '2214_1'
                    }
                ]
            },
            {
                description: '제품명',
                data: [
                    {
                        name: '제품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2215_0'
                    },
                    {
                        name: '소비자안전을 위한 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2215_1'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '23',
        infoName: '영유아용품',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2301_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2301_1'
                    }
                ]
            },
            {
                description: '어린이제품 안전 특별법 상 안전인증대상어린이제품, 안전확인대상어린이제품, 공급자적합성확인대상어린이제품에 대한 KC인증 필 유무',
                data: [
                    {
                        name: '인증유형',
                        inputType: 'YESNO',
                        options: null,
                        code: '2302_0'
                    },
                    {
                        name: '인증번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2302_1'
                    }
                ]
            },
            {
                description: '크기, 중량',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '2303_0'
                    },
                    {
                        name: '중량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2303_1'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '2304'
                    }
                ]
            },
            {
                description: '재질 (섬유의 경우 혼용률)',
                data: [
                    {
                        name: '재질',
                        inputType: 'INPUT',
                        options: null,
                        code: '2305'
                    }
                ]
            },
            {
                description: '사용연령 및 체중범위 (품질 경영 및 공산품안전관리법에 따라 표시해야 하는 사항은 반드시 표기)',
                data: [
                    {
                        name: '사용연령 및 체중범위',
                        inputType: 'INPUT',
                        options: null,
                        code: '2306'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '2307'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2308_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2308_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2308_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '2309'
                    }
                ]
            },
            {
                description: '취급방법 및 취급시 주의사항, 안전표시 (주의, 경고 등)',
                data: [
                    {
                        name: '주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2310'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '2311'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2312'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '24',
        infoName: '악기',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2401_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2401_1'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '2402'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '2403'
                    }
                ]
            },
            {
                description: '재질',
                data: [
                    {
                        name: '재질',
                        inputType: 'INPUT',
                        options: null,
                        code: '2404'
                    }
                ]
            },
            {
                description: '제품 구성',
                data: [
                    {
                        name: '제품 구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '2405'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '2406'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2407_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2407_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2407_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '2408'
                    }
                ]
            },
            {
                description: '상품별 세부 사양',
                data: [
                    {
                        name: '상품별 세부사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '2409'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '2410'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2411'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '25',
        infoName: '스포츠용품',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2501_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2501_1'
                    }
                ]
            },
            {
                description: '크기',
                data: [
                    {
                        name: '크기',
                        inputType: 'INPUT',
                        options: null,
                        code: '2502_0'
                    },
                    {
                        name: '중량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2502_1'
                    }
                ]
            },
            {
                description: '색상',
                data: [
                    {
                        name: '색상',
                        inputType: 'INPUT',
                        options: null,
                        code: '2503'
                    }
                ]
            },
            {
                description: '재질',
                data: [
                    {
                        name: '재질',
                        inputType: 'INPUT',
                        options: null,
                        code: '2504'
                    }
                ]
            },
            {
                description: '제품 구성',
                data: [
                    {
                        name: '제품 구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '2505'
                    }
                ]
            },
            {
                description: '동일모델의 출시년월 예) 2012-10',
                data: [
                    {
                        name: '출시년월',
                        inputType: 'INPUT',
                        options: null,
                        code: '2506'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능, 병행수입의 경우“병행수입”입력하면 처리가능)',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2507_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '2507_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2507_2'
                    }
                ]
            },
            {
                description: '제조국',
                data: [
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '2508'
                    }
                ]
            },
            {
                description: '상품별 세부 사양',
                data: [
                    {
                        name: '상품별 세부사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '2509'
                    }
                ]
            },
            {
                description: '품질보증기준',
                data: [
                    {
                        name: '품질보증기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '2510'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2511'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '26',
        infoName: '서적',
        data: [
            {
                description: '도서명',
                data: [
                    {
                        name: '도서명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2601'
                    }
                ]
            },
            {
                description: '저자, 출판사',
                data: [
                    {
                        name: '저자',
                        inputType: 'INPUT',
                        options: null,
                        code: '2602_0'
                    },
                    {
                        name: '출판사',
                        inputType: 'INPUT',
                        options: null,
                        code: '2602_1'
                    }
                ]
            },
            {
                description: '크기 (전자책의 경우 파일의 용량)',
                data: [
                    {
                        name: '높이',
                        inputType: 'INPUT',
                        options: null,
                        code: '2603_0'
                    },
                    {
                        name: '전자책용량',
                        inputType: 'INPUT',
                        options: null,
                        code: '2603_1'
                    }
                ]
            },
            {
                description: '쪽수 (전자책의 경우 ‘해당없음’ 입력)',
                data: [
                    {
                        name: '쪽수',
                        inputType: 'INPUT',
                        options: null,
                        code: '2604'
                    }
                ]
            },
            {
                description: '제품 구성 (전집 또는 세트일 경우 낱권 구성, CD 등)',
                data: [
                    {
                        name: '제품 구성',
                        inputType: 'INPUT',
                        options: null,
                        code: '2605'
                    }
                ]
            },
            {
                description: '출간일 예) 2012-10',
                data: [
                    {
                        name: '출간일',
                        inputType: 'INPUT',
                        options: null,
                        code: '2606'
                    }
                ]
            },
            {
                description: '목차 또는 책소개 (아동용 학습교재의 경우 사용연령을 포함)',
                data: [
                    {
                        name: '목차 또는 책소개',
                        inputType: 'INPUT',
                        options: null,
                        code: '2607'
                    }
                ]
            },
            {
                description: 'ISBN',
                data: [
                    {
                        name: 'ISBN',
                        inputType: 'INPUT',
                        options: null,
                        code: '2608'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '27',
        infoName: '호텔 / 펜션 예약',
        data: [
            {
                description: '국가 또는 지역명',
                data: [
                    {
                        name: '국가 또는 지역명',
                        inputType: 'INPUT',
                        options: null,
                        code: '2701'
                    }
                ]
            },
            {
                description: '숙소형태',
                data: [
                    {
                        name: '숙소형태',
                        inputType: 'INPUT',
                        options: null,
                        code: '2702'
                    }
                ]
            },
            {
                description: '등급, 객실타입',
                data: [
                    {
                        name: '등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '2703_0'
                    },
                    {
                        name: '객실타입',
                        inputType: 'INPUT',
                        options: null,
                        code: '2703_1'
                    }
                ]
            },
            {
                description: '사용가능 인원, 인원 추가 시 비용',
                data: [
                    {
                        name: '사용가능 인원',
                        inputType: 'INPUT',
                        options: null,
                        code: '2704_0'
                    },
                    {
                        name: '인원 추가 시 비용',
                        inputType: 'INPUT',
                        options: null,
                        code: '2704_1'
                    }
                ]
            },
            {
                description: '부대시설, 제공 서비스 (조식 등)',
                data: [
                    {
                        name: '부대시설',
                        inputType: 'INPUT',
                        options: null,
                        code: '2705_0'
                    },
                    {
                        name: '제공 서비스',
                        inputType: 'INPUT',
                        options: null,
                        code: '2705_1'
                    }
                ]
            },
            {
                description: '취소 규정 (환불, 위약금 등)',
                data: [
                    {
                        name: '취소 규정',
                        inputType: 'INPUT',
                        options: null,
                        code: '2706'
                    }
                ]
            },
            {
                description: '예약담당 연락처',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2707'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '28',
        infoName: '여행 상품',
        data: [
            {
                description: '여행사',
                data: [
                    {
                        name: '여행사',
                        inputType: 'INPUT',
                        options: null,
                        code: '2801'
                    }
                ]
            },
            {
                description: '이용항공편',
                data: [
                    {
                        name: '이용항공편',
                        inputType: 'INPUT',
                        options: null,
                        code: '2802'
                    }
                ]
            },
            {
                description: '여행기간 및 일정',
                data: [
                    {
                        name: '여행기간',
                        inputType: 'INPUT',
                        options: null,
                        code: '2803_0'
                    },
                    {
                        name: '일정',
                        inputType: 'INPUT',
                        options: null,
                        code: '2803_1'
                    }
                ]
            },
            {
                description: '총 예정 인원, 출발 가능 인원',
                data: [
                    {
                        name: '총 예정 인원',
                        inputType: 'INPUT',
                        options: null,
                        code: '2804_0'
                    },
                    {
                        name: '출발 가능 인원',
                        inputType: 'INPUT',
                        options: null,
                        code: '2804_1'
                    }
                ]
            },
            {
                description: '숙박정보',
                data: [
                    {
                        name: '숙박정보',
                        inputType: 'INPUT',
                        options: null,
                        code: '2805'
                    }
                ]
            },
            {
                description: '포함 내역 (식사, 인솔자, 공연관람, 관광지 입장료, 유류할증료, 공항이용료, 관련 세금 및 공과금 등)',
                data: [
                    {
                        name: '포함 내역',
                        inputType: 'INPUT',
                        options: null,
                        code: '2806'
                    }
                ]
            },
            {
                description: '추가 경비 항목과 금액 (유류할증료가 가격에 포함되지 않은 경우 그 금액과 변동가능성, 선택관광, 안내원 봉사료 등)',
                data: [
                    {
                        name: '추가 경비',
                        inputType: 'INPUT',
                        options: null,
                        code: '2807'
                    }
                ]
            },
            {
                description: '취소 규정 (환불, 위약금 등)',
                data: [
                    {
                        name: '취소 규정',
                        inputType: 'INPUT',
                        options: null,
                        code: '2808'
                    }
                ]
            },
            {
                description: '해외여행의 경우 외교통상부가 지정하는 여행경보단계',
                data: [
                    {
                        name: '여행경보단계',
                        inputType: 'INPUT',
                        options: null,
                        code: '2809'
                    }
                ]
            },
            {
                description: '예약담당 연락처',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2810'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '29',
        infoName: '항공권',
        data: [
            {
                description: '요금조건, 왕복·편도 여부',
                data: [
                    {
                        name: '요금조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '2901_0'
                    },
                    {
                        name: '왕복·편도 여부',
                        inputType: 'SELECT',
                        options: ['편도', '왕복'],
                        code: '2901_1'
                    }
                ]
            },
            {
                description: '유효기간 예) 2012-10-25',
                data: [
                    {
                        name: '유효기간',
                        inputType: 'INPUT',
                        options: null,
                        code: '2902'
                    }
                ]
            },
            {
                description: '제한사항 (출발일, 귀국일 변경가능 여부 등)',
                data: [
                    {
                        name: '제한사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '2903'
                    }
                ]
            },
            {
                description: '티켓수령방법',
                data: [
                    {
                        name: '티켓수령방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '2904'
                    }
                ]
            },
            {
                description: '좌석종류',
                data: [
                    {
                        name: '좌석종류',
                        inputType: 'INPUT',
                        options: null,
                        code: '2905'
                    }
                ]
            },
            {
                description: '가격에 포함되지 않은 내역 및 금액 (유류할증료, 공항이용료, 관광지 입장료, 안내원수수료, 식사비용, 선택사항 등)',
                data: [
                    {
                        name: '추가 경비',
                        inputType: 'INPUT',
                        options: null,
                        code: '2906'
                    }
                ]
            },
            {
                description: '취소 규정 (환불, 위약금 등)',
                data: [
                    {
                        name: '취소 규정',
                        inputType: 'INPUT',
                        options: null,
                        code: '2907'
                    }
                ]
            },
            {
                description: '예약담당 연락처',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '2908'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '30',
        infoName: '자동차 대여 서비스 (렌터카)',
        data: [
            {
                description: '차종',
                data: [
                    {
                        name: '차종',
                        inputType: 'INPUT',
                        options: null,
                        code: '3001'
                    }
                ]
            },
            {
                description: '소유권 이전 조건 (소유권이 이전되는 경우에 한함)',
                data: [
                    {
                        name: '소유권 이전 조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3002'
                    }
                ]
            },
            {
                description: '추가 선택 시 비용 (자차면책제도, 내비게이션 등)',
                data: [
                    {
                        name: '추가 선택 시 비용',
                        inputType: 'INPUT',
                        options: null,
                        code: '3003'
                    }
                ]
            },
            {
                description: '차량 반환 시 연료대금 정산 방법',
                data: [
                    {
                        name: '연료대금 정산방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '3004'
                    }
                ]
            },
            {
                description: '차량의 고장·훼손 시 소비자 책임',
                data: [
                    {
                        name: '소비자 책임',
                        inputType: 'INPUT',
                        options: null,
                        code: '3005'
                    }
                ]
            },
            {
                description: '예약 취소 또는 중도 해약 시 환불 기준',
                data: [
                    {
                        name: '환불 기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '3006'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3007'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '31',
        infoName: '물품대여 서비스 (정수기/비데/공기청정기 등)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3101_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3101_1'
                    }
                ]
            },
            {
                description: '소유권 이전 조건 (소유권이 이전되는 경우에 한함)',
                data: [
                    {
                        name: '소유권 이전조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3102'
                    }
                ]
            },
            {
                description: '유지보수 조건 (점검·필터교환 주기, 추가 비용 등)',
                data: [
                    {
                        name: '유지보수 조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3103'
                    }
                ]
            },
            {
                description: '상품의 고장·분실·훼손 시 소비자 책임',
                data: [
                    {
                        name: '소비자 책임',
                        inputType: 'INPUT',
                        options: null,
                        code: '3104'
                    }
                ]
            },
            {
                description: '중도 해약 시 환불 기준',
                data: [
                    {
                        name: '환불 기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '3105'
                    }
                ]
            },
            {
                description: '제품 사양 (용량, 소비전력 등)',
                data: [
                    {
                        name: '제품 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '3106'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3107'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '32',
        infoName: '물품대여 서비스 (서적/유아용품/행사용품 등)',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3201_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3201_1'
                    }
                ]
            },
            {
                description: '소유권 이전 조건 (소유권이 이전되는 경우에 한함)',
                data: [
                    {
                        name: '소유권 이전조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3202'
                    }
                ]
            },
            {
                description: '상품의 고장·분실·훼손 시 소비자 책임',
                data: [
                    {
                        name: '소비자 책임',
                        inputType: 'INPUT',
                        options: null,
                        code: '3203'
                    }
                ]
            },
            {
                description: '중도 해약 시 환불 기준',
                data: [
                    {
                        name: '환불 기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '3204'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3205'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '33',
        infoName: '디지털 콘텐츠 (음원/게임/인터넷강의 등)',
        data: [
            {
                description: '제작자 또는 공급자',
                data: [
                    {
                        name: '제작자/공급자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3301'
                    }
                ]
            },
            {
                description: '이용조건, 이용기간',
                data: [
                    {
                        name: '이용조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3302_0'
                    },
                    {
                        name: '이용기간',
                        inputType: 'INPUT',
                        options: null,
                        code: '3302_1'
                    }
                ]
            },
            {
                description: '상품 제공 방식 (CD, 다운로드, 실시간 스트리밍 등)',
                data: [
                    {
                        name: '상품 제공 방식',
                        inputType: 'INPUT',
                        options: null,
                        code: '3303'
                    }
                ]
            },
            {
                description: '최소 시스템 사양, 필수 소프트웨어',
                data: [
                    {
                        name: '최소시스템 사양',
                        inputType: 'INPUT',
                        options: null,
                        code: '3304'
                    }
                ]
            },
            {
                description: '청약철회 또는 계약의 해제·해지에 따른 효과',
                data: [
                    {
                        name: '해지효과',
                        inputType: 'INPUT',
                        options: null,
                        code: '3305'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3306'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '34',
        infoName: '상품권 / 쿠폰',
        data: [
            {
                description: '발행자',
                data: [
                    {
                        name: '발행자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3401'
                    }
                ]
            },
            {
                description: '유효기간, 이용조건 (유효기간 경과 시 보상 기준, 사용제한품목 및 기간 등)',
                data: [
                    {
                        name: '유효기간(시작일)',
                        inputType: 'INPUT',
                        options: null,
                        code: '3402_0'
                    },
                    {
                        name: '유효기간(종료일)',
                        inputType: 'INPUT',
                        options: null,
                        code: '3402_1'
                    },
                    {
                        name: '구매일로 부터 몇일',
                        inputType: 'INPUT',
                        options: null,
                        code: '3402_2'
                    },
                    {
                        name: '이용조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3402_3'
                    }
                ]
            },
            {
                description: '이용 가능 매장',
                data: [
                    {
                        name: '이용 가능 매장',
                        inputType: 'INPUT',
                        options: null,
                        code: '3403'
                    }
                ]
            },
            {
                description: '잔액 환급 조건',
                data: [
                    {
                        name: '잔액 환급 조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3404'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3405'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '35',
        infoName: '기타재화',
        data: [
            {
                description: '품명 및 모델명',
                data: [
                    {
                        name: '품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3501_0'
                    },
                    {
                        name: '모델명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3501_1'
                    }
                ]
            },
            {
                description: '법에 의한 인증·허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항',
                data: [
                    {
                        name: '인증사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '3502'
                    }
                ]
            },
            {
                description: '제조국 또는 원산지',
                data: [
                    {
                        name: '제조국/원산지',
                        inputType: 'INPUT',
                        options: null,
                        code: '3503'
                    }
                ]
            },
            {
                description: '제조자, 수입품의 경우 수입자를 함께 표기',
                data: [
                    {
                        name: '제조자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3504_0'
                    },
                    {
                        name: '수입품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '3504_1'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3504_2'
                    }
                ]
            },
            {
                description: 'A/S 책임자와 전화번호 또는 소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3505'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '36',
        infoName: '모바일쿠폰',
        data: [
            {
                description: '발행자',
                data: [
                    {
                        name: '제작자/공급자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3601'
                    }
                ]
            },
            {
                description: '유효기간, 이용조건 (유효기간 경과 시 보상 기준포함)',
                data: [
                    {
                        name: '유효기간',
                        inputType: 'INPUT',
                        options: null,
                        code: '3602_0'
                    },
                    {
                        name: '이용조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3602_1'
                    }
                ]
            },
            {
                description: '이용 가능 매장',
                data: [
                    {
                        name: '이용 가능 매장',
                        inputType: 'INPUT',
                        options: null,
                        code: '3603'
                    }
                ]
            },
            {
                description: '환불조건 및 방법',
                data: [
                    {
                        name: '환불조건 및 방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '3604'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3605'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '37',
        infoName: '영화/공연',
        data: [
            {
                description: '주최 또는 기획 (공연에 한함)',
                data: [
                    {
                        name: '주최 또는 기획',
                        inputType: 'INPUT',
                        options: null,
                        code: '3701'
                    }
                ]
            },
            {
                description: '주연 (공연에 한함)',
                data: [
                    {
                        name: '주연',
                        inputType: 'INPUT',
                        options: null,
                        code: '3702'
                    }
                ]
            },
            {
                description: '관람등급',
                data: [
                    {
                        name: '관람등급',
                        inputType: 'INPUT',
                        options: null,
                        code: '3703'
                    }
                ]
            },
            {
                description: '상영·공연시간',
                data: [
                    {
                        name: '상영·공연시간',
                        inputType: 'INPUT',
                        options: null,
                        code: '3704'
                    }
                ]
            },
            {
                description: '상영·공연장소',
                data: [
                    {
                        name: '상영·공연장소',
                        inputType: 'INPUT',
                        options: null,
                        code: '3705'
                    }
                ]
            },
            {
                description: '예매 취소 조건',
                data: [
                    {
                        name: '예매 취소 조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3706'
                    }
                ]
            },
            {
                description: '취소·환불방법',
                data: [
                    {
                        name: '취소·환불방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '3707'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3708'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '38',
        infoName: '기타용역',
        data: [
            {
                description: '서비스 제공 사업자',
                data: [
                    {
                        name: '서비스 제공 사업자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3801'
                    }
                ]
            },
            {
                description: '법에 의한 인증·허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항',
                data: [
                    {
                        name: '법에 의한 인증·\r\n허가 확인 사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '3802'
                    }
                ]
            },
            {
                description: '이용조건 (이용가능 기간·장소, 추가비용 등)',
                data: [
                    {
                        name: '이용조건',
                        inputType: 'INPUT',
                        options: null,
                        code: '3803'
                    }
                ]
            },
            {
                description: '취소·중도해약·해지 조건 및 환불기준',
                data: [
                    {
                        name: '취소·중도해약·해지\r\n조건 및 환불기준',
                        inputType: 'INPUT',
                        options: null,
                        code: '3804'
                    }
                ]
            },
            {
                description: '취소·환불방법',
                data: [
                    {
                        name: '취소·환불방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '3805'
                    }
                ]
            },
            {
                description: '소비자상담 관련 전화번호',
                data: [
                    {
                        name: '책임자/전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3806'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '39',
        infoName: '생활화학제품',
        data: [
            {
                description: '품목 및 제품명',
                data: [
                    {
                        name: '품목 및 제품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '3901'
                    }
                ]
            },
            {
                description: '용도(표백제의 경우 계열을 함께 표시) 및 제형',
                data: [
                    {
                        name: '용도',
                        inputType: 'INPUT',
                        options: null,
                        code: '3902_0'
                    },
                    {
                        name: '제형',
                        inputType: 'INPUT',
                        options: null,
                        code: '3902_1'
                    }
                ]
            },
            {
                description: '제조연월일 및 유통기한',
                data: [
                    {
                        name: '제조연월',
                        inputType: 'INPUT',
                        options: null,
                        code: '3903_0'
                    },
                    {
                        name: '유통기한',
                        inputType: 'INPUT',
                        options: null,
                        code: '3903_1'
                    }
                ]
            },
            {
                description: '중량ㆍ용량ㆍ매수',
                data: [
                    {
                        name: '중량',
                        inputType: 'INPUT',
                        options: null,
                        code: '3904_0'
                    },
                    {
                        name: '용량',
                        inputType: 'INPUT',
                        options: null,
                        code: '3904_1'
                    },
                    {
                        name: '매수',
                        inputType: 'INPUT',
                        options: null,
                        code: '3904_2'
                    }
                ]
            },
            {
                description: '효과ㆍ효능(승인대상 생활화학제품에 한함)',
                data: [
                    {
                        name: '효과',
                        inputType: 'INPUT',
                        options: null,
                        code: '3905_0'
                    },
                    {
                        name: '승인대상 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '3905_1'
                    },
                    {
                        name: '효능',
                        inputType: 'INPUT',
                        options: null,
                        code: '3905_2'
                    }
                ]
            },
            {
                description: '수입자(수입제품에 한함), 제조국 및 제조사',
                data: [
                    {
                        name: '수입제품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '3906_0'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '3906_1'
                    },
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '3906_2'
                    },
                    {
                        name: '제조사',
                        inputType: 'INPUT',
                        options: null,
                        code: '3906_3'
                    }
                ]
            },
            {
                description: '어린이보호포장 대상 제품 유무',
                data: [
                    {
                        name: '어린이보호포장 대상 제품 유무',
                        inputType: 'SELECT',
                        options: ['무', '유'],
                        code: '3907'
                    }
                ]
            },
            {
                description: '제품에 사용된 화학물질 명칭',
                data: [
                    {
                        name: '화학물질 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '3908'
                    }
                ]
            },
            {
                description: '사용상 주의사항',
                data: [
                    {
                        name: '사용상 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '3909'
                    }
                ]
            },
            {
                description: '안전기준 적합확인 신고번호(자가검사번호)또는 승인번호',
                data: [
                    {
                        name: '신고번호 또는 승인번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3910'
                    }
                ]
            },
            {
                description: '소비자 상담 관련 전화번호',
                data: [
                    {
                        name: '전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '3911'
                    }
                ]
            }
        ]
    },
    {
        infoCode: '40',
        infoName: '살생물제품',
        data: [
            {
                description: '제품명 및 제품유형',
                data: [
                    {
                        name: '제품명',
                        inputType: 'INPUT',
                        options: null,
                        code: '4001_0'
                    },
                    {
                        name: '제품유형',
                        inputType: 'INPUT',
                        options: null,
                        code: '4001_1'
                    }
                ]
            },
            {
                description: '중량 또는 용량 및 표준사용량',
                data: [
                    {
                        name: '중량 또는 용량',
                        inputType: 'INPUT',
                        options: null,
                        code: '4002_0'
                    },
                    {
                        name: '표준사용량',
                        inputType: 'INPUT',
                        options: null,
                        code: '4002_1'
                    }
                ]
            },
            {
                description: '효과ㆍ효능',
                data: [
                    {
                        name: '효과',
                        inputType: 'INPUT',
                        options: null,
                        code: '4003_0'
                    },
                    {
                        name: '효능',
                        inputType: 'INPUT',
                        options: null,
                        code: '4003_1'
                    }
                ]
            },
            {
                description: '사용대상자 및 사용범위',
                data: [
                    {
                        name: '사용대상자',
                        inputType: 'INPUT',
                        options: null,
                        code: '4004_0'
                    },
                    {
                        name: '사용범위',
                        inputType: 'INPUT',
                        options: null,
                        code: '4004_1'
                    }
                ]
            },
            {
                description: '수입자(수입제품에 한함), 제조국 및 제조사',
                data: [
                    {
                        name: '수입제품 여부',
                        inputType: 'SELECT',
                        options: ['N', 'Y'],
                        code: '4005_0'
                    },
                    {
                        name: '수입자',
                        inputType: 'INPUT',
                        options: null,
                        code: '4005_1'
                    },
                    {
                        name: '제조국',
                        inputType: 'INPUT',
                        options: null,
                        code: '4005_2'
                    },
                    {
                        name: '제조사',
                        inputType: 'INPUT',
                        options: null,
                        code: '4005_3'
                    }
                ]
            },
            {
                description: '어린이보호포장 대상 제품 유무',
                data: [
                    {
                        name: '어린이보호포장 대상 제품 유무',
                        inputType: 'SELECT',
                        options: ['무', '유'],
                        code: '4006'
                    }
                ]
            },
            {
                description: '살생물물질, 나노물질, 유해화학물질(또는 중점관리물질)의 명칭',
                data: [
                    {
                        name: '살생물물질 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '4007_0'
                    },
                    {
                        name: '나노물질 명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '4007_1'
                    },
                    {
                        name: '유해화학물질명칭',
                        inputType: 'INPUT',
                        options: null,
                        code: '4007_2'
                    }
                ]
            },
            {
                description: '제품 유해성 및 위해성 표시',
                data: [
                    {
                        name: '제품 유해성 및 위해성',
                        inputType: 'INPUT',
                        options: null,
                        code: '4008'
                    }
                ]
            },
            {
                description: '사용방법 및 사용상 주의사항',
                data: [
                    {
                        name: '사용방법',
                        inputType: 'INPUT',
                        options: null,
                        code: '4009_0'
                    },
                    {
                        name: '사용상 주의사항',
                        inputType: 'INPUT',
                        options: null,
                        code: '4009_1'
                    }
                ]
            },
            {
                description: '승인번호',
                data: [
                    {
                        name: '승인번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '4010'
                    }
                ]
            },
            {
                description: '소비자상담 전화번호',
                data: [
                    {
                        name: '소비자상담 전화번호',
                        inputType: 'INPUT',
                        options: null,
                        code: '4011'
                    }
                ]
            }
        ]
    }
]

export const predefinedSiilData = [
    {
        infoCode: '01',
        infoName: '의류',
        infoDetail: {
            '0101': ['상세정보참조', '상세정보참조'],
            '0102': '상세정보참조',
            '0103': '상세정보참조',
            '0104': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0105': '상세정보참조',
            '0106': ['상세정보참조', '상세정보참조'],
            '0107': '상세정보참조',
            '0108': '상세정보참조',
            '0109': '상세정보참조'
        }
    },
    {
        infoCode: '02',
        infoName: '구두/신발',
        infoDetail: {
            '0201': ['상세정보참조', '상세정보참조'],
            '0202': '상세정보참조',
            '0203': ['상세정보참조', '상세정보참조'],
            '0204': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0205': '상세정보참조',
            '0206': '상세정보참조',
            '0207': '상세정보참조',
            '0208': '상세정보참조'
        }
    },
    {
        infoCode: '03',
        infoName: '가방',
        infoDetail: {
            '0301': '상세정보참조',
            '0302': '상세정보참조',
            '0303': '상세정보참조',
            '0304': '상세정보참조',
            '0305': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0306': '상세정보참조',
            '0307': '상세정보참조',
            '0308': '상세정보참조',
            '0309': '상세정보참조'
        }
    },
    {
        infoCode: '04',
        infoName: '패션잡화(모자/벨트/액세서리)',
        infoDetail: {
            '0401': '상세정보참조',
            '0402': '상세정보참조',
            '0403': '상세정보참조',
            '0404': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0405': '상세정보참조',
            '0406': '상세정보참조',
            '0407': '상세정보참조',
            '0408': '상세정보참조'
        }
    },
    {
        infoCode: '05',
        infoName: '침구류/커튼',
        infoDetail: {
            '0501': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0502': '상세정보참조',
            '0503': '상세정보참조',
            '0504': '상세정보참조',
            '0505': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0506': '상세정보참조',
            '0507': ['상세정보참조', '상세정보참조'],
            '0508': '상세정보참조',
            '0509': '상세정보참조'
        }
    },
    {
        infoCode: '06',
        infoName: '가구(침대/소파/싱크대/DIY제품)',
        infoDetail: {
            '0601': '상세정보참조',
            '0602': ['상세정보참조', '상세정보참조'],
            '0603': '상세정보참조',
            '0604': '상세정보참조',
            '0605': '상세정보참조',
            '0606': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '0607': '상세정보참조',
            '0608': '상세정보참조',
            '0609': '상세정보참조',
            '0610': '상세정보참조',
            '0611': '상세정보참조'
        }
    },
    {
        infoCode: '07',
        infoName: '영상가전(TV류)',
        infoDetail: {
            '0701': ['상세정보참조', '상세정보참조'],
            '0702': ['상세정보참조', '상세정보참조'],
            '0703': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '0704': '상세정보참조',
            '0705': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0706': '상세정보참조',
            '0707': '상세정보참조',
            '0708': '상세정보참조',
            '0709': '상세정보참조',
            '0710': '상세정보참조'
        }
    },
    {
        infoCode: '08',
        infoName: '가정용 전기제품 (냉장고/세탁기/식기세척기/전자레인지)',
        infoDetail: {
            '0801': ['상세정보참조', '상세정보참조'],
            '0802': ['상세정보참조', '상세정보참조'],
            '0803': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '0804': '상세정보참조',
            '0805': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0806': '상세정보참조',
            '0807': ['상세정보참조', '상세정보참조'],
            '0808': '상세정보참조',
            '0809': '상세정보참조'
        }
    },
    {
        infoCode: '09',
        infoName: '계절가전(에어컨/온풍기)',
        infoDetail: {
            '0901': ['상세정보참조', '상세정보참조'],
            '0902': ['상세정보참조', '상세정보참조'],
            '0903': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '0904': '상세정보참조',
            '0905': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '0906': '상세정보참조',
            '0907': '상세정보참조',
            '0908': '상세정보참조',
            '0909': '상세정보참조',
            '0910': '상세정보참조',
            '0911': '상세정보참조'
        }
    },
    {
        infoCode: '10',
        infoName: '사무용기기(컴퓨터/노트북/프린터)',
        infoDetail: {
            '1001': ['상세정보참조', '상세정보참조'],
            '1002': ['상세정보참조', '상세정보참조'],
            '1003': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '1004': '상세정보참조',
            '1005': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1006': '상세정보참조',
            '1007': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1008': '상세정보참조',
            '1009': '상세정보참조',
            '1010': '상세정보참조'
        }
    },
    {
        infoCode: '11',
        infoName: '광학기기(디지털카메라/캠코더)',
        infoDetail: {
            '1101': ['상세정보참조', '상세정보참조'],
            '1102': ['상세정보참조', '상세정보참조'],
            '1103': '상세정보참조',
            '1104': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1105': '상세정보참조',
            '1106': ['상세정보참조', '상세정보참조'],
            '1107': '상세정보참조',
            '1108': '상세정보참조',
            '1109': '상세정보참조'
        }
    },
    {
        infoCode: '12',
        infoName: '소형가전(MP3/전자사전 등)',
        infoDetail: {
            '1201': ['상세정보참조', '상세정보참조'],
            '1202': ['상세정보참조', '상세정보참조'],
            '1203': ['상세정보참조', '상세정보참조'],
            '1204': '상세정보참조',
            '1205': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1206': '상세정보참조',
            '1207': ['상세정보참조', '상세정보참조'],
            '1208': '상세정보참조',
            '1209': '상세정보참조',
            '1210': '상세정보참조'
        }
    },
    {
        infoCode: '13',
        infoName: '휴대폰',
        infoDetail: {
            '1301': ['상세정보참조', '상세정보참조'],
            '1302': ['상세정보참조', '상세정보참조'],
            '1303': '상세정보참조',
            '1304': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1305': '상세정보참조',
            '1306': ['상세정보참조', '상세정보참조'],
            '1307': '상세정보참조',
            '1308': '상세정보참조',
            '1309': '상세정보참조',
            '1310': '상세정보참조',
            '1311': '상세정보참조',
            '1312': '상세정보참조'
        }
    },
    {
        infoCode: '14',
        infoName: '내비게이션',
        infoDetail: {
            '1401': ['상세정보참조', '상세정보참조'],
            '1402': ['상세정보참조', '상세정보참조'],
            '1403': ['상세정보참조', '상세정보참조'],
            '1404': '상세정보참조',
            '1405': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1406': '상세정보참조',
            '1407': ['상세정보참조', '상세정보참조'],
            '1408': '상세정보참조',
            '1409': ['상세정보참조', '상세정보참조'],
            '1410': '상세정보참조',
            '1411': '상세정보참조'
        }
    },
    {
        infoCode: '15',
        infoName: '자동차용품(자동차부품/기타 자동차용품)',
        infoDetail: {
            '1501': ['상세정보참조', '상세정보참조'],
            '1502': '상세정보참조',
            '1503': ['상세정보참조', '상세정보참조'],
            '1504': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1505': '상세정보참조',
            '1506': '상세정보참조',
            '1507': '상세정보참조',
            '1508': '상세정보참조',
            '1509': '상세정보참조',
            '1510': '상세정보참조',
            '1511': '상세정보참조'
        }
    },
    {
        infoCode: '16',
        infoName: '의료기기',
        infoDetail: {
            '1601': ['상세정보참조', '상세정보참조'],
            '1602': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1603': ['상세정보참조', '상세정보참조'],
            '1604': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1605': '상세정보참조',
            '1606': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1607': '상세정보참조',
            '1608': ['상세정보참조', '상세정보참조'],
            '1609': '상세정보참조',
            '1610': '상세정보참조',
            '1611': '상세정보참조'
        }
    },
    {
        infoCode: '17',
        infoName: '주방용품',
        infoDetail: {
            '1701': ['상세정보참조', '상세정보참조'],
            '1702': '상세정보참조',
            '1703': '상세정보참조',
            '1704': '상세정보참조',
            '1705': '상세정보참조',
            '1706': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1707': '상세정보참조',
            '1708': '상세정보참조',
            '1709': '상세정보참조',
            '1710': '상세정보참조'
        }
    },
    {
        infoCode: '18',
        infoName: '화장품',
        infoDetail: {
            '1801': '상세정보참조',
            '1802': '상세정보참조',
            '1803': '상세정보참조',
            '1804': '상세정보참조',
            '1805': ['상세정보참조', '상세정보참조'],
            '1806': '상세정보참조',
            '1807': ['상세정보참조', '상세정보참조'],
            '1808': ['상세정보참조', '상세정보참조'],
            '1809': '상세정보참조',
            '1810': '상세정보참조',
            '1811': '상세정보참조'
        }
    },
    {
        infoCode: '19',
        infoName: '귀금속/보석/시계류',
        infoDetail: {
            '1901': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1902': '상세정보참조',
            '1903': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '1904': '상세정보참조',
            '1905': '상세정보참조',
            '1906': '상세정보참조',
            '1907': ['상세정보참조', '상세정보참조'],
            '1908': '상세정보참조',
            '1909': '상세정보참조',
            '1910': '상세정보참조'
        }
    },
    {
        infoCode: '20A',
        infoName: '식품(농산물)',
        infoDetail: {
            '20A01': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20A02': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20A03': '상세정보참조',
            '20A04': ['상세정보참조', '상세정보참조'],
            '20A05': ['상세정보참조', '상세정보참조'],
            '20A08': '상세정보참조',
            '20A09': '상세정보참조',
            '20A10': '상세정보참조',
            '20A11': '상세정보참조',
            '20A12': '상세정보참조',
            '20A13': '상세정보참조'
        }
    },
    {
        infoCode: '20B',
        infoName: '식품(축산물)',
        infoDetail: {
            '20B01': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20B02': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20B03': '상세정보참조',
            '20B04': ['상세정보참조', '상세정보참조'],
            '20B06': ['상세정보참조', '상세정보참조'],
            '20B08': '상세정보참조',
            '20B09': '상세정보참조',
            '20B10': '상세정보참조',
            '20B11': '상세정보참조',
            '20B12': '상세정보참조',
            '20B13': '상세정보참조'
        }
    },
    {
        infoCode: '20C',
        infoName: '식품(수산물)',
        infoDetail: {
            '20C01': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20C02': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '20C03': '상세정보참조',
            '20C04': ['상세정보참조', '상세정보참조'],
            '20C07': ['상세정보참조', '상세정보참조'],
            '20C08': '상세정보참조',
            '20C09': '상세정보참조',
            '20C10': '상세정보참조',
            '20C11': '상세정보참조',
            '20C12': '상세정보참조',
            '20C13': '상세정보참조'
        }
    },
    {
        infoCode: '21',
        infoName: '가공식품',
        infoDetail: {
            '2101': '상세정보참조',
            '2102': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '2103': ['상세정보참조', '상세정보참조'],
            '2104': ['상세정보참조', '상세정보참조'],
            '2105': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '2106': '상세정보참조',
            '2107': '상세정보참조',
            '2108': '상세정보참조',
            '2109': '상세정보참조',
            '2110': '상세정보참조',
            '2111': ['상세정보참조', '상세정보참조'],
            '2112': '상세정보참조',
            '2113': '상세정보참조',
            '2114': '상세정보참조'
        }
    },
    {
        infoCode: '22',
        infoName: '건강기능식품',
        infoDetail: {
            '2201': '상세정보참조',
            '2202': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '2203': ['상세정보참조', '상세정보참조'],
            '2204': ['상세정보참조', '상세정보참조'],
            '2205': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '2206': '상세정보참조',
            '2207': '상세정보참조',
            '2208': '상세정보참조',
            '2209': '상세정보참조',
            '2210': '상세정보참조',
            '2211': '상세정보참조',
            '2212': '상세정보참조',
            '2213': '상세정보참조',
            '2214': ['상세정보참조', '상세정보참조'],
            '2215': ['상세정보참조', '상세정보참조']
        }
    },
    {
        infoCode: '23',
        infoName: '영유아용품',
        infoDetail: {
            '2301': ['상세정보참조', '상세정보참조'],
            '2302': ['상세정보참조', '상세정보참조'],
            '2303': ['상세정보참조', '상세정보참조'],
            '2304': '상세정보참조',
            '2305': '상세정보참조',
            '2306': '상세정보참조',
            '2307': '상세정보참조',
            '2308': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '2309': '상세정보참조',
            '2310': '상세정보참조',
            '2311': '상세정보참조',
            '2312': '상세정보참조'
        }
    },
    {
        infoCode: '24',
        infoName: '악기',
        infoDetail: {
            '2401': ['상세정보참조', '상세정보참조'],
            '2402': '상세정보참조',
            '2403': '상세정보참조',
            '2404': '상세정보참조',
            '2405': '상세정보참조',
            '2406': '상세정보참조',
            '2407': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '2408': '상세정보참조',
            '2409': '상세정보참조',
            '2410': '상세정보참조',
            '2411': '상세정보참조'
        }
    },
    {
        infoCode: '25',
        infoName: '스포츠용품',
        infoDetail: {
            '2501': ['상세정보참조', '상세정보참조'],
            '2502': ['상세정보참조', '상세정보참조'],
            '2503': '상세정보참조',
            '2504': '상세정보참조',
            '2505': '상세정보참조',
            '2506': '상세정보참조',
            '2507': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '2508': '상세정보참조',
            '2509': '상세정보참조',
            '2510': '상세정보참조',
            '2511': '상세정보참조'
        }
    },
    {
        infoCode: '26',
        infoName: '서적',
        infoDetail: {
            '2601': '상세정보참조',
            '2602': ['상세정보참조', '상세정보참조'],
            '2603': ['상세정보참조', '상세정보참조'],
            '2604': '상세정보참조',
            '2605': '상세정보참조',
            '2606': '상세정보참조',
            '2607': '상세정보참조',
            '2608': '상세정보참조'
        }
    },
    {
        infoCode: '27',
        infoName: '호텔 / 펜션 예약',
        infoDetail: {
            '2701': '상세정보참조',
            '2702': '상세정보참조',
            '2703': ['상세정보참조', '상세정보참조'],
            '2704': ['상세정보참조', '상세정보참조'],
            '2705': ['상세정보참조', '상세정보참조'],
            '2706': '상세정보참조',
            '2707': '상세정보참조'
        }
    },
    {
        infoCode: '28',
        infoName: '여행 상품',
        infoDetail: {
            '2801': '상세정보참조',
            '2802': '상세정보참조',
            '2803': ['상세정보참조', '상세정보참조'],
            '2804': ['상세정보참조', '상세정보참조'],
            '2805': '상세정보참조',
            '2806': '상세정보참조',
            '2807': '상세정보참조',
            '2808': '상세정보참조',
            '2809': '상세정보참조',
            '2810': '상세정보참조'
        }
    },
    {
        infoCode: '29',
        infoName: '항공권',
        infoDetail: {
            '2901': ['상세정보참조', '상세정보참조'],
            '2902': '상세정보참조',
            '2903': '상세정보참조',
            '2904': '상세정보참조',
            '2905': '상세정보참조',
            '2906': '상세정보참조',
            '2907': '상세정보참조',
            '2908': '상세정보참조'
        }
    },
    {
        infoCode: '30',
        infoName: '자동차 대여 서비스 (렌터카)',
        infoDetail: {
            '3001': '상세정보참조',
            '3002': '상세정보참조',
            '3003': '상세정보참조',
            '3004': '상세정보참조',
            '3005': '상세정보참조',
            '3006': '상세정보참조',
            '3007': '상세정보참조'
        }
    },
    {
        infoCode: '31',
        infoName: '물품대여 서비스 (정수기/비데/공기청정기 등)',
        infoDetail: {
            '3101': ['상세정보참조', '상세정보참조'],
            '3102': '상세정보참조',
            '3103': '상세정보참조',
            '3104': '상세정보참조',
            '3105': '상세정보참조',
            '3106': '상세정보참조',
            '3107': '상세정보참조'
        }
    },
    {
        infoCode: '32',
        infoName: '물품대여 서비스 (서적/유아용품/행사용품 등)',
        infoDetail: {
            '3201': ['상세정보참조', '상세정보참조'],
            '3202': '상세정보참조',
            '3203': '상세정보참조',
            '3204': '상세정보참조',
            '3205': '상세정보참조'
        }
    },
    {
        infoCode: '33',
        infoName: '디지털 콘텐츠 (음원/게임/인터넷강의 등)',
        infoDetail: {
            '3301': '상세정보참조',
            '3302': ['상세정보참조', '상세정보참조'],
            '3303': '상세정보참조',
            '3304': '상세정보참조',
            '3305': '상세정보참조',
            '3306': '상세정보참조'
        }
    },
    {
        infoCode: '34',
        infoName: '상품권 / 쿠폰',
        infoDetail: {
            '3401': '상세정보참조',
            '3402': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '3403': '상세정보참조',
            '3404': '상세정보참조',
            '3405': '상세정보참조'
        }
    },
    {
        infoCode: '35',
        infoName: '기타재화',
        infoDetail: {
            '3501': ['상세정보참조', '상세정보참조'],
            '3502': '상세정보참조',
            '3503': '상세정보참조',
            '3504': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '3505': '상세정보참조'
        }
    },
    {
        infoCode: '36',
        infoName: '모바일쿠폰',
        infoDetail: {
            '3601': '상세정보참조',
            '3602': ['상세정보참조', '상세정보참조'],
            '3603': '상세정보참조',
            '3604': '상세정보참조',
            '3605': '상세정보참조'
        }
    },
    {
        infoCode: '37',
        infoName: '영화/공연',
        infoDetail: {
            '3701': '상세정보참조',
            '3702': '상세정보참조',
            '3703': '상세정보참조',
            '3704': '상세정보참조',
            '3705': '상세정보참조',
            '3706': '상세정보참조',
            '3707': '상세정보참조',
            '3708': '상세정보참조'
        }
    },
    {
        infoCode: '38',
        infoName: '기타용역',
        infoDetail: {
            '3801': '상세정보참조',
            '3802': '상세정보참조',
            '3803': '상세정보참조',
            '3804': '상세정보참조',
            '3805': '상세정보참조',
            '3806': '상세정보참조'
        }
    },
    {
        infoCode: '39',
        infoName: '생활화학제품',
        infoDetail: {
            '3901': '상세정보참조',
            '3902': ['상세정보참조', '상세정보참조'],
            '3903': ['상세정보참조', '상세정보참조'],
            '3904': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '3905': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '3906': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '3907': '상세정보참조',
            '3908': '상세정보참조',
            '3909': '상세정보참조',
            '3910': '상세정보참조',
            '3911': '상세정보참조'
        }
    },
    {
        infoCode: '40',
        infoName: '살생물제품',
        infoDetail: {
            '4001': ['상세정보참조', '상세정보참조'],
            '4002': ['상세정보참조', '상세정보참조'],
            '4003': ['상세정보참조', '상세정보참조'],
            '4004': ['상세정보참조', '상세정보참조'],
            '4005': ['상세정보참조', '상세정보참조', '상세정보참조', '상세정보참조'],
            '4006': '상세정보참조',
            '4007': ['상세정보참조', '상세정보참조', '상세정보참조'],
            '4008': '상세정보참조',
            '4009': ['상세정보참조', '상세정보참조'],
            '4010': '상세정보참조',
            '4011': '상세정보참조'
        }
    }
]

export const query_siil = extendType({
    type: "Query",
    definition(t) {
        t.field("selectSiilInfoBySomeone", {
            type: nonNull(list(nonNull("SiilItems"))),
            args: {
                code: nonNull(stringArg())
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const a = siilInfo.find(v => v.infoCode === args.code);
                    if (!a) return throwError(errors.noSuchData, ctx);
                    return a.data
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});