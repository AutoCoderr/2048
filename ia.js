function IA(profondeurMax) {

	this.profondeurMax = profondeurMax;

	this.resolvIa = function(callbackIa) {
		this.finish = false;
		if (isGameOver()) {
			return;
		}
		this.callbackIa = (typeof(callbackIa) == "function" ? callbackIa : null);
		this.nbTreeOfLastLevel = 0;
		this.trees = {tab: this.copyTab(tab), trees: [], score: 0, profondeur: 0};
		this.haveBetterScore = this.trees;
		this.generateTree(this.trees);
	}

	this.generateTree = function(tree) {
		if (tree.profondeur < this.profondeurMax) {
			for (let i=0;i<moves.length;i++) {
				const newMove = move(moves[i],this.copyTab(tree.tab), tree.score);
				const newTab = newMove.tab;
				let newScore = newMove.score;
				let ecar = ecarGroupementPuissance(tree.tab,newTab);
				newScore += ecar;
				//console.log("ecar => "+ecar);
				let newTree = {tab: newTab, parent: tree, score: newScore, trees: [], profondeur: tree.profondeur+1, mouvement: moves[i]};
				if (newScore >= this.haveBetterScore.score) {
					this.haveBetterScore = newTree;
				}
				tree.trees.push(newTree);
				this.generateTree(newTree);
			}
			if (tree.profondeur == this.profondeurMax-1) {
				this.nbTreeOfLastLevel += 4;
				if (this.nbTreeOfLastLevel == 4**(this.profondeurMax)) {
					this.finish = true;
					if (typeof(this.callbackIa) == "function") {
						this.callbackIa();
					}
				}
			}
		}
	}

	this.getPath = function() {
		let liste = [];
		let better = this.haveBetterScore;
		liste.push(better.mouvement);
		while(typeof(better.parent) != "undefined") {
			better = better.parent;
			if (better.profondeur > 0) {
				liste.push(better.mouvement);
			}
		}
		let listeReverse = [];
		for (let i=liste.length-1;i>=0;i--) {
			listeReverse.push(liste[i]);
		}
		return listeReverse;
	}


	this.copyTab = function(tab) {
		let tabCopy = [];
		for (let l=0;l<tab.length;l++) {
			tabCopy.push([]);
			for (let c=0;c<tab[l].length;c++) {
				tabCopy[tabCopy.length-1].push(tab[l][c]);
			}
		}
		return tabCopy;
	}
}

function execPath(path,i = 0,callback) {
	if (i < path.length) {
		score = move(path[i]).score;
		displayG(() => {
			this.execPath(path,i+1,callback);
		});
	} else if (typeof(callback) == "function") {
		callback();
	}
}

function ecarGroupementPuissance(tabA,tabB) {
	let scoreA = 0;
	for (let l=0;l<tabA.length;l++) {
		for (let c=0;c<tabA[l].length;c++) {
			let i = 1;
			while(i<4) {
				if (c<tabA[l].length-i) {
					if (tabA[l][c] == tabA[l][c+i] | tabA[l][c] == tabA[l][c+i]*2 | tabA[l][c] == tabA[l][c+i]/2) {
						scoreA += ((tabA[l][c]+tabA[l][c+i])/2)/i;
						//scoreA += 50;
					}
				}
				if (l<tabA.length-i) {
					if (tabA[l][c] == tabA[l+i][c] | tabA[l][c] == tabA[l+i][c]*2 | tabA[l][c] == tabA[l+i][c]/2) {
						scoreA += ((tabA[l][c]+tabA[l+i][c])/2)/i;
						//scoreA += 50;
					}
				}
				if (l<tabA.length-i & c<tabA[l].length-i) {
					if (tabA[l][c] == tabA[l+i][c+i] | tabA[l][c] == tabA[l+i][c+i]*2 | tabA[l][c] == tabA[l+i][c+i]/2) {
						scoreA += ((tabA[l][c]+tabA[l+i][c+i])/2)/(i*2);
						//scoreA += 50;
					}
					for (let j=l+1;j<i;j++) {
						if (tabA[l][c] == tabA[j][c+i] | tabA[l][c] == tabA[j][c+i]*2 | tabA[l][c] == tabA[j][c+i]/2) {
							scoreA += ((tabA[l][c]+tabA[j][c+i])/2)/(i+j-l);
							//scoreA += 50;
						}
					}
					for (let j=c+1;j<i;j++) {
						if (tabA[l][c] == tabA[l+i][j] | tabA[l][c] == tabA[l+i][j]*2 | tabA[l][c] == tabA[l+i][j]/2) {
							scoreA += ((tabA[l][c]+tabA[l+i][j])/2)/(i+j-c);
							//scoreA += 50;
						}
					}
				}
				i += 1;
			}
		}
	}
	let scoreB = 0;
	for (let l=0;l<tabB.length;l++) {
		for (let c=0;c<tabB[l].length;c++) {
			let i = 1;
			while(i<4) {
				if (c<tabB[l].length-i) {
					if (tabB[l][c] == tabB[l][c+i] | tabB[l][c] == tabB[l][c+i]*2 | tabB[l][c] == tabB[l][c+i]/2) {
						scoreB += ((tabB[l][c]+tabB[l][c+i])/2)/i;
						//scoreB += 50;
					}
				}
				if (l<tabB.length-i) {
					if (tabB[l][c] == tabB[l+i][c] | tabB[l][c] == tabB[l+i][c]*2 | tabB[l][c] == tabB[l+i][c]/2) {
						scoreB += ((tabB[l][c]+tabB[l+i][c])/2)/i;
						//scoreB += 50;
					}
				}
				if (l<tabB.length-i & c<tabB[l].length-i) {
					if (tabB[l][c] == tabB[l+i][c+i] | tabB[l][c] == tabB[l+i][c+i]*2 | tabB[l][c] == tabB[l+i][c+i]/2) {
						scoreB += ((tabB[l][c]+tabB[l+i][c+i])/2)/(i*2);
						//scoreB += 50;
					}
					for (let j=l+1;j<i;j++) {
						if (tabB[l][c] == tabB[j][c+i] | tabB[l][c] == tabB[j][c+i]*2 | tabB[l][c] == tabB[j][c+i]/2) {
							scoreB += ((tabB[l][c]+tabB[j][c+i])/2)/(i+j-l);
							//scoreB += 50;
						}
					}
					for (let j=c+1;j<i;j++) {
						if (tabB[l][c] == tabB[l+i][j] | tabB[l][c] == tabB[l+i][j]*2 | tabB[l][c] == tabB[l+i][j]/2) {
							scoreB += ((tabB[l][c]+tabB[l+i][j])/2)/(i+j-c);
							//scoreB += 50;
						}
					}
				}
				i += 1;
			}
		}
	}
	return scoreB-scoreA;
}