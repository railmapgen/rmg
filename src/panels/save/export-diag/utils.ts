export function test(svgEl: JQuery<Element>) {
    var [svgW, svgH] = svgEl.attr('viewBox').split(' ').slice(2);
    svgEl.attr({
        width: svgW, height: svgH
    });

    var canvas = <HTMLCanvasElement> $('canvas')[0];
    $('canvas').attr({
        width: Number(svgW)*2.5, height:Number(svgH)*2.5
    });
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bypass Chrome min font size (to be improved)

    svgEl.find('.rmg-name__en.rmg-name__mtr--station').each((_,el) => {
        $(el).attr('font-size', '11px');
    });

    svgEl.find('.rmg-name__en.rmg-name__gzmtr--station, .rmg-name__zh.IntName').each((_,el) => {
        $(el).attr('font-size', '10px');
    });

    svgEl.find('.rmg-name__en.rmg-name__mtr--osi').each((_,el) => {
        $(el).attr('font-size', '9px');
    });

    svgEl.find('.rmg-name__en.rmg-name__gzmtr--next2-dest').each((_,el) => {
        $(el).attr('font-size', '8.5px')
    });

    svgEl.find('.rmg-name__en.rmg-name__gzmtr--int').each((_,el) => {
        $(el).attr('font-size', '8px');
    });

    svgEl.find('.rmg-name__en.rmg-name__gzmtr--int-small, .rmg-name__en.IntName').each((_,el) => {
        $(el).attr('font-size', '7px');
    });

    svgEl.find('.rmg-name__en.rmg-name__gzmtr--express').each((_,el) => {
        $(el).attr('font-size', '6.5px');
    });

    svgEl.find('text:not([font-size]), tspan:not([font-size])').each((_,el) => {
        $(el).attr('font-size', window.getComputedStyle(el).fontSize);
    });

    svgEl.find('text, tspan').each((_,el) => {
        var elStyle = window.getComputedStyle(el);
        $(el).attr({
            'font-family': elStyle.getPropertyValue('font-family'), 
            'fill': elStyle.getPropertyValue('fill'), 
            'alignment-baseline': elStyle.getPropertyValue('alignment-baseline'), 
            'dominant-baseline': elStyle.getPropertyValue('dominant-baseline'),
            'text-anchor': elStyle.getPropertyValue('text-anchor')
        }).removeAttr('class');
    });

    svgEl.find('#strip, #dest_strip').each((_,el) => {
        var elStyle = window.getComputedStyle(el);
        $(el).attr({
            'stroke-width': elStyle.getPropertyValue('stroke-width')
        });
    });

    var img = new Image();
    img.onload = function() {
        setTimeout(() => {
            ctx.drawImage(img, 0, 0, Number(svgW)*2.5, Number(svgH)*2.5)
            saveAs(
                (<HTMLCanvasElement>$('canvas')[0]).toDataURL('image/png'), 
                'rmg_export'
            );
        }, 2000)
    };
    // img.onloadend = () => {
    //     console.log('img loaded')
    // }
    img.addEventListener('loadend', () => {
        console.log('img loaded')
    })
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl[0].outerHTML)));
}

function saveAs(uri: string, filename: string) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);

    } else {
        window.open(uri);
    }
}