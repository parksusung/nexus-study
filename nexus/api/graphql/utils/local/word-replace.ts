export interface IWordTable {
    find_word: string;
    replace_word: string | null;
}

export const replaceWordTable = <T extends IWordTable>(msg: string, wordTable: T[]) =>
    wordTable.reduce((p, c) => {
        if (c.replace_word) {
            var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
            var regstr = c.find_word;

            if(reg.test(c.find_word)){
                regstr = "\\".concat(c.find_word);
            }

            return p.replace(new RegExp(regstr, "gi"), c.replace_word)
        }

        // else {
        //     if (new RegExp(c.findWord, "g").test(p)) throw new Error(`금지어가 발견되었습니다 : ${c.findWord}`);
        // }
        
        return p;
    }, msg);