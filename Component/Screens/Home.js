import { FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import GetLocation from 'react-native-get-location';
import { getWeather } from '../src/api';
import moment from 'moment';

const Home = () => {
  const [data, setData] = useState(null)
  const [value, setValue] = useState("");
  const [location, setLocation] = useState(null)
  const [forcastArray, setForcastArray] = useState([])
  // const [hourlyUpdate,setHourlyUpdate]=useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
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
        // setHourlyUpdate(res.data?.forecast?.forecastday?.hour);
        // console.log(res.data?.forecast?.forecastday?.hour)
        //console.log("Forecast Array:", res.data?.forecast?.forecastday);
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
        //setHourlyUpdate(res.data?.forecast?.forecastday)
        setValue('');
      }
    } catch (err) {
      console.log(err);
    }
    getData();
  };

  //console.log('65', forcastArray)
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />

      <ImageBackground source={require('../Image/bg.png')}
        style={{
          height: "100%",
          width: "100%",
          paddingTop: StatusBar.currentHeight
        }}
        imageStyle={{
          height: "100%",
          width: "100%",
          resizeMode: 'cover',
          opacity: 0.7
        }}
      >
        <ScrollView>
          {/* search bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: responsiveHeight(5),
              width: responsiveWidth(90),
              borderRadius: responsiveWidth(2),
              backgroundColor: '#f1f5d5',
              opacity: 0.5,
              margin: responsiveWidth(4),
              marginRight: responsiveWidth(4),
              paddingHorizontal: responsiveWidth(2)
            }}
          >
            <TextInput
              placeholder='Search Loaction'
              placeholderTextColor={'black'}
              onChangeText={text => setValue(text)}
              value={value}
              onPress={() => getData()}
              onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
                setValue(text);
                getData();
              }}
              style={{
                fontWeight: '400',
                lineHeight: 22.5,
                width: '90%',
              }}
            />
            <TouchableOpacity onPress={() => getData()}>
              <Image
                source={require('../Image/search.png')}
                style={{
                  height: responsiveHeight(2),
                  width: responsiveWidth(5),
                  resizeMode: 'contain',
                  tintColor: 'black'
                }}
              />
            </TouchableOpacity>
          </View>
          {/* date */}
          <View
            style={{
              marginLeft: responsiveWidth(4)
            }}
          >
            <Text style={{
              fontSize: responsiveFontSize(1.8),
              fontWeight: '500',
              color: 'black'
            }}>{moment(forcastArray[0]?.date).format('ll')}</Text>
          </View>

          {/* Temparature and location */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: responsiveHeight(-4)
            }}
          >
            <Image
              source={{ uri: `https:${data?.condition?.icon}` }}
              style={{
                resizeMode: 'contain',
                height: responsiveHeight(23),
                width: responsiveWidth(50)
              }}
            />
            <View
              style={{
                marginTop: responsiveHeight(-3),
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveWidth(2)
              }}
            >
              <Text style={{
                fontSize: responsiveFontSize(3.1),
                fontWeight: '700',
                color: 'black',
              }}>{location?.name}</Text>
              <Image source={require('../Image/Vector.png')}
                style={{
                  resizeMode: 'contain',
                  height: responsiveHeight(3.5),
                  width: responsiveWidth(5.4)
                }}
              />
            </View>
            {/* Temparature */}
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveWidth(2),
              }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(4.6),
                  fontWeight: '900',
                  color: 'black'
                }}
              >{data?.temp_c}°</Text>
            </View>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: '500',
                color: '#454443',
                // marginTop: responsiveHeight()
              }}
            >High {forcastArray[0]?.day?.maxtemp_c}° . Low {forcastArray[0]?.day?.mintemp_c}°</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                fontWeight: '500',
                color: '#333331'
              }}
            >Feel like {data?.feelslike_c}°</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(3),
                fontWeight: '400',
                color: 'black'
              }}
            >{data?.condition?.text}</Text>


          </View>
          {/* Today weather */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f2ead0',
              opacity: 0.6,
              height: responsiveHeight(15),
              width: responsiveWidth(90),
              gap: responsiveWidth(7),
              alignItems: 'center',
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(4),
              borderRadius: responsiveWidth(5),
              paddingHorizontal: responsiveWidth(3)
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Image/windy.png')}
                style={{
                  resizeMode: 'contain',
                  height: responsiveHeight(5),
                  width: responsiveWidth(10)
                }}
              />
              <Text style={{ color: 'black', fontWeight: '600', marginTop: responsiveHeight(2) }}>{forcastArray[0]?.day?.avgvis_km}k/h</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Image/umbrella.png')}
                style={{
                  resizeMode: 'contain',
                  height: responsiveHeight(5),
                  width: responsiveWidth(10)
                }}
              />
              <Text style={{ color: 'black', fontWeight: '600', marginTop: responsiveHeight(2) }}>{forcastArray[0]?.day?.daily_chance_of_rain} %</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Image/humidity.png')}
                style={{
                  resizeMode: 'contain',
                  height: responsiveHeight(5),
                  width: responsiveWidth(10)
                }}
              />
              <Text style={{ color: 'black', fontWeight: '600', marginTop: responsiveHeight(2) }}>{forcastArray[0]?.day?.avghumidity}%</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Image/rays.png')}
                style={{
                  resizeMode: 'contain',
                  height: responsiveHeight(5),
                  width: responsiveWidth(10)
                }}
              />
              <Text style={{ color: 'black', fontWeight: '600', marginTop: responsiveHeight(2) }}>{forcastArray[0]?.day?.uv}</Text>
            </View>
            <Text
              style={{
                paddingRight: responsiveWidth(2),
                fontSize: responsiveFontSize(2),
                color: 'black',
                fontWeight: '600',
                marginLeft: responsiveWidth(-2)
              }}
            >Today</Text>
          </View>

          {/* hourly forecast */}
          <Text style={{
            fontSize: responsiveFontSize(1.6),
            fontWeight: '500',
            color: 'black',
            marginLeft: responsiveWidth(4),
            marginTop: responsiveHeight(1)
          }}>Hourly forecast</Text>
          <FlatList
            data={forcastArray[0]?.hour}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    backgroundColor: '#f2ead0',
                    opacity: 0.5,
                    height: responsiveHeight(15),
                    width: responsiveWidth(25),
                    borderRadius: responsiveWidth(5),
                    alignItems: 'center',
                    padding: responsiveWidth(1),
                    marginTop: responsiveHeight(1.5),
                    marginLeft: responsiveWidth(4)
                  }}
                >
                  <Image source={{ uri: `https:${item?.condition?.icon}` }}
                    style={{
                      resizeMode: 'contain',
                      height: responsiveHeight(8),
                      width: responsiveWidth(17),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.4),
                      marginTop: responsiveHeight(-1),
                      color: 'black'
                    }}
                  >
                    {moment(item?.time).format('LT')}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      marginTop: responsiveHeight(1),
                      color: 'black'
                    }}
                  >{item?.temp_c}°</Text>
                </View>
              )
            }}
          // contentContainerStyle={{ marginLeft: responsiveWidth(-18) }} 
          />

          {/* Daily forecast */}
          <Text style={{
            fontSize: responsiveFontSize(1.6),
            fontWeight: '500',
            color: 'black',
            marginLeft: responsiveWidth(4),
            marginTop: responsiveHeight(1)
          }}>Daily forecast</Text>
          <FlatList
            data={forcastArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    backgroundColor: '#f2ead0',
                    opacity: 0.5,
                    height: responsiveHeight(15),
                    width: responsiveWidth(25),
                    borderRadius: responsiveWidth(5),
                    alignItems: 'center',
                    padding: responsiveWidth(1),
                    marginTop: responsiveHeight(1.5),
                    marginLeft: responsiveWidth(4)
                  }}
                >
                  <Image source={{ uri: `https:${item?.day?.condition?.icon}` }}
                    style={{
                      resizeMode: 'contain',
                      height: responsiveHeight(8),
                      width: responsiveWidth(17),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.4),
                      marginTop: responsiveHeight(-1),
                      color: 'black'
                    }}
                  >{moment(item?.date).format('LL')}</Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      marginTop: responsiveHeight(1),
                      color: 'black'
                    }}
                  >{item?.day?.maxtemp_c}/{item?.day?.mintemp_c}°</Text>
                </View>

              )
            }}
          />

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})