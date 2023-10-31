import React, { useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function AlarmScreen() {
  const navigation = useNavigation();
  const sound = useRef(new Audio.Sound());

  const stopAlarm = async () => {
    try {
      await sound.current.unloadAsync(); 
      navigation.navigate('Single');
    } catch (error) {
      console.error('Error stopping alarm:', error);
    }
  };

  useEffect(() => {
    const playBackgroundMusic = async () => {
        try {
            const backgroundMusic = require('../../assets/BestTune.mp3');
            await sound.current.loadAsync(backgroundMusic);
            await sound.current.playAsync();
          } catch (error) {
            console.error('Error playing background music:', error);
          }
    };

    const timeout = setTimeout(playBackgroundMusic, 1000); 

    return () => {
      clearTimeout(timeout);
      sound.current.unloadAsync(); 
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Alarm is going off!</Text>
      <Button title="Stop Alarm" onPress={stopAlarm} />
    </View>
  );
}
