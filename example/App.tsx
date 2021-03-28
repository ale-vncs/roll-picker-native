import React, { useCallback, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import RollPickerNative from 'src/index'
import { Text, TouchableOpacity, View } from 'react-native'

const App = () => {
  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString())
  const years = Array.from({ length: 30 }, (_, i) => {
    if (i < 9) return '200' + (i + 1).toString()
    return '20' + (i + 1).toString()
  })

  const months = [
    'January',
    'February',
    'March',
    'May',
    'April',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0)
  const [day, setDay] = useState(0)

  const handlePicker = useCallback((field: string, index: number) => {
    switch (field) {
      case 'month': {
        setMonth(index)
        break
      }
      case 'day': {
        setDay(index)
        break
      }
      case 'year': {
        setYear(index)
        break
      }
    }
  }, [])

  const changeIndexToStart = (field: string) => {
    handlePicker(field, 0)
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#e5e5e5'
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row'
        }}
      >
        <RollPickerNative
          items={months}
          index={month}
          onIndexChange={(index: number) => handlePicker('month', index)}
          selectHeight={35}
          containerHeight={250}
          selectTextStyle={{
            fontSize: 22
          }}
        />
        <RollPickerNative
          items={days}
          index={day}
          onIndexChange={(index: number) => handlePicker('day', index)}
          selectHeight={35}
          containerHeight={250}
          selectTextStyle={{
            fontSize: 22
          }}
        />
        <RollPickerNative
          items={years}
          index={year}
          onIndexChange={(index: number) => handlePicker('year', index)}
          selectHeight={35}
          containerHeight={250}
          selectTextStyle={{
            fontSize: 22
          }}
        />
      </View>
      <TouchableOpacity onPress={() => changeIndexToStart('year')}>
        <Text>Reset</Text>
      </TouchableOpacity>
      <Text
        style={{
          paddingVertical: 25,
          fontSize: 20,
          fontWeight: 'bold'
        }}
      >
        {months[month]}/{days[day]}/{years[year]}
      </Text>
    </View>
  )
}

export default App
