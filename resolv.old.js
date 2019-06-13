function resolv() {
	repeatAngle();
}

let nbCode = 0;

function repeatAngle() {
	console.log("repeatAngle");
	const bigger = getBigger();
	if (bigger.l >= 2 & bigger.c <= 1) {
		execCode("d l",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	} else if (bigger.l >= 2  & bigger.c >= 2) {
		execCode("d r",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	} else if (bigger.l <= 1  & bigger.c <= 1) {
		execCode("u l",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	} else if (bigger.l <= 1  & bigger.c >= 2) {
		execCode("u r",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	}
}

function moveToOpposedAngle() {
	console.log("moveToOpposedAngle");
	const bigger = getBigger();
	if (bigger.c <= 1) {
		execCode("r",0,() => {
			moveToOpposedAngle2();
		},() => {
			upOrDown()
		});
	} else if (bigger.c >= 2) {
		execCode("l",0,() => {
			moveToOpposedAngle2();
		},() => {
			upOrDown()
		});
	}
}

function moveToOpposedAngle2() {
	console.log("moveToOpposedAngle2");
	const bigger = getBigger();
	if (bigger.c <= 1) {
		if ((bigger.l <= 1 & tab[0][0] == 0) | (bigger.l >= 2 & tab[3][0] == 0)) {
			execCode("l",0,() => {
				calculAndExecPath(3,7, () => {
					repeatAngle();
				});
			},() => {
				calculAndExecPath(3,7, () => {
					repeatAngle();
				});
			});
		} else {
			calculAndExecPath(3,7, () => {
				repeatAngle();
			});
		}
	} else if (bigger.c >= 2) {
		if ((bigger.l <= 1 & tab[0][3] == 0) | (bigger.l >= 2 & tab[3][3] == 0)) {
			execCode("r",0,() => {
				calculAndExecPath(3,7, () => {
					repeatAngle();
				});
			},() => {
				calculAndExecPath(3,7, () => {
					repeatAngle();
				});
			});
		} else {
			calculAndExecPath(3,7, () => {
				repeatAngle();
			});
		}
	}
}

/*function searchForFusion() {
	let oneToFusion = false;
	for (let l=0;l<4;l++) {
		for (let c=0;c<4;c++) {
			if (c < 3) {
				if (tab[l][c+1] == tab[l][c]) {
					oneToFusion = true;
					if (c == 2 | )
				}
			}
		}
	}
}

function fixeForToRight(l,c) {
	if (c == 3) {
		return true;
	} else {
		for (let cb=c+1;cb<3;cb++) {
			if (tab[l][cb] == )
		}
	}
}*/

function upOrDown() {
	console.log("upOrDown");
	const bigger = getBigger();
	if (bigger.l <= 1) {
		execCode("d u",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	} else if (bigger.l >= 2) {
		execCode("u d",0,() => {
			repeatAngle();
		},() => {
			moveToOpposedAngle()
		});
	}
}

let movedInCode;

function execCode(codeStr,i = 0, callback, callbackB) {
	if (i >= codeStr.split(" ").length) {
		if (typeof(callback) == "function" & movedInCode) {
			callback();
		} else if (typeof(callbackB) == "function") {
			callbackB();
		} else {
			return;
		}
	} else if (i < 0) {
		return;
	}
	/*nbCode += 1;
	if (nbCode >= 100) {
		return;
	}*/
	if (i == 0) {
		movedInCode = false;
	}
	switch(codeStr.split(" ")[i]) {
		case "u":
			move("toUp");
			break;
		case "d":
			move("toDown");
			break;
		case "l":
			move("toLeft");
			break;
		case "r":
			move("toRight");
			break;
	}
	if (oneMoved) {
		movedInCode = true;
	}
	displayG(() => {
		execCode(codeStr,i+1,callback,callbackB);
	});
}

function getBigger(rang = 1) {
	let listCell = [];
	for (let l=0;l<4;l++) {
		for (let c=0;c<4;c++) {
			listCell.push({l: l, c: c});
		}
	}
	let tried = false;
	while(!tried) {
		tried = true;
		for (let i=0;i<listCell.length;i++) {
			if (i < listCell.length-1) {
				if (tab[listCell[i].l][listCell[i].c] < tab[listCell[i+1].l][listCell[i+1].c]) {
					tried = false;
					const tmp = copyRang(listCell[i+1])
					listCell[i+1] = copyRang(listCell[i]);
					listCell[i] = tmp;
				}
			}
		}
	}
	return listCell[rang-1];
}

function copyRang(cellRang) {
	return {l: cellRang.l, c: cellRang.c};
}