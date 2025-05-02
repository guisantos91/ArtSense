import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type Props = { exhibitionId: string };

export default function ExhibitionQRCode({ exhibitionId }: Props) {
  return (
    <View style={{ alignItems: 'center', padding: 16 }}>
      <QRCode
        value={exhibitionId}
        size={200}
        color="#000"
        backgroundColor="#fff"
      />
    </View>
  );
}