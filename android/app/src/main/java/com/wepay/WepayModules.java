package com.wepay;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.net.Uri;
import java.io.File;

import org.json.JSONObject;
import org.json.JSONException;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

public class WepayModules extends ReactContextBaseJavaModule {

    private Context context;

    public WepayModules(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return "WepayModules";
    }

    // 获取应用包名
    // 要导出一个方法给JavaScript使用，Java方法需要使用注解@ReactMethod
    /**
     * @param packageName
     * @param pageName
     * @param action
     * @param account
     * @param password
     * @param callback  回调方法
     */
     // , String action, String account, String password
    @ReactMethod
    public void jumpApp(String packageName, String pageName, Callback callback) {
        try{
                // String name = getReactApplicationContext().getPackageName();
                Intent intent = new Intent();
                // intent.setComponent(new ComponentName("com.junrui.yhtd","com.junrui.yhtd.ui.record.MedicalRecordActivity"));   //第一个参数为app2的包名，第二个参数为app2的被调转界面activity
                // 第一个参数为app2的包名，第二个参数为app2的被调转界面activity
                intent.setComponent(new ComponentName(packageName,pageName));
                // intent.putExtra("account",account);//携带参数
                // intent.putExtra("password",password);//携带参数
                // if (!"action".equals(action)){
                //     intent.setAction(action);   //app2中被调转界面的action
                // }
                getCurrentActivity().startActivity(intent);
            }catch (Exception e){
                callback.invoke(packageName);
            }
    }

    // 安装apk
    @ReactMethod
    public void installApp(String apkName, Callback cb) {
        try{
            // Uri uri = Uri.parse("file://" + filePath)
            Uri uri = Uri.fromFile(new File(apkName));
            // 创建Intent意图
            Intent intent = new Intent(Intent.ACTION_VIEW);
            //启动新的activity
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 
            //设置Uri和类型
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            //执行安装
            getCurrentActivity().startActivity(intent);
            
            // finish();
        } catch (Exception e){
            cb.invoke(e);
        }
    }


    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
    
    @ReactMethod
    public void updateDialog (){
        // MainActivity.getMainActivity()
        UpdateChecker.checkForDialog(getCurrentActivity());
    }

    @ReactMethod
    public void getBuildType(Callback cb){
        cb.invoke(BuildConfig.buildType);
    }

    @ReactMethod
    public void isDebug(Callback cb){
        cb.invoke(BuildConfig.buildType.equals("debug"));
    }

    @ReactMethod
    public void isRelease(Callback cb){
        cb.invoke(BuildConfig.buildType.equals("release"));
    }

    @ReactMethod
    public void isReleaseStaging(Callback cb){
        cb.invoke(BuildConfig.buildType.equals("releaseStaging"));
    }

    // public static int getVersionCode(Context mContext) {
    //     if (mContext != null) {
    //         try {
    //             return mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0).versionCode;
    //         } catch (PackageManager.NameNotFoundException ignored) {
    //         }
    //     }
    //     return 0;
    // }

    @ReactMethod
    public void getVersionName(final Callback callback) {
        try {
            PackageInfo info = this.context.getPackageManager().getPackageInfo(this.context.getPackageName(), 0);
            callback.invoke(info.versionName);
            return;
        } catch (PackageManager.NameNotFoundException ignored) {
        }
        callback.invoke("");
    }

    // @ReactMethod
    // public void getVersionInfo(final Callback callback) {
    //     JSONObject versionInfo = new JSONObject();
    //     try {
    //         versionInfo.put("versionCode", getVersionCode(this.context));
    //         versionInfo.put("versionName", getVersionName(this.context));
    //     } catch (JSONException e) {
    //         e.printStackTrace();
    //     }
    //     callback.invoke(versionInfo.toString());
    // }
}
