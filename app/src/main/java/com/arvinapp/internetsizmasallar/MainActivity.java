package com.arvinapp.internetsizmasallar;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.widget.Toast;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.LoadAdError;

public class MainActivity extends Activity {

    private WebView webview1;
    private AdView adview1;
    private InterstitialAd myInterstitialAd;
    private String bannerAdId;
    private String interstitialAdId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bannerAdId = BuildConfig.BANNER_AD_ID;
        interstitialAdId = BuildConfig.INTERSTITIAL_AD_ID;

        initializeViews();
        initializeLogic();
    }

    private void initializeViews() {
        webview1 = findViewById(R.id.webview1);
        adview1 = findViewById(R.id.adview1);

        WebSettings settings = webview1.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setSupportZoom(true);

        webview1.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }
        });
    }

    private void initializeLogic() {
        MobileAds.initialize(this, initializationStatus -> {});

        webview1.loadUrl("file:///android_asset/splash.html");

        AdRequest adRequest = new AdRequest.Builder().build();
        adview1.loadAd(adRequest);

        InterstitialAd.load(this, interstitialAdId, adRequest, new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(InterstitialAd ad) {
                myInterstitialAd = ad;
                if (myInterstitialAd != null) {
                    myInterstitialAd.show(MainActivity.this);
                }
            }

            @Override
            public void onAdFailedToLoad(LoadAdError adError) {
                showMessage("Interstitial failed: " + adError.getMessage());
            }
        });
    }

    @Override
    protected void onDestroy() {
        if (adview1 != null) adview1.destroy();
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        if (adview1 != null) adview1.pause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        if (adview1 != null) adview1.resume();
        super.onResume();
    }

    public void showMessage(String s) {
        Toast.makeText(getApplicationContext(), s, Toast.LENGTH_SHORT).show();
    }
}
