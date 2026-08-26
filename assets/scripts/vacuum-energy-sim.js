const VacuumEnergySim = {
	pal: [
		[0,0,0],       // 0 - ложный вакуум (чёрный)
		[255,0,0],     // 1 - уровень 1 (красный)
		[0,255,0],     // 2 - уровень 2 (зелёный)
		[0,0,255],     // 3 - уровень 3 (синий)
		[255,255,0],   // 4 - жёлтый
		[255,0,255],   // 5 - пурпурный
		[0,255,255],   // 6 - циан
		[255,255,255]  // 7 - белый (максимум)
	],
	
	initialize: function() {
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.img = this.ctx.createImageData(this.width, this.height);
		
		this.e = [];
		for (let y = 0; y < this.height; y++) {
			this.e[y] = new Float32Array(this.width);
		}
		
		// Зародыш истинного вакуума (энергия = 10)
		let cx = Math.floor(this.width / 2);
		let cy = Math.floor(this.height / 2);
		this.e[cy][cx] = 1.0;
		
		this.tick();
	},
	
	tick: function() {
		let e_new = this.e.map(row => new Float32Array(row));
		
		for (let y = 1; y < this.height - 1; y++) {
			for (let x = 1; x < this.width - 1; x++) {
				let straight = Math.max(
					this.e[y-1][x], this.e[y+1][x],
					this.e[y][x-1], this.e[y][x+1]
				);
				let diag = Math.max(
					this.e[y-1][x-1], this.e[y-1][x+1],
					this.e[y+1][x-1], this.e[y+1][x+1]
				);
				
				e_new[y][x] = Math.max(
					this.e[y][x],
					straight,
					diag * 0.707
				);
			}
		}
		
		this.e = e_new;
		
		let data = this.img.data;
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let level = Math.ceil(this.e[y][x]);
				level = Math.min(level, this.pal.length - 1);
				
				let idx = (y * this.width + x) * 4;
				let color = this.pal[level];
				data[idx] = color[0];
				data[idx+1] = color[1];
				data[idx+2] = color[2];
				data[idx+3] = 255;
			}
		}
		this.ctx.putImageData(this.img, 0, 0);
		
		requestAnimationFrame(() => this.tick());
	}
};

VacuumEnergySim.initialize();
