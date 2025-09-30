const headerFeatures = [
    function(elem) {
        elem.innerHTML = "I can make something good. <a style='color: inherit;' href='https://youtu.be/PuMz4v5PYKc'>【=◈︿◈=】</a>" + elem.innerHTML;
    },
    function(elem) {
        elem.innerHTML = "<pre style='display: inline-block;'><code class='language-cpp' style='display: inline-block; padding: 0; background: none;'>while (true) stay(self); // &lt;3</code></pre>" + elem.innerHTML;
    },
    function(elem) {
        let blink = elem.innerHTML.trim();
        let updateTime = function(elem) {
            let str = (new Date()).toLocaleString();
            elem.innerHTML = str + blink;
        }
        updateTime(elem);
        setInterval(() => updateTime(elem), 1000);
    },
    function(elem) {
        let rickroll = function() {
            let main = document.getElementsByTagName("main")[0];
            main.innerHTML = "<img style='width: 100%; margin: 0;' src='/_global/features/rickroll.gif' />";
            main.style.padding = 0;
            main.scrollIntoView();
        }
        elem.innerHTML = "[ Advertising space (<a href='#'>click for details</a>) ]" + elem.innerHTML;
        elem.firstElementChild.addEventListener("click", rickroll);
    },
    function(elem) {
        let blink = elem.innerHTML.trim();
        elem.innerHTML = "Fetching..." + blink;
        let promise = fetch("//ipinfo.io/json")
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status);
                return response.json();
            })
            .then(json => {
                let loc = json.loc.split(",");
                let str = json.ip + " / ";
                str += json.country + ", " + json.region + ", " + json.city + " ";
                str += json.postal.slice(0, -2) + "** / ";
                str += loc[0].slice(0, -1) + "**, " + loc[1].slice(0, -1) + "**";
            
                elem.innerHTML = str + blink;
            })
            .catch(error => {
                elem.style.color = "red";
                elem.innerHTML = "Error: " + error.message + blink;
            });
    },
    function(elem) {
        const FRAMES = [
            "◟", "]◟", "͜0]", "0‿0]", "╷0‿0]◟", "[╷0‿0]◟", " [◟0‿0]", "  [◟0‿0]",
            "   [╷0‿0]◟", "    [╷0‿0]◟", "     [◟0‿0]", "_     [◟0‿0]", "_      [╷0‿0]◟",
            "W       [╷0‿0]◟", "WE       [◟0‿0]", "WEL_      [◟0‿0]", "WELC_      [0‿0]◟",
            "WELCO      ,[0‿0]◟", "WELCOM     ,[°‿°]◟", "WELCOME_   ,[‒ᴗ‒]‒",
            "WELCOME!_  ,['▾']ノ", "WELCOME!_  ,[^▾^])", "WELCOME!   ,[^▾^]ノ",
            "WELCOME!   ,[^▾^])", "WELCOME!_  ,[^▾^]ノ", "WELCOME!_  ,[^▾^])",
            "WELCOME!   ,[^▾^]ノ", "WELCOME!   ,['▾']‒", "WELCOME!_  ,[°ᴗ°]◟",
            "WELCOME!_  ‒[0‿0]‒", "WELCOME!   <[0‿0]>", "WELCOME!   <[0‿o]>",
            "WELCOME!   <[0‿‒]>", "WELCOME!   <[0‿<]*", "WELCOME!   <[0‿‒]> ̽",
            "WELCOME!   <[0‿0]>˙", "WELCOME!   <[0‿0]>"
        ];
        let frame = 0;
        let blink = elem.innerHTML.trim();
        elem.innerHTML = "<pre style='display: inline-block; line-height: 1.2; font-family: var(--font-monospace);' />";
        let anim = elem.firstChild;
        let ival = setInterval(() => {
            anim.textContent = FRAMES[frame];
            frame += 1;
            if (frame == FRAMES.length)
            {
                clearInterval(ival);
                elem.innerHTML += blink;
            }
        }, 150);
    }
];

function placeHeaderFeature()
{
    let elem = document.getElementById('header-feature');
    let idx = Math.floor(Math.random() * headerFeatures.length);
    headerFeatures[idx](elem);
}

