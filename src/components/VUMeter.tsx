import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useRealTimeData from '../hooks/useRealTimeData';

const VUMeter = () => {
    const { data } = useRealTimeData();
    const [level, setLevel] = useState(0);
    const numBars = 100;
    const maxLevel = 100;

    useEffect(() => {
        if (data && data.length > 0) {
            // Get the latest value and ensure it's within 0-100 range
            const newLevel = Math.min(Math.max(Math.round(data[data.length - 1].value), 0), maxLevel);
            setLevel(newLevel);
        }
    }, [data]);

    // Generate the bars for the VU meter
    const renderBars = () => {
        const bars = [];
        const activeBarCount = Math.floor((level / maxLevel) * numBars);

        for (let i = 0; i < numBars; i++) {
            const isActive = i < activeBarCount;
            const heightPercent = (100 * (i / numBars)); // Vary heights slightly for visual effect

            // Determine color based on position
            let barColor;
            if (i < numBars * 0.6) {barColor = '#4CAF50';} // Green for lower levels
            else if (i < numBars * 0.8) {barColor = '#FFC107';} // Yellow for mid levels
            else {barColor = '#F44336';} // Red for high levels

            bars.push(
                <View
                    key={i}
                    style={[
                        styles.bar,
                        {
                            height: `${heightPercent}%`,
                            backgroundColor: isActive ? barColor : '#444',
                            opacity: isActive ? 1 : 0.3,
                        },
                    ]}
                />
            );
        }
        return bars;
    };

    return (
        <View style={styles.container}>
            <View
                style={styles.background}
            >
                <Text style={styles.title}>VU Meter</Text>
                <View style={styles.levelDisplay}>
                    <Text style={styles.levelText}>{level}</Text>
                </View>

                <View style={styles.meterContainer}>
                    {renderBars()}
                </View>

                <View style={styles.ticks}>
                    {[0, 25, 50, 75, 100].map(tick => (
                        <Text key={tick} style={styles.tickText}>{tick}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        marginVertical: 10,
    },
    background: {
        flex: 1,
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#34495e',
        // Linear gradient of ['#2c3e50', '#1c2833', '#2c3e50']
        backgroundColor: 'linearGradient(90deg, #2c3e50, #1c2833, #2c3e50)',

    },
    title: {
        color: '#ecf0f1',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    meterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        padding: 6,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#555',
    },
    bar: {
        width: '0.1%',
        backgroundColor: '#76c7c0',
        borderRadius: 2,
        marginHorizontal: 1,
    },
    levelDisplay: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#666',
    },
    levelText: {
        color: '#2ecc71',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ticks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
    },
    tickText: {
        color: '#bdc3c7',
        fontSize: 10,
    },
});

export default VUMeter;
