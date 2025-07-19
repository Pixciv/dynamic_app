package com.arvinapp.internetsizmasallar;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;

import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.LoadAdError;

public class MainActivity extends Activity {

    private String _ad_unit_id;
    private WebView webview1;
    private AdView adview1;
    private InterstitialAd myInterstitialAd;

    @Override
    protected void onCreate(Bundle _savedInstanceState) {
        super.onCreate(_savedInstanceState);
        setContentView(R.layout.activity_main);
        initialize(_savedInstanceState);

        MobileAds.initialize(this);

        // strings.xml'den banner ID çekiliyor (config.json'dan yazılan)
        _ad_unit_id = getString(R.string.banner_ad_unit_id);

        initializeLogic();
    }

    private void initialize(Bundle _savedInstanceState) {
        webview1 = findViewById(R.id.webview1);
        webview1.getSettings().setJavaScriptEnabled(true);
        webview1.getSettings().setSupportZoom(true);
        adview1 = findViewById(R.id.adview1);

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
        webview1.loadUrl("file:///android_asset/splash.html");

        // Banner reklamı yükle
        AdRequest adRequest = new AdRequest.Builder().build();
        adview1.loadAd(adRequest);

        // Geçiş reklamı (interstitial) yükle
        InterstitialAd.load(this, _ad_unit_id, adRequest, new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(InterstitialAd ad) {
                myInterstitialAd = ad;
                if (myInterstitialAd != null) {
                    myInterstitialAd.show(MainActivity.this);
                }
            }

            @Override
            public void onAdFailedToLoad(LoadAdError loadAdError) {
                showMessage("Interstitial yüklenemedi: " + loadAdError.getMessage());
            }
        });
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
