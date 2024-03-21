// Start Up
export { default as GetStartedScreen } from './startUpScreens/GetStartedScreen';
export { default as LoginScreen } from './startUpScreens/login_screens/LoginScreen';
export { default as BubbleStartScreen } from './startUpScreens/BubbleStartScreen';
export { default as StartScreen } from './startUpScreens/StartScreen';
export { default as RegisterScreen } from './startUpScreens/register_screens/RegisterScreen';
export { default as BodyStatsScreen } from './startUpScreens/register_screens/BodyStats';
export { default as BodyLimitsScreen } from './startUpScreens/register_screens/BodyLimits';
export { default as HomeScreen } from './frontendScreens/HomeScreen';

// Drinking
export { default as StartDrinkingScreen } from './frontendScreens/DrinkingScreens/CurrentlyDrinking';
// export { default as BarcodeScanScreen } from './frontendScreens/DrinkingScreens/BarcodeScan';

// Entries/History
export { default as AddEntryScreen } from './frontendScreens/DrinkingScreens/AddDrink';
export { default as EditEntriesScreen } from './frontendScreens/EntriesScreens/EditEntries';
export { default as EntriesScreen } from './frontendScreens/EntriesScreens/Entries';
export { default as HistoryScreen } from './frontendScreens/HistoryScreens/History';
export { default as DetailedHistoryScreen } from './frontendScreens/HistoryScreens/DetailedHistory';
export { default as HistoryCalendarScreen } from './frontendScreens/HistoryScreens/HistoryCalender';

// Favourites
export { default as FavouritesScreen } from './frontendScreens/FavouritesScreens/ViewFavourites';
export { default as PickFavouritesScreen } from './frontendScreens/FavouritesScreens/PickFromFavourites';
export { default as AddFavouritesScreen } from './frontendScreens/FavouritesScreens/Add Favourite';
export { default as EditFavouritesScreen } from './frontendScreens/FavouritesScreens/EditFavourite';
export { default as FavouriteListScreen } from './frontendScreens/FavouritesScreens/FavouritesList';

// Settings
export { default as SettingsScreen } from './frontendScreens/UsersAndSettingsScreens/Settings';
export { default as ProfileScreen } from './frontendScreens/UsersAndSettingsScreens/Profile';
export { default as LimitsScreen } from './frontendScreens/UsersAndSettingsScreens/Limits';
export { default as NotificationManagerScreen } from './frontendScreens/UsersAndSettingsScreens/NotificationsManager';
export { default as DataManagerScreen } from './frontendScreens/UsersAndSettingsScreens/DataManager';
export { default as StaticVariablesScreen } from './frontendScreens/UsersAndSettingsScreens/StaticVariables';
export { default as DisplaySettingsScreen } from './frontendScreens/UsersAndSettingsScreens/DisplayScreen';

// Charts
export { default as ChartsScreen } from './frontendScreens/ChartsScreens/OmniChartManager';
export { default as BACChartsScreen } from './frontendScreens/ChartsScreens/ChartTypes/BACChartsScreen';
export { default as UnitsChartsScreen } from './frontendScreens/ChartsScreens/ChartTypes/UnitsChartsScreen';
export { default as AmountSpentChartsScreen } from './frontendScreens/ChartsScreens/ChartTypes/AmountSpentChartsScreens';
export { default as NamesCharts } from './frontendScreens/ChartsScreens/ChartTypes/NamesChartsScreen';
export { default as TypesCharts } from './frontendScreens/ChartsScreens/ChartTypes/TypesChartsScreen';
export { default as DrunknessCharts } from './frontendScreens/ChartsScreens/ChartTypes/DrunkCharts';

// Stats
export { default as TodaysStatsScreen } from './frontendScreens/StatsScreens/TodaysStats';
export { default as AllStatsScreen } from './frontendScreens/StatsScreens/AllStats';
export { default as CurrentNightOutScreen } from './frontendScreens/StatsScreens/CurrentNightOut';
export { default as CompareNightsOutScreen } from './frontendScreens/StatsScreens/CompareNightsOut';

// Misc
export { default as AchievementsScreen} from './frontendScreens/StatsScreens/Achievements';

// Online
export { default as Rankings } from './onlineScreens/Rankings';
export { default as AcceptRankingsScreen } from './onlineScreens/AcceptOnlineRankings';
export { default as SpentRankingsScreen } from './onlineScreens/SpentRankings';
export { default as UnitRankingsScreen } from './onlineScreens/UnitRankings';