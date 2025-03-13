import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useRealTimeData from '../hooks/useRealTimeData';

const RealTimeDisplay = () => {
    const { data } = useRealTimeData();
    const lastData = data[data.length - 1];

    return (
        <View style={styles.container}>
            {lastData && (
                <>
                    <Text style={styles.title}>Latest Data</Text>
                    <Text style={styles.data}>{Math.round(lastData.value)}</Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    data: {
        fontSize: 18,
        marginTop: 10,
        color: '#333',
    },
});

export default RealTimeDisplay;
