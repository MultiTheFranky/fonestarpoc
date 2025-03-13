import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFPSMetric } from '../hooks/useFPSMetric';

const styles = StyleSheet.create({
  text: { color: 'black' },
  container: { position: 'absolute', top: 100, left: 8 },
});

export const FpsCounter: FunctionComponent<{ visible: boolean }> = ({ visible }) => {
  const { fps, average } = useFPSMetric();
  if (!visible) {return null;}
  return (
    <View pointerEvents={'none'} style={styles.container}>
      <Text style={styles.text}>{fps} FPS</Text>
      <Text style={styles.text}>{average.toFixed(2)} average FPS</Text>
    </View>
  );
};
