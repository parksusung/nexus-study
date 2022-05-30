import { FileUpload } from "./types"

import { Context } from "./types"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AdminOrderByWithRelationInput: { // input type
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    created_token?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    login_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    password?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByRelationAggregateInput'] | null; // ProductOrderByRelationAggregateInput
    state?: NexusGenEnums['SortOrder'] | null; // SortOrder
    token?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  AdminWhereInput: { // input type
    AND?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    NOT?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    OR?: NexusGenInputs['AdminWhereInput'][] | null; // [AdminWhereInput!]
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    created_token?: NexusGenInputs['DateTimeNullableFilter'] | null; // DateTimeNullableFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    login_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    password?: NexusGenInputs['StringFilter'] | null; // StringFilter
    product?: NexusGenInputs['ProductListRelationFilter'] | null; // ProductListRelationFilter
    state?: NexusGenInputs['EnumAdminStateFilter'] | null; // EnumAdminStateFilter
    token?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
  }
  BoolFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: NexusGenInputs['NestedBoolFilter'] | null; // NestedBoolFilter
  }
  CategoryOrderByWithRelationInput: { // input type
    a077_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    a112_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    b378_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c1?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c1_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c2?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c2_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c3?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c3_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c4?: NexusGenEnums['SortOrder'] | null; // SortOrder
    c4_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByRelationAggregateInput'] | null; // ProductOrderByRelationAggregateInput
    siil_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  CategoryWhereInput: { // input type
    AND?: NexusGenInputs['CategoryWhereInput'][] | null; // [CategoryWhereInput!]
    NOT?: NexusGenInputs['CategoryWhereInput'][] | null; // [CategoryWhereInput!]
    OR?: NexusGenInputs['CategoryWhereInput'][] | null; // [CategoryWhereInput!]
    a077_code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    a112_code?: NexusGenInputs['IntFilter'] | null; // IntFilter
    b378_code?: NexusGenInputs['IntFilter'] | null; // IntFilter
    c1?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c1_name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c2?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c2_name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c3?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c3_name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c4?: NexusGenInputs['StringFilter'] | null; // StringFilter
    c4_name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product?: NexusGenInputs['ProductListRelationFilter'] | null; // ProductListRelationFilter
    siil_code?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  DateTimeFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeFilter'] | null; // NestedDateTimeFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  DateTimeNullableFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeNullableFilter'] | null; // NestedDateTimeNullableFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  EnumAdminStateFilter: { // input type
    equals?: NexusGenEnums['AdminState'] | null; // AdminState
    in?: NexusGenEnums['AdminState'][] | null; // [AdminState!]
    not?: NexusGenInputs['NestedEnumAdminStateFilter'] | null; // NestedEnumAdminStateFilter
    notIn?: NexusGenEnums['AdminState'][] | null; // [AdminState!]
  }
  EnumProductStateFilter: { // input type
    equals?: NexusGenEnums['ProductState'] | null; // ProductState
    in?: NexusGenEnums['ProductState'][] | null; // [ProductState!]
    not?: NexusGenInputs['NestedEnumProductStateFilter'] | null; // NestedEnumProductStateFilter
    notIn?: NexusGenEnums['ProductState'][] | null; // [ProductState!]
  }
  EnumProductStoreLogUploadStateFilter: { // input type
    equals?: NexusGenEnums['ProductStoreLogUploadState'] | null; // ProductStoreLogUploadState
    in?: NexusGenEnums['ProductStoreLogUploadState'][] | null; // [ProductStoreLogUploadState!]
    not?: NexusGenInputs['NestedEnumProductStoreLogUploadStateFilter'] | null; // NestedEnumProductStoreLogUploadStateFilter
    notIn?: NexusGenEnums['ProductStoreLogUploadState'][] | null; // [ProductStoreLogUploadState!]
  }
  EnumPurchaseLogStateFilter: { // input type
    equals?: NexusGenEnums['PurchaseLogState'] | null; // PurchaseLogState
    in?: NexusGenEnums['PurchaseLogState'][] | null; // [PurchaseLogState!]
    not?: NexusGenInputs['NestedEnumPurchaseLogStateFilter'] | null; // NestedEnumPurchaseLogStateFilter
    notIn?: NexusGenEnums['PurchaseLogState'][] | null; // [PurchaseLogState!]
  }
  EnumPurchaseLogTypeFilter: { // input type
    equals?: NexusGenEnums['PurchaseLogType'] | null; // PurchaseLogType
    in?: NexusGenEnums['PurchaseLogType'][] | null; // [PurchaseLogType!]
    not?: NexusGenInputs['NestedEnumPurchaseLogTypeFilter'] | null; // NestedEnumPurchaseLogTypeFilter
    notIn?: NexusGenEnums['PurchaseLogType'][] | null; // [PurchaseLogType!]
  }
  EnumUserStateFilter: { // input type
    equals?: NexusGenEnums['UserState'] | null; // UserState
    in?: NexusGenEnums['UserState'][] | null; // [UserState!]
    not?: NexusGenInputs['NestedEnumUserStateFilter'] | null; // NestedEnumUserStateFilter
    notIn?: NexusGenEnums['UserState'][] | null; // [UserState!]
  }
  FloatFilter: { // input type
    equals?: number | null; // Float
    gt?: number | null; // Float
    gte?: number | null; // Float
    in?: number[] | null; // [Float!]
    lt?: number | null; // Float
    lte?: number | null; // Float
    not?: NexusGenInputs['NestedFloatFilter'] | null; // NestedFloatFilter
    notIn?: number[] | null; // [Float!]
  }
  IntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntFilter'] | null; // NestedIntFilter
    notIn?: number[] | null; // [Int!]
  }
  IntNullableFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntNullableFilter'] | null; // NestedIntNullableFilter
    notIn?: number[] | null; // [Int!]
  }
  NestedBoolFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: NexusGenInputs['NestedBoolFilter'] | null; // NestedBoolFilter
  }
  NestedDateTimeFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeFilter'] | null; // NestedDateTimeFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  NestedDateTimeNullableFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['NestedDateTimeNullableFilter'] | null; // NestedDateTimeNullableFilter
    notIn?: NexusGenScalars['DateTime'][] | null; // [DateTime!]
  }
  NestedEnumAdminStateFilter: { // input type
    equals?: NexusGenEnums['AdminState'] | null; // AdminState
    in?: NexusGenEnums['AdminState'][] | null; // [AdminState!]
    not?: NexusGenInputs['NestedEnumAdminStateFilter'] | null; // NestedEnumAdminStateFilter
    notIn?: NexusGenEnums['AdminState'][] | null; // [AdminState!]
  }
  NestedEnumProductStateFilter: { // input type
    equals?: NexusGenEnums['ProductState'] | null; // ProductState
    in?: NexusGenEnums['ProductState'][] | null; // [ProductState!]
    not?: NexusGenInputs['NestedEnumProductStateFilter'] | null; // NestedEnumProductStateFilter
    notIn?: NexusGenEnums['ProductState'][] | null; // [ProductState!]
  }
  NestedEnumProductStoreLogUploadStateFilter: { // input type
    equals?: NexusGenEnums['ProductStoreLogUploadState'] | null; // ProductStoreLogUploadState
    in?: NexusGenEnums['ProductStoreLogUploadState'][] | null; // [ProductStoreLogUploadState!]
    not?: NexusGenInputs['NestedEnumProductStoreLogUploadStateFilter'] | null; // NestedEnumProductStoreLogUploadStateFilter
    notIn?: NexusGenEnums['ProductStoreLogUploadState'][] | null; // [ProductStoreLogUploadState!]
  }
  NestedEnumPurchaseLogStateFilter: { // input type
    equals?: NexusGenEnums['PurchaseLogState'] | null; // PurchaseLogState
    in?: NexusGenEnums['PurchaseLogState'][] | null; // [PurchaseLogState!]
    not?: NexusGenInputs['NestedEnumPurchaseLogStateFilter'] | null; // NestedEnumPurchaseLogStateFilter
    notIn?: NexusGenEnums['PurchaseLogState'][] | null; // [PurchaseLogState!]
  }
  NestedEnumPurchaseLogTypeFilter: { // input type
    equals?: NexusGenEnums['PurchaseLogType'] | null; // PurchaseLogType
    in?: NexusGenEnums['PurchaseLogType'][] | null; // [PurchaseLogType!]
    not?: NexusGenInputs['NestedEnumPurchaseLogTypeFilter'] | null; // NestedEnumPurchaseLogTypeFilter
    notIn?: NexusGenEnums['PurchaseLogType'][] | null; // [PurchaseLogType!]
  }
  NestedEnumUserStateFilter: { // input type
    equals?: NexusGenEnums['UserState'] | null; // UserState
    in?: NexusGenEnums['UserState'][] | null; // [UserState!]
    not?: NexusGenInputs['NestedEnumUserStateFilter'] | null; // NestedEnumUserStateFilter
    notIn?: NexusGenEnums['UserState'][] | null; // [UserState!]
  }
  NestedFloatFilter: { // input type
    equals?: number | null; // Float
    gt?: number | null; // Float
    gte?: number | null; // Float
    in?: number[] | null; // [Float!]
    lt?: number | null; // Float
    lte?: number | null; // Float
    not?: NexusGenInputs['NestedFloatFilter'] | null; // NestedFloatFilter
    notIn?: number[] | null; // [Float!]
  }
  NestedIntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntFilter'] | null; // NestedIntFilter
    notIn?: number[] | null; // [Int!]
  }
  NestedIntNullableFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['NestedIntNullableFilter'] | null; // NestedIntNullableFilter
    notIn?: number[] | null; // [Int!]
  }
  NestedStringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringFilter'] | null; // NestedStringFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  NestedStringNullableFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringNullableFilter'] | null; // NestedStringNullableFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  ProductListRelationFilter: { // input type
    every?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    none?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    some?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
  }
  ProductOptionListRelationFilter: { // input type
    every?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    none?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    some?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
  }
  ProductOptionNameListRelationFilter: { // input type
    every?: NexusGenInputs['ProductOptionNameWhereInput'] | null; // ProductOptionNameWhereInput
    none?: NexusGenInputs['ProductOptionNameWhereInput'] | null; // ProductOptionNameWhereInput
    some?: NexusGenInputs['ProductOptionNameWhereInput'] | null; // ProductOptionNameWhereInput
  }
  ProductOptionNameOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionNameOrderByWithRelationInput: { // input type
    has_image?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_name_translated?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    order?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByWithRelationInput'] | null; // ProductOrderByWithRelationInput
    product_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_option_value?: NexusGenInputs['ProductOptionValueOrderByRelationAggregateInput'] | null; // ProductOptionValueOrderByRelationAggregateInput
    taobao_pid?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionNameUpdateInput: { // input type
    id: number; // Int!
    name: string; // String!
  }
  ProductOptionNameWhereInput: { // input type
    AND?: NexusGenInputs['ProductOptionNameWhereInput'][] | null; // [ProductOptionNameWhereInput!]
    NOT?: NexusGenInputs['ProductOptionNameWhereInput'][] | null; // [ProductOptionNameWhereInput!]
    OR?: NexusGenInputs['ProductOptionNameWhereInput'][] | null; // [ProductOptionNameWhereInput!]
    has_image?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    is_name_translated?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    order?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    product_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product_option_value?: NexusGenInputs['ProductOptionValueListRelationFilter'] | null; // ProductOptionValueListRelationFilter
    taobao_pid?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  ProductOptionNameWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
  ProductOptionOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionOrderByWithRelationInput: { // input type
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_active?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_string?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_value1_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_value2_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_value3_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    price?: NexusGenEnums['SortOrder'] | null; // SortOrder
    price_cny?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByWithRelationInput'] | null; // ProductOrderByWithRelationInput
    product_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_option1?: NexusGenInputs['ProductOptionValueOrderByWithRelationInput'] | null; // ProductOptionValueOrderByWithRelationInput
    product_option2?: NexusGenInputs['ProductOptionValueOrderByWithRelationInput'] | null; // ProductOptionValueOrderByWithRelationInput
    product_option3?: NexusGenInputs['ProductOptionValueOrderByWithRelationInput'] | null; // ProductOptionValueOrderByWithRelationInput
    stock?: NexusGenEnums['SortOrder'] | null; // SortOrder
    taobao_sku_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionUQ_product_id_sku_idCompoundUniqueInput: { // input type
    product_id: number; // Int!
    taobao_sku_id: string; // String!
  }
  ProductOptionUQ_product_optionCompoundUniqueInput: { // input type
    option_value1_id: number; // Int!
    option_value2_id: number; // Int!
    option_value3_id: number; // Int!
  }
  ProductOptionUpdateInput: { // input type
    id: number; // Int!
    isActive: boolean; // Boolean!
    price: number; // Int!
    stock: number; // Int!
  }
  ProductOptionValueImageUpdateInput: { // input type
    id: number; // Int!
    image?: string | null; // String
    newImageBase64?: string | null; // String
  }
  ProductOptionValueListRelationFilter: { // input type
    every?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    none?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    some?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
  }
  ProductOptionValueOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionValueOrderByWithRelationInput: { // input type
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    image?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_active?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_name_translated?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    number?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_name_order?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_value1?: NexusGenInputs['ProductOptionOrderByRelationAggregateInput'] | null; // ProductOptionOrderByRelationAggregateInput
    option_value2?: NexusGenInputs['ProductOptionOrderByRelationAggregateInput'] | null; // ProductOptionOrderByRelationAggregateInput
    option_value3?: NexusGenInputs['ProductOptionOrderByRelationAggregateInput'] | null; // ProductOptionOrderByRelationAggregateInput
    product_option_name?: NexusGenInputs['ProductOptionNameOrderByWithRelationInput'] | null; // ProductOptionNameOrderByWithRelationInput
    product_option_name_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    taobao_vid?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOptionValueUpdateInput: { // input type
    id: number; // Int!
    image?: string | null; // String
    isActive?: boolean | null; // Boolean
    name: string; // String!
    newImage?: NexusGenScalars['Upload'] | null; // Upload
    newImageBase64?: string | null; // String
  }
  ProductOptionValueWhereInput: { // input type
    AND?: NexusGenInputs['ProductOptionValueWhereInput'][] | null; // [ProductOptionValueWhereInput!]
    NOT?: NexusGenInputs['ProductOptionValueWhereInput'][] | null; // [ProductOptionValueWhereInput!]
    OR?: NexusGenInputs['ProductOptionValueWhereInput'][] | null; // [ProductOptionValueWhereInput!]
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    image?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    is_active?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    is_name_translated?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    number?: NexusGenInputs['IntFilter'] | null; // IntFilter
    option_name_order?: NexusGenInputs['IntFilter'] | null; // IntFilter
    option_value1?: NexusGenInputs['ProductOptionListRelationFilter'] | null; // ProductOptionListRelationFilter
    option_value2?: NexusGenInputs['ProductOptionListRelationFilter'] | null; // ProductOptionListRelationFilter
    option_value3?: NexusGenInputs['ProductOptionListRelationFilter'] | null; // ProductOptionListRelationFilter
    product_option_name?: NexusGenInputs['ProductOptionNameWhereInput'] | null; // ProductOptionNameWhereInput
    product_option_name_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    taobao_vid?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  ProductOptionValueWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
  ProductOptionWhereInput: { // input type
    AND?: NexusGenInputs['ProductOptionWhereInput'][] | null; // [ProductOptionWhereInput!]
    NOT?: NexusGenInputs['ProductOptionWhereInput'][] | null; // [ProductOptionWhereInput!]
    OR?: NexusGenInputs['ProductOptionWhereInput'][] | null; // [ProductOptionWhereInput!]
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    is_active?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    option_string?: NexusGenInputs['StringFilter'] | null; // StringFilter
    option_value1_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    option_value2_id?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    option_value3_id?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    price?: NexusGenInputs['IntFilter'] | null; // IntFilter
    price_cny?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    product?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    product_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product_option1?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    product_option2?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    product_option3?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    stock?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    taobao_sku_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  ProductOptionWhereUniqueInput: { // input type
    UQ_product_id_sku_id?: NexusGenInputs['ProductOptionUQ_product_id_sku_idCompoundUniqueInput'] | null; // ProductOptionUQ_product_id_sku_idCompoundUniqueInput
    UQ_product_option?: NexusGenInputs['ProductOptionUQ_product_optionCompoundUniqueInput'] | null; // ProductOptionUQ_product_optionCompoundUniqueInput
    id?: number | null; // Int
  }
  ProductOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductOrderByWithRelationInput: { // input type
    admin?: NexusGenInputs['AdminOrderByWithRelationInput'] | null; // AdminOrderByWithRelationInput
    admin_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category?: NexusGenInputs['CategoryOrderByWithRelationInput'] | null; // CategoryOrderByWithRelationInput
    category_a001?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a001_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a006?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a006_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a027?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a027_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a077?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a077_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a112?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a112_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a113?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a113_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a524?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a524_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a525?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_a525_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b378?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b378_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b719?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b719_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b956?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_b956_name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    category_esm?: NexusGenEnums['SortOrder'] | null; // SortOrder
    cny_rate?: NexusGenEnums['SortOrder'] | null; // SortOrder
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    description?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    image_thumbnail_data?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_image_translated?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_name_translated?: NexusGenEnums['SortOrder'] | null; // SortOrder
    local_shipping_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    local_shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    margin_rate?: NexusGenEnums['SortOrder'] | null; // SortOrder
    margin_unit_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    modified_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    price?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_option?: NexusGenInputs['ProductOptionOrderByRelationAggregateInput'] | null; // ProductOptionOrderByRelationAggregateInput
    product_option_name?: NexusGenInputs['ProductOptionNameOrderByRelationAggregateInput'] | null; // ProductOptionNameOrderByRelationAggregateInput
    product_store?: NexusGenInputs['ProductStoreOrderByRelationAggregateInput'] | null; // ProductStoreOrderByRelationAggregateInput
    search_tags?: NexusGenEnums['SortOrder'] | null; // SortOrder
    shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    siil_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    siil_data?: NexusGenEnums['SortOrder'] | null; // SortOrder
    state?: NexusGenEnums['SortOrder'] | null; // SortOrder
    stock_updated_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    taobao_product?: NexusGenInputs['TaobaoProductOrderByWithRelationInput'] | null; // TaobaoProductOrderByWithRelationInput
    taobao_product_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    user?: NexusGenInputs['UserOrderByWithRelationInput'] | null; // UserOrderByWithRelationInput
    user_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductStoreListRelationFilter: { // input type
    every?: NexusGenInputs['ProductStoreWhereInput'] | null; // ProductStoreWhereInput
    none?: NexusGenInputs['ProductStoreWhereInput'] | null; // ProductStoreWhereInput
    some?: NexusGenInputs['ProductStoreWhereInput'] | null; // ProductStoreWhereInput
  }
  ProductStoreLogListRelationFilter: { // input type
    every?: NexusGenInputs['ProductStoreLogWhereInput'] | null; // ProductStoreLogWhereInput
    none?: NexusGenInputs['ProductStoreLogWhereInput'] | null; // ProductStoreLogWhereInput
    some?: NexusGenInputs['ProductStoreLogWhereInput'] | null; // ProductStoreLogWhereInput
  }
  ProductStoreLogOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductStoreLogOrderByWithRelationInput: { // input type
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    dest_state?: NexusGenEnums['SortOrder'] | null; // SortOrder
    error_message?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    job_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    modified_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_store?: NexusGenInputs['ProductStoreOrderByWithRelationInput'] | null; // ProductStoreOrderByWithRelationInput
    product_store_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_store_state?: NexusGenInputs['ProductStoreStateOrderByWithRelationInput'] | null; // ProductStoreStateOrderByWithRelationInput
    upload_state?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductStoreLogWhereInput: { // input type
    AND?: NexusGenInputs['ProductStoreLogWhereInput'][] | null; // [ProductStoreLogWhereInput!]
    NOT?: NexusGenInputs['ProductStoreLogWhereInput'][] | null; // [ProductStoreLogWhereInput!]
    OR?: NexusGenInputs['ProductStoreLogWhereInput'][] | null; // [ProductStoreLogWhereInput!]
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    dest_state?: NexusGenInputs['IntFilter'] | null; // IntFilter
    error_message?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    job_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    modified_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    product_store?: NexusGenInputs['ProductStoreWhereInput'] | null; // ProductStoreWhereInput
    product_store_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product_store_state?: NexusGenInputs['ProductStoreStateWhereInput'] | null; // ProductStoreStateWhereInput
    upload_state?: NexusGenInputs['EnumProductStoreLogUploadStateFilter'] | null; // EnumProductStoreLogUploadStateFilter
  }
  ProductStoreLogWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
  ProductStoreOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductStoreOrderByWithRelationInput: { // input type
    connected_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    etc_vendor_item_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByWithRelationInput'] | null; // ProductOrderByWithRelationInput
    product_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_store_log?: NexusGenInputs['ProductStoreLogOrderByRelationAggregateInput'] | null; // ProductStoreLogOrderByRelationAggregateInput
    product_store_state?: NexusGenInputs['ProductStoreStateOrderByWithRelationInput'] | null; // ProductStoreStateOrderByWithRelationInput
    site_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    state?: NexusGenEnums['SortOrder'] | null; // SortOrder
    store_product_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    store_url?: NexusGenEnums['SortOrder'] | null; // SortOrder
    user?: NexusGenInputs['UserOrderByWithRelationInput'] | null; // UserOrderByWithRelationInput
    user_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductStoreStateOrderByWithRelationInput: { // input type
    description?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_store?: NexusGenInputs['ProductStoreOrderByRelationAggregateInput'] | null; // ProductStoreOrderByRelationAggregateInput
    product_store_log?: NexusGenInputs['ProductStoreLogOrderByRelationAggregateInput'] | null; // ProductStoreLogOrderByRelationAggregateInput
  }
  ProductStoreStateWhereInput: { // input type
    AND?: NexusGenInputs['ProductStoreStateWhereInput'][] | null; // [ProductStoreStateWhereInput!]
    NOT?: NexusGenInputs['ProductStoreStateWhereInput'][] | null; // [ProductStoreStateWhereInput!]
    OR?: NexusGenInputs['ProductStoreStateWhereInput'][] | null; // [ProductStoreStateWhereInput!]
    description?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    product_store?: NexusGenInputs['ProductStoreListRelationFilter'] | null; // ProductStoreListRelationFilter
    product_store_log?: NexusGenInputs['ProductStoreLogListRelationFilter'] | null; // ProductStoreLogListRelationFilter
  }
  ProductStoreWhereInput: { // input type
    AND?: NexusGenInputs['ProductStoreWhereInput'][] | null; // [ProductStoreWhereInput!]
    NOT?: NexusGenInputs['ProductStoreWhereInput'][] | null; // [ProductStoreWhereInput!]
    OR?: NexusGenInputs['ProductStoreWhereInput'][] | null; // [ProductStoreWhereInput!]
    connected_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    etc_vendor_item_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    product_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product_store_log?: NexusGenInputs['ProductStoreLogListRelationFilter'] | null; // ProductStoreLogListRelationFilter
    product_store_state?: NexusGenInputs['ProductStoreStateWhereInput'] | null; // ProductStoreStateWhereInput
    site_code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    state?: NexusGenInputs['IntFilter'] | null; // IntFilter
    store_product_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    store_url?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
  }
  ProductStoreWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
  ProductThumbnailImageUpdateInput: { // input type
    defaultImage: string; // String!
    uploadImageBase64?: string | null; // String
  }
  ProductThumbnailUpdateInput: { // input type
    defaultImage: string; // String!
    uploadImage?: NexusGenScalars['Upload'] | null; // Upload
  }
  ProductUQ_user_id_taobao_product_idCompoundUniqueInput: { // input type
    taobao_product_id: number; // Int!
    user_id: number; // Int!
  }
  ProductWhereInput: { // input type
    AND?: NexusGenInputs['ProductWhereInput'][] | null; // [ProductWhereInput!]
    NOT?: NexusGenInputs['ProductWhereInput'][] | null; // [ProductWhereInput!]
    OR?: NexusGenInputs['ProductWhereInput'][] | null; // [ProductWhereInput!]
    admin?: NexusGenInputs['AdminWhereInput'] | null; // AdminWhereInput
    admin_id?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    category?: NexusGenInputs['CategoryWhereInput'] | null; // CategoryWhereInput
    category_a001?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a001_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a006?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a006_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a027?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a027_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a077?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a077_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a112?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a112_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a113?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a113_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a524?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a524_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a525?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_a525_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b378?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b378_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b719?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b719_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b956?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_b956_name?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_code?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    category_esm?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    cny_rate?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    description?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    image_thumbnail_data?: NexusGenInputs['StringFilter'] | null; // StringFilter
    is_image_translated?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    is_name_translated?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    local_shipping_code?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    local_shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    margin_rate?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    margin_unit_type?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    modified_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    price?: NexusGenInputs['IntFilter'] | null; // IntFilter
    product_code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    product_option?: NexusGenInputs['ProductOptionListRelationFilter'] | null; // ProductOptionListRelationFilter
    product_option_name?: NexusGenInputs['ProductOptionNameListRelationFilter'] | null; // ProductOptionNameListRelationFilter
    product_store?: NexusGenInputs['ProductStoreListRelationFilter'] | null; // ProductStoreListRelationFilter
    search_tags?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    siil_code?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    siil_data?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    state?: NexusGenInputs['EnumProductStateFilter'] | null; // EnumProductStateFilter
    stock_updated_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    taobao_product?: NexusGenInputs['TaobaoProductWhereInput'] | null; // TaobaoProductWhereInput
    taobao_product_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
  }
  ProductWhereUniqueInput: { // input type
    UQ_user_id_taobao_product_id?: NexusGenInputs['ProductUQ_user_id_taobao_product_idCompoundUniqueInput'] | null; // ProductUQ_user_id_taobao_product_idCompoundUniqueInput
    id?: number | null; // Int
  }
  PurchaseLogListRelationFilter: { // input type
    every?: NexusGenInputs['PurchaseLogWhereInput'] | null; // PurchaseLogWhereInput
    none?: NexusGenInputs['PurchaseLogWhereInput'] | null; // PurchaseLogWhereInput
    some?: NexusGenInputs['PurchaseLogWhereInput'] | null; // PurchaseLogWhereInput
  }
  PurchaseLogOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  PurchaseLogWhereInput: { // input type
    AND?: NexusGenInputs['PurchaseLogWhereInput'][] | null; // [PurchaseLogWhereInput!]
    NOT?: NexusGenInputs['PurchaseLogWhereInput'][] | null; // [PurchaseLogWhereInput!]
    OR?: NexusGenInputs['PurchaseLogWhereInput'][] | null; // [PurchaseLogWhereInput!]
    expired_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    pay_amount?: NexusGenInputs['IntFilter'] | null; // IntFilter
    pay_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    plan_info?: NexusGenInputs['StringFilter'] | null; // StringFilter
    purchased_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    state?: NexusGenInputs['EnumPurchaseLogStateFilter'] | null; // EnumPurchaseLogStateFilter
    type?: NexusGenInputs['EnumPurchaseLogTypeFilter'] | null; // EnumPurchaseLogTypeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
  }
  SiilInput: { // input type
    code: string; // String!
    value: string; // String!
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringFilter'] | null; // NestedStringFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  StringNullableFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: NexusGenInputs['NestedStringNullableFilter'] | null; // NestedStringNullableFilter
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  TaobaoProductOrderByWithRelationInput: { // input type
    brand?: NexusGenEnums['SortOrder'] | null; // SortOrder
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    image_thumbnail?: NexusGenEnums['SortOrder'] | null; // SortOrder
    modified_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
    original_data?: NexusGenEnums['SortOrder'] | null; // SortOrder
    price?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByRelationAggregateInput'] | null; // ProductOrderByRelationAggregateInput
    taobao_brand_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    taobao_category_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    taobao_num_iid?: NexusGenEnums['SortOrder'] | null; // SortOrder
    translate_data?: NexusGenEnums['SortOrder'] | null; // SortOrder
    video_url?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  TaobaoProductWhereInput: { // input type
    AND?: NexusGenInputs['TaobaoProductWhereInput'][] | null; // [TaobaoProductWhereInput!]
    NOT?: NexusGenInputs['TaobaoProductWhereInput'][] | null; // [TaobaoProductWhereInput!]
    OR?: NexusGenInputs['TaobaoProductWhereInput'][] | null; // [TaobaoProductWhereInput!]
    brand?: NexusGenInputs['StringFilter'] | null; // StringFilter
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    image_thumbnail?: NexusGenInputs['StringFilter'] | null; // StringFilter
    modified_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    original_data?: NexusGenInputs['StringFilter'] | null; // StringFilter
    price?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    product?: NexusGenInputs['ProductListRelationFilter'] | null; // ProductListRelationFilter
    taobao_brand_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    taobao_category_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    taobao_num_iid?: NexusGenInputs['StringFilter'] | null; // StringFilter
    translate_data?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    video_url?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
  }
  UserInfoOrderByWithRelationInput: { // input type
    additional_shipping_fee_jeju?: NexusGenEnums['SortOrder'] | null; // SortOrder
    as_information?: NexusGenEnums['SortOrder'] | null; // SortOrder
    as_tel?: NexusGenEnums['SortOrder'] | null; // SortOrder
    auction_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    cny_rate?: NexusGenEnums['SortOrder'] | null; // SortOrder
    collect_stock?: NexusGenEnums['SortOrder'] | null; // SortOrder
    collect_timeout?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_access_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_default_inbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_default_outbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_image_opt?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_login_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_maximum_buy_for_person?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_outbound_shipping_time_day?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_secret_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_union_delivery_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    coupang_vendor_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    default_shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    description_show_title?: NexusGenEnums['SortOrder'] | null; // SortOrder
    discount_amount?: NexusGenEnums['SortOrder'] | null; // SortOrder
    discount_unit_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    esmplus_auction_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    esmplus_gmarket_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    esmplus_master_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    exchange_shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    extra_shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    fix_image_bottom?: NexusGenEnums['SortOrder'] | null; // SortOrder
    fix_image_top?: NexusGenEnums['SortOrder'] | null; // SortOrder
    gmarket_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    interpark_cert_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    interpark_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    interpark_secret_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    lotteon_api_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    lotteon_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    lotteon_normal_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    lotteon_vendor_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    margin_rate?: NexusGenEnums['SortOrder'] | null; // SortOrder
    margin_unit_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    max_product_limit?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_origin?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_origin_code?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_store_only?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_store_url?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_align_top?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_index_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    option_twoways?: NexusGenEnums['SortOrder'] | null; // SortOrder
    phone?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product_collect_count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    refund_shipping_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_api_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_default_inbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_default_outbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_normal_api_key?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_normal_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_normal_inbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_normal_outbound?: NexusGenEnums['SortOrder'] | null; // SortOrder
    street_seller_type?: NexusGenEnums['SortOrder'] | null; // SortOrder
    tmon_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    tmon_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    user?: NexusGenInputs['UserOrderByWithRelationInput'] | null; // UserOrderByWithRelationInput
    user_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    wemakeprice_fee?: NexusGenEnums['SortOrder'] | null; // SortOrder
    wemakeprice_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  UserInfoWhereInput: { // input type
    AND?: NexusGenInputs['UserInfoWhereInput'][] | null; // [UserInfoWhereInput!]
    NOT?: NexusGenInputs['UserInfoWhereInput'][] | null; // [UserInfoWhereInput!]
    OR?: NexusGenInputs['UserInfoWhereInput'][] | null; // [UserInfoWhereInput!]
    additional_shipping_fee_jeju?: NexusGenInputs['IntFilter'] | null; // IntFilter
    as_information?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    as_tel?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    auction_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    cny_rate?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    collect_stock?: NexusGenInputs['IntFilter'] | null; // IntFilter
    collect_timeout?: NexusGenInputs['IntFilter'] | null; // IntFilter
    coupang_access_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_default_inbound?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_default_outbound?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    coupang_image_opt?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_login_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_maximum_buy_for_person?: NexusGenInputs['IntFilter'] | null; // IntFilter
    coupang_outbound_shipping_time_day?: NexusGenInputs['IntFilter'] | null; // IntFilter
    coupang_secret_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_union_delivery_type?: NexusGenInputs['StringFilter'] | null; // StringFilter
    coupang_vendor_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    default_shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    description_show_title?: NexusGenInputs['StringFilter'] | null; // StringFilter
    discount_amount?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    discount_unit_type?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    esmplus_auction_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    esmplus_gmarket_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    esmplus_master_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    exchange_shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    extra_shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    fix_image_bottom?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    fix_image_top?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    gmarket_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    interpark_cert_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    interpark_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    interpark_secret_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    lotteon_api_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    lotteon_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    lotteon_normal_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    lotteon_vendor_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    margin_rate?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    margin_unit_type?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    max_product_limit?: NexusGenInputs['IntNullableFilter'] | null; // IntNullableFilter
    naver_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    naver_origin?: NexusGenInputs['StringFilter'] | null; // StringFilter
    naver_origin_code?: NexusGenInputs['StringFilter'] | null; // StringFilter
    naver_store_only?: NexusGenInputs['StringFilter'] | null; // StringFilter
    naver_store_url?: NexusGenInputs['StringFilter'] | null; // StringFilter
    option_align_top?: NexusGenInputs['StringFilter'] | null; // StringFilter
    option_index_type?: NexusGenInputs['IntFilter'] | null; // IntFilter
    option_twoways?: NexusGenInputs['StringFilter'] | null; // StringFilter
    phone?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    product_collect_count?: NexusGenInputs['IntFilter'] | null; // IntFilter
    refund_shipping_fee?: NexusGenInputs['IntFilter'] | null; // IntFilter
    street_api_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    street_default_inbound?: NexusGenInputs['StringFilter'] | null; // StringFilter
    street_default_outbound?: NexusGenInputs['StringFilter'] | null; // StringFilter
    street_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    street_normal_api_key?: NexusGenInputs['StringFilter'] | null; // StringFilter
    street_normal_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    street_normal_inbound?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    street_normal_outbound?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    street_seller_type?: NexusGenInputs['IntFilter'] | null; // IntFilter
    tmon_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    tmon_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    wemakeprice_fee?: NexusGenInputs['FloatFilter'] | null; // FloatFilter
    wemakeprice_id?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  UserLogListRelationFilter: { // input type
    every?: NexusGenInputs['UserLogWhereInput'] | null; // UserLogWhereInput
    none?: NexusGenInputs['UserLogWhereInput'] | null; // UserLogWhereInput
    some?: NexusGenInputs['UserLogWhereInput'] | null; // UserLogWhereInput
  }
  UserLogOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  UserLogOrderByWithRelationInput: { // input type
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    is_read?: NexusGenEnums['SortOrder'] | null; // SortOrder
    payload_data?: NexusGenEnums['SortOrder'] | null; // SortOrder
    title?: NexusGenEnums['SortOrder'] | null; // SortOrder
    user?: NexusGenInputs['UserOrderByWithRelationInput'] | null; // UserOrderByWithRelationInput
    user_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  UserLogWhereInput: { // input type
    AND?: NexusGenInputs['UserLogWhereInput'][] | null; // [UserLogWhereInput!]
    NOT?: NexusGenInputs['UserLogWhereInput'][] | null; // [UserLogWhereInput!]
    OR?: NexusGenInputs['UserLogWhereInput'][] | null; // [UserLogWhereInput!]
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    is_read?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    payload_data?: NexusGenInputs['StringFilter'] | null; // StringFilter
    title?: NexusGenInputs['StringFilter'] | null; // StringFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
  }
  UserLogWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
  UserOrderByWithRelationInput: { // input type
    created_at?: NexusGenEnums['SortOrder'] | null; // SortOrder
    created_token?: NexusGenEnums['SortOrder'] | null; // SortOrder
    email?: NexusGenEnums['SortOrder'] | null; // SortOrder
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    kakao_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    naver_id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    password?: NexusGenEnums['SortOrder'] | null; // SortOrder
    product?: NexusGenInputs['ProductOrderByRelationAggregateInput'] | null; // ProductOrderByRelationAggregateInput
    product_store?: NexusGenInputs['ProductStoreOrderByRelationAggregateInput'] | null; // ProductStoreOrderByRelationAggregateInput
    purchase_log?: NexusGenInputs['PurchaseLogOrderByRelationAggregateInput'] | null; // PurchaseLogOrderByRelationAggregateInput
    state?: NexusGenEnums['SortOrder'] | null; // SortOrder
    token?: NexusGenEnums['SortOrder'] | null; // SortOrder
    user_info?: NexusGenInputs['UserInfoOrderByWithRelationInput'] | null; // UserInfoOrderByWithRelationInput
    user_log?: NexusGenInputs['UserLogOrderByRelationAggregateInput'] | null; // UserLogOrderByRelationAggregateInput
    user_question?: NexusGenInputs['UserQuestionOrderByRelationAggregateInput'] | null; // UserQuestionOrderByRelationAggregateInput
    word_table?: NexusGenInputs['WordTableOrderByRelationAggregateInput'] | null; // WordTableOrderByRelationAggregateInput
  }
  UserQuestionListRelationFilter: { // input type
    every?: NexusGenInputs['UserQuestionWhereInput'] | null; // UserQuestionWhereInput
    none?: NexusGenInputs['UserQuestionWhereInput'] | null; // UserQuestionWhereInput
    some?: NexusGenInputs['UserQuestionWhereInput'] | null; // UserQuestionWhereInput
  }
  UserQuestionOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  UserQuestionWhereInput: { // input type
    AND?: NexusGenInputs['UserQuestionWhereInput'][] | null; // [UserQuestionWhereInput!]
    NOT?: NexusGenInputs['UserQuestionWhereInput'][] | null; // [UserQuestionWhereInput!]
    OR?: NexusGenInputs['UserQuestionWhereInput'][] | null; // [UserQuestionWhereInput!]
    answer?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    answered_at?: NexusGenInputs['DateTimeNullableFilter'] | null; // DateTimeNullableFilter
    attachment_file?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    content?: NexusGenInputs['StringFilter'] | null; // StringFilter
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    is_active?: NexusGenInputs['BoolFilter'] | null; // BoolFilter
    title?: NexusGenInputs['StringFilter'] | null; // StringFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
  }
  UserWhereInput: { // input type
    AND?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    NOT?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    OR?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    created_at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    created_token?: NexusGenInputs['DateTimeNullableFilter'] | null; // DateTimeNullableFilter
    email?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    kakao_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    naver_id?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    password?: NexusGenInputs['StringFilter'] | null; // StringFilter
    product?: NexusGenInputs['ProductListRelationFilter'] | null; // ProductListRelationFilter
    product_store?: NexusGenInputs['ProductStoreListRelationFilter'] | null; // ProductStoreListRelationFilter
    purchase_log?: NexusGenInputs['PurchaseLogListRelationFilter'] | null; // PurchaseLogListRelationFilter
    state?: NexusGenInputs['EnumUserStateFilter'] | null; // EnumUserStateFilter
    token?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    user_info?: NexusGenInputs['UserInfoWhereInput'] | null; // UserInfoWhereInput
    user_log?: NexusGenInputs['UserLogListRelationFilter'] | null; // UserLogListRelationFilter
    user_question?: NexusGenInputs['UserQuestionListRelationFilter'] | null; // UserQuestionListRelationFilter
    word_table?: NexusGenInputs['WordTableListRelationFilter'] | null; // WordTableListRelationFilter
  }
  UserWhereUniqueInput: { // input type
    email?: string | null; // String
    id?: number | null; // Int
    kakao_id?: string | null; // String
    naver_id?: string | null; // String
    token?: string | null; // String
  }
  WordTableListRelationFilter: { // input type
    every?: NexusGenInputs['WordTableWhereInput'] | null; // WordTableWhereInput
    none?: NexusGenInputs['WordTableWhereInput'] | null; // WordTableWhereInput
    some?: NexusGenInputs['WordTableWhereInput'] | null; // WordTableWhereInput
  }
  WordTableOrderByRelationAggregateInput: { // input type
    _count?: NexusGenEnums['SortOrder'] | null; // SortOrder
    count?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  WordTableWhereInput: { // input type
    AND?: NexusGenInputs['WordTableWhereInput'][] | null; // [WordTableWhereInput!]
    NOT?: NexusGenInputs['WordTableWhereInput'][] | null; // [WordTableWhereInput!]
    OR?: NexusGenInputs['WordTableWhereInput'][] | null; // [WordTableWhereInput!]
    find_word?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['IntFilter'] | null; // IntFilter
    replace_word?: NexusGenInputs['StringNullableFilter'] | null; // StringNullableFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    user_id?: NexusGenInputs['IntFilter'] | null; // IntFilter
  }
}

export interface NexusGenEnums {
  AdminState: "ACTIVE" | "DELETED"
  ProductState: "COLLECTED" | "ON_SALE" | "SELL_DONE" | "UPLOAD_FAILED" | "UPLOAD_WAITING"
  ProductStoreLogUploadState: "CANCEL" | "FAIL" | "ON_PROGRESS" | "SUCCESS" | "WAIT"
  PurchaseLogState: "ACTIVE" | "ENDED" | "REFUNDED" | "WAIT_DEPOSIT" | "WAIT_PAYMENT"
  PurchaseLogType: "IMAGE_TRANSLATE" | "PLAN" | "STOCK"
  SiilItemTypeEnum: "INPUT" | "SELECT" | "YESNO"
  SortOrder: "asc" | "desc"
  TaobaoItemOrderBy: "_credit" | "_sale"
  TranslateEngineEnumType: "baidu" | "google" | "papago"
  TranslateTargetEnumType: "PRODUCT_ALL" | "PRODUCT_NAME" | "PRODUCT_OPTION_ALL" | "PRODUCT_OPTION_NAME" | "PRODUCT_OPTION_VALUE"
  UserLoginType: "ADMIN" | "EMAIL" | "KAKAO" | "NAVER"
  UserPurchaseAdditionalInfoEnumType: "IMAGE_TRANSLATE" | "STOCK"
  UserSocialType: "EMAIL" | "KAKAO" | "NAVER"
  UserState: "ACTIVE" | "DELETED"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
  Upload: FileUpload
}

export interface NexusGenObjects {
  AccountInfo: { // root type
    accountHolder: string; // String!
    accountNumber: string; // String!
    bankName: string; // String!
  }
  Admin: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    login_id: string; // String!
    state: NexusGenEnums['AdminState']; // AdminState!
  }
  Category: { // root type
    a077_code: string; // String!
    b378_code: number; // Int!
    c1: string; // String!
    c1_name: string; // String!
    c2: string; // String!
    c2_name: string; // String!
    c3: string; // String!
    c3_name: string; // String!
    c4: string; // String!
    c4_name: string; // String!
    code: string; // String!
    id: number; // Int!
    siil_code: string; // String!
  }
  CategoryInformationType: { // root type
    code: string; // String!
    code_a001?: string | null; // String
    code_a006?: string | null; // String
    code_a027?: string | null; // String
    code_a077?: string | null; // String
    code_a112?: string | null; // String
    code_a113?: string | null; // String
    code_a524?: string | null; // String
    code_a525?: string | null; // String
    code_b378?: string | null; // String
    code_b719?: string | null; // String
    code_b956?: string | null; // String
    depth1: string; // String!
    depth2: string; // String!
    depth3: string; // String!
    depth4: string; // String!
    depth5: string; // String!
    depth6: string; // String!
    id: string; // String!
    name: string; // String!
  }
  CategorySelectType: { // root type
    code: string; // String!
    name: string; // String!
  }
  Mutation: {};
  PhoneVerification: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    tel: string; // String!
    verification_number: string; // String!
  }
  PlanInfo: { // root type
    description: string; // String!
    external_feature_variable_id?: string | null; // String
    id: number; // Int!
    is_active: boolean; // Boolean!
    month: number; // Int!
    name: string; // String!
    plan_level?: number | null; // Int
    price: number; // Int!
  }
  Product: { // root type
    admin_id?: number | null; // Int
    category_a001?: string | null; // String
    category_a001_name?: string | null; // String
    category_a006?: string | null; // String
    category_a006_name?: string | null; // String
    category_a027?: string | null; // String
    category_a027_name?: string | null; // String
    category_a077?: string | null; // String
    category_a077_name?: string | null; // String
    category_a112?: string | null; // String
    category_a112_name?: string | null; // String
    category_a113?: string | null; // String
    category_a113_name?: string | null; // String
    category_a524?: string | null; // String
    category_a524_name?: string | null; // String
    category_a525?: string | null; // String
    category_a525_name?: string | null; // String
    category_b378?: string | null; // String
    category_b378_name?: string | null; // String
    category_b719?: string | null; // String
    category_b719_name?: string | null; // String
    category_b956?: string | null; // String
    category_b956_name?: string | null; // String
    category_code?: string | null; // String
    cny_rate: number; // Float!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: number; // Int!
    image_thumbnail_data: string; // String!
    is_image_translated: boolean; // Boolean!
    is_name_translated: boolean; // Boolean!
    local_shipping_code?: number | null; // Int
    local_shipping_fee: number; // Int!
    margin_rate: number; // Float!
    margin_unit_type?: string | null; // String
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    name: string; // String!
    price: number; // Int!
    product_code: string; // String!
    search_tags?: string | null; // String
    shipping_fee: number; // Int!
    siil_code?: string | null; // String
    siil_data?: string | null; // String
    state: NexusGenEnums['ProductState']; // ProductState!
    stock_updated_at: NexusGenScalars['DateTime']; // DateTime!
    taobao_product_id: number; // Int!
    user_id?: number | null; // Int
  }
  ProductOption: { // root type
    id: number; // Int!
    is_active: boolean; // Boolean!
    option_string: string; // String!
    option_value1_id: number; // Int!
    option_value2_id?: number | null; // Int
    option_value3_id?: number | null; // Int
    price: number; // Int!
    price_cny: number; // Float!
    product_id: number; // Int!
    stock?: number | null; // Int
    taobao_sku_id: string; // String!
  }
  ProductOptionName: { // root type
    id: number; // Int!
    is_name_translated: boolean; // Boolean!
    name: string; // String!
    order: number; // Int!
    product_id: number; // Int!
    taobao_pid: string; // String!
  }
  ProductOptionValue: { // root type
    id: number; // Int!
    image?: string | null; // String
    is_active: boolean; // Boolean!
    is_name_translated: boolean; // Boolean!
    name: string; // String!
    number: number; // Int!
    option_name_order: number; // Int!
    taobao_vid: string; // String!
  }
  ProductStore: { // root type
    connected_at: NexusGenScalars['DateTime']; // DateTime!
    etc_vendor_item_id?: string | null; // String
    id: number; // Int!
    product_id: number; // Int!
    site_code: string; // String!
    state: number; // Int!
    store_product_id?: string | null; // String
    store_url?: string | null; // String
    user_id: number; // Int!
  }
  ProductStoreLog: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    dest_state: number; // Int!
    error_message: string; // String!
    id: number; // Int!
    job_id: string; // String!
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    product_store_id: number; // Int!
    upload_state: NexusGenEnums['ProductStoreLogUploadState']; // ProductStoreLogUploadState!
  }
  ProductStoreState: { // root type
    description: string; // String!
    id: number; // Int!
    name: string; // String!
  }
  PurchaseLog: { // root type
    expired_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    pay_amount: number; // Int!
    pay_id?: string | null; // String
    plan_info: string; // String!
    purchased_at: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['PurchaseLogState']; // PurchaseLogState!
    type: NexusGenEnums['PurchaseLogType']; // PurchaseLogType!
    user_id: number; // Int!
  }
  Query: {};
  SignInType: { // root type
    accessToken: string; // String!
    refreshToken: string; // String!
  }
  SiilItem: { // root type
    code: string; // String!
    inputType: NexusGenEnums['SiilItemTypeEnum']; // SiilItemTypeEnum!
    name: string; // String!
    options?: string[] | null; // [String!]
  }
  SiilItems: { // root type
    data: NexusGenRootTypes['SiilItem'][]; // [SiilItem!]!
    description: string; // String!
  }
  SiilSavedData: { // root type
    code: string; // String!
    data: NexusGenRootTypes['SiilSavedItem'][]; // [SiilSavedItem!]!
  }
  SiilSavedItem: { // root type
    code: string; // String!
    value: string; // String!
  }
  TaobaoProduct: { // root type
    brand: string; // String!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    image_thumbnail: string; // String!
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    name: string; // String!
    original_data: string; // String!
    price: number; // Float!
    taobao_brand_id?: string | null; // String
    taobao_category_id: string; // String!
    taobao_num_iid: string; // String!
    video_url?: string | null; // String
  }
  TaobaoProductOption: { // root type
    name: string; // String!
    taobaoSkuId: string; // String!
  }
  TaobaoProductOptionInfo: { // root type
    option: NexusGenRootTypes['TaobaoProductOption'][]; // [TaobaoProductOption!]!
    optionName: NexusGenRootTypes['TaobaoProductOptionName'][]; // [TaobaoProductOptionName!]!
    optionValue: NexusGenRootTypes['TaobaoProductOptionValue'][]; // [TaobaoProductOptionValue!]!
  }
  TaobaoProductOptionName: { // root type
    name: string; // String!
    taobaoPid: string; // String!
  }
  TaobaoProductOptionValue: { // root type
    image?: string | null; // String
    name: string; // String!
    taobaoVid: string; // String!
  }
  User: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    created_token?: NexusGenScalars['DateTime'] | null; // DateTime
    email: string; // String!
    id: number; // Int!
    kakao_id?: string | null; // String
    naver_id?: string | null; // String
    state: NexusGenEnums['UserState']; // UserState!
  }
  UserInfo: { // root type
    additional_shipping_fee_jeju: number; // Int!
    as_information?: string | null; // String
    as_tel?: string | null; // String
    auction_fee: number; // Float!
    cny_rate: number; // Float!
    collect_stock: number; // Int!
    collect_timeout: number; // Int!
    coupang_access_key: string; // String!
    coupang_default_inbound: string; // String!
    coupang_default_outbound: string; // String!
    coupang_fee: number; // Float!
    coupang_image_opt: string; // String!
    coupang_login_id: string; // String!
    coupang_maximum_buy_for_person: number; // Int!
    coupang_outbound_shipping_time_day: number; // Int!
    coupang_secret_key: string; // String!
    coupang_union_delivery_type: string; // String!
    coupang_vendor_id: string; // String!
    default_shipping_fee: number; // Int!
    description_show_title: string; // String!
    discount_amount?: number | null; // Int
    discount_unit_type?: string | null; // String
    esmplus_auction_id: string; // String!
    esmplus_gmarket_id: string; // String!
    esmplus_master_id: string; // String!
    exchange_shipping_fee: number; // Int!
    extra_shipping_fee: number; // Int!
    fix_image_bottom?: string | null; // String
    fix_image_top?: string | null; // String
    gmarket_fee: number; // Float!
    interpark_cert_key: string; // String!
    interpark_fee: number; // Float!
    interpark_secret_key: string; // String!
    lotteon_api_key: string; // String!
    lotteon_fee: number; // Float!
    lotteon_normal_fee: number; // Float!
    lotteon_vendor_id: string; // String!
    margin_rate: number; // Float!
    margin_unit_type?: string | null; // String
    max_product_limit?: number | null; // Int
    naver_fee: number; // Float!
    naver_origin: string; // String!
    naver_origin_code: string; // String!
    naver_store_only: string; // String!
    naver_store_url: string; // String!
    option_align_top: string; // String!
    option_index_type: number; // Int!
    option_twoways: string; // String!
    phone?: string | null; // String
    product_collect_count: number; // Int!
    refund_shipping_fee: number; // Int!
    street_api_key: string; // String!
    street_default_inbound: string; // String!
    street_default_outbound: string; // String!
    street_fee: number; // Float!
    street_normal_api_key: string; // String!
    street_normal_fee: number; // Float!
    street_normal_inbound?: string | null; // String
    street_normal_outbound?: string | null; // String
    street_seller_type: number; // Int!
    tmon_fee: number; // Float!
    tmon_id?: string | null; // String
    user_id: number; // Int!
    wemakeprice_fee: number; // Float!
    wemakeprice_id: string; // String!
  }
  UserLog: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    is_read: boolean; // Boolean!
    payload_data: string; // String!
    title: string; // String!
    user_id: number; // Int!
  }
  UserPurchaseAdditionalInfo: { // root type
    expiredAt: NexusGenScalars['DateTime']; // DateTime!
    type: NexusGenEnums['UserPurchaseAdditionalInfoEnumType']; // UserPurchaseAdditionalInfoEnumType!
  }
  UserPurchaseInfo: { // root type
    additionalInfo: NexusGenRootTypes['UserPurchaseAdditionalInfo'][]; // [UserPurchaseAdditionalInfo!]!
    level: number; // Int!
    levelExpiredAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AccountInfo: { // field return type
    accountHolder: string; // String!
    accountNumber: string; // String!
    bankName: string; // String!
  }
  Admin: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    login_id: string; // String!
    state: NexusGenEnums['AdminState']; // AdminState!
  }
  Category: { // field return type
    a077_code: string; // String!
    b378_code: number; // Int!
    c1: string; // String!
    c1_name: string; // String!
    c2: string; // String!
    c2_name: string; // String!
    c3: string; // String!
    c3_name: string; // String!
    c4: string; // String!
    c4_name: string; // String!
    code: string; // String!
    id: number; // Int!
    siil_code: string; // String!
  }
  CategoryInformationType: { // field return type
    code: string; // String!
    code_a001: string | null; // String
    code_a006: string | null; // String
    code_a027: string | null; // String
    code_a077: string | null; // String
    code_a112: string | null; // String
    code_a113: string | null; // String
    code_a524: string | null; // String
    code_a525: string | null; // String
    code_b378: string | null; // String
    code_b719: string | null; // String
    code_b956: string | null; // String
    depth1: string; // String!
    depth2: string; // String!
    depth3: string; // String!
    depth4: string; // String!
    depth5: string; // String!
    depth6: string; // String!
    id: string; // String!
    name: string; // String!
  }
  CategorySelectType: { // field return type
    code: string; // String!
    name: string; // String!
  }
  Mutation: { // field return type
    changeMyPasswordByAdmin: boolean; // Boolean!
    changePasswordByUser: boolean; // Boolean!
    connectSocialIdByUser: NexusGenRootTypes['User']; // User!
    requestPhoneVerificationByEveryone: boolean; // Boolean!
    setMaxProductLimitByAdmin: boolean; // Boolean!
    signInUserByEveryone: NexusGenRootTypes['SignInType']; // SignInType!
    signOutUserByEveryone: string; // String!
    signUpAdminByAdmin: boolean; // Boolean!
    signUpUserByEveryone: NexusGenRootTypes['SignInType']; // SignInType!
    silentRefreshToken: NexusGenRootTypes['SignInType'] | null; // SignInType
    translateProductTextByUser: string; // String!
    translateProductsTextByUser: string; // String!
    updateMyDataByUser: boolean; // Boolean!
    updateMyImageByUser: boolean; // Boolean!
    updatePhoneByUser: boolean; // Boolean!
    verifyPhoneByEveryone: number; // Int!
  }
  PhoneVerification: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    tel: string; // String!
    verification_number: string; // String!
  }
  PlanInfo: { // field return type
    description: string; // String!
    external_feature_variable_id: string | null; // String
    id: number; // Int!
    is_active: boolean; // Boolean!
    month: number; // Int!
    name: string; // String!
    plan_level: number | null; // Int
    price: number; // Int!
  }
  Product: { // field return type
    activeProductStore: NexusGenRootTypes['ProductStore'][]; // [ProductStore!]!
    admin: NexusGenRootTypes['Admin'] | null; // Admin
    admin_id: number | null; // Int
    category: NexusGenRootTypes['Category'] | null; // Category
    category_a001: string | null; // String
    category_a001_name: string | null; // String
    category_a006: string | null; // String
    category_a006_name: string | null; // String
    category_a027: string | null; // String
    category_a027_name: string | null; // String
    category_a077: string | null; // String
    category_a077_name: string | null; // String
    category_a112: string | null; // String
    category_a112_name: string | null; // String
    category_a113: string | null; // String
    category_a113_name: string | null; // String
    category_a524: string | null; // String
    category_a524_name: string | null; // String
    category_a525: string | null; // String
    category_a525_name: string | null; // String
    category_b378: string | null; // String
    category_b378_name: string | null; // String
    category_b719: string | null; // String
    category_b719_name: string | null; // String
    category_b956: string | null; // String
    category_b956_name: string | null; // String
    category_code: string | null; // String
    cny_rate: number; // Float!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    description: string; // String!
    id: number; // Int!
    imageThumbnail: string[]; // [String!]!
    image_thumbnail_data: string; // String!
    is_image_translated: boolean; // Boolean!
    is_name_translated: boolean; // Boolean!
    local_shipping_code: number | null; // Int
    local_shipping_fee: number; // Int!
    margin_rate: number; // Float!
    margin_unit_type: string | null; // String
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    name: string; // String!
    optionInfoHtml: string; // String!
    price: number; // Int!
    product_code: string; // String!
    product_option: NexusGenRootTypes['ProductOption'][]; // [ProductOption!]!
    product_option_name: NexusGenRootTypes['ProductOptionName'][]; // [ProductOptionName!]!
    product_store: NexusGenRootTypes['ProductStore'][]; // [ProductStore!]!
    search_tags: string | null; // String
    shipping_fee: number; // Int!
    siilInfo: NexusGenRootTypes['SiilSavedData'] | null; // SiilSavedData
    siil_code: string | null; // String
    siil_data: string | null; // String
    state: NexusGenEnums['ProductState']; // ProductState!
    stock_updated_at: NexusGenScalars['DateTime']; // DateTime!
    taobao_product: NexusGenRootTypes['TaobaoProduct']; // TaobaoProduct!
    taobao_product_id: number; // Int!
    user: NexusGenRootTypes['User'] | null; // User
    user_id: number | null; // Int
  }
  ProductOption: { // field return type
    id: number; // Int!
    is_active: boolean; // Boolean!
    name: string; // String!
    option_string: string; // String!
    option_value1_id: number; // Int!
    option_value2_id: number | null; // Int
    option_value3_id: number | null; // Int
    price: number; // Int!
    price_cny: number; // Float!
    product: NexusGenRootTypes['Product']; // Product!
    product_id: number; // Int!
    product_option1: NexusGenRootTypes['ProductOptionValue']; // ProductOptionValue!
    product_option2: NexusGenRootTypes['ProductOptionValue'] | null; // ProductOptionValue
    product_option3: NexusGenRootTypes['ProductOptionValue'] | null; // ProductOptionValue
    stock: number | null; // Int
    taobao_sku_id: string; // String!
  }
  ProductOptionName: { // field return type
    id: number; // Int!
    is_name_translated: boolean; // Boolean!
    name: string; // String!
    order: number; // Int!
    product: NexusGenRootTypes['Product']; // Product!
    product_id: number; // Int!
    product_option_value: NexusGenRootTypes['ProductOptionValue'][]; // [ProductOptionValue!]!
    taobao_pid: string; // String!
  }
  ProductOptionValue: { // field return type
    id: number; // Int!
    image: string | null; // String
    is_active: boolean; // Boolean!
    is_name_translated: boolean; // Boolean!
    name: string; // String!
    number: number; // Int!
    option_name_order: number; // Int!
    option_value1: NexusGenRootTypes['ProductOption'][]; // [ProductOption!]!
    option_value2: NexusGenRootTypes['ProductOption'][]; // [ProductOption!]!
    option_value3: NexusGenRootTypes['ProductOption'][]; // [ProductOption!]!
    productOption: NexusGenRootTypes['ProductOption'][]; // [ProductOption!]!
    product_option_name: NexusGenRootTypes['ProductOptionName']; // ProductOptionName!
    taobao_vid: string; // String!
  }
  ProductStore: { // field return type
    connected_at: NexusGenScalars['DateTime']; // DateTime!
    etc_vendor_item_id: string | null; // String
    id: number; // Int!
    product: NexusGenRootTypes['Product']; // Product!
    product_id: number; // Int!
    product_store_log: NexusGenRootTypes['ProductStoreLog'][]; // [ProductStoreLog!]!
    product_store_state: NexusGenRootTypes['ProductStoreState']; // ProductStoreState!
    site_code: string; // String!
    state: number; // Int!
    store_product_id: string | null; // String
    store_url: string | null; // String
    user: NexusGenRootTypes['User']; // User!
    user_id: number; // Int!
  }
  ProductStoreLog: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    dest_state: number; // Int!
    error_message: string; // String!
    id: number; // Int!
    job_id: string; // String!
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    product_store: NexusGenRootTypes['ProductStore']; // ProductStore!
    product_store_id: number; // Int!
    product_store_state: NexusGenRootTypes['ProductStoreState']; // ProductStoreState!
    upload_state: NexusGenEnums['ProductStoreLogUploadState']; // ProductStoreLogUploadState!
  }
  ProductStoreState: { // field return type
    description: string; // String!
    id: number; // Int!
    name: string; // String!
  }
  PurchaseLog: { // field return type
    expired_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    pay_amount: number; // Int!
    pay_id: string | null; // String
    plan_info: string; // String!
    purchased_at: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['PurchaseLogState']; // PurchaseLogState!
    type: NexusGenEnums['PurchaseLogType']; // PurchaseLogType!
    user: NexusGenRootTypes['User']; // User!
    user_id: number; // Int!
  }
  Query: { // field return type
    selectMyInfoByUser: NexusGenRootTypes['User']; // User!
    selectSiilInfoBySomeone: NexusGenRootTypes['SiilItems'][]; // [SiilItems!]!
    selectUsersByAdmin: NexusGenRootTypes['User'][]; // [User!]!
    selectUsersCountByAdmin: number; // Int!
    translateText: string; // String!
    whoami: string | null; // String
  }
  SignInType: { // field return type
    accessToken: string; // String!
    refreshToken: string; // String!
  }
  SiilItem: { // field return type
    code: string; // String!
    inputType: NexusGenEnums['SiilItemTypeEnum']; // SiilItemTypeEnum!
    name: string; // String!
    options: string[] | null; // [String!]
  }
  SiilItems: { // field return type
    data: NexusGenRootTypes['SiilItem'][]; // [SiilItem!]!
    description: string; // String!
  }
  SiilSavedData: { // field return type
    code: string; // String!
    data: NexusGenRootTypes['SiilSavedItem'][]; // [SiilSavedItem!]!
  }
  SiilSavedItem: { // field return type
    code: string; // String!
    value: string; // String!
  }
  TaobaoProduct: { // field return type
    brand: string; // String!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    image_thumbnail: string; // String!
    modified_at: NexusGenScalars['DateTime']; // DateTime!
    name: string; // String!
    original_data: string; // String!
    price: number; // Float!
    product: NexusGenRootTypes['Product'][]; // [Product!]!
    taobao_brand_id: string | null; // String
    taobao_category_id: string; // String!
    taobao_num_iid: string; // String!
    video_url: string | null; // String
  }
  TaobaoProductOption: { // field return type
    name: string; // String!
    taobaoSkuId: string; // String!
  }
  TaobaoProductOptionInfo: { // field return type
    option: NexusGenRootTypes['TaobaoProductOption'][]; // [TaobaoProductOption!]!
    optionName: NexusGenRootTypes['TaobaoProductOptionName'][]; // [TaobaoProductOptionName!]!
    optionValue: NexusGenRootTypes['TaobaoProductOptionValue'][]; // [TaobaoProductOptionValue!]!
  }
  TaobaoProductOptionName: { // field return type
    name: string; // String!
    taobaoPid: string; // String!
  }
  TaobaoProductOptionValue: { // field return type
    image: string | null; // String
    name: string; // String!
    taobaoVid: string; // String!
  }
  User: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    created_token: NexusGenScalars['DateTime'] | null; // DateTime
    email: string; // String!
    id: number; // Int!
    kakao_id: string | null; // String
    naver_id: string | null; // String
    password: string | null; // String
    product: NexusGenRootTypes['Product'][]; // [Product!]!
    productCount: number; // Int!
    purchaseInfo: NexusGenRootTypes['UserPurchaseInfo']; // UserPurchaseInfo!
    state: NexusGenEnums['UserState']; // UserState!
    user_info: NexusGenRootTypes['UserInfo'] | null; // UserInfo
    user_log: NexusGenRootTypes['UserLog'][]; // [UserLog!]!
  }
  UserInfo: { // field return type
    additional_shipping_fee_jeju: number; // Int!
    as_information: string | null; // String
    as_tel: string | null; // String
    auction_fee: number; // Float!
    cny_rate: number; // Float!
    collect_stock: number; // Int!
    collect_timeout: number; // Int!
    coupang_access_key: string; // String!
    coupang_default_inbound: string; // String!
    coupang_default_outbound: string; // String!
    coupang_fee: number; // Float!
    coupang_image_opt: string; // String!
    coupang_login_id: string; // String!
    coupang_maximum_buy_for_person: number; // Int!
    coupang_outbound_shipping_time_day: number; // Int!
    coupang_secret_key: string; // String!
    coupang_union_delivery_type: string; // String!
    coupang_vendor_id: string; // String!
    default_shipping_fee: number; // Int!
    description_show_title: string; // String!
    discount_amount: number | null; // Int
    discount_unit_type: string | null; // String
    esmplus_auction_id: string; // String!
    esmplus_gmarket_id: string; // String!
    esmplus_master_id: string; // String!
    exchange_shipping_fee: number; // Int!
    extra_shipping_fee: number; // Int!
    fix_image_bottom: string | null; // String
    fix_image_top: string | null; // String
    gmarket_fee: number; // Float!
    interpark_cert_key: string; // String!
    interpark_fee: number; // Float!
    interpark_secret_key: string; // String!
    lotteon_api_key: string; // String!
    lotteon_fee: number; // Float!
    lotteon_normal_fee: number; // Float!
    lotteon_vendor_id: string; // String!
    margin_rate: number; // Float!
    margin_unit_type: string | null; // String
    max_product_limit: number | null; // Int
    naver_fee: number; // Float!
    naver_origin: string; // String!
    naver_origin_code: string; // String!
    naver_store_only: string; // String!
    naver_store_url: string; // String!
    option_align_top: string; // String!
    option_index_type: number; // Int!
    option_twoways: string; // String!
    phone: string | null; // String
    product_collect_count: number; // Int!
    refund_shipping_fee: number; // Int!
    street_api_key: string; // String!
    street_default_inbound: string; // String!
    street_default_outbound: string; // String!
    street_fee: number; // Float!
    street_normal_api_key: string; // String!
    street_normal_fee: number; // Float!
    street_normal_inbound: string | null; // String
    street_normal_outbound: string | null; // String
    street_seller_type: number; // Int!
    tmon_fee: number; // Float!
    tmon_id: string | null; // String
    user: NexusGenRootTypes['User']; // User!
    user_id: number; // Int!
    wemakeprice_fee: number; // Float!
    wemakeprice_id: string; // String!
  }
  UserLog: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    is_read: boolean; // Boolean!
    payload_data: string; // String!
    title: string; // String!
    user: NexusGenRootTypes['User']; // User!
    user_id: number; // Int!
  }
  UserPurchaseAdditionalInfo: { // field return type
    expiredAt: NexusGenScalars['DateTime']; // DateTime!
    type: NexusGenEnums['UserPurchaseAdditionalInfoEnumType']; // UserPurchaseAdditionalInfoEnumType!
  }
  UserPurchaseInfo: { // field return type
    additionalInfo: NexusGenRootTypes['UserPurchaseAdditionalInfo'][]; // [UserPurchaseAdditionalInfo!]!
    level: number; // Int!
    levelExpiredAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenFieldTypeNames {
  AccountInfo: { // field return type name
    accountHolder: 'String'
    accountNumber: 'String'
    bankName: 'String'
  }
  Admin: { // field return type name
    created_at: 'DateTime'
    id: 'Int'
    login_id: 'String'
    state: 'AdminState'
  }
  Category: { // field return type name
    a077_code: 'String'
    b378_code: 'Int'
    c1: 'String'
    c1_name: 'String'
    c2: 'String'
    c2_name: 'String'
    c3: 'String'
    c3_name: 'String'
    c4: 'String'
    c4_name: 'String'
    code: 'String'
    id: 'Int'
    siil_code: 'String'
  }
  CategoryInformationType: { // field return type name
    code: 'String'
    code_a001: 'String'
    code_a006: 'String'
    code_a027: 'String'
    code_a077: 'String'
    code_a112: 'String'
    code_a113: 'String'
    code_a524: 'String'
    code_a525: 'String'
    code_b378: 'String'
    code_b719: 'String'
    code_b956: 'String'
    depth1: 'String'
    depth2: 'String'
    depth3: 'String'
    depth4: 'String'
    depth5: 'String'
    depth6: 'String'
    id: 'String'
    name: 'String'
  }
  CategorySelectType: { // field return type name
    code: 'String'
    name: 'String'
  }
  Mutation: { // field return type name
    changeMyPasswordByAdmin: 'Boolean'
    changePasswordByUser: 'Boolean'
    connectSocialIdByUser: 'User'
    requestPhoneVerificationByEveryone: 'Boolean'
    setMaxProductLimitByAdmin: 'Boolean'
    signInUserByEveryone: 'SignInType'
    signOutUserByEveryone: 'String'
    signUpAdminByAdmin: 'Boolean'
    signUpUserByEveryone: 'SignInType'
    silentRefreshToken: 'SignInType'
    translateProductTextByUser: 'String'
    translateProductsTextByUser: 'String'
    updateMyDataByUser: 'Boolean'
    updateMyImageByUser: 'Boolean'
    updatePhoneByUser: 'Boolean'
    verifyPhoneByEveryone: 'Int'
  }
  PhoneVerification: { // field return type name
    created_at: 'DateTime'
    id: 'Int'
    tel: 'String'
    verification_number: 'String'
  }
  PlanInfo: { // field return type name
    description: 'String'
    external_feature_variable_id: 'String'
    id: 'Int'
    is_active: 'Boolean'
    month: 'Int'
    name: 'String'
    plan_level: 'Int'
    price: 'Int'
  }
  Product: { // field return type name
    activeProductStore: 'ProductStore'
    admin: 'Admin'
    admin_id: 'Int'
    category: 'Category'
    category_a001: 'String'
    category_a001_name: 'String'
    category_a006: 'String'
    category_a006_name: 'String'
    category_a027: 'String'
    category_a027_name: 'String'
    category_a077: 'String'
    category_a077_name: 'String'
    category_a112: 'String'
    category_a112_name: 'String'
    category_a113: 'String'
    category_a113_name: 'String'
    category_a524: 'String'
    category_a524_name: 'String'
    category_a525: 'String'
    category_a525_name: 'String'
    category_b378: 'String'
    category_b378_name: 'String'
    category_b719: 'String'
    category_b719_name: 'String'
    category_b956: 'String'
    category_b956_name: 'String'
    category_code: 'String'
    cny_rate: 'Float'
    created_at: 'DateTime'
    description: 'String'
    id: 'Int'
    imageThumbnail: 'String'
    image_thumbnail_data: 'String'
    is_image_translated: 'Boolean'
    is_name_translated: 'Boolean'
    local_shipping_code: 'Int'
    local_shipping_fee: 'Int'
    margin_rate: 'Float'
    margin_unit_type: 'String'
    modified_at: 'DateTime'
    name: 'String'
    optionInfoHtml: 'String'
    price: 'Int'
    product_code: 'String'
    product_option: 'ProductOption'
    product_option_name: 'ProductOptionName'
    product_store: 'ProductStore'
    search_tags: 'String'
    shipping_fee: 'Int'
    siilInfo: 'SiilSavedData'
    siil_code: 'String'
    siil_data: 'String'
    state: 'ProductState'
    stock_updated_at: 'DateTime'
    taobao_product: 'TaobaoProduct'
    taobao_product_id: 'Int'
    user: 'User'
    user_id: 'Int'
  }
  ProductOption: { // field return type name
    id: 'Int'
    is_active: 'Boolean'
    name: 'String'
    option_string: 'String'
    option_value1_id: 'Int'
    option_value2_id: 'Int'
    option_value3_id: 'Int'
    price: 'Int'
    price_cny: 'Float'
    product: 'Product'
    product_id: 'Int'
    product_option1: 'ProductOptionValue'
    product_option2: 'ProductOptionValue'
    product_option3: 'ProductOptionValue'
    stock: 'Int'
    taobao_sku_id: 'String'
  }
  ProductOptionName: { // field return type name
    id: 'Int'
    is_name_translated: 'Boolean'
    name: 'String'
    order: 'Int'
    product: 'Product'
    product_id: 'Int'
    product_option_value: 'ProductOptionValue'
    taobao_pid: 'String'
  }
  ProductOptionValue: { // field return type name
    id: 'Int'
    image: 'String'
    is_active: 'Boolean'
    is_name_translated: 'Boolean'
    name: 'String'
    number: 'Int'
    option_name_order: 'Int'
    option_value1: 'ProductOption'
    option_value2: 'ProductOption'
    option_value3: 'ProductOption'
    productOption: 'ProductOption'
    product_option_name: 'ProductOptionName'
    taobao_vid: 'String'
  }
  ProductStore: { // field return type name
    connected_at: 'DateTime'
    etc_vendor_item_id: 'String'
    id: 'Int'
    product: 'Product'
    product_id: 'Int'
    product_store_log: 'ProductStoreLog'
    product_store_state: 'ProductStoreState'
    site_code: 'String'
    state: 'Int'
    store_product_id: 'String'
    store_url: 'String'
    user: 'User'
    user_id: 'Int'
  }
  ProductStoreLog: { // field return type name
    created_at: 'DateTime'
    dest_state: 'Int'
    error_message: 'String'
    id: 'Int'
    job_id: 'String'
    modified_at: 'DateTime'
    product_store: 'ProductStore'
    product_store_id: 'Int'
    product_store_state: 'ProductStoreState'
    upload_state: 'ProductStoreLogUploadState'
  }
  ProductStoreState: { // field return type name
    description: 'String'
    id: 'Int'
    name: 'String'
  }
  PurchaseLog: { // field return type name
    expired_at: 'DateTime'
    id: 'Int'
    pay_amount: 'Int'
    pay_id: 'String'
    plan_info: 'String'
    purchased_at: 'DateTime'
    state: 'PurchaseLogState'
    type: 'PurchaseLogType'
    user: 'User'
    user_id: 'Int'
  }
  Query: { // field return type name
    selectMyInfoByUser: 'User'
    selectSiilInfoBySomeone: 'SiilItems'
    selectUsersByAdmin: 'User'
    selectUsersCountByAdmin: 'Int'
    translateText: 'String'
    whoami: 'String'
  }
  SignInType: { // field return type name
    accessToken: 'String'
    refreshToken: 'String'
  }
  SiilItem: { // field return type name
    code: 'String'
    inputType: 'SiilItemTypeEnum'
    name: 'String'
    options: 'String'
  }
  SiilItems: { // field return type name
    data: 'SiilItem'
    description: 'String'
  }
  SiilSavedData: { // field return type name
    code: 'String'
    data: 'SiilSavedItem'
  }
  SiilSavedItem: { // field return type name
    code: 'String'
    value: 'String'
  }
  TaobaoProduct: { // field return type name
    brand: 'String'
    created_at: 'DateTime'
    id: 'Int'
    image_thumbnail: 'String'
    modified_at: 'DateTime'
    name: 'String'
    original_data: 'String'
    price: 'Float'
    product: 'Product'
    taobao_brand_id: 'String'
    taobao_category_id: 'String'
    taobao_num_iid: 'String'
    video_url: 'String'
  }
  TaobaoProductOption: { // field return type name
    name: 'String'
    taobaoSkuId: 'String'
  }
  TaobaoProductOptionInfo: { // field return type name
    option: 'TaobaoProductOption'
    optionName: 'TaobaoProductOptionName'
    optionValue: 'TaobaoProductOptionValue'
  }
  TaobaoProductOptionName: { // field return type name
    name: 'String'
    taobaoPid: 'String'
  }
  TaobaoProductOptionValue: { // field return type name
    image: 'String'
    name: 'String'
    taobaoVid: 'String'
  }
  User: { // field return type name
    created_at: 'DateTime'
    created_token: 'DateTime'
    email: 'String'
    id: 'Int'
    kakao_id: 'String'
    naver_id: 'String'
    password: 'String'
    product: 'Product'
    productCount: 'Int'
    purchaseInfo: 'UserPurchaseInfo'
    state: 'UserState'
    user_info: 'UserInfo'
    user_log: 'UserLog'
  }
  UserInfo: { // field return type name
    additional_shipping_fee_jeju: 'Int'
    as_information: 'String'
    as_tel: 'String'
    auction_fee: 'Float'
    cny_rate: 'Float'
    collect_stock: 'Int'
    collect_timeout: 'Int'
    coupang_access_key: 'String'
    coupang_default_inbound: 'String'
    coupang_default_outbound: 'String'
    coupang_fee: 'Float'
    coupang_image_opt: 'String'
    coupang_login_id: 'String'
    coupang_maximum_buy_for_person: 'Int'
    coupang_outbound_shipping_time_day: 'Int'
    coupang_secret_key: 'String'
    coupang_union_delivery_type: 'String'
    coupang_vendor_id: 'String'
    default_shipping_fee: 'Int'
    description_show_title: 'String'
    discount_amount: 'Int'
    discount_unit_type: 'String'
    esmplus_auction_id: 'String'
    esmplus_gmarket_id: 'String'
    esmplus_master_id: 'String'
    exchange_shipping_fee: 'Int'
    extra_shipping_fee: 'Int'
    fix_image_bottom: 'String'
    fix_image_top: 'String'
    gmarket_fee: 'Float'
    interpark_cert_key: 'String'
    interpark_fee: 'Float'
    interpark_secret_key: 'String'
    lotteon_api_key: 'String'
    lotteon_fee: 'Float'
    lotteon_normal_fee: 'Float'
    lotteon_vendor_id: 'String'
    margin_rate: 'Float'
    margin_unit_type: 'String'
    max_product_limit: 'Int'
    naver_fee: 'Float'
    naver_origin: 'String'
    naver_origin_code: 'String'
    naver_store_only: 'String'
    naver_store_url: 'String'
    option_align_top: 'String'
    option_index_type: 'Int'
    option_twoways: 'String'
    phone: 'String'
    product_collect_count: 'Int'
    refund_shipping_fee: 'Int'
    street_api_key: 'String'
    street_default_inbound: 'String'
    street_default_outbound: 'String'
    street_fee: 'Float'
    street_normal_api_key: 'String'
    street_normal_fee: 'Float'
    street_normal_inbound: 'String'
    street_normal_outbound: 'String'
    street_seller_type: 'Int'
    tmon_fee: 'Float'
    tmon_id: 'String'
    user: 'User'
    user_id: 'Int'
    wemakeprice_fee: 'Float'
    wemakeprice_id: 'String'
  }
  UserLog: { // field return type name
    created_at: 'DateTime'
    id: 'Int'
    is_read: 'Boolean'
    payload_data: 'String'
    title: 'String'
    user: 'User'
    user_id: 'Int'
  }
  UserPurchaseAdditionalInfo: { // field return type name
    expiredAt: 'DateTime'
    type: 'UserPurchaseAdditionalInfoEnumType'
  }
  UserPurchaseInfo: { // field return type name
    additionalInfo: 'UserPurchaseAdditionalInfo'
    level: 'Int'
    levelExpiredAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    changeMyPasswordByAdmin: { // args
      currentPassword: string; // String!
      newPassword: string; // String!
    }
    changePasswordByUser: { // args
      currentPassword: string; // String!
      newPassword: string; // String!
    }
    connectSocialIdByUser: { // args
      socialId: string; // String!
      userType: NexusGenEnums['UserSocialType']; // UserSocialType!
    }
    requestPhoneVerificationByEveryone: { // args
      phoneNumber: string; // String!
    }
    setMaxProductLimitByAdmin: { // args
      productLimit?: number | null; // Int
      userId: number; // Int!
    }
    signInUserByEveryone: { // args
      email: string; // String!
      password: string; // String!
      userType: NexusGenEnums['UserSocialType']; // UserSocialType!
    }
    signOutUserByEveryone: { // args
      accessToken: string; // String!
    }
    signUpAdminByAdmin: { // args
      id: string; // String!
      password: string; // String!
    }
    signUpUserByEveryone: { // args
      email: string; // String!
      password: string; // String!
      phone: string; // String!
      verificationId: number; // Int!
    }
    silentRefreshToken: { // args
      refreshToken: string; // String!
    }
    translateProductTextByUser: { // args
      id: number; // Int!
      type: NexusGenEnums['TranslateTargetEnumType']; // TranslateTargetEnumType!
    }
    translateProductsTextByUser: { // args
      ids: number[]; // [Int!]!
      type: NexusGenEnums['TranslateTargetEnumType']; // TranslateTargetEnumType!
    }
    updateMyDataByUser: { // args
      additionalShippingFeeJeju?: number | null; // Int
      asInformation?: string | null; // String
      asTel?: string | null; // String
      auctionFee?: number | null; // Float
      cnyRate?: number | null; // Float
      collectStock?: number | null; // Int
      collectTimeout?: number | null; // Int
      coupangAccessKey?: string | null; // String
      coupangDefaultInbound?: string | null; // String
      coupangDefaultOutbound?: string | null; // String
      coupangFee?: number | null; // Float
      coupangImageOpt?: string | null; // String
      coupangLoginId?: string | null; // String
      coupangMaximumBuyForPerson?: number | null; // Int
      coupangOutboundShippingTimeDay?: number | null; // Int
      coupangSecretKey?: string | null; // String
      coupangUnionDeliveryType?: string | null; // String
      coupangVendorId?: string | null; // String
      defaultShippingFee?: number | null; // Int
      descriptionShowTitle?: string | null; // String
      discountAmount?: number | null; // Int
      discountUnitType?: string | null; // String
      esmplusAuctionId?: string | null; // String
      esmplusGmarketId?: string | null; // String
      esmplusMasterId?: string | null; // String
      exchangeShippingFee?: number | null; // Int
      extraShippingFee?: number | null; // Int
      fixImageBottom?: NexusGenScalars['Upload'] | null; // Upload
      fixImageTop?: NexusGenScalars['Upload'] | null; // Upload
      gmarketFee?: number | null; // Float
      interparkCertKey?: string | null; // String
      interparkFee?: number | null; // Float
      interparkSecretKey?: string | null; // String
      lotteonApiKey?: string | null; // String
      lotteonFee?: number | null; // Float
      lotteonNormalFee?: number | null; // Float
      lotteonVendorId?: string | null; // String
      marginRate?: number | null; // Float
      marginUnitType?: string | null; // String
      naverFee?: number | null; // Float
      naverOrigin?: string | null; // String
      naverOriginCode?: string | null; // String
      naverStoreOnly?: string | null; // String
      naverStoreUrl?: string | null; // String
      optionAlignTop?: string | null; // String
      optionIndexType?: number | null; // Int
      optionTwoWays?: string | null; // String
      refundShippingFee?: number | null; // Int
      streetApiKey?: string | null; // String
      streetDefaultInbound?: string | null; // String
      streetDefaultOutbound?: string | null; // String
      streetFee?: number | null; // Float
      streetNormalApiKey?: string | null; // String
      streetNormalFee?: number | null; // Float
      streetNormalInbound?: string | null; // String
      streetNormalOutbound?: string | null; // String
      streetSellerType?: number | null; // Int
      tmonFee?: number | null; // Float
      tmonId?: string | null; // String
      wemakepriceFee?: number | null; // Float
      wemakepriceId?: string | null; // String
    }
    updateMyImageByUser: { // args
      fixImageBottom?: string | null; // String
      fixImageTop?: string | null; // String
    }
    updatePhoneByUser: { // args
      phone: string; // String!
      verificationId: number; // Int!
    }
    verifyPhoneByEveryone: { // args
      phoneNumber: string; // String!
      verificationNumber: string; // String!
    }
  }
  Product: {
    product_option: { // args
      cursor?: NexusGenInputs['ProductOptionWhereUniqueInput'] | null; // ProductOptionWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionOrderByWithRelationInput'][] | null; // [ProductOptionOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    }
    product_option_name: { // args
      cursor?: NexusGenInputs['ProductOptionNameWhereUniqueInput'] | null; // ProductOptionNameWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionNameOrderByWithRelationInput'][] | null; // [ProductOptionNameOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionNameWhereInput'] | null; // ProductOptionNameWhereInput
    }
    product_store: { // args
      cursor?: NexusGenInputs['ProductStoreWhereUniqueInput'] | null; // ProductStoreWhereUniqueInput
      orderBy?: NexusGenInputs['ProductStoreOrderByWithRelationInput'][] | null; // [ProductStoreOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductStoreWhereInput'] | null; // ProductStoreWhereInput
    }
  }
  ProductOptionName: {
    product_option_value: { // args
      cursor?: NexusGenInputs['ProductOptionValueWhereUniqueInput'] | null; // ProductOptionValueWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionValueOrderByWithRelationInput'][] | null; // [ProductOptionValueOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionValueWhereInput'] | null; // ProductOptionValueWhereInput
    }
  }
  ProductOptionValue: {
    option_value1: { // args
      cursor?: NexusGenInputs['ProductOptionWhereUniqueInput'] | null; // ProductOptionWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionOrderByWithRelationInput'][] | null; // [ProductOptionOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    }
    option_value2: { // args
      cursor?: NexusGenInputs['ProductOptionWhereUniqueInput'] | null; // ProductOptionWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionOrderByWithRelationInput'][] | null; // [ProductOptionOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    }
    option_value3: { // args
      cursor?: NexusGenInputs['ProductOptionWhereUniqueInput'] | null; // ProductOptionWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOptionOrderByWithRelationInput'][] | null; // [ProductOptionOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    }
    productOption: { // args
      cursor?: NexusGenInputs['ProductOptionWhereUniqueInput'] | null; // ProductOptionWhereUniqueInput
      orderBy?: Array<NexusGenInputs['ProductOptionOrderByWithRelationInput'] | null> | null; // [ProductOptionOrderByWithRelationInput]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductOptionWhereInput'] | null; // ProductOptionWhereInput
    }
  }
  ProductStore: {
    product_store_log: { // args
      cursor?: NexusGenInputs['ProductStoreLogWhereUniqueInput'] | null; // ProductStoreLogWhereUniqueInput
      orderBy?: NexusGenInputs['ProductStoreLogOrderByWithRelationInput'][] | null; // [ProductStoreLogOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductStoreLogWhereInput'] | null; // ProductStoreLogWhereInput
    }
  }
  Query: {
    selectSiilInfoBySomeone: { // args
      code: string; // String!
    }
    selectUsersByAdmin: { // args
      cursor?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
      orderBy?: NexusGenInputs['UserOrderByWithRelationInput'][] | null; // [UserOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    }
    selectUsersCountByAdmin: { // args
      where?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    }
    translateText: { // args
      engine: NexusGenEnums['TranslateEngineEnumType']; // TranslateEngineEnumType!
      text: string; // String!
    }
  }
  TaobaoProduct: {
    product: { // args
      cursor?: NexusGenInputs['ProductWhereUniqueInput'] | null; // ProductWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    }
  }
  User: {
    product: { // args
      cursor?: NexusGenInputs['ProductWhereUniqueInput'] | null; // ProductWhereUniqueInput
      orderBy?: NexusGenInputs['ProductOrderByWithRelationInput'][] | null; // [ProductOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['ProductWhereInput'] | null; // ProductWhereInput
    }
    user_log: { // args
      cursor?: NexusGenInputs['UserLogWhereUniqueInput'] | null; // UserLogWhereUniqueInput
      orderBy?: NexusGenInputs['UserLogOrderByWithRelationInput'][] | null; // [UserLogOrderByWithRelationInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
      where?: NexusGenInputs['UserLogWhereInput'] | null; // UserLogWhereInput
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}