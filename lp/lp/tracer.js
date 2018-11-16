window._tracer_base = 'http://admin.bmtower1.bz/';//admin.lpmotor.ru';
function tRacerGetParam(name) {
    var m = new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search);
    return (null !== m && 'undefined' !== typeof m[1]) ? m[1] : null;
}
function _tRacerScript(name, params, sync) {
    if (sync) {
        console.log('send sync request');
        $.ajax({
            url: window._tracer_base + 'tracer/' + name,
            data: params,
            dataType: 'json',
            cache: false,
            async: false,
            complete: function () {
                console.log('sync request done');
            }
        });
    } else {
        var script = document.createElement('script');
        script.className = 'mag_script';
        script.type = 'text/javascript';
        script.src = window._tracer_base + 'tracer/' + name + '.js?' + params + '&_=' + (+new Date());
        script.onload = function () {
            this.parentNode.removeChild(this);
            if (this.fn_string) {
                eval(this.fn_string);
            }
        };
        if ('string' === typeof fn) {
            script.fn_string = fn;
        }
        document.body.appendChild(script);
    }
}
function tRacerVis(type) {
    if ('undefined' === typeof type) {
        type = 'landing';
    }

    var p = tRacerGetParam('p'),
        utm_source = tRacerGetParam('utm_source'),
        utm_medium = tRacerGetParam('utm_medium'),
        utm_term = tRacerGetParam('utm_term'),
        utm_content = tRacerGetParam('utm_content'),
        utm_campaign = tRacerGetParam('utm_campaign');

    if (null !== utm_source) {
        utm_source = '&utm_source=' + encodeURI(utm_source);
    } else {
        utm_source = '';
    }
    if (null !== utm_medium) {
        utm_medium = '&utm_medium=' + encodeURI(utm_medium);
    } else {
        utm_medium = '';
    }
    if (null !== utm_term) {
        utm_term = '&utm_term=' + encodeURI(utm_term);
    } else {
        utm_term = '';
    }
    if (null !== utm_content) {
        utm_content = '&utm_content=' + encodeURI(utm_content);
    } else {
        utm_content = '';
    }
    if (null !== utm_campaign) {
        utm_campaign = '&utm_campaign=' + encodeURI(utm_campaign);
    } else {
        utm_campaign = '';
    }

    //    var script = document.createElement('script');
    //    script.className = 'mag_script';
    //    script.type = 'text/javascript';
    //    script.src = (document.location.protocol == "https:" ? "https:" : "http:")+'//admin.lpmotor.ru/tracer/vis.js?type='+type+'&ref='+document.referrer+(null===p ? '' : '&p='+encodeURI(p))+utm_source+utm_medium+utm_term+utm_content+utm_campaign+'&_='+(+new Date());
    //    script.onload = function(){ this.parentNode.removeChild(this); };
    //    document.body.appendChild(script);
    _tRacerScript('vis', 'type=' + type + '&ref=' + document.referrer + (null === p ? '' : '&p=' + encodeURI(p)) + utm_source + utm_medium + utm_term + utm_content + utm_campaign);
}
function tRacerVisBack(d) {
    if ('undefined' === typeof d['status']) {
        return;
    }

    if ('undefined' !== typeof d['cid']) {
        console.log('tRacer cid = ', d.cid);
    }
    console.log('tRacer data = ', d);
    if ('ok' == d.status) {
        //setCookie('_lpcid', d.cid, 365);
    }
}
function tRacerSetFlag(name, val) {
    var v = '';
    if ('undefined' === typeof val) {
        val = '';
    }
    else {
        v = '&val=' + val;
    }

    var img = new Image();
    img.className = 'mag_img';
    img.onload = function () {
        this.parentNode.removeChild(this);
    };
    img.src = (document.location.protocol == "https:" ? "https:" : "http:") + '//' + document.location.host + '/tracer/set_flag.gif?name=' + encodeURI(name) + v + '&_=' + (+new Date());
    document.body.appendChild(img);
    img = null;
}
function tRacerEvent(evName, ops) {
    var sync = false;
    if ('undefined' !== typeof ops && 'undefined' !== ops['sync']) {
        sync = true;
        delete ops['sync'];
    }
    var o = '';
    if ('undefined' !== typeof ops) {
        for (var k in ops) {
            o += '&' + k + '=' + encodeURI(ops[k]);
        }
        k = null;
    }
    _tRacerScript('event', 'name=' + evName + o, sync);
}