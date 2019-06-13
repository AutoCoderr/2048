/*let ia = new IA(2);
function callbackIA() {
	execPath(ia.getPath(),0,() => {
		ia.resolvIa(callbackIA);
	});
}
ia.resolvIa(callbackIA);
*/

function resolvIA(nbTree, profondeur) {
	let callbackIA = () => {
		calculAndExecPath(profondeur, nbTree, () => {
			callbackIA();
		});
	}
	calculAndExecPath(profondeur, nbTree, () => {
		callbackIA();
	});
}

function calculAndExecPath(profondeur,nbTree, callback) {
	let ia = new IA(profondeur, nbTree);
	ia.resolvIa((path) => {
		//console.log(path);
		execPath(path,0, () => {
			if (typeof(callback) == "function") {
				callback();
			}
		});
	});
	/*let tests = [];
	for (let i=0;i<nbTest;i++) {
		tests.push(new IA(profondeur));
	}
	for (let i=0;i<nbTest;i++) {
		tests[i].resolvIa();
        while(tests[i].haveBetterScore.score == 0) {
            tests[i].profondeurMax += 1;
            tests[i].resolvIa();
        }
	}
	let allFinished = false;
	while(!allFinished) {
		allFinished = true;
		for (let i=0;i<nbTest;i++) {
			if (!tests[i].finish) {
				allFinished = false;
			}
		}
	}
	for (let i=0;i<nbTest;i++) {
		console.log(tests[i].getPath());
	}
	console.log("");

	let finalPath = [];
	for (let i=0;i<profondeur;i++) {
		let movesCount = {};
		for (let j=0;j<moves.length;j++) {
			movesCount[moves[j]] = 0;
		}

		for (let j=0;j<nbTest;j++) {
			movesCount[tests[j].getPath()[i]] += 1;
		}

		let bestMove = moves[0];
		for (let move in movesCount) {
			if (movesCount[move] > movesCount[bestMove]) {
				bestMove = move;
			}
		}
		finalPath.push(bestMove)
	}
	execPath(finalPath,0, () => {
		if (typeof(callback) == "function") {
			callback();
		}
	});
	console.log(finalPath);
	console.log("");*/
}