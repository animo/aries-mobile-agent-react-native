import React from 'react'
import { RNCamera } from 'react-native-camera'
import { BaseView } from './BaseView'

const ScannerView = (): React.ReactElement => {
  let camera: RNCamera = null

  return (
    <BaseView viewTitle="Scan Invitation">
      <RNCamera
        ref={(ref): void => {
          camera = ref
        }}
        style={{
          flex: 1,
          width: '100%',
        }}
      />
    </BaseView>
  )
}

export { ScannerView }
