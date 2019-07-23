/**
 * @format
 */
if(__DEV__) {
    import('./src/config/ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
import {AppRegistry} from 'react-native';
import Index from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Index);
