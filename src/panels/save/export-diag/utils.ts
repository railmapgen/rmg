export function test(svgEl: SVGSVGElement) {
    let svgW = svgEl.viewBox.baseVal.width;
    let svgH = svgEl.viewBox.baseVal.height;

    svgEl.setAttribute('width', svgW.toString());
    svgEl.setAttribute('height', svgH.toString());

    let canvas = document.querySelectorAll('canvas')[0];
    canvas.width = Number(svgW) * 2.5;
    canvas.height = Number(svgH) * 2.5;

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bypass Chrome min font size (to be improved)

    svgEl.querySelectorAll('.rmg-name__en.rmg-name__mtr--station').forEach(el => el.setAttribute('font-size', '11px'));

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--station')
        .forEach(el => el.setAttribute('font-size', '10.5px'));

    svgEl.querySelectorAll('.rmg-name__zh.IntName').forEach(el => el.setAttribute('font-size', '10px'));

    svgEl.querySelectorAll('.rmg-name__en.rmg-name__mtr--osi').forEach(el => el.setAttribute('font-size', '9px'));

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--next2-dest')
        .forEach(el => el.setAttribute('font-size', '8.5px'));

    svgEl.querySelectorAll('.rmg-name__en.rmg-name__gzmtr--int').forEach(el => el.setAttribute('font-size', '8px'));

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--int-small, .rmg-name__en.IntName')
        .forEach(el => el.setAttribute('font-size', '7px'));

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--express')
        .forEach(el => el.setAttribute('font-size', '6.5px'));

    svgEl
        .querySelectorAll('text:not([font-size]), tspan:not([font-size])')
        .forEach(el => el.setAttribute('font-size', window.getComputedStyle(el).fontSize));

    svgEl.querySelectorAll('text, tspan').forEach(el => {
        let elStyle = window.getComputedStyle(el);
        el.setAttribute('font-family', elStyle.fontFamily);
        el.setAttribute('fill', elStyle.fill);
        el.setAttribute('dominant-baseline', elStyle.dominantBaseline);
        el.setAttribute('text-anchor', elStyle.textAnchor);
        el.removeAttribute('class');
    });

    var img = new Image();
    img.onload = function() {
        setTimeout(() => {
            ctx.drawImage(img, 0, 0, Number(svgW) * 2.5, Number(svgH) * 2.5);
            saveAs(canvas.toDataURL('image/png'), 'rmg.' + new Date().toISOString() + '.png');
        }, 2000);
    };
    // img.onloadend = () => {
    //     console.log('img loaded')
    // }
    img.addEventListener('loadend', () => {
        console.log('img loaded');
    });
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl.outerHTML)));
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
