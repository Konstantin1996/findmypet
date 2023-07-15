import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useState } from 'react';
export default function App() {
  const [isCameraOpened, setIsCameraOpened] = useState(false)

  const onPress = () => {
    setIsCameraOpened(!isCameraOpened)
  }

  const [cameraRef, setCameraRef] = useState(null);

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const convertToBlob = async (uri) => {
    return new Promise((resolve, reject) => {
      fetch(uri).then((resp) => {
        resp.blob().then((respBlob) => {
          resolve(respBlob)
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    });
  };

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      // Handle the taken photo, e.g., save or process it
      try {
        const blob = await convertToBlob(photo.uri);
      } catch (err) {
        console.error(err)
      }
      setIsCameraOpened(false)
      console.log('by')

    }
  };

  return (
    <>
      {
        isCameraOpened
          ? (
            <View style={styles.container}>
              <Camera style={styles.camera} type={Camera.Constants.Type.back}  ref={(ref) => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleTakePicture}
                  >
                    <Text style={styles.buttonText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          )
          : (
            <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              />
              <Button title={'Open camera'} onPress={onPress} />
            </View>
          )

      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    height: '100%',
    width: '100%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

