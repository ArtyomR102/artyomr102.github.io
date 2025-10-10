const headerFeatures = {
    'nurture': function(elem) {
        elem.innerHTML = "I can make something good. <a href='https://youtu.be/PuMz4v5PYKc'>【=◈︿◈=】</a>" + elem.innerHTML.trim();
    },
    'code': function(elem) {
        elem.innerHTML = "<span class='hljs-keyword'>while</span> (<span class='hljs-literal'>true</span>) <span class='hljs-built_in'>stay</span>(self); <span class='hljs-comment'>// &lt;3</span>" + elem.innerHTML.trim();
    },
    'clock': function(elem) {
        let blink = elem.innerHTML.trim();
        let updateTime = function(elem) {
            let str = (new Date()).toLocaleString();
            elem.innerHTML = str + blink;
        }
        updateTime(elem);
        setInterval(() => updateTime(elem), 1000);
    },
    'surprise': function(elem) {
        let rickroll = function() {
            let main = document.getElementsByTagName("main")[0];
            main.innerHTML = "<img style='width: 100%; margin: 0;' src='/assets/rickroll.gif' onload='this.scrollIntoView({behavior: \"smooth\", block: \"center\"})' />";
            main.style.padding = 0;
        }
        elem.innerHTML = "[ Advertising space (<a href='#'>click for details</a>) ]" + elem.innerHTML;
        elem.firstElementChild.addEventListener("click", rickroll);
    },
    'deanon': function(elem) {
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
    'animation': function(elem) {
        const FRAMES = [
            "◟", "]◟", "͜0]", "0ᴗ0]", "╷0ᴗ0]◟", "[╷0ᴗ0]◟", " [◟0ᴗ0]", "  [◟0ᴗ0]",
            "   [╷0ᴗ0]◟", "    [╷0ᴗ0]◟", "     [◟0ᴗ0]", "_     [◟0ᴗ0]", "_      [╷0ᴗ0]◟",
            "W       [╷0ᴗ0]◟", "WE       [◟0ᴗ0]", "WEL_      [◟0ᴗ0]", "WELC_      [0ᴗ0]◟",
            "WELCO      ,[0ᴗ0]◟", "WELCOM     ,[°ᴗ°]◟", "WELCOME_   ,[‒v‒]‒",
            "WELCOME!_  ,['▾']ノ", "WELCOME!_  ,[^▾^])", "WELCOME!   ,[^▾^]ノ",
            "WELCOME!   ,[^▾^])", "WELCOME!_  ,[^▾^]ノ", "WELCOME!_  ,[^▾^])",
            "WELCOME!   ,[^▾^]ノ", "WELCOME!   ,['▾']‒", "WELCOME!_  ,[°v°]◟",
            "WELCOME!_  ,[0ᴗ0]◟", "WELCOME!   ,[0ᴗ0]◟"
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
};

function placeHeaderFeature()
{
    let elem = document.getElementById('header-feature');
    let key = new URLSearchParams(window.location.search).get('headerFeature');
    
    if (key == null || !headerFeatures.hasOwnProperty(key))
    {
        let keys = Object.keys(headerFeatures);
        key = keys[Math.floor(Math.random() * keys.length)];
    }
    
    headerFeatures[key](elem);
}

