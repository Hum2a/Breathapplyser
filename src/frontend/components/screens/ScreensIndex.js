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
export { default as VisualDetailedHistoryScreen } from './frontendScreens/HistoryScreens/VisualDetailedHistory';

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
export { default as AlcoholicsScreen } from './frontendScreens/UsersAndSettingsScreens/Alcholics';
export { default as BACRefreshRateScreen } from './frontendScreens/UsersAndSettingsScreens/Alcoholics/BACDecreaseRefreshPicker';
export { default as DrunkParametersScreen } from './frontendScreens/UsersAndSettingsScreens/Alcoholics/DrunkParameters';
export { default as DisplaySettingsScreen } from './frontendScreens/UsersAndSettingsScreens/DisplayScreen';
export { default as EmojiCustomisationScreen } from './frontendScreens/UsersAndSettingsScreens/Display/EmojiCustomisation';
export { default as AnimationsToggleScreen } from './frontendScreens/UsersAndSettingsScreens/Display/AnimationsToggle';
export { default as RecentControlsScreen } from './frontendScreens/UsersAndSettingsScreens/Display/RecentDrinksControls';
export { default as CommonControlsScreen } from './frontendScreens/UsersAndSettingsScreens/Display/CommonDrinksControls';
export { default as DeveloperSettingsScreen } from './frontendScreens/UsersAndSettingsScreens/Developer';
export { default as VenueManagementScreen } from './frontendScreens/UsersAndSettingsScreens/Alcoholics/VenueManagement';

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
export { default as LifeTimeStatsScreen } from './frontendScreens/StatsScreens/LifetimeStats';
export { default as NightOutCalendarScreen } from './frontendScreens/StatsScreens/NightOutCalendar';

// Misc
export { default as AchievementsScreen} from './frontendScreens/StatsScreens/Achievements';

// Online
export { default as Rankings } from './onlineScreens/Rankings';
export { default as AcceptRankingsScreen } from './onlineScreens/AcceptOnlineRankings';
export { default as SpentRankingsScreen } from './onlineScreens/SpentRankings';
export { default as UnitRankingsScreen } from './onlineScreens/UnitRankings';

// Developer
    // Alcohol Stuff
export { default as AlcoholStuffDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuff';
export { default as EntriesDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuffScreens/Entries';
export { default as EntriesEditDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuffScreens/EntriesEdit';
export { default as BACLevelDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuffScreens/BACLevel';
export { default as VenueDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuffScreens/Venues';
export { default as FavouritesEditDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/AlcoholStuffScreens/FavouritesEdit';

export { default as AnimationsDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/Animations';
export { default as BACRefreshRateDevScreen } from './frontendScreens/UsersAndSettingsScreens/Developer/BACRefreshRate';
export { default as DailyTotalsDevScreen } from  './frontendScreens/UsersAndSettingsScreens/Developer/DailyTotals';