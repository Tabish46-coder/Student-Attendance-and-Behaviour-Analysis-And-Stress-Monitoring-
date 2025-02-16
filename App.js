import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Login from './Teacher_screens/login';
import Home from './Teacher_screens/Teacher_home';
import Teacher_notification from './Teacher_screens/Teacher_notification';
import Teacher_allocation from './Teacher_screens/Teacher_allocation';
import Teacher_attendance from './Teacher_screens/Teacher_attendance';
import TeacherTimetableComponent from './Teacher_screens/Teacher_timetable';
import Student_home from './Student_screens/Student_home';
import Student_notification from './Student_screens/Studnet_notification';
import Student_enrollment from './Student_screens/Student_enrollment';
import Student_timetable from './Student_screens/Student_timetable';
import Admin_Teachers from './Admin_Screens/Admin_Teachers';
import Admin_allocation from './Admin_Screens/Admin_allocation';
import Datacell_Home from './Datacell_screens/Datacell_Home';
import Student_save_image from './Datacell_screens/Student_save_image';
import Upload_Video_screen from './Datacell_screens/Upload_Video_screen';
import AdminTimetable from './Admin_Screens/Admin_Timetable';
import Studnet_Attendance from './Student_screens/Student_Attendance';
import Attendance from './Student_screens/Attendance';
import Admin_Homepage from './Admin_Screens/Admin_Homepage';
import Admin_Setting from './Admin_Screens/Admin_setting';
import Admin_Notification from './Admin_Screens/Admin_Notification';
import Admin_Emotions from './Admin_Screens/Admin_Emotions';
import Student_Claims from './Student_screens/Student_Claims';
import Admin_Timeline from './Admin_Screens/Admin_Timeline';
import CMM_Home from './CMM/CMM_Home';
import CMM_Voilations from './CMM/CMM_Voilations';
import CMM_Add_Voilations from './CMM/CMM_Add_Voilations';
import Admin_Students from './Admin_Screens/Admin_Students';
import CMM_Manage_Voilations from './CMM/CMM_Manage_Voilations';
import CMM_Students from './CMM/CMM_Studnets';
import CMM_Manage_Student_Voilation from './CMM/CMM_Manage_Student_Voilation';
import CMM_Voilations_Details from './CMM/CMM_voilations_Detail';
import CMM_Voilation_expand from './CMM/CMM_Voilation_expand';
import CMM_ViewLogs from './CMM/CMM_ViewLogs';
import CMM_upload_Video from './CMM/CMM_Upload_Video';
import Student_Profile from './Student_screens/Student_Profile';
import Student_FreeSlots from './Student_screens/Student_FreeSlots';
import AdminTimetable1 from './Admin_Screens/Admin_Timetable1';
import Admin_Timetable2 from './Admin_Screens/Admin_Timetable2';
import EmotionalAnalysis from './Admin_Screens/Admin_TimeLine2';
import StudentEmotionAnalysis from './Admin_Screens/Admin_Studnet_Analysis';
import Teacher_Profile from './Teacher_screens/Teacher_Profile';
import Teacher_Claims from './Teacher_screens/Teacher_Claims';
import Teacher_Claim_Details from './Teacher_screens/Teacher_Claim_Details';
import Teacher_Held_Classes from './Teacher_screens/Teacher_Held_Classes';
import Teacher_Held_Classes_Detail from './Teacher_screens/Teacher_Held_Classes_Detail';
import Teacher_Attendance_Images from './Teacher_screens/Teacher_Attendance_Images';
import Admin_Behaviour from './Admin_Screens/Admin_Behaviour';
import Admin_Selection from './Teacher_screens/Admin_Selection';
import Overall_Attendance from './Teacher_screens/Overall_Attendance';
import Admin_Punish_Students from './Admin_Screens/Admin_Punish_Students';
import Junior_Home from './Junior_Teacher/Junior_Home';
import Junior_Allocations from './Junior_Teacher/Junior_Allocations';
import Junior_Timetable from './Junior_Teacher/Junior_Timetable';
import Junior_Attendance from './Junior_Teacher/Junior_Attendance';
import Teacher_Attendance_Sheet from './Teacher_screens/Teacher_Attendance_Sheet';
import Admin_Punish_Held from './Admin_Screens/Admin_Punish_Held';
import Admin_Punishment_Logs from './Admin_Screens/Admin_Punishment_Logs';
import EmotionSummaryView from './Admin_Screens/Emotion_Summary_Images';
import BehaviorSummaryView from './Admin_Screens/Behaviour_Summary';
import LastRowImagesView from './Admin_Screens/Last_row';
import Tasks from './Admin_Screens/tasks';
import Teacher_Manage_CRGR from './Teacher_screens/Teacher_Manage_CR/GR';
import ComparisonChartScreen from './Admin_Screens/Comparison';
import CRGRAllocation from './Teacher_screens/Teacher_Manage_CR/CRGR_Allocation';
import Admin_CrGR_Report from './Admin_Screens/Admin_CRGR_Report';
import CRGR_Home from './CR&GR/CR&GR_Home';
import Give_Feedback from './CR&GR/Give_Feedback';
import ADD_FEEDBACK from './CR&GR/ADD_FEEDBACK';
import CRGRCourse from './CR&GR/CRGRCOurse';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
const Stack = createStackNavigator();

function App() {

  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'Roboto-Regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Roboto-Medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Roboto-Light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Roboto-Thin',
        fontWeight: 'normal',
      },
    },
  };
  
  const theme = {
    ...DefaultTheme,
    roundness: 10, // Adjust the roundness of buttons and cards
    colors: {
      ...DefaultTheme.colors,
      primary: '#209920', // Primary color for buttons, text, etc.
      accent: 'green', // Accent color
      background: '#078345', // Background color
      surface: '#FFFFFF', // Card or surface color
      text: '#000000', // Text color
      error: '#B00020', // Error color
    },
    fonts: configureFonts(fontConfig),
  };
  return (
    <PaperProvider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{gestureEnabled:true, ...TransitionPresets.SlideFromRightIOS}}>
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name='Teacher_home' component={Home} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen 
          name="Teacher_notification" 
          component={Teacher_notification} 
          options={{
            gestureDirection: 'horizontal-inverted',
            presentation: 'modal', 
            cardOverlayEnabled: true,
            cardStyle: {
              backgroundColor: 'white',
              marginTop: 'auto', 
              height: '50%',
              marginRight:50,
              
            },
            headerStyle:{backgroundColor:'#078345'},
            headerTitleStyle:{color:'white'},
            headerTintColor:'white',
            headerTitle:"Notifications"
  
             
          }} 
        />

<Stack.Screen 
          name="Admin_Notification" 
          component={Admin_Notification} 
          options={{
            gestureDirection: 'horizontal-inverted',
            presentation: 'modal', 
            cardOverlayEnabled: true,
            cardStyle: {
              backgroundColor: 'white',
              marginTop: 'auto', 
              height: '50%',
              marginRight:50,
              
            },
            headerStyle:{backgroundColor:'#078345'},
            headerTitleStyle:{color:'white'},
            headerTintColor:'white',
            headerTitle:'Notifications'
  
             
          }} 
        />
        <Stack.Screen name='Teacher_allocation' component={Teacher_allocation} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:'Allocation',headerTitleStyle:{color:'white'}}}  ></Stack.Screen>
        <Stack.Screen name='Teacher_attendance'component={Teacher_attendance} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Attendance",headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_timetable' component={TeacherTimetableComponent}options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Timetable",headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='student_home' component={Student_home} options={{headerShown:false}}></Stack.Screen>
       <Stack.Screen name='Student_notification' component={Student_notification}options={{headerTitle:'Notifications',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Student_enrollment' component={Student_enrollment} options={{headerTitle:"Enrollment",headerStyle:{backgroundColor:'#078345'},
         headerTitleStyle:{color:'white'},headerTintColor:'white'}} ></Stack.Screen>

         <Stack.Screen name='Student_timetable' component={Student_timetable} options={{headerStyle:{backgroundColor:'#078345'},
         headerTitleStyle:{color:'white'},headerTintColor:'black',headerTitle:"Timetable"}} ></Stack.Screen>
         <Stack.Screen name='Admin_Teachers' component={Admin_Teachers} options={{headerTitle:'Teachers',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_allocation' component={Admin_allocation} options={{headerStyle:{backgroundColor:'#078345'},headerShown:false}}></Stack.Screen>
         <Stack.Screen name='Datacell_Home' component={Datacell_Home} options={{headerShown:false}}></Stack.Screen>
         <Stack.Screen name='Student_save_image' component={Student_save_image} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Save Image",headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name="Upload_Video_screen" component={Upload_Video_screen} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Upload Video",headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='AdminTimetable' component={AdminTimetable} options={{headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'},headerTintColor:"white",headerTitle:"Teacher Timetable"}}></Stack.Screen>
         <Stack.Screen name='Studnet_Attendance' component={Studnet_Attendance} options={{headerTitle:"Attendance",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Attendance' component={Attendance} options={{headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_Homepage' component={Admin_Homepage} options={{headerShown:false}}></Stack.Screen>
         <Stack.Screen name='Admin_Setting' component={Admin_Setting} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:'Settings',headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_Emotions' component={Admin_Emotions} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:'Held Classes',headerTitleStyle:{color:'white'}}}></Stack.Screen>
        
         <Stack.Screen name='Student_Claims' component={Student_Claims} options={{headerTitle:'Clamis',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_Timeline' component={Admin_Timeline} options={{headerTitle:'Emotion Timeline',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Home' component={CMM_Home} options={{headerShown:false}}></Stack.Screen>
         <Stack.Screen name='CMM_Voilations' component={CMM_Voilations} options={{headerTitle:'Voilations',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Add_Voilations' component={CMM_Add_Voilations} options={{headerTitle:'Add Voilations', headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Manage_Voilations' component={CMM_Manage_Voilations} options={{headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'},headerTitle:'Manage Voilations'}}></Stack.Screen>
         <Stack.Screen name='CMM_Manage_Student_Voilation' component={CMM_Manage_Student_Voilation} options={{headerTitle:'Edit Student Punishment',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_Students' component={Admin_Students} options={{headerTitle:'Students',headerStyle:{backgroundColor:"#078345"},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Students' component={CMM_Students} options={{headerTitle:'Students',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Voilations_Details' component={CMM_Voilations_Details} options={{headerTitle:"LOGS",headerStyle:{backgroundColor:"#078345"},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_Voilation_expand' component={CMM_Voilation_expand} options={{headerTitle:'Violations Detail',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='CMM_ViewLogs' component={CMM_ViewLogs} options={{headerTitle:'LOGS',headerStyle:{backgroundColor:'#078345'}}}></Stack.Screen>
         <Stack.Screen name='CMM_upload_Video' component={CMM_upload_Video} options={{headerTitle:'Upload Video',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Student_Profile' component={Student_Profile} options={{headerTitle:'Profile',headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Student_FreeSlots' component={Student_FreeSlots} options={{headerTitle:"Today's Free Punishment Slots",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='AdminTimetable1' component={AdminTimetable1} options={{headerTitle:"Classes Slots",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='Admin_Timetable2' component={Admin_Timetable2} options={{headerTitle:"Classes",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='EmotionalAnalysis' component={EmotionalAnalysis} options={{headerTitle:"Emtions",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
         <Stack.Screen name='StudentEmotionAnalysis' component={StudentEmotionAnalysis} options={{headerTitle:"Detailed Analysis",headerStyle:{backgroundColor:"#078345"}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Profile' component={Teacher_Profile} options={{headerTitle:"Profile",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Claims' component={Teacher_Claims} options={{headerTitle:'Claims',headerStyle:{backgroundColor:"#078345"},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Claim_Details' component={Teacher_Claim_Details} options={{headerTitle:"Claim Details",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Held_Classes' component={Teacher_Held_Classes} options={{headerTitle:"Held Classes", headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Held_Classes_Detail' component={Teacher_Held_Classes_Detail} options={{headerTitle:"Held Classes Attendance",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Attendance_Images' component={Teacher_Attendance_Images} options={{headerTitle:"Attendance Images",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_Behaviour' component={Admin_Behaviour} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:'Behaviour',headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_Selection' component={Admin_Selection} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Attendance",headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Overall_Attendance' component={Overall_Attendance} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Overall Attendance",headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_Punish_Students' component={Admin_Punish_Students} options={{headerStyle:{backgroundColor:'#078345'},headerTitle:"Punish Students",headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Junior_Home' component={Junior_Home} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='Junior_Allocations' component={Junior_Allocations} options={{headerTitle:"Allocations",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Junior_Timetable' component={Junior_Timetable} options={{headerTitle:"Timetable",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Junior_Attendance' component={Junior_Attendance} options={{headerTitle:"Attendance",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Attendance_Sheet' component={Teacher_Attendance_Sheet} options={{headerTitle:"Attendance Sheet",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_Punish_Held' component={Admin_Punish_Held} options={{headerTitle:"Held Classes",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_Punishment_Logs' component={Admin_Punishment_Logs} options={{headerTitle:"Punishment Logs",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Tasks' component={Tasks} options={{headerTitle:"Tasks",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='EmotionSummaryView' component={EmotionSummaryView} options={{headerTitle:"EmotionSummaryView",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='BehaviorSummaryView' component={BehaviorSummaryView} options={{headerTitle:"BehaviorSummaryView",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='LastRowImagesView' component={LastRowImagesView} options={{headerTitle:"LastRowImagesView",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='ComparisonChartScreen' component={ComparisonChartScreen} options={{headerTitle:"ComparisonChartScreen",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Teacher_Manage_CRGR' component={Teacher_Manage_CRGR} options={{headerTitle:"Manage CR & GR",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='CRGRAllocation' component={CRGRAllocation} options={{headerTitle:"Chose CR/GR",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='Admin_CrGR_Report' component={Admin_CrGR_Report} options={{headerTitle:"CR/GR Report",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='CRGR_Home' component={CRGR_Home} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name='Give_Feedback' component={Give_Feedback} options={{headerTitle:"Give FeedBack",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='CRGRCourse' component={CRGRCourse} options={{headerTitle:"Courses",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        <Stack.Screen name='ADD_FEEDBACK' component={ADD_FEEDBACK} options={{headerTitle:"Add FEEDBACK",headerStyle:{backgroundColor:'#078345'},headerTitleStyle:{color:'white'}}}></Stack.Screen>
        
      </Stack.Navigator>
      
      
</NavigationContainer>

</PaperProvider>      
  );
}

export default App;
