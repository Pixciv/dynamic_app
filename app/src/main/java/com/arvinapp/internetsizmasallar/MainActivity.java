package com.arvinapp.internetsizmasallar;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.InterstitialAdLoadCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends Activity {

    private String _ad_unit_id;
    private WebView webview1;
    private AdView adview1;
    private InterstitialAd myInterstialAd;
    private InterstitialAdLoadCallback _myInterstialAd_interstitial_ad_load_callback;

    @Override
    protected void onCreate(Bundle _savedInstanceState) {
        super.onCreate(_savedInstanceState);
        setContentView(R.layout.activity_main);
        initialize(_savedInstanceState);

        MobileAds.initialize(this);

        // Dinamik AdMob Banner ID config.json'dan buildConfigField ile geliyor
        _ad_unit_id = BuildConfig.BANNER_AD_ID;
        initializeLogic();
    }

    private void initialize(Bundle _savedInstanceState) {
        webview1 = findViewById(R.id.webview1);
        webview1.getSettings().setJavaScriptEnabled(true);
        webview1.getSettings().setSupportZoom(true);
        adview1 = findViewById(R.id.adview1);

        webview1.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView _param1, String _param2, Bitmap _param3) {
                super.onPageStarted(_param1, _param2, _param3);
            }

            @Override
            public void onPageFinished(WebView _param1, String _param2) {
                super.onPageFinished(_param1, _param2);
            }
        });

        _myInterstialAd_interstitial_ad_load_callback = new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(InterstitialAd _param1) {
                myInterstialAd = _param1;
                if (myInterstialAd != null) {
                    myInterstialAd.show(MainActivity.this);
                } else {
                    showMessage("Error: InterstitialAd not loaded!");
                }
            }

            @Override
            public void onAdFailedToLoad(LoadAdError _param1) {
                // Reklam yüklenemediğinde yapılacak işlemler
            }
        };
    }

    private void initializeLogic() {
        String splashUrl = "file:///android_asset/splash.html";
        webview1.loadUrl(splashUrl);

        AdRequest adRequest = new AdRequest.Builder().build();
        adview1.loadAd(adRequest);

        AdRequest interstitialAdRequest = new AdRequest.Builder().build();
        InterstitialAd.load(MainActivity.this, _ad_unit_id, interstitialAdRequest, _myInterstialAd_interstitial_ad_load_callback);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (adview1 != null) {
            adview1.destroy();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (adview1 != null) {
            adview1.pause();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (adview1 != null) {
            adview1.resume();
        }
    }

    public void showMessage(String _s) {
        Toast.makeText(getApplicationContext(), _s, Toast.LENGTH_SHORT).show();
    }
}
