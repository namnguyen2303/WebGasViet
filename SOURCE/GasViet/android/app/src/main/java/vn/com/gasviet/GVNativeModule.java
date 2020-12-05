package vn.com.gasviet;

import android.app.NotificationManager;
import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;


public class GVNativeModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context = getReactApplicationContext();

    public GVNativeModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "GVNativeModule";
    }


    @ReactMethod
    public void GetNotiData(Callback callback) {
        callback.invoke(Noti.notiData.toString());
    }

    @ReactMethod
    public void dimissAllNoti() {
        NotificationManager nMgr = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        nMgr.cancelAll();
    }


}
