import React, {useEffect, useState} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {NfcModule, CompassModule} = NativeModules;

type TabType = 'nfc' | 'compass';

export default function App() {
  const [activeTab, setActiveTab] =
    useState<TabType>('nfc');

  const [nfcData, setNfcData] =
    useState('Waiting for NFC Tag...');

  const [degree, setDegree] =
    useState(0);

  useEffect(() => {
    const nfcEmitter =
      new NativeEventEmitter(NfcModule);

    const nfcSub =
      nfcEmitter.addListener(
        'onTagDetected',
        data => {
          setNfcData(data);
        },
      );
    const compassEmitter =
      new NativeEventEmitter(CompassModule);

    const compassSub =
      compassEmitter.addListener(
        'onDirectionChanged',
        value => {
          setDegree(value);
        },
      );

    NfcModule.startListening();

    CompassModule.start();

    return () => {

      nfcSub.remove();
      compassSub.remove();

      NfcModule.stopListening();

      CompassModule.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>
        Sensor Native Module Lab
      </Text>

      {/* TABS */}
      <View style={styles.tabContainer}>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'nfc' &&
              styles.activeTab,
          ]}
          onPress={() => setActiveTab('nfc')}>
          <Text style={styles.tabText}>
            NFC
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'compass' &&
              styles.activeTab,
          ]}
          onPress={() =>
            setActiveTab('compass')
          }>
          <Text style={styles.tabText}>
            Compass
          </Text>
        </TouchableOpacity>
      </View>

      {/* NFC SCREEN */}
      {activeTab === 'nfc' && (
        <View style={styles.screen}>

          <Text style={styles.screenTitle}>
            NFC Reader
          </Text>

          <View style={styles.card}>

            <Text style={styles.label}>
              NFC Data:
            </Text>

            <Text style={styles.value}>
              {nfcData}
            </Text>

          </View>

          <Text style={styles.helper}>
            Tap an NFC tag near the phone
          </Text>

        </View>
      )}

      {/* COMPASS SCREEN */}
      {activeTab === 'compass' && (
        <View style={styles.screen}>

          <Text style={styles.screenTitle}>
            Compass
          </Text>

          <Text style={styles.degreeText}>
            {Math.round(degree)}°
          </Text>

          <View style={styles.compassContainer}>

            <View
              style={[
                styles.arrowContainer,
                {
                  transform: [
                    {
                      rotate: `${-degree}deg`,
                    },
                  ],
                },
              ]}>

              <Text style={styles.arrow}>
                ↑
              </Text>

            </View>

          </View>

          <Text style={styles.helper}>
            Rotate your device
          </Text>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#4A90E2',
  },

  tabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  value: {
    fontSize: 16,
  },

  helper: {
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },

  degreeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  compassContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 90,
    fontWeight: 'bold',
  },
});