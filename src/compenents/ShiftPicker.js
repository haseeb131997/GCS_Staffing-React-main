import React, {useState} from 'react';
import {View, Text, Button, Modal, StyleSheet, Dimensions} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {TouchableOpacity} from 'react-native';
import width from '../Units/width';
import height from '../Units/height';

const ShiftPicker = ({onSaveShift}) => {
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedSubShift, setSelectedSubShift] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const shiftOptions = ['8hrs shift', '12hrs shift'];
  const subShifts8hrs = [
    '06AM to 02PM Day',
    '07AM to 03PM Day',
    '02PM to 10PM Evening',
    '03PM to 11PM Evening',
    '10PM to 06AM Night',
    '11PM to 07AM Night',
  ];
  const subShifts12hrs = [
    '06AM to 06PM Day',
    '07AM to 07PM Day',
    '06PM to 06AM Night',
    '07PM to 07AM Night',
  ];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveSelectedShift = () => {
    const storeShift = `${selectedShift} - ${selectedSubShift}`;
    onSaveShift(storeShift);
    toggleModal();
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      style={{flex: 1}}>
      <View
        style={[
          styles.modalContainer,
          {height: screenHeight * 0.5, width: screenWidth * 0.95},
        ]}>
        <View style={styles.modalContent}>
          <Text>Select Shift:</Text>
          <Picker
            selectedValue={selectedShift}
            onValueChange={itemValue => setSelectedShift(itemValue)}>
            {shiftOptions.map((shift, index) => (
              <Picker.Item key={index} label={shift} value={shift} />
            ))}
          </Picker>

          {selectedShift === '8hrs shift' && (
            <View>
              <Picker
                selectedValue={selectedSubShift}
                onValueChange={itemValue => setSelectedSubShift(itemValue)}>
                {subShifts8hrs.map((subShift, index) => (
                  <Picker.Item key={index} label={subShift} value={subShift} />
                ))}
              </Picker>
            </View>
          )}

          {selectedShift === '12hrs shift' && (
            <View>
              <Text>Select Sub Shift:</Text>
              <Picker
                selectedValue={selectedSubShift}
                onValueChange={itemValue => setSelectedSubShift(itemValue)}>
                {subShifts12hrs.map((subShift, index) => (
                  <Picker.Item key={index} label={subShift} value={subShift} />
                ))}
              </Picker>
            </View>
          )}

          <Button title="Save" onPress={saveSelectedShift} />
          <Button title="Close" onPress={toggleModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: '50%',
    borderRadius: 10,
    elevation: 5,
  },
  modalContent: {
    padding: 16,
  },
});

export default ShiftPicker;
