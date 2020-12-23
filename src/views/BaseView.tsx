import { Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import React from 'react'
import { View } from 'react-native'

type BaseViewProps = {
  viewTitle: string
  children?: React.ReactNode
}

const BaseView: React.FC<BaseViewProps> = (props: BaseViewProps): React.ReactElement => {
  const styles = useStyleSheet(themedStyles)

  return (
    <Layout style={styles.container}>
      <View style={styles.viewContainer}>
        <View style={styles.header}>
          <Text category="h3" style={styles.viewTitle}>
            {props.viewTitle}
          </Text>
          <View style={styles.ruler} />
        </View>
        {props.children}
      </View>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 5,
  },
  viewTitle: {
    marginVertical: 5,
    textAlign: 'center',
    color: 'color-basic-300',
  },
  ruler: {
    borderBottomColor: 'color-basic-500',
    borderBottomWidth: 1,
    width: '60%',
    alignSelf: 'center',
  },
  childrenContainer: {
    flex: 1,
  },
})

export { BaseView }
