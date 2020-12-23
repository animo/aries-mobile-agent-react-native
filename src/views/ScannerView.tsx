import React from 'react'
import { StyleSheet } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { BaseView } from './BaseView'

const ScannerView = (): React.ReactElement => {
  let camera: RNCamera = null

  function onScan(barcode: BarCodeReadEvent): void {
    if (barcode.type != 'qr') return
    console.log(barcode.data)

    // const invite: ConnectionInvitationMessage = new ConnectionInvitationMessage(barcode.data);
  }

  return (
    <BaseView viewTitle="Scan Invitation">
      <RNCamera
        onBarCodeRead={onScan}
        ref={ref => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
  },
})

export { ScannerView }
