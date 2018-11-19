import { Platform, Dimensions, NativeModules} from 'react-native';
const {width, height} = Dimensions.get("window");

export const Build = {
    NONE : -1,
    DEBUG : 0,
    RELEASE : 1,
    RELEASESTAGING : 2,
    type : -1,
    versionName : "",
    versionDesc : "",
    desc : "",
}

function initBuildLater (){
    if(Build.type === Build.NONE || Build.versionName === ""){
        return;
    }
    Build.versionDesc = Build.versionName + (["调试版", "", "测试版"][Build.type]);
    Build.desc = Build.versionName + "\n" + Build.desc + "\n" + Platform.OS + "\n" + width + "," + height;
    Object.freeze(Build);
}

export function initBuild(){
    let m = NativeModules.WepayModules;
    m.getVersionName(e=>{
        Build.versionName = e;
        initBuildLater();
    });
    m.getBuildType(e=>{
        Build.type = e;
        if(typeof(Build.type) === "number"){
            Build.desc = ["debug", "release", "releaseStaging"][Build.type];
        } else {
            let oldType = {
                debug : Build.DEBUG,
                release : Build.RELEASE,
                releaseStaging : Build.RELEASESTAGING,
            }
            Build.desc = Build.type;
            Build.type = oldType[Build.type];           
        }
        initBuildLater();
    })
}
