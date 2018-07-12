import * as defaultConf from '../../../config/default-config.json';
import * as userConf from '../../../config/config.json';
import { userTagKeys } from '../../root-store/user-tags/user-tag-keys';


export class AppConfiguration {

  public static get askToCreateVM(): boolean {
    return (<any>defaultConf).USER[userTagKeys.askToCreateVM];
  }

  public static get askToCreateVolume(): boolean {
    return (<any>defaultConf).USER[userTagKeys.askToCreateVolume];
  }

  public static get savePasswordForAllVMs(): boolean {
    return (<any>defaultConf).USER[userTagKeys.savePasswordForAllVMs];
  }

  public static get firstDayOfWeek(): string {
    return (<any>userConf)['defaultFirstDayOfWeek'] || (<any>defaultConf).USER[userTagKeys.firstDayOfWeek];
  }

  public static get interfaceLanguage(): string {
    return (<any>userConf)['defaultInterfaceLanguage'] || (<any>defaultConf).USER[userTagKeys.lang];
  }

  public static get lastVMId(): number {
    return (<any>defaultConf).USER[userTagKeys.lastVMId];
  }

  public static get sessionTimeout(): number {
    return (<any>userConf)['sessionTimeout'] || (<any>defaultConf).USER[userTagKeys.sessionTimeout];
  }

  public static get showSystemTags(): boolean {
    return (<any>defaultConf).USER[userTagKeys.showSystemTags];
  }

  public static get timeFormat(): string {
    return (<any>userConf)['defaultTimeFormat'] || (<any>defaultConf).USER[userTagKeys.timeFormat];
  }

  public static get theme(): string {
    return (<any>userConf)['defaultThemeName'] || (<any>defaultConf).USER[userTagKeys.theme];
  }

  public static get navigationOrder(): string {
    return (<any>defaultConf).USER[userTagKeys.navigationOrder];
  }

  public static get apiDocumentationLink(): string {
    return (<any>userConf)['apiDocLink'] || (<any>defaultConf).INFO['apiDocLink'];
  }
}
