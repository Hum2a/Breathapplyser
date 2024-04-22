import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  StartDrinkingScreen,
  AddEntryScreen,
  ProfileScreen,
  LimitsScreen,
  SettingsScreen,
  HistoryScreen,
  DetailedHistoryScreen,
  HistoryCalendarScreen,
  ChartsScreen,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  BodyStatsScreen,
  BodyLimitsScreen,
  FavouritesScreen,
  PickFavouritesScreen,
  AddFavouritesScreen,
  EditFavouritesScreen,
  FavouriteListScreen,
  NotificationManagerScreen,
  DataManagerScreen,
  GetStartedScreen,
  TodaysStatsScreen,
  AllStatsScreen,
  CurrentNightOutScreen,
  CompareNightsOutScreen,
  AchievementsScreen,
  EditEntriesScreen,
  BACChartsScreen,
  UnitsChartsScreen,
  AmountSpentChartsScreen,
  NamesCharts,
  TypesCharts,
  DrunknessCharts,
  Rankings,
  SpentRankingsScreen,
  UnitRankingsScreen,
  AcceptRankingsScreen,
  AlcoholicsScreen,
  DisplaySettingsScreen,
  EmojiCustomisationScreen,
  DrunkParametersScreen,
  BACRefreshRateScreen,
  LifeTimeStatsScreen,
  VisualDetailedHistoryScreen,
  NightOutCalendarScreen,
} from '../screens/ScreensIndex';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true, // Enable gestures if desired
        }}
        >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StartDrinking" component={StartDrinkingScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="DetailedHistory" component={DetailedHistoryScreen} />
        <Stack.Screen name="HistoryCalender" component={HistoryCalendarScreen} />
        <Stack.Screen name="VisualDetailedHistory" component={VisualDetailedHistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Limits" component={LimitsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Charts" component={ChartsScreen} />
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="BodyStats" component={BodyStatsScreen} />
        <Stack.Screen name='BodyLimits' component={BodyLimitsScreen} />
        <Stack.Screen name="Favourites" component={FavouritesScreen} />
        <Stack.Screen name="PickFavourites" component={PickFavouritesScreen} />
        <Stack.Screen name="AddFavourite" component={AddFavouritesScreen} />
        <Stack.Screen name="EditFavourite" component={EditFavouritesScreen} />
        <Stack.Screen name="FavouriteList" component={FavouriteListScreen} />
        <Stack.Screen name="NotificationManger" component={NotificationManagerScreen} />
        <Stack.Screen name="DataManager" component={DataManagerScreen} />
        <Stack.Screen name="Alcoholics" component={AlcoholicsScreen} />
        <Stack.Screen name="Display" component={DisplaySettingsScreen} />
        <Stack.Screen name="Emoji" component={EmojiCustomisationScreen} />
        <Stack.Screen name='DrunkParams' component={DrunkParametersScreen} />
        <Stack.Screen name="BACRefreshRate" component={BACRefreshRateScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="TodaysStats" component={TodaysStatsScreen} />
        <Stack.Screen name="AllStats" component={AllStatsScreen} />
        <Stack.Screen name="LifeTimeStats" component={LifeTimeStatsScreen} />
        <Stack.Screen name="CurrentNight" component={CurrentNightOutScreen} />
        <Stack.Screen name="CompareNights" component={CompareNightsOutScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="EditEntries" component={EditEntriesScreen} />
        <Stack.Screen name="BACCharts" component={BACChartsScreen} />
        <Stack.Screen name="UnitsCharts" component={UnitsChartsScreen} />
        <Stack.Screen name="AmountSpentCharts" component={AmountSpentChartsScreen} />
        <Stack.Screen name="NamesCharts" component={NamesCharts} />
        <Stack.Screen name="TypesCharts" component={TypesCharts} />
        <Stack.Screen name="DrunkCharts" component={DrunknessCharts} />
        <Stack.Screen name="Rankings" component={Rankings} />
        {/* <Stack.Screen name="DrunkRankings" component={DrunkRankings} />
        <Stack.Screen name="MostDrankRankings" component={MostDrankRankings} /> */}
        <Stack.Screen name="UnitsRankings" component={UnitRankingsScreen} />
        <Stack.Screen name="SpentRankings" component={SpentRankingsScreen} />
        <Stack.Screen name="AcceptRankings" component={AcceptRankingsScreen} />
        <Stack.Screen name="NightOutCalendar" component={NightOutCalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;