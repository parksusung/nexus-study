import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'
import fetch from 'node-fetch'
import { Context } from '../../types'
import * as util from 'util'


async function errorToSlack<E extends Error>(e: E, info: any) {
    if (!process.env.DEBUG_SLACK_URL || !process.env.DEBUG_SLACK_SERVER_NAME) return;
    const data = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": `${process.env.DEBUG_SLACK_SERVER_NAME}`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `오류 정보\n${"```"}${util.inspect(e)}${"```"}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `기타 정보\n${"```"}${util.inspect(info)}${"```"}`
                }
            }
        ]
    }
    await fetch(process.env.DEBUG_SLACK_URL, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}


export function getDebugInfo(ctx: Context) {
    const body = ctx.req?.body;
    const tokenInfo = ctx.token;
    const token = ctx.req?.headers?.authorization?.replace("Bearer ", "");
    const variables = JSON.stringify(ctx.req?.body.variables)
    const query = JSON.stringify(ctx.req?.body.query)
    return { body, tokenInfo, token, variables, query }
}

export const throwError = (error: any, ctx: Context | null) => {
    if (ctx) {
        let info = getDebugInfo(ctx);
        console.log({ error, info, timestamp: new Date().toString() })
    }
    if (error instanceof ApolloError) {
    }
    else {
        errorToSlack(error, ctx ? getDebugInfo(ctx) : null)
    }

    throw error;
}

export class CustomError extends ApolloError {
    constructor(message: string, code: string) {
        super(message, code);

        Object.defineProperty(this, 'name', { value: 'CustomError' });
    }
}



export const errors = {
    etc: (msg: string) => new UserInputError(msg),
    notAuthenticated: new AuthenticationError('유효한 accessToken이 아닙니다.'),
    higherLevelRequired: new CustomError('해당 기능은 현재 플랜에서 이용할 수 없습니다.', 'PURCHASE_REQUIRED'),
    additionalPermissionRequired: new CustomError('해당 부가 기능을 이용할 수 없습니다.', 'PURCHASE_REQUIRED'),
    notInitialized: new ApolloError('초기화 문제, 관리자에게 연락하세요.'),
    forbidden: new ForbiddenError('접근이 거부되었습니다.'),
    forbiddenForData: new ForbiddenError('요청한 데이터에 대한 접근이 거부되었습니다.'),
    noSuchData: new UserInputError('요청한 데이터가 존재하지 않습니다.'),
    invalidUser: new UserInputError('존재하지 않는 아이디이거나 비밀번호가 틀렸습니다.'),
    oneboundAPIError: (error: any) => new CustomError(`API Error : ${error}`, "ONEBOUND_API_ERROR"),
}
