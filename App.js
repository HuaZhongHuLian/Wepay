import AppNavigator from './js/navigators/AppNavigator'
import React, { Component } from 'react';
import {View, Text, Image} from "react-native"
import { Provider } from 'mobx-react';
import AppStore from './js/AppStore';
import codePush from "react-native-code-push";
import SplashScreen from "react-native-splash-screen"
import You from './js/util/You'
// import {Theme} from 'teaset';

import {initBuildType} from "./js/utils/App";
// import StackNavigator from "./js/utils/StackNavigator"


// import {_Dialog} from "./js/utils/Dialog"
// import {_Net} from "./js/utils/Net"
// import {_Util} from "./js/utils/Util"

// import icons from "./res/images/_icons";
// import images from "./res/pictures/_images"
// import bankcards from "./res/bank_card_icon/_bankcard"



if (!__DEV__) {
global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {}
};
}

// Theme.set({
//     fitIPhoneX: true,
//     primaryColor: '#48B1A3',
//     // secondaryColor : "#48B1A3",
//     // defaultColor : "white",
//     // defaultTextColor : "black",
// }); 

const stores ={
    AppStore,
} 
 class App extends Component {
    constructor(props){
        super(props);
        console.log("App初始化,明显是在启动图之后");
        You.init();
        initBuildType();
    }

    componentWillMount(){
        console.log("App准备Mount");
    }

    componentDidMount(){
        console.log("App已经Mount");
        SplashScreen.hide();
    }

    render() {
        // return <View style = {{flex:1, backgroundColor:"black", justifyContent:"center", alignItems:"center"}}>
        //     <Text style = {{fontSize:32, color:"white"}}>Nav</Text>
        //     <Image source = {bankcards.guangda}/>
        // </View>;
        // return <StackNavigator />;
        // 配置mobx 的 Store 
        return <Provider {...stores}>
            <AppNavigator/>
        </Provider>;
    }
}

//export default AppNavigator
// 关闭指定警告
console.ignoredYellowBox = [ 'Warning: isMounted(...)','Warning: Failed prop type' ];
// 关闭全部的警告
//console.disableYellowBox = true;


//必须配置以下代码否则重启app回到上一个版本
let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
let codePushApp = codePush(codePushOptions)(App);
export default codePushApp;
