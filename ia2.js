function IA(profondeurMax, nbTree) {

	this.profondeurMax = profondeurMax;
	this.nbTree = nbTree;
	this.calculStarted = false;

	this.trees = [];

	this.resolvIa = function(callbackIa) {
		this.finish = false;
		if (isGameOver()) {
			return;
		}
		this.callbackIa = (typeof(callbackIa) == "function" ? callbackIa : null);
		for (let i=0;i<this.nbTree;i++) {
			this.trees.push({nbTreeOfLastLevel: 0, tree: {tab: this.copyTab(tab), trees: [], score: 0, profondeur: 0}, finished: false, branchs: []});
			this.generateTree(this.trees[i].tree,this.trees[i])
		}
	}

	this.generateTree = function(tree, racine) {
		if (tree.profondeur < this.profondeurMax) {
			for (let i=0;i<moves.length;i++) {
				const newMove = move(moves[i],this.copyTab(tree.tab), tree.score);
				const newTab = newMove.tab;
				let newScore = newMove.score;
				newScore += arangementPuissance(tree.tab,newTab);
				//newScore += ecarGroupementPuissance(tree.tab,newTab);
				//newScore += (countEmptyCase(newTab)-countEmptyCase(tree.tab))*(newScore/8);
				let newTree = {tab: newTab, parent: tree, score: newScore, trees: [], profondeur: tree.profondeur+1, mouvement: moves[i]};
				tree.trees.push(newTree);
				if (tree.profondeur == this.profondeurMax-1) {
					racine.branchs.push({nb: racine.branchs.length, branch: newTree});
				}
				this.generateTree(newTree, racine);
			}
			if (tree.profondeur == this.profondeurMax-1) {
				racine.nbTreeOfLastLevel += 4;
				if (racine.nbTreeOfLastLevel == 4**(this.profondeurMax)) {
					racine.finished = true;
					for (let i=0;i<this.trees.length;i++) {
						if (!this.trees[i].finished) {
							return;
						}
					}
					setTimeout(() => {
						this.calculMoyenne();
					},10);
				}
			}
		}
	}

	this.calculMoyenne = function() {
		if (this.calculStarted) {
			return;
		}
		this.calculStarted = true;
		let branchMoyenne = [];
		for (let i=0;i<4**this.profondeurMax;i++) {
			let moyenne = 0;
			for (let j=0;j<this.trees.length;j++) {
				for (let k=0;k<this.trees[j].branchs.length;k++) {
					if (this.trees[j].branchs[k].nb == i) {
						moyenne += this.trees[j].branchs[k].branch.score;
					}
				}
			}
			moyenne = moyenne/this.trees.length;
			branchMoyenne.push({nb: i, moyenne: moyenne});
		}

		let max = 0;
		for (let i=1;i<branchMoyenne.length;i++) {
			//console.log("N° "+(i+1)+" : "+branchMoyenne[i].moyenne);
			if (branchMoyenne[i].moyenne > branchMoyenne[max].moyenne) {
				max = i;
			}
		}

		if (branchMoyenne[max].moyenne == 0) {
			score = move(moves[Math.round(Math.random()*(moves.length-1))]).score;
			console.log("random mouv")
			displayG(() => {
				console.log("restart IA");
				this.calculStarted = false;
				this.trees = [];
				this.resolvIa(this.callbackIa);
			});
			return;
		}

		if (this.callbackIa != null) {
			//console.log(this.trees[0].branchs[max].branch);
			this.callbackIa(this.getPath(this.trees[0].branchs[max].branch));
		}
	}

	this.getPath = function(branch) {

		let liste = [];
		liste.push(branch.mouvement);
		while(typeof(branch.parent) != "undefined") {
			branch = branch.parent;
			if (branch.profondeur > 0) {
				liste.push(branch.mouvement);
			}
		}
		let listeReverse = [];
		for (let i=liste.length-1;i>=0;i--) {
			listeReverse.push(liste[i]);
		}
		console.log(listeReverse);
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
		setTimeout(() => {
			callback();
		}, 10);
	}
}

function countEmptyCase(tab) {
	let nb = 0;
	for (let l=0;l<tab.length;l++) {
		for (let c=0;c<tab[l].length;c++) {
			if (tab[l][c] == 0) {
				nb += 1;
			}
		}
	}
	return nb;
}

function arangementPuissance(tabA, tabB) {
	let scoreA = 0;
	for (let l=0;l<tabA.length;l++) {
		for (let c=0;c<tabA[l].length;c++) {
			const around = [{l: l-1, c: c-1}, {l: l-1, c: c}, {l: l-1, c: c+1},
							{l: l, c: c-1}, {l: l, c: c+1},
							{l: l+1, c: c-1}, {l: l+1, c: c}, {l: l+1, c: c+1}];
			for (let a=0;a<around.length;a++) {
				if (typeof(tabA[around[a].l]) != "undefined") {
					if (typeof(tabA[around[a].l][around[a].c]) != "undefined") {
						if (tabA[around[a].l][around[a].c] <= tabA[l][c] /*& tabA[l][c]/tabA[around[a].l][around[a].c] <= 4*/) {
							/*if (around[a].l == l | around[a].c == c) {
								scoreA += tabA[around[a].l][around[a].c]/2;
							} else {
								scoreA += tabA[around[a].l][around[a].c]/4;
							}*/
							let ecar = tabA[l][c]/tabA[around[a].l][around[a].c];
							if (ecar <= 4) {
								if (around[a].l == l | around[a].c == c) {
									scoreA += tabA[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabA))/4);
								} else {
									scoreA += tabA[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabA)));
								}
							} else {
								if (around[a].l == l | around[a].c == c) {
									scoreA -= tabA[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabA)));
								} else {
									scoreA -= tabA[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabA))/4);
								}
							}
						}
					}
				}
			}
		}
	}
	let scoreB = 0;
	for (let l=0;l<tabB.length;l++) {
		for (let c=0;c<tabB[l].length;c++) {
			const around = [{l: l-1, c: c-1}, {l: l-1, c: c}, {l: l-1, c: c+1},
							{l: l, c: c-1}, {l: l, c: c+1},
							{l: l+1, c: c-1}, {l: l+1, c: c}, {l: l+1, c: c+1}];
			for (let a=0;a<around.length;a++) {
				if (typeof(tabB[around[a].l]) != "undefined") {
					if (typeof(tabB[around[a].l][around[a].c]) != "undefined") {
						if (tabB[around[a].l][around[a].c] <= tabB[l][c] /*& tabB[l][c]/tabB[around[a].l][around[a].c] <= 4*/) {
							/*if (around[a].l == l | around[a].c == c) {
								scoreB += tabB[around[a].l][around[a].c]/2;
							} else {
								scoreB += tabB[around[a].l][around[a].c]/4;
							}*/
							let ecar = tabB[l][c]/tabB[around[a].l][around[a].c];
							if (ecar <= 4) {
								if (around[a].l == l | around[a].c == c) {
									scoreB += tabB[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabB))/4);
								} else {
									scoreB += tabB[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabB)));
								}
							} else {
								if (around[a].l == l | around[a].c == c) {
									scoreB -= tabB[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabB)));
								} else {
									scoreB -= tabB[around[a].l][around[a].c]/((hauteurTableau*largeurTableau-countEmptyCase(tabB))/4);
								}
							}
						}
					}
				}
			}
		}
	}
	return scoreB-scoreA;
}

function ecarGroupementPuissance(tabA,tabB) {
	let scoreA = 0;
	for (let l=0;l<tabA.length;l++) {
		for (let c=0;c<tabA[l].length;c++) {
			let i = 1;
			while(i<largeurTableau) {
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