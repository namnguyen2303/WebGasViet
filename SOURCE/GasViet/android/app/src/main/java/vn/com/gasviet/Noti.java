package vn.com.gasviet;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class Noti extends FirebaseMessagingService {
    public static StringBuilder notiData = new StringBuilder();

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        notiData = new StringBuilder();
        int i = remoteMessage.getData().get("custom").indexOf("type");
        String c = remoteMessage.getData().get("custom").substring(i + 6, i + 7);
        if (!c.equals("4") && !c.equals("5")) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            notiData.append(remoteMessage.getData().get("custom"));
        }


    }

}
