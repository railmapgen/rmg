var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const getTransJSON = (lang) => __awaiter(this, void 0, void 0, function* () {
    let response = yield fetch(`lang/${lang}.json`);
    var d = new Date();
    console.log(lang, d.toLocaleTimeString() + ':' + d.getMilliseconds());
    return response.ok ? response.json() : {};
});
const pageLangFallback = (lang) => {
    if (lang !== 'en') {
        return [lang, 'en'];
    }
    else {
        return [lang];
    }
};
const translate1 = (lang) => __awaiter(this, void 0, void 0, function* () {
    var e_1, _a;
    var datas = pageLangFallback(lang).map(l => getTransJSON(l));
    for (let el of $('[trans-tag')) {
        let transStr;
        try {
            for (var datas_1 = __asyncValues(datas), datas_1_1; datas_1_1 = yield datas_1.next(), !datas_1_1.done;) {
                let data = datas_1_1.value;
                transStr = data[$(el).attr('trans-tag')];
                if (transStr) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (datas_1_1 && !datas_1_1.done && (_a = datas_1.return)) yield _a.call(datas_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        $(el).text(transStr);
    }
});
translate1(window.urlParams.get('lang'));
$('html').attr('lang', window.urlParams.get('lang'));
