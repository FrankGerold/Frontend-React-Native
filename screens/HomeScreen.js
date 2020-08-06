// Obviously the home screen with the giant button and etc 
import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, Alert, FlatList } from 'react-native';

import BigMainButton from '../components/BigMainButton'
import Form from '../components/Form'

// redux stuff 
import { useSelector, useDispatch, createStoreHook } from 'react-redux'
import * as eventsActions from '../store/actions/events'
import * as userActions from '../store/actions/users'
//asyncstorage, this is sqlite/persistence + localstorage + react-native
import AsyncStorage from '@react-native-community/async-storage';


// this is an example for storing strings, the most basic level but if you want to store objects go to docs, link below
// const storeData = async (value) => {
//     try {
//       await AsyncStorage.setItem('@storage_Key', value)
//     } catch (e) {
//       // saving error
//     }
//  }
//  https://react-native-community.github.io/async-storage/docs/usage

// ask permissions to send notification --GA
import * as Permissions from 'expo-permissions'



const HomeScreen = props => {
    const { navigation } = props
    // js memory for saved reqs
    const [listOfSavedReqs, setListOfSavedReqs] = useState('')
    // boolean switch to see if setListOfSavedReqs needs to be run 
    const [isThereNewSave, setIsThereNewSave] = useState(false)

    // redux testing 
    const allEvents = useSelector(state => state.events.allEvents)
    const savedEvents = useSelector(state => state.events.savedEvents) 

    // demo mvp fix for userId get
    let userIdInRedux = useSelector(state => state.users.user_id)

    const dispatch = useDispatch();

    // debug helper
    // const checkAsync = async () => {
    //     try {
    //         const userIDDD = await AsyncStorage.getItem('user_id')
    //         if (userIDDD !== null) {
    //             console.log("checkAsync not Null", userIDDD)
    //         } else {
    //             console.log("checkAsync Null", userIDDD)
    //         }
    //     } catch (error) {
    //         console.log("check async", error)
    //     }
    // }

    const readData = async () => {
        try {
            const userIdA = await AsyncStorage.getItem('user_id')
            if (userIdA !== null) {
                // console.log("inside async AsyncStorage, should be userId", userIdA)
                dispatch(userActions.setUser(userIdA))
            } else {
                // console.log("new userId because Async did not have one")
                dispatch(userActions.createUser())
            }
        } catch (error) {
            console.log("getItem error", error)
        }
    }

    // component did mount 
    useEffect(() => {
        // console.log("pulled from state", userIdInRedux)
        readData()
        dispatch(eventsActions.fetchEvents())
    }, [dispatch]);

    // debug useEffect
    // useEffect(() => {
    //     console.log("Repeat HomeScreen useEffect", userIdInRedux)
    //     // checkAsync()
    // })


    //check notification permission status -- GA
    useEffect(() => {
        Permissions.getAsync(Permissions.NOTIFICATIONS).then(statusObj => {
            if(statusObj.status !== 'granted'){
                return Permissions.askAsync(Permissions.NOTIFICATIONS)
            }

            return statusObj
        }).then(statusObj => {
            if(statusObj.status !== 'granted'){
                return 
            }
        })
    }, [])



    // test new 
    const createNewHandler = () => {
        dispatch(userActions.createUser())
    }



    
    return (
        <View style={styles.main}>
            <Text>The HomeScreen</Text>
            <Text>Welcome to ___________</Text>
            {/* custom button component  */}
            <BigMainButton  pushToken={props.pushToken}/>
            {/* i think these should probably be replaced by custom components to style + css up */}
            <Button 
                title="See More Requests"
                onPress={() => navigation.navigate('Map')}
            />
            {/* this is how you pass down props, second arg  */}
            <Button
                title="See Saved Requests"
                onPress={() => navigation.navigate('Map', {
                    listOfSavedReqs: listOfSavedReqs
                })}
            />


            <Button 
                title="TEST NEW"
                onPress={createNewHandler}
            />

        
            {/* redux + componentDidMount testing  */}

            <Text>All Events</Text>
            <View style={styles.flatList}>
                {allEvents.map((event) => (
                    <View key={event.id}>
                        <Text>Event id: {event.id}</Text>
                        <Text>Event location: {event.location}</Text>
                        <Text>Event resolved?: {event.resolved_stat ? "YES" : "NO"}</Text>
                        <Text>Event description: {event.description}</Text>
                        <Text>Event user_id: {event.user_id}</Text>
                        <Text>Event created_at: {event.created_at}</Text>
                        <Text>Event updated_at: {event.updated_at}</Text>
                    </View>
                ))}
            </View>
            

        </View>
    )
}

// this is literally just here so we have a template to mess with when we google styling 
const styles = StyleSheet.create({
    main: {
        flex: 0.3
    },
    flatList: {
        height: 200
    }
})
export default HomeScreen; 
