import * as Cookies from "js-cookie"

/**
============================================
    字符串属性重写开始部分
============================================
**/
String.prototype.startWith = function(b) {
    var a = new RegExp("^" + b);
    return a.test(this)
};
String.prototype.endWith = function(b) {
    var a = new RegExp(b + "$");
    return a.test(this)
};
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.IsInt = function() {
    if (this == "NaN") {
        return false
    }
    return this == parseInt(this).toString()
};
String.prototype.left = function(a) {
    return this.slice(0, a)
};
String.prototype.right = function(a) {
    return this.slice(this.length - a)
};
String.prototype.HTMLEncode = function() {
    var c = this;
    var a = [ /x26/g, /x3C/g, /x3E/g, /x20/g ];
    var d = [ "&", "<", ">", " " ];
    for ( var b = 0; b < a.length; b++) {
        c = c.replace(a[b], d[b])
    }
    return c
};
String.prototype.ascW = function() {
    var a = "";
    for ( var b = 0; b < this.length; b++) {
        a += "&#" + this.charCodeAt(b) + ";"
    }
    return a
};
String.prototype.format = function() {
    var a = arguments;
    return this.replace(/\{(\d+)\}/g, function(c, b) {
        return a[b]
    })
};
/**
     字符串属性重写结束部分
============================================
**/

/**
============================================
    日期属性重写开始部分
**/
Date.prototype.format = function(a) {
    var d = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        S : this.getMilliseconds()
    };
    var c = {
        "0" : "\u65e5",
        "1" : "\u4e00",
        "2" : "\u4e8c",
        "3" : "\u4e09",
        "4" : "\u56db",
        "5" : "\u4e94",
        "6" : "\u516d"
    };
    if (/(y+)/.test(a)) {
        a = a.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(a)) {
        a = a
                .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
                                : "\u5468")
                                : "")
                                + c[this.getDay() + ""])
    }
    for ( var b in d) {
        if (new RegExp("(" + b + ")").test(a)) {
            a = a.replace(RegExp.$1, (RegExp.$1.length == 1) ? (d[b])
                    : (("00" + d[b]).substr(("" + d[b]).length)))
        }
    }
    return a
};
Date.MONTH_DAYS = [ 31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
Date.ENG_MONTH_MAP = {
    Jan : 1,
    Feb : 2,
    Mar : 3,
    Apr : 4,
    May : 5,
    Jun : 6,
    Jul : 7,
    Aug : 8,
    Sep : 9,
    Oct : 10,
    Nov : 11,
    Dec : 12
};
Date.MONTH_ENG_MAP = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec" ];
Date.prototype.diffDayHourString = function(c) {
    var d = this;
    var b;
    if (typeof d == "object") {
        b = c.getTime() - d.getTime()
    } else {
        b = c - d
    }
    var f = Math.floor(b / (24 * 3600 * 1000));
    var e = b % (24 * 3600 * 1000);
    var a = Math.floor(e / (3600 * 1000));
    return f + "D " + a + "H"
};
Date.prototype.addTime = function(c) {
    var a = this;
    var b = new Date(a - 0 + c * 86400000);
    return b
};
Date.prototype.addMonth = function(b) {
    var a = this;
    a.setMonth(a.getMonth() + b);
    return a
};
Date.prototype.addYear = function(b) {
    var a = this;
    a.setFullYear(a.getFullYear() + b);
    return a
};
Date.prototype.addHour = function(b) {
    var a = this;
    a.setHours(a.getHours() + b);
    return a
};
Date.prototype.addMinute = function(b) {
    var a = this;
    a.setMinutes(a.getMinutes() + b);
    return a
};
Date.prototype.getChinaMonth = function() {
    var b = this;
    var a = b.getMonth() + 1;
    if (a > 9) {
        return a.toString()
    }
    return "0" + a
};
Date.prototype.diffHourInt = function(c) {
    var d = this;
    var b;
    if (typeof d == "object") {
        b = c.getTime() - d.getTime()
    } else {
        b = c - d
    }
    var f = Math.floor(b / (24 * 3600 * 1000));
    var e = b % (24 * 3600 * 1000);
    var a = Math.floor(e / (3600 * 1000));
    return f * 24 + a
};
Date.prototype.getMonthDays = function(a, b) {
    a -= 0;
    b -= 0;
    if (b == 1) {
        if (0 == a % 4 && ((a % 100 != 0) || (a % 400 == 0))) {
            return 29
        } else {
            return 28
        }
    } else {
        return Date.MONTH_DAYS[b]
    }
};
Date.prototype.getMonthWeek = function() {
    var b = this, a = b.getDay(), c = b.getDate();
    return Math.ceil((c + 6 - a) / 7)
};
Date.prototype.getYearWeek = function() {
    var b = this, a = new Date(b.getFullYear(), 0, 1), c = Math.round((b
            .valueOf() - a.valueOf()) / 86400000);
    return Math.ceil((c + (((a.getDay() || 7) + 1) - 1)) / 7)
};
function format(){
};
format.formatDate = function(v, dateFormat) {
    try {
        if(v== null){
            return "";
        }
        if (dateFormat == undefined || typeof dateFormat != "string") {
            dateFormat = "yyyy-MM-dd"
        }
        if ((typeof v) == "number") {
            var o = new Date(v);
            return o.format(dateFormat)
        }
        if ((typeof v) == "string" && v.indexOf("/Date(") == 0) {
            var date = eval("new " + eval(v).source);
            return date.format(dateFormat)
        }
        if (v.time) {
            var o = new Date(v.time);
            return o.format(dateFormat)
        } else {
            if (v != "") {
                v = v.replace(/\//g, "-");
                var myDate;
                if (v.split(" ")) {
                    myDate = v.split(" ")[0]
                } else {
                    myDate = v
                }
                myDate = myDate.replace("-0", "-").replace("-0", "-");
                var nowDate = new Date();
                if (myDate.split("-")[0] == nowDate.getFullYear()) {
                    return myDate.split("-")[1] + "月" + myDate.split("-")[2]
                            + "日"
                } else {
                    return myDate.split("-")[0] + "年" + myDate.split("-")[1]
                            + "月" + myDate.split("-")[2] + "日"
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    return "";
};

/*
    * 堆栈类
    */
var Stack = function(){
    this.data = new Array;
};
Stack.prototype = {
    //入栈
    push:function(opt){
        this.data.push(opt);
    },
    //出栈
    pop:function(){
        return this.data.pop();
    },
    //是否为空
    isEmpty:function(){
        if(0==this.data.length){
            return true;
        }
        return false;
    },
    /*
        * 输出结果
        * @format 分格，默认为,
        */
    toString:function(format){
        if(format == null){
            format = ",";
        }
        return this.data.join(format);
    }
};

/*
    * Long term storage for persistence of state/etc
    */
var store = window.localStorage;

var getCache = function (key) {
    var value = null;
    try {
        value = store.getItem(key);
    } catch(e) {
        
    }
    if(value == null){
        value = Cookies.get(key);
    }
    return value;
};

var setCache = function (key, value) {
    try {
        store.setItem(key, value);
    } catch(e) {
        Cookies.set(key,value);
    }
};


function UriUtil () {

}
UriUtil.encode = function (value) {
    return window.encodeURIComponent(value);
};

UriUtil.decode = function (value) {
    try {
        return window.decodeURIComponent('' + value);
    } catch (err) {
        return value;
    }
};

UriUtil.parseQuery = function () {
    var query = window.location.hash.replace(/^\#/, '');
    if (!query) {
        return null;
    }

    return query.split('&').map(function(param) {
        var splitPoint = param.indexOf('=');
        return {
            key : param.substring(0, splitPoint),
            value : param.substring(splitPoint + 1)
        };
    }).reduce(function(params, param){
        if (param.key && param.value) {
            params[param.key] = UriUtil.decode(param.value);
        }
        return params;
    }, {});
}

UriUtil.updateQuery = function (object) {
    var query = Object.keys(object).map(function(key){
        return key + '=' + UriUtil.encode(object[key]);
    }).join('&');
    window.location.hash = query;
}



var hasOwn = {}.hasOwnProperty;
function classNames () {
    var classes = [];

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg) continue;

        var argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
            classes.push(arg);
        } else if (Array.isArray(arg)) {
            classes.push(classNames.apply(null, arg));
        } else if (argType === 'object') {
            for (var key in arg) {
                if (hasOwn.call(arg, key) && arg[key]) {
                    classes.push(key);
                }
            }
        }
    }

    return classes.join(' ');
}
/*----------------------------------------
                暴露公共方法
----------------------------------------*/
export default {
    classNames:classNames,

    format:format,
    Stack:Stack,		//堆栈

    getCache:getCache,
    setCache:setCache,
    
    parseQuery:UriUtil.parseQuery,
    updateQuery:UriUtil.updateQuery
}