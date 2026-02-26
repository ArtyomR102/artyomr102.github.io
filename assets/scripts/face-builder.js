const FaceBuilder = {
    selTile: -1,
    mirrorMode: true,

    faceData: [{
            "elem": "left-arm",
            "char": "╭–𝀅<~ㇸ",
            "diac": false
        }, {
            "elem": "left-rim",
            "char": "([⟨{❲",
            "diac": false
        }, {
            "elem": "left-dec",
            "char": "^",
            "diac": false
        }, {
            "elem": "left-eye",
            "char": "_-°oO0^>≥◉☺",
            "diac": true
        }, {
            "elem": "mouth",
            "char": "△▵⁔._‿v▿▽",
            "diac": true
        }, {
            "elem": "right-eye",
            "char": "_-°oO0^<≤◉☺",
            "diac": true
        }, {
            "elem": "right-dec",
            "char": "^",
            "diac": false
        }, {
            "elem": "right-rim",
            "char": ")]⟩}❳",
            "diac": false
        }, {
            "elem": "right-arm",
            "char": "╮–ノ>~𝀃",
            "diac": false
    }],

    diacList: [
        "\u0301\u0300\u0302\u030C\u0311\u0304\u0306\u0307\u0308\u033D\u030D\u1DCE\u035B\u1DC7\u1DC6\u1DC4\u1DC5",
        "\u0317\u0316\u032D\u032C\u032F\u0320\u032E\u0323\u0324\u0353\u0329\u0327\u0345"
    ],

    mirrorDiacs: [
        {0: 1, 13: 14, 15: 16},
        {0: 1, 13: 14, 15: 16}
    ],

    _init: function() {
        for (const [idx, tile] of this.faceData.entries()) {
            tile.elem = document.getElementById(tile.elem);
            tile.elem.addEventListener("click", this.selectTile.bind(this, idx));
        }

        let aboveList = document.getElementById("above-diac-list");
        let belowList = document.getElementById("below-diac-list");
        for (const [type, list] of [aboveList, belowList].entries())
            for (let idx = 0; idx < this.diacList[type].length; idx++) {
                let check = document.createElement("input");
                check.type = "checkbox";
                //check.textContent = "\u25CC" + list[idx];
                check.addEventListener("click", this.toggleDiac.bind(this, type, idx, check));
                list.appendChild(check);
            }
        
        for (let type = 0; type < this.mirrorDiacs.length; type++) {
            const reverseMirror = {};
            Object.entries(this.mirrorDiacs[type]).forEach(([key, value]) => {
                reverseMirror[value] = key;
            });
            this.mirrorDiacs[type] = {...this.mirrorDiacs[type], ...reverseMirror};
        }

        [-1, 1, -1, 3, 4, 3, -1, 1, -1].forEach((char, tile) => {
            this.selTile = tile;
            this.setBaseChar(char);
        });
        this.selTile = -1;
    },

    _getTiles: function() {
        let list = [this.faceData[this.selTile]];
        if (this.mirrorMode && this.selTile != 4)
            list.push(this.faceData[8 - this.selTile]);
        return list;
    },

    selectTile: function(tile) {
        this.selTile = tile;
    },

    setBaseChar: function(idx) {
        this._getTiles().forEach(tile => {
            tile.elem.innerText = (idx == -1 ? "" : tile.char[idx]) + tile.elem.innerText.slice(1);
        })
    },

    addDiac: function(type, idx) {
        this._getTiles().forEach((tile, ti) => {
            if (ti != 0 && idx in this.mirrorDiacs[type])
                idx = this.mirrorDiacs[type][idx];
            tile.elem.innerText += this.diacList[type][idx];
        })
    },

    removeDiac: function(type, idx) {
        this._getTiles().forEach((tile, ti) => {
            if (ti != 0 && idx in this.mirrorDiacs[type])
                idx = this.mirrorDiacs[type][idx];
            tile.elem.innerText = tile.elem.innerText.replace(this.diacList[type][idx], "");
        })
    },

    toggleDiac: function(type, idx, check) {
        (check.checked ? this.addDiac : this.removeDiac).call(this, type, idx);
    }
}

FaceBuilder._init();
