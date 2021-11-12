export function test(svgEl: SVGSVGElement, scale: number, filename: string) {
    let svgW = svgEl.viewBox.baseVal.width;
    let svgH = svgEl.viewBox.baseVal.height;

    // svgEl.removeAttribute('height');

    let canvas = document.querySelectorAll('canvas')[0];
    canvas.width = Number(svgW) * window.devicePixelRatio * scale;
    canvas.height = Number(svgH) * window.devicePixelRatio * scale;

    svgEl.setAttribute('width', canvas.width.toString());
    svgEl.setAttribute('height', canvas.height.toString());

    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bypass Chrome min font size (to be improved)

    svgEl.querySelectorAll('.rmg-name__en.rmg-name__mtr--station').forEach(el => el.setAttribute('font-size', '11px'));

    svgEl.querySelectorAll('.rmg-name__zh.IntName').forEach(el => el.setAttribute('font-size', '10px'));

    svgEl.querySelectorAll('.rmg-name__en.rmg-name__mtr--osi').forEach(el => el.setAttribute('font-size', '9px'));

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--next2-dest')
        .forEach(el => el.setAttribute('font-size', '8.5px'));

    svgEl.querySelectorAll('.rmg-name__en.IntName').forEach(el => el.setAttribute('font-size', '7px'));

    // svgEl
    //     .querySelectorAll('text:not([font-size]), tspan:not([font-size])')
    //     .forEach((el) => el.setAttribute('font-size', window.getComputedStyle(el).fontSize));

    svgEl.querySelectorAll('text, tspan').forEach(el => {
        let elStyle = window.getComputedStyle(el);
        el.setAttribute('font-family', elStyle.fontFamily);
        el.setAttribute('fill', elStyle.fill);
        el.setAttribute('dominant-baseline', elStyle.dominantBaseline);
        el.setAttribute('text-anchor', elStyle.textAnchor || '');
        // el.removeAttribute('class');
    });

    var img = new Image();
    img.onload = () => {
        setTimeout(() => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveAs(canvas.toDataURL('image/png'), filename);
        }, 2000);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl.outerHTML)));
}

function saveAs(uri: string, filename: string) {
    var link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = `${filename}.png`;
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
