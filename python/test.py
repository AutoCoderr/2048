from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras import optimizers
from keras.layers.normalization import BatchNormalization
import numpy as np
import matplotlib.pyplot as plt
import json
import math
# fix random seed for reproducibility
np.random.seed(7)

X = json.loads(open("X1.json","r").read())
Y = json.loads(open("Y1.json","r").read())

XTrain = np.array(X[:math.floor(len(X)*0.8)])
YTrain = np.array(Y[:math.floor(len(Y)*0.8)])

XTest = np.array(X[len(X)-len(XTrain):])
YTest = np.array(Y[len(X)-len(XTrain):])

print ("nb Train => "+str(len(XTrain)))



# create model
model = Sequential()
model.add(Dense(16, input_dim=16, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(20, input_dim=16, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(20, input_dim=20, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(10, input_dim=20, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(8, input_dim=10, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(6, input_dim=8, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(4, input_dim=6, activation='relu'))
model.add(BatchNormalization(epsilon=1e-06, momentum=0.9, scale=True, center=True))
model.add(Dropout(0.25))
model.add(Dense(4, input_dim=4, activation='softmax'))
ecar = 0.003-0.0001
adam = optimizers.adam(lr=0.003, decay=(ecar/1000))
#sgd = optimizers.SGD(lr=0.003, decay=9.666666e-07, momentum=0.45, nesterov=True)
model.compile(loss='binary_crossentropy', optimizer=adam, metrics=['accuracy'])

history = model.fit(XTrain, YTrain, epochs=1000, batch_size=100)

scores = model.evaluate(XTest, YTest)
print("\n%s: %.2f%%" % (model.metrics_names[0], scores[0]*100))

#print (history.history.keys())

# Plot training & validation accuracy values
plt.plot(history.history['acc'])
#plt.plot(history.history['val_acc'])
plt.title('Model accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Test'], loc='upper left')
plt.show()

# Plot training & validation loss values
plt.plot(history.history['loss'])
#plt.plot(history.history['val_loss'])
plt.title('Model loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(['Train', 'Test'], loc='upper left')
plt.show()