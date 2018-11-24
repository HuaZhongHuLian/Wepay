import { Platform,  Dimensions, NativeModules} from 'react-native';

const {width, height} = Dimensions.get('window');
export const vsSize = {width : width, height : height};
export const isAndroid = (Platform.OS != 'ios');

class BuildType{
    static isDebug;
    static isRelease;
    static isReleaseStaging;
    static versionName = '';
}

export default class You{
    // BuildType 与 Version
    static isDebug(){return BuildType.isDebug;}
    static isRelease(){return BuildType.isRelease;}
    static isReleaseStaging(){return BuildType.isReleaseStaging;}
    static getVersionName(){return BuildType.versionName;}

    static init(){
        console.log("TOTModules.init 初始化");
        // BuildType.isDebug = false;
        // BuildType.isRelease = true;
        // BuildType.isReleaseStaging = false;
        // BuildType.versionName = "1.0.1";
        // return;
        let m = NativeModules.WepayModules;
        m.getVersionName(e=>BuildType.versionName = e);
        m.isDebug(e=>BuildType.isDebug = e);
        m.isRelease(e=>BuildType.isRelease = e);
        m.isReleaseStaging(e=>BuildType.isReleaseStaging = e);
    }

    static show(){
        let str = 'version ' + You.getVersionName() + '\ndebug:' + You.isDebug() + '\nrelease:'
        + You.isRelease() + '\nreleaseStaging:' + You.isReleaseStaging() + '\nisAndroid:' + isAndroid
        + '\nwidth:' + vsSize.width + '\nhetght:' + vsSize.height;
        console.log(str);
        if(You.isRelease()){
            return;
        }
        // alert(str);
    }


    // -1 未检测   0 无    1 有
    static hadUpdate = -1;
}
