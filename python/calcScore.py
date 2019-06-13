import sys

#calcul le score minimal à 2048 que l'on peut avoir quand on une case à 'n' (ex: 2048, 1024, etc...)

def calcScore(n):
    score = 0
    i = 1
    while(n > 2):
        score += n*i
        i *= 2
        n /= 2
    score -= 4*(n/4)*0.1 # car 1 'quatre' sur 10 n'est pas une fusion entre 2 'deux' mais apparait directement, ce qui n'augmente pas le score, il faut donc enlever 1/10 des points donné par les 'quatres'
    return score

def calcScore2(n):
    p = 0
    while(2**p < n):
        p += 1
    return n*(p-1)-4*(n/4)*0.1 #pareil qu'au dessus

if (len(sys.argv) > 1) :
    print(calcScore2(int(sys.argv[1])))