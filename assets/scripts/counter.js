function initCounter()
{
    if (new URLSearchParams(window.location.search).has('noCounter'))
    {
        d.getElementById("counter").parentElement.remove();
        return;
    }
    
    let d = document;
    let s = screen;
    d.getElementById("counter").src = "https://counter.yadro.ru/hit?t18.1;r"
        + escape(d.referrer) + ((typeof(s)=="undefined") ? "" : ";s"
        + s.width + "*" + s.height + "*" + (s.colorDepth ? s.colorDepth : s.pixelDepth))
        + ";u"+escape(d.URL) + ";h" + escape(d.title.substring(0,150)) + ";" + Math.random();
}

