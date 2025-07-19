package com.arvinapp.internetsizseslimasallar;

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

    private WebView webview1;
    private AdView adview1;
    private InterstitialAd myInterstitialAd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // WebView ve AdView başlat
        webview1 = findViewById(R.id.webview1);
        adview1 = findViewById(R.id.adview1);

        webview1.getSettings().setJavaScriptEnabled(true);
        webview1.getSettings().setSupportZoom(true);
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

        // AdMob başlat
        MobileAds.initialize(this);

        // Banner reklam yükle
        AdRequest bannerAdRequest = new AdRequest.Builder().build();
        adview1.loadAd(bannerAdRequest);

        // Interstitial reklam yükle
        AdRequest interstitialAdRequest = new AdRequest.Builder().build();
        InterstitialAd.load(this, BuildConfig.INTERSTITIAL_AD_ID, interstitialAdRequest,
            new InterstitialAdLoadCallback() {
                @Override
                public void onAdLoaded(InterstitialAd interstitialAd) {
                    myInterstitialAd = interstitialAd;
                    if (myInterstitialAd != null) {
                        myInterstitialAd.show(MainActivity.this);
                    } else {
                        showMessage("Interstitial reklam yüklenemedi.");
                    }
                }

                @Override
                public void onAdFailedToLoad(LoadAdError adError) {
                    showMessage("Interstitial reklam hatası: " + adError.getMessage());
                }
            });

        // WebView içerik yükle
        webview1.loadUrl("file:///android_asset/splash.html");
    }

    @Override
    protected void onDestroy() {
        if (adview1 != null) {
            adview1.destroy();
        }
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        if (adview1 != null) {
            adview1.pause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        if (adview1 != null) {
            adview1.resume();
        }
        super.onResume();
    }

    private void showMessage(String msg) {
        Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
    }
}
