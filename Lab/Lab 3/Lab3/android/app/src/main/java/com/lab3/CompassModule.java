package com.lab3;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CompassModule extends ReactContextBaseJavaModule
        implements SensorEventListener {

    private final ReactApplicationContext reactContext;

    private final SensorManager sensorManager;

    private final Sensor accelerometer;
    private final Sensor magnetometer;

    private final float[] gravityData = new float[3];
    private final float[] magneticData = new float[3];

    private boolean hasGravity = false;
    private boolean hasMagnetic = false;

    public CompassModule(
            ReactApplicationContext context
    ) {
        super(context);

        this.reactContext = context;

        sensorManager =
                (SensorManager) context.getSystemService(
                        Context.SENSOR_SERVICE
                );

        accelerometer =
                sensorManager.getDefaultSensor(
                        Sensor.TYPE_ACCELEROMETER
                );

        magnetometer =
                sensorManager.getDefaultSensor(
                        Sensor.TYPE_MAGNETIC_FIELD
                );
    }

    @NonNull
    @Override
    public String getName() {
        return "CompassModule";
    }

    @ReactMethod
    public void start() {

        if (accelerometer != null) {
            sensorManager.registerListener(
                    this,
                    accelerometer,
                    SensorManager.SENSOR_DELAY_UI
            );
        }

        if (magnetometer != null) {
            sensorManager.registerListener(
                    this,
                    magnetometer,
                    SensorManager.SENSOR_DELAY_UI
            );
        }
    }

    @ReactMethod
    public void stop() {

        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.sensor.getType()
                == Sensor.TYPE_ACCELEROMETER) {

            System.arraycopy(
                    event.values,
                    0,
                    gravityData,
                    0,
                    gravityData.length
            );

            hasGravity = true;
        }

        if (event.sensor.getType()
                == Sensor.TYPE_MAGNETIC_FIELD) {

            System.arraycopy(
                    event.values,
                    0,
                    magneticData,
                    0,
                    magneticData.length
            );

            hasMagnetic = true;
        }

        if (hasGravity && hasMagnetic) {

            float[] rotationMatrix =
                    new float[9];

            float[] orientationAngles =
                    new float[3];

            boolean success =
                    SensorManager.getRotationMatrix(
                            rotationMatrix,
                            null,
                            gravityData,
                            magneticData
                    );

            if (success) {

                SensorManager.getOrientation(
                        rotationMatrix,
                        orientationAngles
                );

                float azimuthRadians =
                        orientationAngles[0];

                float azimuthDegrees =
                        (float) Math.toDegrees(
                                azimuthRadians
                        );

                azimuthDegrees =
                        (azimuthDegrees + 360) % 360;

                reactContext
                        .getJSModule(
                                DeviceEventManagerModule
                                        .RCTDeviceEventEmitter.class
                        )
                        .emit(
                                "onDirectionChanged",
                                azimuthDegrees
                        );
            }
        }
    }

    @Override
    public void onAccuracyChanged(
            Sensor sensor,
            int accuracy
    ) {
    }
}