import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { normalizeUnits } from 'moment';
import normalize from '../utils/normalize';
import LinearGradient from 'react-native-linear-gradient';
import GetLocation from 'react-native-get-location';
import { getWeather } from '../Component/src/api';
import moment from 'moment';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null)
  const [value, setValue] = useState("");
  const [data, setData] = useState(null)
  const [location, setLocation] = useState(null)
  const [forcastArray, setForcastArray] = useState([])
  useEffect(() => {
    const fetchCurrentLoaction = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000
        })
        setCurrentLocation(location)
        console.log(location)
      } catch (error) {
        const { code, message } = error
        console.warn(code, message)
      }
    }
    fetchCurrentLoaction();
    setValue('');
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `${currentLocation?.latitude},${currentLocation?.longitude}`;
        const res = await getWeather('/forecast.json', query)
        setData(res.data?.current);
        setLocation(res.data?.location);
        setForcastArray(res.data?.forecast?.forecastday);
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [currentLocation])

  // api call for search data
  const getData = async () => {
    try {
      if (value.trim() !== '') {
        const res = await getWeather('/forecast.json', value);
        setData(res.data?.current);
        setLocation(res.data?.location);
        setForcastArray(res.data?.forecast?.forecastday);
        setValue('');
      }
    } catch (err) {
      console.log(err);
    }
    getData();
  };

  return (
    <LinearGradient
      colors={['#30BBBB', '#6CD6D6', '#95FFFF']}
      style={{
        //backgroundColor: '#30BBBB',
        //backgroundColor: '#a6e3e9',
        flex: 1
      }}
    >
      <View
        style={{
          //justifyContent:'space-evenly',
          //alignContent:'ce'
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            marginTop: normalize(150),
            borderRadius: normalize(18),
            marginHorizontal: normalize(17),
            paddingLeft: normalize(9),
            //height: normalize(52)
          }}
        >
          <Image
            source={require('./image/search1.png')}
            style={{
              resizeMode: 'contain',
              height: normalize(24),
              width: normalize(22),
              tintColor: '#30BBBB'
            }}
          />
          <TextInput
            placeholder='Enter Location'
            // value={text}
            // onChangeText={setText}
            placeholderTextColor={"#88BBBB"}
            onChangeText={text => setValue(text)}
            value={value}
            onPress={() => getData()}
            onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
              setValue(text);
              getData();
            }}
            style={{
              padding: normalize(7),
              flex: 1,
              fontSize: normalize(15.6),
              fontFamily: "RobotoSlab-Light"
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: '#66cecd',
            //   backgroundColor:'#71c9ce',
            marginTop: normalize(54),
            marginHorizontal: normalize(17),
            paddingHorizontal: normalize(23),
            paddingVertical: normalize(12),
            opacity: 0.9,
            borderRadius: normalize(29),
            justifyContent: 'center',
            // alignItems:'center'

          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: normalize(25),
                color: 'white',
                //fontWeight: '500',
                fontFamily: 'RobotoSlab-Medium'
              }}
            >{location?.name}</Text>
            <TouchableOpacity>
              <Image
                source={require('./image/heart.png')}
                style={{
                  height: normalize(20),
                  width: normalize(20),
                  resizeMode: 'contain'
                }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontWeight: '400',
              color: 'white',
              fontSize: normalize(10),
              fontFamily: 'RobotoSlab-Regular'
            }}
          >{moment(forcastArray[0]?.date).format('ddd M/D/YY')}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: normalize(50),
                color: '#FFFFFF',
                fontWeight: '500'
              }}
            >{data?.temp_c}°c</Text>
            <Image
              source={{ uri: `https:${data?.condition?.icon}` }}
              style={{
                height: normalize(56),
                width: normalize(56),
                resizeMode: 'contain'
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                backgroundColor: '#43cdcd',
                //backgroundColor:'lightpink',
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(5),
                borderRadius: normalize(14),
                opacity: 0.7
              }}
            >
              <Text
                style={{
                  fontSize: normalize(18),
                  color: '#FFFFFF',
                  fontFamily: 'RobotoCondensed-Regular'
                }}
              >Highest</Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  color: '#FFFFFF',
                  fontFamily: 'RobotoCondensed-Regular'
                }}
              >{forcastArray[0]?.day?.maxtemp_c} C</Text>
            </View>
            <View
              style={{
                backgroundColor: '#43cdcd',
                //backgroundColor:'lightpink',
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(5),
                borderRadius: normalize(14),
                opacity: 0.7
              }}
            >
              <Text
                style={{
                  fontSize: normalize(18),
                  color: '#FFFFFF',
                  fontFamily: 'RobotoCondensed-Regular'
                }}
              >Lowest</Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  color: '#FFFFFF',
                  fontFamily: 'RobotoCondensed-Regular'
                }}
              >{forcastArray[0]?.day?.mintemp_c}° C</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({})