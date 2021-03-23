import React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import RollPickerNative from 'src/index'
import { View } from 'react-native'

const items: string[] = [
  'C',
  'Java',
  'Python',
  'JavaScript',
  'PHP',
  '.NET',
  'C#',
  'C++',
  'Ruby'
]

const App = () => {
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
          width: '100%'
        }}
      >
        <RollPickerNative
          label={'Choose your language'}
          labelStyle={{
            width: '100%',
            marginBottom: 10,
            textAlign: 'center'
          }}
          items={items}
          selectStyle={{
            height: 50
          }}
          containerStyle={{
            height: 250,
            borderRadius: 15
          }}
        />
      </View>
    </View>
  )
}

export default App
