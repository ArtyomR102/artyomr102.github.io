const FaceBuilder = {
    _selTile: -1,
    _aboveDiacElem: null,
    _baseCharElem: null,
    _belowDiacElem: null,

    mirrorMode: true,
    strictMode: false,

    _faceData: [{
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
        for (const [idx, tile] of this._faceData.entries()) {
            tile.elem = document.getElementById(tile.elem);
            tile.elem.addEventListener("click", this.selectTile.bind(this, idx));
        }

        let aboveList = document.getElementById("above-diac-list");
        let belowList = document.getElementById("below-diac-list");
        for (const [type, list] of [aboveList, belowList].entries())
            for (let idx = 0; idx < this.diacList[type].length; idx++) {
                let check = document.createElement("input");
                check.type = "checkbox";
                check.disabled = true;
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

        this._aboveDiacElem = document.getElementById("above-diac-list");
        this._baseCharElem = document.getElementById("base-char-list");
        this._belowDiacElem = document.getElementById("below-diac-list");

        [-1, 1, -1, 3, 4, 3, -1, 1, -1].forEach((char, tile) => {
            this._selTile = tile;
            this.setBaseChar(char);
        });
        this._selTile = -1;

        document.getElementById("copy-result-btn")
        .addEventListener("click", this.copyResult.bind(this));
    },

    _getTiles: function() {
        let list = [this._faceData[this._selTile]];
        if (this.mirrorMode && this._selTile != 4)
            list.push(this._faceData[8 - this._selTile]);
        return list;
    },

    _rebuildCtrls: function() {
        [...this._aboveDiacElem.childNodes, ...this._belowDiacElem.childNodes]
        .forEach(check => {
            check.disabled = !this._faceData[this._selTile].diac;
        });
        
        this._baseCharElem.innerHTML = "";
        for (let idx = 0; idx < this._faceData[this._selTile].char.length; idx++) {
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "base-char";
            //radio.textContent = "\u25CC" + list[idx];
            radio.addEventListener("click", this.setBaseChar.bind(this, idx));
            this._baseCharElem.appendChild(radio);
        }
    },

    selectTile: function(tile) {
        this._faceData[tile].elem.classList.add("selected");
        this._faceData[Math.max(this._selTile, 0)].elem.classList.remove("selected");
        this._selTile = tile;
        this._rebuildCtrls();
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
    },

    copyResult: function() {
        let face = document.getElementsByClassName("fb-face")[0];
        navigator.clipboard.writeText(face.textContent);
    }
}

FaceBuilder._init();

