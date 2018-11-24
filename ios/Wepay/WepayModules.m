//
//  WepayModules.m
//  Wepay
//
//  Created by mac-wolf on 2018/10/29.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "WepayModules.h"

@implementation WepayModules

// 导出模块，不添加参数即默认为这个类名
RCT_EXPORT_MODULE();


#pragma mark - Response
// 导出方法，桥接到js的方法返回值类型必须是void
/* 回调参数必须为两个，第一个为状态，第二个为参数 */
RCT_EXPORT_METHOD(getBuildType:(RCTResponseSenderBlock)callback){
  NSString *callbackData = @"release"; //准备回调回去的数据
#ifdef DEBUG
  callbackData = @"debug";
#endif
#ifdef STAGING
  callbackData = @"releaseStaging";
#endif
  callback(@[callbackData]);
  return;
  callback(@[[NSNull null],callbackData]);
}

RCT_EXPORT_METHOD(isDebug:(RCTResponseSenderBlock)callback){
#ifdef DEBUG
  callback(@[@(YES)]);
  return;
#endif
  callback(@[@(NO)]);
}

RCT_EXPORT_METHOD(isRelease:(RCTResponseSenderBlock)callback){
#ifdef DEBUG
  callback(@[@(NO)]);
  return;
#endif
#ifdef STAGING
  callback(@[@(NO)]);
  return;
#endif
  callback(@[@(YES)]);
}

RCT_EXPORT_METHOD(isReleaseStaging:(RCTResponseSenderBlock)callback){
#ifdef STAGING
  callback(@[@(YES)]);
  return;
#endif
  callback(@[@(NO)]);
}



//回调
//RCTResponseSenderBlock
//RCTResponseSenderBlock只接受一个参数,为数组，把需要回调的参数加入到数组中，回调回去
RCT_EXPORT_METHOD(getVersionName:(RCTResponseSenderBlock)callback){
  // 获取info字典
  NSString *bundlePath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
  NSMutableDictionary *infoDict = [NSMutableDictionary dictionaryWithContentsOfFile:bundlePath];
  NSString *version = [infoDict objectForKey:@"CFBundleShortVersionString"];
  
  //更多参数放到数组中进行回调
  // callback(@[string,array,end]);
  callback(@[version]);
  return;
  callback(@[[NSNull null],version]);
  // 或者
  NSDictionary *tempInfoDict = [[NSBundle mainBundle] infoDictionary];
  NSString *tempExecutable = [tempInfoDict objectForKey:@"CFBundleExecutable"];
  NSString *tempAppName = [tempInfoDict objectForKey:@"CFBundleDisplayName"];
  NSString *tempVersion = [tempInfoDict objectForKey:@"CFBundleShortVersionString"];
  NSLog(@"%@",infoDict);
}


@end

