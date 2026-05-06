const HeaderFeature = {
	features: {
		nurture: function(elem) {
			elem.innerHTML = "I can make something good. <a href='https://youtu.be/PuMz4v5PYKc'>【=◈︿◈=】</a>" + elem.innerHTML.trim();
		},
		code: function(elem) {
			elem.innerHTML = "<span class='hljs-keyword'>while</span> (<span class='hljs-literal'>true</span>) <span class='hljs-built_in'>stay</span>(self); <span class='hljs-comment'>// &lt;3</span>" + elem.innerHTML.trim();
		},
		clock: function(elem) {
			let blink = elem.innerHTML.trim();
			let updateTime = function(elem) {
				let str = (new Date()).toLocaleString();
				elem.innerHTML = str + blink;
			}
			updateTime(elem);
			setInterval(() => updateTime(elem), 1000);
		},
		surprise: function(elem) {
			let rickroll = function() {
				let main = document.getElementsByTagName("main")[0];
				main.innerHTML = "<img style='width: 100%; margin: 0;' src='/assets/images/rickroll.gif' onload='this.scrollIntoView({behavior: \"smooth\", block: \"center\"})' />";
				main.style.padding = 0;
			}
			elem.innerHTML = "[ Advertising space (<a href='#'>click for details</a>) ]" + elem.innerHTML.trim();
			elem.firstElementChild.addEventListener("click", rickroll);
		},
		deanon: function(elem) {
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
		animation: function(elem) {
			const FRAMES = [
				"◟", "]◟", "͜0]", "0ᴗ0]", "╷0ᴗ0]◟", "[╷0ᴗ0]◟", " [◟0ᴗ0]", "  [◟0ᴗ0]",
				"   [╷0ᴗ0]◟", "	[╷0ᴗ0]◟", "	 [◟0ᴗ0]", "_	 [◟0ᴗ0]", "_	  [╷0ᴗ0]◟",
				"W	   [╷0ᴗ0]◟", "WE	   [◟0ᴗ0]", "WEL_	  [◟0ᴗ0]", "WELC_	  [0ᴗ0]◟",
				"WELCO	  ,[0ᴗ0]◟", "WELCOM	 ,[°ᴗ°]◟", "WELCOME_   ,[‒v‒]‒",
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
	},

	place: function() {
		let elem = document.getElementById('header-feature');
		let key = new URLSearchParams(window.location.search).get('headerFeature');
		
		if (key == null || !this.features.hasOwnProperty(key))
		{
			let keys = Object.keys(this.features);
			key = keys[Math.floor(Math.random() * keys.length)];
		}
		
		this.features[key](elem);
	}
};

const SideFeatures = {
	features: {
		rm: function(elem) {
			elem.innerHTML = '<code style="">$ sudo rm -rf --no-preserve-root<blink>_</blink></code>';
		},
		clock: function(elem) {
			elem.innerHTML = `
				<svg width="120" height="120" viewBox="0 0 120 120">
					<style>
						* {
							stroke-width: 5;
							stroke: #007f00;
							stroke-linecap: square;
							fill: none;
							overflow: visible;
						}
					</style>
					<polygon points="120,60 112,90 90,112 60,120 30,112 8,90 0,60 8,30 30,8 60,0 90,8 112,30" />
					<polyline id="clock-hands" />
				</svg>
			`;
			let hands = document.getElementById('clock-hands');

			let update = function(elem) {
				let date = new Date();
				let hx = Math.round(60 + 30 * Math.sin((date.getHours() + date.getMinutes() / 60.0) * Math.PI / 6));
				let hy = Math.round(60 - 30 * Math.cos((date.getHours() + date.getMinutes() / 60.0) * Math.PI / 6));
				let my = Math.round(60 - 45 * Math.cos(date.getMinutes() * Math.PI / 30));
				let mx = Math.round(60 + 45 * Math.sin(date.getMinutes() * Math.PI / 30));
				elem.setAttribute('points', `${hx},${hy} 60,60 ${mx},${my}`);
			}
			update(hands);
			setTimeout(function() {
				update(hands);
				setInterval(update, 60000, hands);
			}, (60 - (new Date).getSeconds()) * 1000, hands);
		},
        nginx: function(elem) {
			elem.innerHTML = `
                <center>
                    <h3>500 Internal Server Error</h3>
                    <hr>
                    nginx
                </center>`;
		},
		scam: function(elem) {
			elem.innerHTML = "<br><br><br><br><br><a>Click here!</a>";
			elem.style.width = '200px';
			elem.style.height = '150px';
			elem.style.userSelect = 'none';

			let pos = elem.getBoundingClientRect();
			document.body.insertAdjacentHTML('beforeend', `
				<div style="
					position: absolute;
					left: 0; right: 0;
					top: ${pos.top + window.scrollY + 10}px;
					text-indent: ${pos.left + + window.scrollX + 10}px;
					word-break: break-all;
					pointer-events: none;
				">
					<p>CONGRATULATIONS!</p>
					<p>You won 99,999,999 Kromers!</p>
					<p>To get your money, please download our Smart Crypto Helper Tool for free</p>
				<div>
			`)
		},
		glitch: function(elem) {
			let canvas = document.createElement('canvas');
            canvas.width = 180;
            canvas.height = 130;
            canvas.style.cursor = 'progress';
            canvas.onclick = function() {
                window.location.href = "/" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
            }
            elem.appendChild(canvas);

            let ctx = canvas.getContext('2d');
            ctx.fillStyle = 'green';
            let frames = Math.random() * 30 + 15
            for (let f = 0; f < frames; f++) {
                let x = Math.random() * 180;
                let y = Math.random() * 130;
                let w = Math.random() * (180 - x);
                let h = Math.random() * (130 - y);
                ctx[f % 2 ? 'clearRect' : 'fillRect'](x, y, w, h);
            }
		}
	},

	place: function() {
		let num = Math.floor(Math.random() * 3);
		let list = [];

		let key = new URLSearchParams(window.location.search).get('sideFeatures');
		if (key != null) {
			key.split(",").forEach((val) => {
				if (!this.features.hasOwnProperty(val))
					return;

				list.push(val);
			})
		}
		
		if (list.length < num) {
			let keys = Object.keys(this.features);
			while (list.length < num) {
				let key = keys[Math.floor(Math.random() * keys.length)];
				list.push(key);
			}
		}

		let sides = [{
				elem: document.getElementById('right-side-features'),
				cells: Math.ceil(list.length / 2)
			}, {
				elem: document.getElementById('left-side-features'),
				cells: Math.floor(list.length / 2)
		}];

		sides.forEach(function(side) {
			side.size = side.elem.getBoundingClientRect().height
			side.csize = side.size / side.cells;
		});

		list.forEach((feat, idx) => {
			let side = sides[idx % 2];
			let elem = document.createElement('div');
			elem.style[idx % 2 ? 'right' : 'left'] = 0;
			side.elem.appendChild(elem);
			elem.style.top = (Math.random() * Math.max(side.csize - 150, 0)) + Math.floor(idx / 2) * side.csize + 'px';
			this.features[feat](elem);
		});
	}
};

function placeAllFeatures() {
	HeaderFeature.place();
	SideFeatures.place();
}

