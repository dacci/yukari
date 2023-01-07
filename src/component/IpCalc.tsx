import React, {useCallback, useEffect, useState} from 'react';
import {IPv4} from 'ipaddr.js'
import {Grid, InputAdornment, Slider, TextField} from '@mui/material';

const toHexIpAddress = (ipAddress: IPv4) => {
  try {
    return ipAddress
      .toByteArray()
      .map((o) => '0' + o.toString(16).toUpperCase())
      .map((s) => s.substring(s.length - 2, s.length))
      .join('.')
  } catch (e) {
    return '';
  }
};

const toWildcardMask = (subnetMask: IPv4) => {
  try {
    return subnetMask
      .toByteArray()
      .map((o) => ~o & 0xFF)
      .join('.');
  } catch (e) {
    return '';
  }
};

function IpCalc() {
  const [ipAddress, setIpAddress_] = useState('192.168.2.1');
  const [ipAddressError, setIpAddressError] = useState(false);
  const [subnetMask, setSubnetMask_] = useState('255.255.255.0');
  const [subnetMaskError, setSubnetMaskError] = useState(false);
  const [maskBits, setMaskBits_] = useState('24');
  const [maskBitsError, setMaskBitsError] = useState(false);

  const [parsedAddress, setParsedAddress] = useState(() => IPv4.parse(ipAddress));
  const [parsedSubnet, setParsedSubnet] = useState(() => IPv4.parse(subnetMask));
  const [prefixLength, setPrefixLength] = useState(~~maskBits);
  const [networkAddress, setNetworkAddress] = useState(() => IPv4.networkAddressFromCIDR(`${ipAddress}/${maskBits}`).toNormalizedString());
  const [broadcastAddress, setBroadcastAddress] = useState(() => IPv4.broadcastAddressFromCIDR(`${ipAddress}/${maskBits}`).toNormalizedString());

  const setIpAddress = useCallback((value: string) => {
    setIpAddress_(value);

    try {
      setParsedAddress(IPv4.parse(value));
      setIpAddressError(false);
    } catch (e) {
      setIpAddressError(true);
    }
  }, []);

  const setSubnetMask = useCallback((value: string) => {
    setSubnetMask_(value);

    try {
      const parsed = IPv4.parse(value);
      const length = parsed.prefixLengthFromSubnetMask();
      if (length !== null) {
        setParsedSubnet(parsed);
        setPrefixLength(length);
        setMaskBits_(length.toString());
      }
      setSubnetMaskError(length === null);
    } catch (e) {
      setSubnetMaskError(true);
    }
  }, []);

  const setMaskBits = useCallback((value: string) => {
    setMaskBits_(value);

    const length = Math.trunc(Number(value));
    if (0 <= length && length <= 32) {
      const parsedSubnet = IPv4.subnetMaskFromPrefixLength(length);
      setParsedSubnet(parsedSubnet);
      setPrefixLength(length);
      setSubnetMask_(parsedSubnet.toNormalizedString());
      setMaskBitsError(false);
    } else {
      setMaskBitsError(true);
    }
  }, []);

  useEffect(() => {
    const cidr = `${parsedAddress.toNormalizedString()}/${prefixLength}`;
    setNetworkAddress(IPv4.networkAddressFromCIDR(cidr).toNormalizedString());
    setBroadcastAddress(IPv4.broadcastAddressFromCIDR(cidr).toNormalizedString());
  }, [parsedAddress, prefixLength]);

  return (
    <Grid container spacing={2} alignItems='center' sx={{
      p: 2,
    }}>
      <Grid item xs={6}>
        <TextField
          error={ipAddressError}
          fullWidth
          inputProps={{inputMode: 'decimal'}}
          label='IP Address'
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          fullWidth
          label="Hex IP Address"
          value={toHexIpAddress(parsedAddress)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          error={subnetMaskError}
          fullWidth
          inputProps={{inputMode: 'decimal'}}
          label='Subnet Mask'
          value={subnetMask}
          onChange={(e) => setSubnetMask(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          fullWidth
          label="Wildcard Mask"
          value={toWildcardMask(parsedSubnet)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={maskBitsError}
          fullWidth
          inputProps={{
            inputMode: 'numeric',
            max: 32,
            min: 0,
            step: 1,
            type: 'number',
            sx: {
              textAlign: 'right',
              width: '25%',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' sx={{width: '100%', paddingX: 2}}>
                <Slider
                  max={32}
                  min={0}
                  value={~~maskBits}
                  sx={{}}
                  onChange={(e, value) => setMaskBits(value.toString())}
                />
              </InputAdornment>
            ),
          }}
          label='Mask Bits'
          value={maskBits}
          onChange={(e) => setMaskBits(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          fullWidth
          label="Network Address"
          value={networkAddress}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          fullWidth
          label="Broadcast Address"
          value={broadcastAddress}
        />
      </Grid>
    </Grid>
  );
}

export default IpCalc;
