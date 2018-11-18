import { NativeModules} from 'react-native';
class BuildType {
    static isDebug = false;
    static isRelease = false;
    static isReleaseStaging = false;
    static versionName = "";
    static desc = "";

    static getDesc(){
        if(this.desc.length < 1){
            if(this.isDebug){
                this.desc = "debug";
            } else if(this.isRelease){
                this.desc = "release";
            } else if(this.isReleaseStaging){
                this.desc = "releaseStaging";
            }
            this.desc = this.versionName + "\n" + this.desc + "\n" + (isAndroid ? "Androis" : "IOS") + "\n" + vsSize.width + "," + vsSize.height;
        }
        return this.desc;
    }

    static getVersionDesc(){
        if(this.isDebug){
            return this.versionName + " 调试版";
        } else if(this.isReleaseStaging){
            return this.versionName + " 测试版";
        }
        return this.versionName;
    }
}

export function initBuildType(){
    let m = NativeModules.WepayModules;
    m.getVersionName(e=>BuildType.versionName = e);
    m.isDebug(e=>BuildType.isDebug = e);
    m.isRelease(e=>BuildType.isRelease = e);
    m.isReleaseStaging(e=>BuildType.isReleaseStaging = e);
}

export default class App {
    static isDebug(){return BuildType.isDebug;}
    static isRelease(){return BuildType.isRelease;}
    static isReleaseStaging(){return BuildType.isReleaseStaging;}
    static getBuildTypeDesc(){return BuildType.getDesc();}
    static getVersionName(){return BuildType.versionName;}
    static getVersionDesc(){return BuildType.getVersionDesc();}
    // 热更新
    static codepush_n1_0_1 = -1;
    // 首次启动 放在主页 检测登录和更新
    // 0无下载  1有下载 2本地session登录成功 
    static firstStart_n1_0_1 = -1;
}