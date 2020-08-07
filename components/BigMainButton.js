// to do. put G's fetch from expo pushToken into Redux
// make the onPress go to next screen 
// pull lot/lat data on submit 

// the please record me button #1

import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// this is the import you need for navigation done outside of screens
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'

// while app run upfront, the local notification will show --GA
Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        }
    }
})

const BigMainButton = props => {
    // mimic the syntax and use navigation inside of a component
    const navigation = useNavigation();

    // the reacting of users to notifications --GA
    useEffect(() => { 
        // how user interact with notification when app is not running -- GA
        // will lead the user back to the app -- GA
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response)
        })

        // how user interact with notification when app is upfront running -- GA
        const foregroundSubscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log(notification)
            }
            
        )

        return () => {
            backgroundSubscription.remove()
            foregroundSubscription.remove()
        }
    }, []
    )
    // notification trigger function --GA
    const triggerNotificationHandler = () => {
        // local notification  -- GA
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: 'first local notification',
        //         body: 'hello everybody'
        //     },
        //     trigger:{
        //         seconds: 5
        //     }
        // })

        // push notification -- GA
        //https://exp.host/--/api/v2/push/send expo server -- GA
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: props.pushToken,
                title: 'Record me!',
                body: 'Please record me, here is my address'
            })

        })
    }

  
    return (
        <View style={styles.button}>
            <Text style={styles.textStyle}>The BigMainButton</Text>
            <Button 
                title="Please Record Me!" 
                // once follow up is loaded, we can async trigger database create
                onPress={() => navigation.navigate('FollowUp')}
                
                // bigmainbutton should trigger push notification --GA
               //implement notification with onpress --GA
            //    onPress={triggerNotificationHandler}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center'
    },
    button: {
        borderWidth: 5
    }
})
export default BigMainButton; 