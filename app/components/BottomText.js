/* @flow */

import React from 'react';
import normalize from '../lib/normalizeText';
import colors from '../lib/colors';
import { StyleSheet, Text } from 'react-native';

/**
 * Used across examples as a screen placeholder.
 */
import type { Children } from 'react';

const BottomText = ({ children }: { children?: Children }) => (
    <Text style={styles.bottom}>{children}</Text>
);

export default BottomText;

const styles = StyleSheet.create({
    bottom:{fontSize:normalize(12),margin:10,alignSelf:'center',color:colors.gre5},
});