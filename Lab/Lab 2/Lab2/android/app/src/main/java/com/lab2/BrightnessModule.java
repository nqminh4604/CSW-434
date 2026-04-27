package com.lab2;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BrightnessModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    BrightnessModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "BrightnessModule";
    }

    @ReactMethod
    public void canWriteSettings(com.facebook.react.bridge.Callback callback) {
        boolean canWrite = Settings.System.canWrite(reactContext);
        callback.invoke(canWrite);
    }

    @ReactMethod
    public void requestWriteSettings() {
        Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS);
        intent.setData(Uri.parse("package:" + reactContext.getPackageName()));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void setBrightness(float value) {
        if (getCurrentActivity() == null)
            return;

        try {
            android.view.Window window = getCurrentActivity().getWindow();
            android.view.WindowManager.LayoutParams params = window.getAttributes();

            params.screenBrightness = value;

            window.setAttributes(params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getBrightness(com.facebook.react.bridge.Callback callback) {
        if (getCurrentActivity() == null) {
            callback.invoke(0.5);
            return;
        }

        android.view.Window window = getCurrentActivity().getWindow();
        android.view.WindowManager.LayoutParams params = window.getAttributes();

        float brightness = params.screenBrightness;

        if (brightness < 0)
            brightness = 0.5f;

        callback.invoke(brightness);
    }
}