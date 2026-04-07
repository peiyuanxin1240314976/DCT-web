import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PrimaryButton } from '@/components'

import './index.css'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text className='index__title'>Temple Mini Program</Text>
      <PrimaryButton onClick={() => console.log('clicked')}>示例按钮</PrimaryButton>
    </View>
  )
}
