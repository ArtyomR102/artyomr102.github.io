const VacuumEnergySim = {
	pal: [
		[0, 0, 0],
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 255, 0],
		[255, 0, 255],
		[0, 255, 255],
		[255, 255, 255]
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
		
		let cx = Math.floor(this.width / 2);
		let cy = Math.floor(this.height / 2);
		this.e[cy][cx] = 1.0;
		
		this.tick();
	},
	
	tick: function() {
		for (let x = 1; x < this.width - 1; x++) {
			for (let y = 1; y < this.height - 1; y++) {
				this.e[y][x] = Math.max(
					Math.ceil(this.e[y][x]),
					Math.max(
						this.e[y-1][x], this.e[y+1][x],
						this.e[y][x-1], this.e[y][x+1]
					),
					Math.max(
						this.e[y-1][x-1], this.e[y-1][x+1],
						this.e[y+1][x-1], this.e[y+1][x+1]
					) - 0.707
				);
				
				let idx = (y * this.width + x) * 4;
				let color = this.pal[Math.floor(this.e[x][y]) % 8];
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
