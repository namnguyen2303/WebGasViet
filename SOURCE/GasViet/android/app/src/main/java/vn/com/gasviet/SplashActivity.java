package vn.com.gasviet;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            Thread.sleep(3000);
            startActivity(new Intent(SplashActivity.this, MainActivity.class));
            finish();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}
