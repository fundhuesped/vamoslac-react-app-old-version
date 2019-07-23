import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import { GA_TRACKING_ID } from "../../config/HTTP/index.js";

export let tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);
