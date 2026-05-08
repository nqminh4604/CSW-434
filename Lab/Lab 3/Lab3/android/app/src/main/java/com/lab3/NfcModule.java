package com.lab3;

import android.app.Activity;
import android.nfc.NfcAdapter;
import android.nfc.Tag;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NfcModule extends ReactContextBaseJavaModule implements NfcAdapter.ReaderCallback {

    private final ReactApplicationContext reactContext;

    private NfcAdapter nfcAdapter;

    public NfcModule(ReactApplicationContext context) {
        super(context);

        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "NfcModule";
    }
    @ReactMethod
    public void startListening() {

        Activity activity = getCurrentActivity();

        if (activity == null) return;

        nfcAdapter =
                NfcAdapter.getDefaultAdapter(activity);

        if (nfcAdapter == null) return;

        nfcAdapter.enableReaderMode(
                activity,
                this,
                NfcAdapter.FLAG_READER_NFC_A |
                        NfcAdapter.FLAG_READER_NFC_B,
                null
        );
    }

    @ReactMethod
    public void stopListening() {

        Activity activity = getCurrentActivity();

        if (activity == null || nfcAdapter == null)
            return;

        nfcAdapter.disableReaderMode(activity);
    }

    @Override
    public void onTagDiscovered(Tag tag) {
        reactContext
                .getJSModule(
                        DeviceEventManagerModule
                                .RCTDeviceEventEmitter.class
                )
                .emit(
                        "onTagDetected",
                        tag.toString()
                );
    }

}
