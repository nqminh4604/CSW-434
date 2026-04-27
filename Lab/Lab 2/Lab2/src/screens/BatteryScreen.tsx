import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getBatteryLevel } from '../services/BatteryService';

export default function BatteryScreen() {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        getBatteryLevel().then(setLevel);
    }, [5]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Battery</Text>

            <View style={styles.batteryBox}>
                <View style={[styles.fill, { height: `${level}%` }]} />
                <Text style={styles.percent}>{level}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0D2B2B',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: "auto"
    },
    title: {
        color: 'white',
        marginBottom: 10,
    },
    batteryBox: {
        width: 120,
        height: 220,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
    },
    fill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#00E5A0',
    },
    percent: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
});