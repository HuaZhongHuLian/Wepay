package com.wepay;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by mac on 2018/10/20.
 */

public class GoToActivity extends ReactContextBaseJavaModule {

    public GoToActivity(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GoToApp";
    }


    // 获取应用包名
    // 要导出一个方法给JavaScript使用，Java方法需要使用注解@ReactMethod

    /**
     *
     * @param packageName
     * @param pageName
     * @param action
     * @param account
     * @param password
     * @param callback  回调方法
     */
    @ReactMethod
    public void gotoApp(String packageName, String pageName, String action, String account, String password, Callback callback) {
        try{
            //String name = getReactApplicationContext().getPackageName();
            Intent intent = new Intent();
            //intent.setComponent(new ComponentName("com.junrui.yhtd","com.junrui.yhtd.ui.record.MedicalRecordActivity"));   //第一个参数为app2的包名，第二个参数为app2的被调转界面activity
            //第一个参数为app2的包名，第二个参数为app2的被调转界面activity
            intent.setComponent(new ComponentName(packageName,pageName));
            intent.putExtra("account",account);//携带参数
            intent.putExtra("password",password);//携带参数
            if (!"action".equals(action))
            intent.setAction(action);   //app2中被调转界面的action
            getCurrentActivity().startActivity(intent);
        }catch (Exception e){
            callback.invoke(packageName);
        }

    }
}
