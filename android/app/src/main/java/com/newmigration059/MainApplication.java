package com.newmigration059;

import android.app.Application;

import com.taskrabbit.zendesk.*;
import com.airbnb.android.react.lottie.LottiePackage;
import com.zopim.android.sdk.api.ZopimChat;
import com.facebook.react.ReactApplication;
// import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new LottiePackage(),
          // new VectorIconsPackage(),
          new MapsPackage(),
          new RNDeviceInfo(),
          new GoogleAnalyticsBridgePackage(),
          new RNI18nPackage(),
          new AsyncStoragePackage(),
          new SplashScreenReactPackage(),
          new SvgPackage(),
          new RealmReactPackage(),
          new RNZendeskChatPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    ZopimChat.init("ZXuFuBFUS919FLIZkz5GlaIOEbzRUadx");
    SoLoader.init(this, /* native exopackage */ false);
  }
}
