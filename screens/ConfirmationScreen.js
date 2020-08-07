// TO DO

// CONFIMRATION SCREEN NEEDS EVENT_ID maybe pull from currentEvent
//
// needs dispatch(responsesActions.createResponse())

// see all responses to event

//X need another textInput for description
//X drop down for response
//X + useState

//



// this is # 3, the confirmation screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Picker } from '@react-native-community/picker';

import { useSelector, useDispatch } from 'react-redux';
import * as eventsActions from '../store/actions/events'
import * as userActions from '../store/actions/users'
import * as responsesActions from '../store/actions/responses'


const ConfirmationScreen = props => {
  const dispatch = useDispatch();

  [responseChoice, setResponseChoice] = useState('');
  [inputResponse, setInput] = useState('');

  const allResponses = useSelector(state => state.responses.allResponses);
  const currentUser = useSelector(state => state.users.user_id)

  const submitEvent = () => {
    //call response action to create new response, using dropdown choice and text input and current user  and event id
      // user_id, event_id, hasEvidence, description

      // Temp fix with random user and event, and accomodating current inadequate schema
      let fakeUser = 1 //CurrentUser will work when merged with DOms new PR, for now use fake one.
      let fakeEvent = 2 //Once map screen can actually select an event, it will be accessible as props.event. Til then use fake.
      let hasEvidence = true //THis will probably change with a schema refactor
      let description = { responseChoice: inputResponse }

    dispatch(responsesActions.createResponse(fakeUser, fakeEvent, hasEvidence, description.toString()))
  };

  return (
    <KeyboardAvoidingView
       style={styles.main}
       behavior={Platform.OS == "ios" ? "padding" : "height"}
     >
        <Text>The Confirmation Screen</Text>

        {/* SHow event details */}
        <View style={styles.detailsRegion}>
          <Text>Details</Text>

        {/* again, random assumption that event is an object with a description property that's a string. change when data structure gets fleshed out, */}
          <Text>{/* props.event.description */}</Text>
        </View>

        <View style={styles.dropdown}>
          <Picker
            selectedValue={responseChoice}
            style={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => setResponseChoice(itemValue)}
          >
            <Picker.Item
              label='I have evidence.'
              value='haveEvi'
            />

            <Picker.Item
              label='I need evidence.'
              value='needEvi'
            />

            <Picker.Item
              label="I don't have evidence."
              value='noEvi'
            />

            <Picker.Item
              label='Other... See written response.'
              value='other'
            />
          </Picker>
        </View>

      <View
        style={styles.textBoxArea}
      >
        <TextInput
          style={styles.textInput}
          value={inputResponse}
          onChangeText={text=>setInput(text)}
          placeholder="Write your response info here!"
          keyboardAppearance='dark'
          multiline={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            submitEvent();
          }}
        />

        <View style={styles.submitButton}>
          <Button
            title="Submit Response"
            onPress={submitEvent} />
        </View>
      </View>

    </KeyboardAvoidingView
    >
  );
};

const styles = StyleSheet.create({
    main: {
      justifyContent: 'center'
    },
    dropdown: {
      width: '75%'
    },
    detailsRegion: {
      height: '33%',
      borderColor: 'blue',
      borderWidth: 1,
      width: '90%',
      marginTop: '4%',
    },
    pickerText: {},
    textInput: {
      borderColor: 'blue',
      borderWidth: 2,
      height: '33%'
    },
    textBoxArea: {},
    submitButton: {
      height: 50,
      marginTop: 5
    }
})

export default ConfirmationScreen;
