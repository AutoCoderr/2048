from random import randint as rand
import json

def equalsList(A,B):
    if (len(A) != len(B)):
        return False
    i = 0
    while(i<len(A)):
        if (A[i] != B[i]):
            return False
        i += 1
    return True

X = json.loads(open("X.json","r").read())
Y = json.loads(open("Y.json","r").read())

i = 0
while (i<len(X)-1):
    if (equalsList(X[i],X[i+1]) == True):
        del X[i]
        del Y[i]
    else:
        i += 1

X1 = []
Y1 = []

while (len(X) > 0):
    j = rand(0,len(X)-1)
    X1.append(X[j])
    Y1.append(Y[j])
    del X[j]
    del Y[j]


#dans X.json : convertis toutes les puissances de 2 en des coeficient entre 0 et 1 ayant les même proportions que les puissance de 2 de départ
# ce qui devrait en théorie améliorer les performances de l'apprentissage du réseau de neuronnes

i = 0
while(i<len(X1)):
    foundedPowers = []
    total = 0
    j = 0
    while(j<len(X1[i])):
        founded = False
        k = 0
        while(k<len(foundedPowers)):
            if (foundedPowers[k] == X1[i][j]):
                founded = True
                break
            k += 1
        if (founded == False):
            foundedPowers.append(X1[i][j])
            total += X1[i][j]
        j += 1
    j = 0
    while(j<len(X1[i])):
        X1[i][j] = X1[i][j]/total
        j += 1
    i += 1

fileX = open("X1.json","w") 
fileY = open("Y1.json","w") 
 
fileX.write(json.dumps(X1))
fileY.write(json.dumps(Y1))
 
fileX.close() 
fileY.close() 