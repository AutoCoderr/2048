function DL() {
    this.listScore = [];
    this.finishSimulate = false;

    this.NN = null;
    this.batch_x = [];
    this.batch_y = [];

    this.createNN = function () {
        const model = tf.sequential();

        model.add(tf.layers.dense({ units: 8, inputShape: 16, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 8, inputShape: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 6, inputShape: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 4, inputShape: 6, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));
        model.compile({ optimizer: 'sgd', loss: 'binaryCrossentropy', lr: 0.05 });

        this.NN = model;
    };

    this.trainNN = async function () {
        if (this.NN == null | this.batch_x.length == 0 | this.batch_y.length == 0 | this.batch_x.length != this.batch_y.length) {
            document.getElementById("msgForIa").innerHTML = "<font color='orange' size='3'>Les variable ne sont pas correctements configurées pour<br/> l'entrainement</font>";
            return;
        }

        const nbEpoch = 1000;

        document.getElementById("msgForIa").innerHTML = "<font color='black' size='3'>Entrainement en cours.. <br/>Cela peut prendre trèèèèès longtemps<div id='stepTrain'></div></font>";

        await this.NN.fit(tf.tensor2d(this.batch_x), tf.tensor2d(this.batch_y), {
            batchSize: 1,
            epochs: nbEpoch,
            callbacks: {
                onEpochEnd: (epoch, logs) => { document.getElementById('stepTrain').innerHTML = "epoch "+epoch+" sur "+nbEpoch; }
              }
        });

        document.getElementById("msgForIa").innerHTML = "<font color='green' size='3'>Entrainement terminé!</font>";
    };

    this.simule = function (nb) {
        if (isNaN(nb)) {
            document.getElementById("msgForIa").innerHTML = "<font color='orange' size='3'>Nombre spécifié invalide</font>";
            return;
        }
        document.getElementById("msgForIa").innerHTML = "<font color='black' size='3'>Simulation en cours...<br/>Veuillez patienter...<br/>cela peut prendre quelque temps</font>";
        this.finishSimulate = false;
        this.listScore = [];
        for (let i=0;i<nb;i++) {
            this.testNN(true,copyTab(tab), score, () => {
                if (this.listScore.length == nb & !this.finishSimulate) {
                    this.endSimule();
                }
            });
        }
    }

    this.endSimule = function() {
        this.finishSimulate = true;
        document.getElementById("msgForIa").innerHTML = "<font color='orange' size='3'>Score moyen : "+this.moyenneScore()+"</font>";
    }


    this.moyenneScore = function() {
        let m = 0;
        for (let i=0;i<this.listScore.length;i++) {
            m += this.listScore[i];
        }
        m = m/this.listScore.length;
        return m;
    }

    this.testNN = async function (simulate = false, tabb = tab, scoreb = score, callback = null, nbNoChange = 0) {

        if (isGameOver()) {
            if (simulate) {
                this.listScore.push(scoreb);
                if (callback != null) {
                    callback();
                }
            }
            return;
        }
        if (nbNoChange >= 10) {
            if (simulate) {
                this.listScore.push(scoreb);
                if (callback != null) {
                    callback();
                }
            }
            return;
        }

        const oldTab = copyTab(tabb);

        const res = this.NN.predict(tf.tensor2d([game2Vector(tabb)]));
        const OneHotEncodingVectorDataSync = res.dataSync();
        const OneHotEncodingVector = Array.from(OneHotEncodingVectorDataSync);
        const mouv = vector2Mouv(OneHotEncodingVector);

        console.log(OneHotEncodingVectorDataSync);
        console.log(OneHotEncodingVector);
        console.log(mouv);
        if (mouv != "nothing") {
            scoreb = move(mouv, tabb, scoreb).score;
            if (eqalTab(oldTab,tabb)) {
                nbNoChange += 1;
            }
            if (!simulate) {
                score = scoreb;
                displayG(() => {
                    this.testNN(simulate, tabb, scoreb, callback, nbNoChange);
                });
            } else {
                this.testNN(simulate, tabb, scoreb, callback, nbNoChange);
            }
        } else if (simulate) {
            this.listScore.push(scoreb);
            if (callback != null) {
                callback();
            }
        }
    };

    this.sendBatch = function () {
        if (this.batch_x.length == 0 | this.batch_y.length == 0 | this.batch_x.length != this.batch_y.length) {
            document.getElementById("msgForIa").innerHTML = "<font color='orange' size='3'>Les variable ne sont pas correctements configurées pour<br/> l'exportation</font>";
            return;
        }
        document.getElementById("msgForIa").innerHTML = "<font color='black' size='3'>Veuillez patienter pendant l'envoie"+
                                                        "<br/> des données d'entrainement, cela peut prendre quelque temps</font>";
        $.post(
            '/sendBatchDatas.php',
            {
                batch_x: JSON.stringify(this.batch_x),
                batch_y: JSON.stringify(this.batch_y),
                user: document.getElementById('userBatch').value,
                score: score
            },

            function(data){
                if (data.rep == "success") {
                    document.getElementById("msgForIa").innerHTML = "<font color='green' size='3'>Envoie réussi!!</font>";
                    this.batch_x = [];
                    this.batch_y = [];
                } else if (data.rep == "failed") {
                    $("#msgForIa").empty();
                    $("#msgForIa").append("<ul>");
                    for (var i=0;i<data.errors.length;i++) {
                        $("#msgForIa").append("<li><font color='red'>"+data.errors[i]+"</font></li>");
                    }
                    $("#msgForIa").append("</ul>");
                }
            },
            'json'
        );
    }

    this.exportBatch = function () {
        if (this.batch_x.length == 0 | this.batch_y.length == 0 | this.batch_x.length != this.batch_y.length) {
            document.getElementById("msgForIa").innerHTML = "<font color='orange' size='3'>Les variable ne sont pas correctements configurées pour<br/> l'exportation</font>";
            return;
        }
        let filenameX = "exportX.json";
        let filenameY = "exportY.json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          var blobX = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.batch_x)))], { type: contentType });
          navigator.msSaveOrOpenBlob(blobX, filenameX);
          var blobY = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.batch_y)))], { type: contentType });
          navigator.msSaveOrOpenBlob(blobY, filenameY);
        } else {
          var aX = document.createElement('aX');
          aX.download = filenameX;
          aX.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.batch_x));
          aX.target = '_blank';
          document.body.appendChild(aX);
          aX.click();
          document.body.removeChild(aX);

          var aY = document.createElement('aY');
          aY.download = filenameY;
          aY.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.batch_y));
          aY.target = '_blank';
          document.body.appendChild(aY);
          aY.click();
          document.body.removeChild(aY);
        }
    }
}

function game2Vector(tab) { // convert the game matrix to a vector for the neural network
    let V = [];
    for (let l=0;l<tab.length;l++) {
        for (let c=0;c<tab[l].length;c++) {
            V.push(tab[l][c]);
        }
    }
    return V;
}
//convert one hot encoding to mouvement

const indexVector2Mouv = {0: "toUp", 1: "toDown", 2: "toLeft", 3: "toRight"};

function vector2Mouv(V) {
    for (let i=0;i<V.length;i++) {
        if (Math.round(V[i]) == 1) {
            return indexVector2Mouv[i];
        }
    }
    return "nothing";
}

//convert mouvement to one hot encoding

function mouv2Vector(mouv) {
    let V = [0,0,0,0];
    for (let i=0;i<V.length;i++) {
        if (indexVector2Mouv[i] == mouv) {
            V[i] = 1;
            break;
        }
    }
    return V;
}

function eqalTab(tabA,tabB) {
    if (tabA.length != tabB.length) {
        return false;
    } else if (tabA.length >= 1) {
        if (tabA[0].length != tabB[0].length) {
            return false;
        }
    }
    for (let l=0;l<tabA.length;l++) {
        for (let c=0;c<tabA[l].length;c++) {
            if (tabA[l][c] != tabB[l][c]) {
                return false;
            }
        }
    }
    return true;
}

function copyTab(tab) {
    let tabCopy = [];
    for (let l=0;l<tab.length;l++) {
        tabCopy.push([]);
        for (let c=0;c<tab[l].length;c++) {
            tabCopy[tabCopy.length-1].push(tab[l][c]);
        }
    }
    return tabCopy;
}

/*async function testNN() {
    const model = tf.sequential();

    model.add(tf.layers.dense({ units: 8, inputShape: 2, activation: 'tanh' }));
    model.add(tf.layers.dense({ units: 8, inputShape: 8, activation: 'tanh' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'sgd', loss: 'binaryCrossentropy', lr: 0.1 });

    // Creating dataset
    const xs = tf.tensor2d([[0, 0], [0, 1], [1, 0], [1, 1]]);
    xs.print();
    const ys = tf.tensor2d([[0], [1], [1], [0]]);
    ys.print();
    // Train the model
    await model.fit(xs, ys, {
        batchSize: 1,
        epochs: 5
    });

    document.getElementById("displayForIa").innerHTML = model.predict(xs);
    console.log(model.predict(xs));
}*/