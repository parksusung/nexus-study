export interface IWordTable {
    findWord: string;
    replaceWord: string | null;
}

export const replaceWordTable = <T extends IWordTable>(msg: string, wordTable: T[]) =>
    wordTable.reduce((p, c) => {
        if (c.replaceWord) {
            return p.replace(new RegExp(c.findWord, "g"), c.replaceWord)
        }
        else {
            if (new RegExp(c.findWord, "g").test(p)) throw new Error(`금지어가 발견되었습니다 : ${c.findWord}`);
        }
        return p;
    }, msg);